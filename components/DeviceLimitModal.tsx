'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { UserDevice } from '@/lib/types';
import { getDeviceId, registerCurrentDevice, revokeDevice } from '@/lib/device-sessions';

interface Props {
  devices: UserDevice[];
  onResolved: () => void;
  onCancel: () => void;
}

function formatLastSeen(iso: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function DeviceLimitModal({ devices, onResolved, onCancel }: Props) {
  const t = useTranslations('auth.devices');
  const locale = useLocale();
  const [selected, setSelected] = useState<string>(devices[0]?.id ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleContinue() {
    if (!selected) return;
    setLoading(true);
    setError('');
    try {
      const revoked = await revokeDevice(selected);
      if (!revoked) throw new Error('revoke_failed');
      const reg = await registerCurrentDevice();
      if (!reg.ok) throw new Error(reg.deviceLimit ? 'still_limited' : reg.error ?? 'register_failed');
      onResolved();
    } catch {
      setError(t('error'));
    } finally {
      setLoading(false);
    }
  }

  const currentId = getDeviceId();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="device-limit-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        background: 'rgba(0,0,0,.45)',
        display: 'grid',
        placeItems: 'center',
        padding: 20,
      }}
    >
      <div
        className="auth-card"
        style={{ maxWidth: 440, width: '100%', margin: 0 }}
      >
        <h2 id="device-limit-title" style={{ fontFamily: 'var(--display)', fontSize: '1.35rem', marginBottom: 8 }}>
          {t('title')}
        </h2>
        <p style={{ color: 'var(--ink-soft)', fontSize: '.92rem', lineHeight: 1.55, marginBottom: 18 }}>
          {t('body')}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {devices.map((device) => (
            <label
              key={device.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '12px 14px',
                border: selected === device.id ? '2px solid var(--guide)' : '1.5px solid var(--line)',
                borderRadius: 12,
                cursor: 'pointer',
                background: selected === device.id ? 'rgba(27,156,86,.06)' : '#fff',
              }}
            >
              <input
                type="radio"
                name="device-revoke"
                value={device.id}
                checked={selected === device.id}
                onChange={() => setSelected(device.id)}
                style={{ marginTop: 4 }}
              />
              <span>
                <strong style={{ display: 'block', fontFamily: 'var(--display)', fontSize: '.95rem' }}>
                  {device.device_label}
                </strong>
                <span style={{ fontSize: '.8rem', color: 'var(--ink-soft)' }}>
                  {t('last_seen', { date: formatLastSeen(device.last_seen_at, locale) })}
                </span>
                {device.device_id === currentId && (
                  <span style={{ display: 'block', fontSize: '.75rem', color: 'var(--guide-deep)', marginTop: 4 }}>
                    {t('current_hint')}
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>

        {error && <div className="auth-error" style={{ marginBottom: 12 }}>{error}</div>}

        <button
          type="button"
          className="btn btn-primary"
          disabled={loading || !selected}
          onClick={handleContinue}
          style={{ width: '100%', justifyContent: 'center', opacity: loading ? .7 : 1 }}
        >
          {loading ? t('working') : t('continue')}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onCancel}
          disabled={loading}
          style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
        >
          {t('cancel')}
        </button>
      </div>
    </div>
  );
}
