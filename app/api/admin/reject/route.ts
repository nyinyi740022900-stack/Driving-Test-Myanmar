import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase-server';

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

  const { error: updErr } = await service
    .from('payment_submissions')
    .update({
      status: 'rejected',
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      notes: notes ?? null,
    })
    .eq('id', submissionId);
  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
