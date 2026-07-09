import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase-server';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean);

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user && ADMIN_EMAILS.includes(user.email ?? '') ? user : null;
}

export async function POST(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { key, value } = await req.json();
  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 });

  const service = await createServiceClient();
  const { error } = await service
    .from('app_settings')
    .upsert(
      { key, value: String(value ?? ''), updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
