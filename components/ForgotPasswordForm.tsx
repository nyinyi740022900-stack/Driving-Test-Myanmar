'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase';
import { SITE_URL } from '@/lib/brand';

interface Props {
  locale: string;
}

export default function ForgotPasswordForm({ locale }: Props) {
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const next = encodeURIComponent(`/${locale}/auth/reset-password`);
      const redirectTo = `${SITE_URL}/auth/callback?next=${next}`;
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (err) throw err;
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('errors.generic'));
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="auth-card">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>📧</div>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', marginBottom: 8 }}>{t('forgot_sent_title')}</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '.95rem', lineHeight: 1.6 }}>
            {t('forgot_sent_body', { email })}
          </p>
          <Link href={`/${locale}/auth/login`} className="btn btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
            {t('back_login')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <Link
        href={`/${locale}/auth/login`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '.82rem', color: 'var(--ink-soft)', marginBottom: 20, textDecoration: 'none' }}
      >
        {t('back_login')}
      </Link>
      <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.5rem', marginBottom: 4 }}>{t('forgot_title')}</h2>
      <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem', marginBottom: 22, lineHeight: 1.6 }}>
        {t('forgot_sub')}
      </p>

      {error && <div className="auth-error">{error}</div>}

      <label className="field-label">{t('email')}</label>
      <input
        className="field-input"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
        style={{ marginTop: 20, width: '100%', justifyContent: 'center', opacity: loading ? 0.6 : 1 }}
      >
        {loading ? t('please_wait') : t('forgot_cta')}
      </button>
    </form>
  );
}
