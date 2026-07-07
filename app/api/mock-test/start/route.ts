import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { canRunMockTest, recordMockTestUsage } from '@/lib/subscription';
import type { Category } from '@/lib/types';

const VALID: Category[] = ['sg_btt', 'sg_ftt', 'sg_rtt', 'jp_car', 'jp_moto'];

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized', allowed: false }, { status: 401 });
  }

  let body: { category?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body', allowed: false }, { status: 400 });
  }

  const category = body.category as Category;
  if (!category || !VALID.includes(category)) {
    return NextResponse.json({ error: 'Invalid category', allowed: false }, { status: 400 });
  }

  try {
    const allowed = await canRunMockTest(supabase, user.id, category);
    if (!allowed) {
      return NextResponse.json({ allowed: false, reason: 'daily_limit' });
    }

    await recordMockTestUsage(supabase, user.id, category);
    return NextResponse.json({ allowed: true });
  } catch (err) {
    console.error('[mock-test/start]', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'server_error', allowed: false }, { status: 500 });
  }
}
