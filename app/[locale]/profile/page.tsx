'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/AuthProvider';
import { createClient } from '@/lib/supabase';
import { TEST_META } from '@/lib/types';
import { getBestScore, getAttemptCount } from '@/lib/progress';
import WrongAnswersSection from '@/components/WrongAnswersSection';

interface Subscription {
  status: 'free' | 'premium';
  expires_at: string | null;
  created_at: string;
}

interface PaymentSubmission {
  id: string;
  plan: string;
  amount: number;
  wallet: string;
  transaction_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  notes: string | null;
}

export default function ProfilePage() {
  const params = useParams();
  const locale = (params.locale as string) ?? 'en';
  const router = useRouter();
  const t = useTranslations('profile');
  const { user, loading, signOut } = useAuth();

  const [sub, setSub] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<PaymentSubmission[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/${locale}/auth/login?redirect=/${locale}/profile`);
    }
  }, [user, loading, locale, router]);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    Promise.all([
      supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
      supabase.from('payment_submissions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    ]).then(([subRes, payRes]) => {
      setSub(subRes.data ?? null);
      setPayments(payRes.data ?? []);
      setFetching(false);
    });
  }, [user]);

  if (loading || fetching || !user) return null;

  const isPremium = sub?.status === 'premium' && sub.expires_at && new Date(sub.expires_at) > new Date();
  const expiresDate = sub?.expires_at ? new Date(sub.expires_at).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-SG', { year: 'numeric', month: 'long', day: 'numeric' }) : null;

  const statusColor = isPremium ? '#1B9C56' : '#888';
  const statusLabel = isPremium ? t('plan_premium') : t('plan_free');
  const planLabelMap = {
    monthly: t('plan_monthly'),
    yearly: t('plan_yearly'),
  } as const;

  const progressRows = TEST_META.map(meta => {
    const best = getBestScore(meta.category);
    const attempts = getAttemptCount(meta.category);
    const bestPct = best ? Math.round((best.score / best.total) * 100) : null;
    const name = locale === 'my' ? meta.nameMy : locale === 'ja' ? meta.nameJa : meta.nameEn;
    return { meta, name, attempts, bestPct };
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paint)', padding: '48px 24px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        <Link href={`/${locale}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '.82rem', color: 'var(--ink-soft)', marginBottom: 24, textDecoration: 'none' }}>
          {t('back_home')}
        </Link>

        {/* Profile header */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '28px 28px', marginBottom: 20, border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--asphalt)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.4rem', flexShrink: 0 }}>
            {user.email?.[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.1rem', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
            <div style={{ fontSize: '.82rem', color: 'var(--ink-soft)' }}>
              {t('member_since', { date: new Date(user.created_at).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-SG', { year: 'numeric', month: 'long' }) })}
            </div>
          </div>
          <button
            onClick={async () => { await signOut(); router.push(`/${locale}`); }}
            style={{ fontSize: '.82rem', fontFamily: 'var(--display)', fontWeight: 600, color: 'var(--ink-soft)', background: 'none', border: '1px solid var(--line)', borderRadius: 8, cursor: 'pointer', padding: '7px 14px' }}
          >
            {t('sign_out')}
          </button>
        </div>

        {/* Subscription status */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '24px 28px', marginBottom: 20, border: `1.5px solid ${statusColor}30` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: isPremium ? 16 : 12 }}>
            <div>
              <div style={{ fontSize: '.72rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 4 }}>
                {t('current_plan')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.3rem' }}>{statusLabel}</span>
                <span style={{ background: `${statusColor}18`, color: statusColor, fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.75rem', padding: '3px 10px', borderRadius: 99 }}>
                  {isPremium ? t('status_active') : t('status_free')}
                </span>
              </div>
            </div>
            {!isPremium && (
              <Link href={`/${locale}/premium`} style={{ fontSize: '.82rem', fontFamily: 'var(--display)', fontWeight: 700, background: 'var(--guide)', color: '#fff', padding: '8px 16px', borderRadius: 10, textDecoration: 'none' }}>
                {t('upgrade_cta')}
              </Link>
            )}
          </div>

          {isPremium && expiresDate && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <InfoRow label={t('expires')} value={expiresDate} />
              <InfoRow label={t('features')} value={t('features_value')} />
            </div>
          )}

          {!isPremium && (
            <div style={{ fontSize: '.85rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              {t('free_note')}
            </div>
          )}
        </div>

        {/* Progress summary */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '24px 28px', marginBottom: 20, border: '1px solid var(--line)' }}>
          <div style={{ fontSize: '.72rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 16 }}>
            {t('progress_heading')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {progressRows.map(({ meta, name, attempts, bestPct }) => (
              <div key={meta.category} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: 'var(--paint)', borderRadius: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '.92rem' }}>{name}</div>
                  <div style={{ fontSize: '.78rem', color: 'var(--ink-soft)', marginTop: 2 }}>
                    {t('attempts_label', { count: attempts })}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {bestPct === null ? (
                    <div style={{ fontSize: '.78rem', color: 'var(--ink-soft)' }}>{t('no_attempts')}</div>
                  ) : (
                    <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1rem', color: bestPct >= meta.passPercent ? 'var(--guide)' : 'var(--amber)' }}>
                      {bestPct}%
                    </div>
                  )}
                  <div style={{ fontSize: '.72rem', color: 'var(--ink-soft)' }}>
                    {t('best_score')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <WrongAnswersSection locale={locale} />

        {/* Settings */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '24px 28px', marginBottom: 20, border: '1px solid var(--line)' }}>
          <div style={{ fontSize: '.72rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 16 }}>
            {t('settings_heading')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <SettingRow label={t('email_label')} value={user.email ?? '—'} />
            <SettingRow label={t('account_id_label')} value={user.id.slice(0, 16) + '…'} mono />
            <SettingRow label={t('email_verified_label')} value={user.email_confirmed_at ? t('email_verified') : t('email_not_verified')} />
          </div>
        </div>

        {/* Payment history */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '24px 28px', border: '1px solid var(--line)' }}>
          <div style={{ fontSize: '.72rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 16 }}>
            {t('payments_heading')}
          </div>

          {payments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--ink-soft)', fontSize: '.9rem' }}>
              {t('payments_empty')}{' '}
              <Link href={`/${locale}/premium`} style={{ color: 'var(--guide-deep)', fontWeight: 600 }}>{t('view_plans')}</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {payments.map(p => {
                const planLabel = planLabelMap[p.plan as keyof typeof planLabelMap] ?? p.plan;
                const statusClr = p.status === 'approved' ? '#1B9C56' : p.status === 'rejected' ? '#dc2626' : '#d97706';
                return (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--paint)', borderRadius: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.88rem' }}>{planLabel}</div>
                      <div style={{ fontSize: '.78rem', color: 'var(--ink-soft)', marginTop: 2 }}>
                        {p.wallet} · {p.transaction_id} · {new Date(p.created_at).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-SG')}
                      </div>
                      {p.notes && p.status === 'rejected' && (
                        <div style={{ fontSize: '.78rem', color: '#dc2626', marginTop: 4 }}>
                          {t('rejection_note', { note: p.notes })}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '.95rem' }}>
                        {p.amount.toLocaleString()} {t('currency_ks')}
                      </div>
                      <span style={{ background: `${statusClr}18`, color: statusClr, fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.72rem', padding: '2px 8px', borderRadius: 99, textTransform: 'capitalize' }}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, fontSize: '.85rem' }}>
      <span style={{ color: 'var(--ink-soft)', minWidth: 80 }}>{label}</span>
      <span style={{ fontFamily: 'var(--display)', fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function SettingRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--line)', gap: 12, flexWrap: 'wrap' }}>
      <span style={{ fontSize: '.88rem', color: 'var(--ink-soft)' }}>{label}</span>
      <span style={{ fontSize: '.88rem', fontFamily: mono ? 'monospace' : 'var(--display)', fontWeight: 600 }}>{value}</span>
    </div>
  );
}
