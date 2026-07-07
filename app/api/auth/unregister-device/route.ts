import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/device-sessions-server';
import { createServiceClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  const user = await requireAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { deviceId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const deviceId = (body.deviceId ?? '').trim();
  if (!deviceId) {
    return NextResponse.json({ error: 'Missing deviceId' }, { status: 400 });
  }

  const service = await createServiceClient();
  const { error } = await service
    .from('user_devices')
    .delete()
    .eq('user_id', user.id)
    .eq('device_id', deviceId);

  if (error) {
    console.error('[unregister-device]', error.message);
    return NextResponse.json({ error: 'unregister_failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
