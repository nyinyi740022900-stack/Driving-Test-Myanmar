'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase';

interface Props {
  locale: string;
}

export default function ResetPasswordForm({ locale }: Props) {
  const t = useTranslations('auth');
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [invalidLink, setInvalidLink] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data, error: userError }) => {
      if (userError || !data.user) setInvalidLink(true);
      setChecking(false);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError(t('errors.password_mismatch'));
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) throw err;
      await supabase.auth.signOut();
      router.push(`/${locale}/auth/login?reset=success`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('errors.generic'));
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="auth-card">
        <p style={{ color: 'var(--ink-soft)', textAlign: 'center' }}>{t('please_wait')}</p>
      </div>
    );
  }

  if (invalidLink) {
    return (
      <div className="auth-card">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>⚠️</div>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', marginBottom: 8 }}>{t('reset_invalid_title')}</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '.95rem', lineHeight: 1.6 }}>
            {t('reset_invalid_link')}
          </p>
          <Link href={`/${locale}/auth/forgot-password`} className="btn btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
            {t('forgot_cta')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.5rem', marginBottom: 4 }}>{t('reset_title')}</h2>
      <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem', marginBottom: 22, lineHeight: 1.6 }}>
        {t('reset_sub')}
      </p>

      {error && <div className="auth-error">{error}</div>}

      <label className="field-label">{t('reset_password')}</label>
      <input
        className="field-input"
        type="password"
        required
        autoComplete="new-password"
        minLength={8}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t('password_placeholder_signup')}
      />

      <label className="field-label" style={{ marginTop: 14 }}>{t('reset_confirm')}</label>
      <input
        className="field-input"
        type="password"
        required
        autoComplete="new-password"
        minLength={8}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder={t('password_placeholder_signup')}
      />

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
        style={{ marginTop: 20, width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}
      >
        {loading ? t('please_wait') : t('reset_cta')}
      </button>
    </form>
  );
}
