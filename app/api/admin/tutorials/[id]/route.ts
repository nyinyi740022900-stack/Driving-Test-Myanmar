import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase-server';
import { extractYouTubeId } from '@/lib/youtube';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean);

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user && ADMIN_EMAILS.includes(user.email ?? '') ? user : null;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const { id } = await params;
  const body = await req.json();
  if (body.youtube_url !== undefined && !extractYouTubeId(body.youtube_url ?? '')) {
    return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
  }
  const service = await createServiceClient();
  const { error } = await service.from('video_tutorials').update(body).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const { id } = await params;
  const service = await createServiceClient();
  const { error } = await service.from('video_tutorials').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
