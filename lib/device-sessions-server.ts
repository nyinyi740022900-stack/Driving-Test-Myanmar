import { parseDeviceLabel } from '@/lib/device-sessions';
import { MAX_DEVICES_PER_USER } from '@/lib/types';
import type { UserDevice } from '@/lib/types';
import { createClient, createServiceClient } from '@/lib/supabase-server';

const DEVICE_SELECT = 'id, device_id, device_label, last_seen_at, created_at';

export async function registerUserDevice(
  userId: string,
  deviceId: string,
  userAgent: string,
): Promise<{ ok: true } | { ok: false; devices: UserDevice[] }> {
  if (!deviceId || deviceId.length > 128) {
    throw new Error('Invalid device');
  }

  const service = await createServiceClient();
  const now = new Date().toISOString();

  const { data: existing } = await service
    .from('user_devices')
    .select(DEVICE_SELECT)
    .eq('user_id', userId)
    .eq('device_id', deviceId)
    .maybeSingle();

  if (existing) {
    await service
      .from('user_devices')
      .update({ last_seen_at: now, user_agent: userAgent || null })
      .eq('id', existing.id);
    return { ok: true };
  }

  const { data: devices, error: listErr } = await service
    .from('user_devices')
    .select(DEVICE_SELECT)
    .eq('user_id', userId)
    .order('last_seen_at', { ascending: false });

  if (listErr) throw new Error(listErr.message);

  if ((devices?.length ?? 0) >= MAX_DEVICES_PER_USER) {
    return { ok: false, devices: (devices ?? []) as UserDevice[] };
  }

  const { error: insertErr } = await service.from('user_devices').insert({
    user_id: userId,
    device_id: deviceId,
    device_label: parseDeviceLabel(userAgent),
    user_agent: userAgent || null,
    last_seen_at: now,
  });

  if (insertErr) throw new Error(insertErr.message);
  return { ok: true };
}

export async function requireAuthUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}
