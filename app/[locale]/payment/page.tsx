'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/AuthProvider';
import { createClient } from '@/lib/supabase';
import { getPlans, PLANS, type PlanKey } from '@/lib/subscription';
import { SUPPORT_EMAIL } from '@/lib/brand';
import { compressPaymentScreenshot } from '@/lib/compress-image';
import Link from 'next/link';

const DEFAULT_WALLETS = {
  KBZPay: process.env.NEXT_PUBLIC_KBZPAY_NUMBER ?? '09 XXXX XXXX',
  WavePay: process.env.NEXT_PUBLIC_WAVEPAY_NUMBER ?? '09 XXXX XXXX',
} as const;
const DEFAULT_WALLET_NAMES = {
  KBZPay: process.env.NEXT_PUBLIC_KBZPAY_NAME ?? '',
  WavePay: process.env.NEXT_PUBLIC_WAVEPAY_NAME ?? '',
} as const;

type WalletKey = 'KBZPay' | 'WavePay';

export default function PaymentPage() {
  const t = useTranslations('payment');
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) ?? 'en';
  const { user, loading } = useAuth();
  const planKey = (searchParams.get('plan') ?? 'monthly') as PlanKey;
  const [pricing, setPricing] = useState<{ monthlyPrice: number; yearlyPrice: number }>({
    monthlyPrice: PLANS.monthly.price,
    yearlyPrice: PLANS.yearly.price,
  });
  const [walletNumbers, setWalletNumbers] = useState({ KBZPay: DEFAULT_WALLETS.KBZPay, WavePay: DEFAULT_WALLETS.WavePay });
  const [walletNames, setWalletNames] = useState({ KBZPay: DEFAULT_WALLET_NAMES.KBZPay, WavePay: DEFAULT_WALLET_NAMES.WavePay });
  const plans = getPlans(pricing);
  const plan = plans[planKey] ?? plans.monthly;
  const wallets = [
    { key: 'KBZPay' as const, label: 'KBZPay', number: walletNumbers.KBZPay, color: '#E8192C' },
    { key: 'WavePay' as const, label: 'WavePay', number: walletNumbers.WavePay, color: '#0066CC' },
  ];
  const planLabels = {
    monthly: t('plan_monthly_label'),
    yearly: t('plan_yearly_label'),
  } as const;

  const [wallet, setWallet] = useState<WalletKey>('KBZPay');
  const [txnId, setTxnId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      const returnUrl = encodeURIComponent(`/${locale}/payment?plan=${planKey}`);
      router.push(`/${locale}/auth/login?redirect=${returnUrl}`);
    }
  }, [user, loading, locale, planKey, router]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/settings/public')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed');
        const data = await res.json() as {
          monthlyPrice?: number;
          yearlyPrice?: number;
          kbzpayNumber?: string;
          wavepayNumber?: string;
          kbzpayName?: string;
          wavepayName?: string;
        };
        if (cancelled) return;
        setPricing({
          monthlyPrice: Number.isFinite(data.monthlyPrice) && (data.monthlyPrice ?? 0) > 0 ? Number(data.monthlyPrice) : PLANS.monthly.price,
          yearlyPrice: Number.isFinite(data.yearlyPrice) && (data.yearlyPrice ?? 0) > 0 ? Number(data.yearlyPrice) : PLANS.yearly.price,
        });
        setWalletNumbers({
          KBZPay: data.kbzpayNumber?.trim() || DEFAULT_WALLETS.KBZPay,
          WavePay: data.wavepayNumber?.trim() || DEFAULT_WALLETS.WavePay,
        });
        setWalletNames({
          KBZPay: data.kbzpayName?.trim() || DEFAULT_WALLET_NAMES.KBZPay,
          WavePay: data.wavepayName?.trim() || DEFAULT_WALLET_NAMES.WavePay,
        });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  async function handleScreenshotChange(file: File | null) {
    if (!file) {
      setScreenshot(null);
      return;
    }

    setError('');
    setCompressing(true);
    try {
      const compressed = await compressPaymentScreenshot(file);
      setScreenshot(compressed);
    } catch (err: unknown) {
      setScreenshot(null);
      setError(err instanceof Error ? err.message : t('error_generic'));
    } finally {
      setCompressing(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    const txnDigits = txnId.replace(/\D/g, '');
    if (txnDigits.length !== 6) {
      setError(t('error_txn_digits'));
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const supabase = createClient();
      let screenshotRef: string | null = null;

      if (screenshot) {
        const path = `${user.id}/${Date.now()}.jpg`;
        const { error: upErr } = await supabase.storage
          .from('payment-screenshots')
          .upload(path, screenshot, {
            upsert: false,
            contentType: 'image/jpeg',
            cacheControl: '3600',
          });
        if (upErr) throw upErr;
        screenshotRef = path;
      }

      const { error: insertErr } = await fetch('/api/payment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planKey,
          wallet,
          transaction_id: txnDigits,
          screenshot_url: screenshotRef,
        }),
      }).then(async (res) => {
        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          return { error: { message: data.error ?? 'Submit failed' } };
        }
        return { error: null };
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
              {wallets.map(w => (
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
                  {wallets.find(w => w.key === wallet)?.number}
                </div>
                <div style={{ fontSize: '.82rem', color: 'var(--ink-soft)', marginTop: 2 }}>
                  {wallet} · {t('brand_name')}
                </div>
                {!!walletNames[wallet] && (
                  <div style={{ fontSize: '.85rem', color: 'var(--guide-deep)', marginTop: 4, fontWeight: 700 }}>
                    {t('account_name')}: {walletNames[wallet]}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(wallets.find(w => w.key === wallet)?.number ?? '')}
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
              inputMode="numeric"
              autoComplete="off"
              required
              maxLength={6}
              pattern="\d{6}"
              value={txnId}
              onChange={e => setTxnId(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder={t('txn_placeholder')}
              style={{ marginBottom: 16, letterSpacing: '.08em', fontFamily: 'monospace' }}
            />

            <label className="field-label" htmlFor="screenshot-upload">
              {t('step_screenshot')}
            </label>
            <input
              id="screenshot-upload"
              type="file"
              accept="image/*"
              disabled={compressing || submitting}
              onChange={e => void handleScreenshotChange(e.target.files?.[0] ?? null)}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px',
                border: '1.5px dashed var(--line)',
                borderRadius: 10,
                marginBottom: 8,
                fontSize: '.88rem',
                cursor: 'pointer',
                background: 'var(--paint)',
              }}
            />
            {compressing && (
              <p style={{ marginBottom: 12, fontSize: '.82rem', color: 'var(--ink-soft)' }}>
                {t('compressing')}
              </p>
            )}
            {screenshot && !compressing && (
              <p style={{ marginBottom: 12, fontSize: '.82rem', color: 'var(--guide-deep)' }}>
                {t('screenshot_ready', { size: Math.max(1, Math.round(screenshot.size / 1024)) })}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || compressing}
              style={{ width: '100%', justifyContent: 'center', opacity: submitting || compressing ? .6 : 1 }}
            >
              {compressing ? t('compressing') : submitting ? t('submitting') : t('submit_cta')}
            </button>
          </form>

          <p style={{ marginTop: 16, fontSize: '.82rem', color: 'var(--ink-soft)', textAlign: 'center' }}>
            {t('footer_note')}
          </p>
          {!!walletNames[wallet] && (
            <p style={{ marginTop: 8, fontSize: '.8rem', color: 'var(--ink-soft)', textAlign: 'center' }}>
              {t('verify_name_note', { name: walletNames[wallet] })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
