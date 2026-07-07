import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/device-sessions-server';
import { createServiceClient } from '@/lib/supabase-server';

export async function GET() {
  const user = await requireAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const service = await createServiceClient();
  const { data, error } = await service
    .from('user_devices')
    .select('id, device_id, device_label, last_seen_at, created_at')
    .eq('user_id', user.id)
    .order('last_seen_at', { ascending: false });

  if (error) {
    console.error('[devices]', error.message);
    return NextResponse.json({ error: 'list_failed' }, { status: 500 });
  }

  return NextResponse.json({ devices: data ?? [] });
}
