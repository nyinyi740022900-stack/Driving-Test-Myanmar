import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { canRunMockTest, isPremium, recordMockTestUsage, type MockTestSource } from '@/lib/subscription';
import type { Category } from '@/lib/types';

const VALID: Category[] = ['sg_btt', 'sg_ftt', 'sg_rtt', 'jp_car', 'jp_moto'];

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized', allowed: false }, { status: 401 });
  }

  let body: { category?: string; source?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body', allowed: false }, { status: 400 });
  }

  const category = body.category as Category;
  if (!category || !VALID.includes(category)) {
    return NextResponse.json({ error: 'Invalid category', allowed: false }, { status: 400 });
  }

  const source: MockTestSource = body.source === 'ad_unlock' ? 'ad_unlock' : 'free';

  try {
    // Premium (real subscription or the admin's site-wide free promo) is
    // unlimited, so there is nothing to record. This matters beyond just
    // saving a write: mock_test_usage has a unique(user_id, category,
    // used_date, source) constraint, meant to stop a free-tier user
    // recording two "free" attempts the same day. A premium/promo user
    // taking a SECOND test in the same category on the same day would hit
    // that same constraint on this insert and get a raw 500 back — which
    // the client's catch-all then rendered as "daily limit reached", the
    // exact wrong message for someone who is supposed to have no limit.
    if (await isPremium(supabase, user.id)) {
      return NextResponse.json({ allowed: true, source });
    }

    const allowed = await canRunMockTest(supabase, user.id, category, source);
    if (!allowed) {
      return NextResponse.json({ allowed: false, reason: 'daily_limit' });
    }

    const recorded = await recordMockTestUsage(supabase, user.id, category, source);
    if (!recorded.ok) {
      return NextResponse.json({ error: 'usage_record_failed', allowed: false }, { status: 500 });
    }

    return NextResponse.json({ allowed: true, source });
  } catch (err) {
    console.error('[mock-test/start]', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'server_error', allowed: false }, { status: 500 });
  }
}
