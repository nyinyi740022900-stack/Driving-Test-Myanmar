'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

interface Props {
  mode: 'login' | 'signup';
  locale: string;
  redirectTo?: string;
}

export default function AuthForm({ mode, locale, redirectTo }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();
  // createClient() throws when Supabase env vars are missing — only instantiate on submit


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
        router.push(redirectTo ?? `/${locale}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="auth-card">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>📧</div>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', marginBottom: 8 }}>Check your email</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '.95rem' }}>
            We sent a confirmation link to <strong>{email}</strong>.<br />
            Click it to activate your account, then sign in.
          </p>
          <a href={`/${locale}/auth/login`} className="btn btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
            Sign in →
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <a
        href={`/${locale}`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '.82rem', color: 'var(--ink-soft)', marginBottom: 20, textDecoration: 'none' }}
      >
        ← Back to home
      </a>
      <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.5rem', marginBottom: 4 }}>
        {mode === 'login' ? 'Sign in' : 'Create account'}
      </h2>
      <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem', marginBottom: 22 }}>
        {mode === 'login'
          ? 'Access your practice history and premium features.'
          : 'Free to join — start practising immediately.'}
      </p>

      {error && (
        <div className="auth-error">{error}</div>
      )}

      <label className="field-label">Email</label>
      <input
        className="field-input"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
      />

      <label className="field-label" style={{ marginTop: 14 }}>Password</label>
      <input
        className="field-input"
        type="password"
        required
        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        minLength={8}
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder={mode === 'signup' ? 'Min 8 characters' : '••••••••'}
      />

      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
        style={{ marginTop: 20, width: '100%', justifyContent: 'center', opacity: loading ? .6 : 1 }}
      >
        {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
      </button>

      <p style={{ marginTop: 16, fontSize: '.86rem', color: 'var(--ink-soft)', textAlign: 'center' }}>
        {mode === 'login' ? (
          <>No account? <a href={`/${locale}/auth/signup`} style={{ color: 'var(--guide-deep)', fontWeight: 600 }}>Sign up free</a></>
        ) : (
          <>Already have an account? <a href={`/${locale}/auth/login`} style={{ color: 'var(--guide-deep)', fontWeight: 600 }}>Sign in</a></>
        )}
      </p>
    </form>
  );
}
