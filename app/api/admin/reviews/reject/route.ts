import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase-server';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean);

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { reviewId, notes } = await req.json();
  if (!reviewId) return NextResponse.json({ error: 'Missing reviewId' }, { status: 400 });

  const service = await createServiceClient();

  const { data: review, error: fetchErr } = await service
    .from('member_reviews')
    .select('id, status')
    .eq('id', reviewId)
    .single();

  if (fetchErr || !review) return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  if (review.status !== 'pending') return NextResponse.json({ error: 'Already processed' }, { status: 409 });

  const { error: updErr } = await service
    .from('member_reviews')
    .update({
      status: 'rejected',
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      admin_notes: notes ?? null,
    })
    .eq('id', reviewId);

  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
