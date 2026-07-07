'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase';
import DeviceLimitModal from './DeviceLimitModal';
import type { UserDevice } from '@/lib/types';
import { registerCurrentDevice } from '@/lib/device-sessions';

interface Props {
  mode: 'login' | 'signup';
  locale: string;
  redirectTo?: string;
}

export default function AuthForm({ mode, locale, redirectTo }: Props) {
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [deviceLimitDevices, setDeviceLimitDevices] = useState<UserDevice[] | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      if (mode === 'signup') {
        const { error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
        setDone(true);
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;

        const reg = await registerCurrentDevice();
        if (reg.deviceLimit && reg.devices?.length) {
          setDeviceLimitDevices(reg.devices);
          return;
        }
        if (!reg.ok) {
          throw new Error(t('errors.device_register'));
        }

        router.push(redirectTo ?? `/${locale}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('errors.generic'));
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="auth-card">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>📧</div>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', marginBottom: 8 }}>{t('check_email_title')}</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '.95rem' }}>
            {t('check_email_body', { email })}
          </p>
          <a href={`/${locale}/auth/login`} className="btn btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
            {t('check_email_cta')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <form className="auth-card" onSubmit={handleSubmit}>
        <a
          href={`/${locale}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '.82rem', color: 'var(--ink-soft)', marginBottom: 20, textDecoration: 'none' }}
        >
          {t('back_home')}
        </a>
        <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.5rem', marginBottom: 4 }}>
          {mode === 'login' ? t('login_title') : t('signup_title')}
        </h2>
        <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem', marginBottom: 22 }}>
          {mode === 'login' ? t('login_sub') : t('signup_sub')}
        </p>

        {error && (
          <div className="auth-error">{error}</div>
        )}

        <label className="field-label">{t('email')}</label>
        <input
          className="field-input"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <label className="field-label" style={{ marginTop: 14 }}>{t('password')}</label>
        <input
          className="field-input"
          type="password"
          required
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          minLength={8}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder={mode === 'signup' ? t('password_placeholder_signup') : '••••••••'}
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ marginTop: 20, width: '100%', justifyContent: 'center', opacity: loading ? .6 : 1 }}
        >
          {loading ? t('please_wait') : mode === 'login' ? t('login_cta') : t('signup_cta')}
        </button>

        <p style={{ marginTop: 16, fontSize: '.86rem', color: 'var(--ink-soft)', textAlign: 'center' }}>
          {mode === 'login' ? (
            <>{t('no_account')} <a href={`/${locale}/auth/signup`} style={{ color: 'var(--guide-deep)', fontWeight: 600 }}>{t('signup_link')}</a></>
          ) : (
            <>{t('has_account')} <a href={`/${locale}/auth/login`} style={{ color: 'var(--guide-deep)', fontWeight: 600 }}>{t('login_link')}</a></>
          )}
        </p>
      </form>

      {deviceLimitDevices && (
        <DeviceLimitModal
          devices={deviceLimitDevices}
          onResolved={() => {
            setDeviceLimitDevices(null);
            router.push(redirectTo ?? `/${locale}`);
          }}
          onCancel={async () => {
            setDeviceLimitDevices(null);
            await createClient().auth.signOut();
          }}
        />
      )}
    </>
  );
}
