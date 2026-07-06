'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/AuthProvider';
import { createClient } from '@/lib/supabase';
import { PLANS, type PlanKey } from '@/lib/subscription';
import { SUPPORT_EMAIL } from '@/lib/brand';
import Link from 'next/link';

const WALLETS = [
  {
    key: 'KBZPay',
    label: 'KBZPay',
    number: process.env.NEXT_PUBLIC_KBZPAY_NUMBER ?? '09 XXXX XXXX',
    color: '#E8192C',
  },
  {
    key: 'WavePay',
    label: 'WavePay',
    number: process.env.NEXT_PUBLIC_WAVEPAY_NUMBER ?? '09 XXXX XXXX',
    color: '#0066CC',
  },
] as const;

type WalletKey = 'KBZPay' | 'WavePay';

export default function PaymentPage() {
  const t = useTranslations('payment');
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) ?? 'en';
  const { user, loading } = useAuth();
  const planKey = (searchParams.get('plan') ?? 'monthly') as PlanKey;
  const plan = PLANS[planKey] ?? PLANS.monthly;
  const planLabels = {
    monthly: t('plan_monthly_label'),
    yearly: t('plan_yearly_label'),
  } as const;

  const [wallet, setWallet] = useState<WalletKey>('KBZPay');
  const [txnId, setTxnId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      const returnUrl = encodeURIComponent(`/${locale}/payment?plan=${planKey}`);
      router.push(`/${locale}/auth/login?redirect=${returnUrl}`);
    }
  }, [user, loading, locale, planKey, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError('');
    setSubmitting(true);

    try {
      const supabase = createClient();
      let screenshotUrl: string | null = null;

      if (screenshot) {
        const ext = screenshot.name.split('.').pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from('payment-screenshots')
          .upload(path, screenshot, { upsert: false });
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage
          .from('payment-screenshots')
          .getPublicUrl(path);
        screenshotUrl = urlData.publicUrl;
      }

      const { error: insertErr } = await supabase.from('payment_submissions').insert({
        user_id: user.id,
        plan: planKey,
        amount: plan.price,
        wallet,
        transaction_id: txnId.trim(),
        screenshot_url: screenshotUrl,
        status: 'pending',
      });
      if (insertErr) throw insertErr;
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('error_generic'));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ maxWidth: 480, textAlign: 'center' }}>
          <div style={{ fontSize: '2.4rem', marginBottom: 12 }}>🎉</div>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.5rem', marginBottom: 10 }}>{t('submitted_title')}</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '.95rem', marginBottom: 20 }}>
            {t('submitted_desc', { plan: planLabels[planKey] })}
          </p>
          <p style={{ color: 'var(--ink-soft)', fontSize: '.88rem', marginBottom: 8 }}>
            {t('submitted_note')}
          </p>
          <p style={{ color: 'var(--ink-soft)', fontSize: '.85rem', marginBottom: 24 }}>
            {t('submitted_contact')}{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: 'var(--guide-deep)', fontWeight: 600 }}>
              {SUPPORT_EMAIL}
            </a>
          </p>
          <Link href={`/${locale}`} className="btn btn-primary" style={{ display: 'inline-flex' }}>
            {t('back_home')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: 40 }}>
      <div style={{ width: '100%', maxWidth: 500 }}>
        <Link href={`/${locale}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '.82rem', color: 'var(--ink-soft)', marginBottom: 16, textDecoration: 'none' }}>
          {t('back_home')}
        </Link>
        <div className="auth-card">
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: '.78rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--guide-deep)', marginBottom: 6 }}>
              {t('eyebrow')}
            </div>
            <h1 style={{ fontFamily: 'var(--display)', fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 }}>
              {planLabels[planKey]}
            </h1>
            <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.8rem', color: 'var(--guide-deep)' }}>
              {plan.price.toLocaleString()} {t('currency_ks')}
            </div>
          </div>

          {/* Wallet selector */}
          <div style={{ marginBottom: 20 }}>
            <div className="field-label" style={{ marginBottom: 10 }}>{t('step_method')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {WALLETS.map(w => (
                <button
                  key={w.key}
                  type="button"
                  aria-pressed={wallet === w.key}
                  onClick={() => setWallet(w.key)}
                  style={{
                    padding: '14px',
                    borderRadius: 12,
                    border: wallet === w.key ? `2px solid ${w.color}` : '1.5px solid var(--line)',
                    background: wallet === w.key ? `${w.color}12` : 'var(--paint)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontFamily: 'var(--display)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: wallet === w.key ? w.color : 'var(--ink)',
                    transition: 'all .15s',
                  }}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transfer instructions */}
          <div style={{
            background: 'var(--paint-2)',
            borderRadius: 12,
            padding: '16px',
            marginBottom: 24,
          }}>
            <div className="field-label" style={{ marginBottom: 8 }}>
              {t('step_transfer', { amount: plan.price.toLocaleString() })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.3rem' }}>
                  {WALLETS.find(w => w.key === wallet)?.number}
                </div>
                <div style={{ fontSize: '.82rem', color: 'var(--ink-soft)', marginTop: 2 }}>
                  {wallet} · {t('brand_name')}
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(WALLETS.find(w => w.key === wallet)?.number ?? '')}
                style={{ fontSize: '.78rem', fontFamily: 'var(--display)', fontWeight: 700, padding: '6px 12px', border: '1px solid var(--line)', borderRadius: 8, background: '#fff', cursor: 'pointer', color: 'var(--ink-soft)' }}
              >
                {t('copy')}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}

            <label className="field-label">{t('step_txn')}</label>
            <input
              className="field-input"
              type="text"
              required
              value={txnId}
              onChange={e => setTxnId(e.target.value)}
              placeholder={t('txn_placeholder')}
              style={{ marginBottom: 16 }}
            />

            <label className="field-label" htmlFor="screenshot-upload">
              {t('step_screenshot')}
            </label>
            <input
              id="screenshot-upload"
              type="file"
              accept="image/*"
              onChange={e => setScreenshot(e.target.files?.[0] ?? null)}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px',
                border: '1.5px dashed var(--line)',
                borderRadius: 10,
                marginBottom: 20,
                fontSize: '.88rem',
                cursor: 'pointer',
                background: 'var(--paint)',
              }}
            />

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ width: '100%', justifyContent: 'center', opacity: submitting ? .6 : 1 }}
            >
              {submitting ? t('submitting') : t('submit_cta')}
            </button>
          </form>

          <p style={{ marginTop: 16, fontSize: '.82rem', color: 'var(--ink-soft)', textAlign: 'center' }}>
            {t('footer_note')}
          </p>
        </div>
      </div>
    </div>
  );
}
