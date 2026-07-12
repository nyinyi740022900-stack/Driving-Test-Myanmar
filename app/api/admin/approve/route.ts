import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase-server';
import { PLANS, type PlanKey } from '@/lib/subscription';
import { computeStackedExpiry } from '@/lib/subscription-expiry';
import { sendPaymentStatusEmail } from '@/lib/payment-email';

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

  const { data: sub, error: fetchErr } = await service
    .from('payment_submissions')
    .select('id, user_id, plan, status')
    .eq('id', submissionId)
    .single();
  if (fetchErr || !sub) return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
  if (sub.status !== 'pending') return NextResponse.json({ error: 'Already processed' }, { status: 409 });

  const plan = PLANS[sub.plan as PlanKey];
  if (!plan) return NextResponse.json({ error: 'Unknown plan' }, { status: 400 });

  const { data: existingSub } = await service
    .from('subscriptions')
    .select('expires_at, status')
    .eq('user_id', sub.user_id)
    .maybeSingle();

  const expiresAt = computeStackedExpiry(
    sub.plan as PlanKey,
    existingSub?.status === 'premium' ? existingSub.expires_at : null,
  );

  const { error: subErr } = await service.from('subscriptions').upsert(
    {
      user_id: sub.user_id,
      status: 'premium',
      expires_at: expiresAt.toISOString(),
    },
    { onConflict: 'user_id' },
  );
  if (subErr) return NextResponse.json({ error: subErr.message }, { status: 500 });

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

  const { data: authUser } = await service.auth.admin.getUserById(sub.user_id);
  const email = authUser?.user?.email;
  if (email) {
    await sendPaymentStatusEmail({
      to: email,
      type: 'approved',
      planLabel: plan.label,
      expiresAt,
    });
  }

  return NextResponse.json({ ok: true, expires_at: expiresAt.toISOString() });
}
