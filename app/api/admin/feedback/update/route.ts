import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase-server';
import type { FeedbackPriority, FeedbackStatus } from '@/lib/types';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean);
const VALID_STATUSES: FeedbackStatus[] = ['pending', 'reviewing', 'resolved', 'dismissed'];
const VALID_PRIORITIES: FeedbackPriority[] = ['low', 'normal', 'high'];

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { feedbackId, status, admin_notes, priority } = await req.json();
  if (!feedbackId) return NextResponse.json({ error: 'Missing feedbackId' }, { status: 400 });
  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }
  if (priority && !VALID_PRIORITIES.includes(priority)) {
    return NextResponse.json({ error: 'Invalid priority' }, { status: 400 });
  }

  const service = await createServiceClient();

  const { data: existing, error: fetchErr } = await service
    .from('user_feedback')
    .select('id, status')
    .eq('id', feedbackId)
    .single();

  if (fetchErr || !existing) {
    return NextResponse.json({ error: 'Feedback not found' }, { status: 404 });
  }

  const updates: Record<string, unknown> = {};
  if (status) {
    updates.status = status;
    updates.reviewed_by = user.id;
    updates.reviewed_at = new Date().toISOString();
  }
  if (priority) updates.priority = priority;
  if (admin_notes !== undefined) {
    updates.admin_notes = admin_notes?.trim() ? admin_notes.trim().slice(0, 1000) : null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }

  const { error: updErr } = await service
    .from('user_feedback')
    .update(updates)
    .eq('id', feedbackId);

  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
