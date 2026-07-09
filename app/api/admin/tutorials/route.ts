import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase-server';
import { extractYouTubeId } from '@/lib/youtube';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean);

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user && ADMIN_EMAILS.includes(user.email ?? '') ? user : null;
}

export async function GET() {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const service = await createServiceClient();
  const { data, error } = await service.from('video_tutorials').select('*').order('country').order('sort_order');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const body = await req.json();
  if (!extractYouTubeId(body.youtube_url ?? '')) {
    return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
  }
  const service = await createServiceClient();
  const { data, error } = await service.from('video_tutorials').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
