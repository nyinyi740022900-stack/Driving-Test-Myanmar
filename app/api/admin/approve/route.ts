import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase-server';
import { PLANS, type PlanKey } from '@/lib/subscription';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean);

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { submissionId, notes } = await req.json();
  if (!submissionId) return NextResponse.json({ error: 'Missing submissionId' }, { status: 400 });

  const service = await createServiceClient();

  // Fetch submission
  const { data: sub, error: fetchErr } = await service
    .from('payment_submissions')
    .select('*')
    .eq('id', submissionId)
    .single();
  if (fetchErr || !sub) return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
  if (sub.status !== 'pending') return NextResponse.json({ error: 'Already processed' }, { status: 409 });

  const plan = PLANS[sub.plan as PlanKey];
  if (!plan) return NextResponse.json({ error: 'Unknown plan' }, { status: 400 });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + plan.days);

  // Upsert subscription
  const { error: subErr } = await service.from('subscriptions').upsert(
    {
      user_id: sub.user_id,
      status: 'premium',
      expires_at: expiresAt.toISOString(),
    },
    { onConflict: 'user_id' }
  );
  if (subErr) return NextResponse.json({ error: subErr.message }, { status: 500 });

  // Mark submission approved
  const { error: updErr } = await service
    .from('payment_submissions')
    .update({
      status: 'approved',
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      notes: notes ?? null,
    })
    .eq('id', submissionId);
  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
