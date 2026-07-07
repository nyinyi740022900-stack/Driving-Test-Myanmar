import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/device-sessions-server';
import { createServiceClient } from '@/lib/supabase-server';

export async function POST(request: Request) {
  const user = await requireAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { deviceRowId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const deviceRowId = (body.deviceRowId ?? '').trim();
  if (!deviceRowId) {
    return NextResponse.json({ error: 'Missing deviceRowId' }, { status: 400 });
  }

  const service = await createServiceClient();
  const { error } = await service
    .from('user_devices')
    .delete()
    .eq('id', deviceRowId)
    .eq('user_id', user.id);

  if (error) {
    console.error('[revoke-device]', error.message);
    return NextResponse.json({ error: 'revoke_failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
