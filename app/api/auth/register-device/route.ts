import { NextResponse } from 'next/server';
import { registerUserDevice, requireAuthUser } from '@/lib/device-sessions-server';

export async function POST(request: Request) {
  const user = await requireAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { deviceId?: string; userAgent?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const deviceId = (body.deviceId ?? '').trim();
  const userAgent = (body.userAgent ?? '').slice(0, 512);

  try {
    const result = await registerUserDevice(user.id, deviceId, userAgent);
    if (!result.ok) {
      return NextResponse.json({ error: 'device_limit', devices: result.devices }, { status: 409 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'register_failed';
    console.error('[register-device]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
