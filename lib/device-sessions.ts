import type { UserDevice } from './types';

const DEVICE_KEY = 'rr_device_id';

export function getDeviceId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

export function parseDeviceLabel(userAgent: string): string {
  const ua = userAgent || '';
  if (/iPhone/i.test(ua)) return 'iPhone';
  if (/iPad/i.test(ua)) return 'iPad';
  if (/Android/i.test(ua)) return 'Android';
  if (/Macintosh|Mac OS/i.test(ua)) return 'Mac';
  if (/Windows/i.test(ua)) return 'Windows PC';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Browser';
}

export interface RegisterDeviceResult {
  ok: boolean;
  deviceLimit?: boolean;
  devices?: UserDevice[];
  error?: string;
}

export async function registerCurrentDevice(): Promise<RegisterDeviceResult> {
  try {
    const res = await fetch('/api/auth/register-device', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: getDeviceId(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      }),
    });

    if (res.status === 409) {
      const data = (await res.json()) as { devices?: UserDevice[] };
      return { ok: false, deviceLimit: true, devices: data.devices ?? [] };
    }

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      return { ok: false, error: data.error ?? 'device_register_failed' };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: 'network_error' };
  }
}

export async function revokeDevice(deviceRowId: string): Promise<boolean> {
  const res = await fetch('/api/auth/revoke-device', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceRowId }),
  });
  return res.ok;
}

export async function unregisterCurrentDevice(): Promise<void> {
  try {
    await fetch('/api/auth/unregister-device', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId: getDeviceId() }),
    });
  } catch {
    // non-blocking on sign-out
  }
}

export async function listUserDevices(): Promise<UserDevice[]> {
  const res = await fetch('/api/auth/devices');
  if (!res.ok) return [];
  const data = (await res.json()) as { devices?: UserDevice[] };
  return data.devices ?? [];
}
