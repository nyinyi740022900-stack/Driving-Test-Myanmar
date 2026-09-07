import type { Metadata } from 'next';
import { pageAlternates } from '@/lib/seo';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getPlans } from '@/lib/subscription';
import { getPublicAppSettings } from '@/lib/app-settings';
import PremiumPageTracker from '@/components/PremiumPageTracker';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('premium');
  return {
    title: { absolute: t('meta_title') },
    description: t('meta_description'),
    alternates: pageAlternates(locale, '/premium'),
  };
}

export default async function PremiumPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations('premium');
  const pricing = await getPublicAppSettings();
  const plans = getPlans({
    monthlyPrice: pricing.monthlyPrice,
    yearlyPrice: pricing.yearlyPrice,
  });

  const planLabels = {
    monthly: t('plan_monthly_label'),
    yearly: t('plan_yearly_label'),
  } as const;

  const features = [
    t('feature_1'),
    t('feature_2'),
    t('feature_3'),
    t('feature_4'),
    t('feature_5'),
  ];

  const compareRows: { label: string; free: string; premium: string }[] = [
    { label: t('compare_row_lessons'), free: t('compare_val_unlimited'), premium: t('compare_val_unlimited') },
    { label: t('compare_row_mock'), free: t('compare_val_one_daily'), premium: t('compare_val_unlimited') },
    { label: t('compare_row_ads'), free: t('compare_val_with_ads'), premium: t('compare_val_no_ads') },
    { label: t('compare_row_history'), free: t('compare_val_no'), premium: t('compare_val_yes') },
    { label: t('compare_row_review'), free: t('compare_val_no'), premium: t('compare_val_yes') },
    { label: t('compare_row_support'), free: t('compare_val_standard'), premium: t('compare_val_priority') },
  ];

  const howSteps = [t('how_1'), t('how_2'), t('how_3')];

  const faqs = [
    { q: t('faq_1_q'), a: t('faq_1_a') },
    { q: t('faq_2_q'), a: t('faq_2_a') },
    { q: t('faq_3_q'), a: t('faq_3_a') },
    { q: t('faq_4_q'), a: t('faq_4_a') },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paint)', padding: '60px 24px' }}>
      <PremiumPageTracker />
      <div style={{ maxWidth: 740, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div className="eyebrow" style={{ color: 'var(--guide-deep)', marginBottom: 12 }}>{t('eyebrow')}</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 800, marginBottom: 12 }}>
            {t('title')}
          </h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: '1.05rem', maxWidth: '34em', margin: '0 auto' }}>
            {t('lead')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {(Object.entries(plans) as [keyof typeof plans, typeof plans[keyof typeof plans]][]).map(([key, plan]) => (
            <div key={key} style={{
              background: '#fff',
              border: key === 'yearly' ? '2px solid var(--guide)' : '1px solid var(--line)',
              borderRadius: 16,
              padding: '28px 24px',
              position: 'relative',
            }}>
              {key === 'yearly' && (
                <div style={{
                  position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--guide)', color: '#fff', fontFamily: 'var(--display)',
                  fontWeight: 700, fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase',
                  padding: '4px 14px', borderRadius: 999,
                }}>{t('best_value')}</div>
              )}
              <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 6 }}>
                {planLabels[key]}
              </div>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '2.2rem', lineHeight: 1, marginBottom: 4 }}>
                {plan.price.toLocaleString()}
                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ink-soft)' }}>
                  {t('currency_ks')}
                </span>
              </div>
              <div style={{ fontSize: '.85rem', color: 'var(--ink-soft)', marginBottom: 20 }}>
                {t('plan_days', { days: plan.days })} · {key === 'yearly' ? t('plan_yearly_note') : t('plan_monthly_note')}
              </div>
              <ul style={{ listStyle: 'none', fontSize: '.9rem', color: 'var(--ink-soft)', marginBottom: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {features.map(f => (
                  <li key={f} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: 'var(--guide)', fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/${locale}/payment?plan=${key}`}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', display: 'flex' }}
              >
                {t('choose_plan', { plan: planLabels[key] })}
              </Link>
            </div>
          ))}
        </div>

        <section aria-labelledby="compare-title" style={{ marginTop: 64 }}>
          <h2 id="compare-title" style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800, marginBottom: 18, textAlign: 'center' }}>
            {t('compare_title')}
          </h2>
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--paint-2)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', fontFamily: 'var(--display)', fontWeight: 700 }}>{t('compare_col_feature')}</th>
                  <th style={{ padding: '12px 16px', fontFamily: 'var(--display)', fontWeight: 700 }}>{t('compare_col_free')}</th>
                  <th style={{ padding: '12px 16px', fontFamily: 'var(--display)', fontWeight: 700, color: 'var(--guide-deep)' }}>{t('compare_col_premium')}</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map(row => (
                  <tr key={row.label} style={{ borderTop: '1px solid var(--line)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--ink)' }}>{row.label}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--ink-soft)' }}>{row.free}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--guide-deep)', fontWeight: 600 }}>{row.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="how-title" style={{ marginTop: 64 }}>
          <h2 id="how-title" style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800, marginBottom: 18, textAlign: 'center' }}>
            {t('how_title')}
          </h2>
          <ol style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 14, counterReset: 'step' }}>
            {howSteps.map((step, i) => (
              <li key={step} style={{
                background: '#fff', border: '1px solid var(--line)', borderRadius: 14,
                padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start',
              }}>
                <span style={{
                  flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--guide)', color: '#fff', fontFamily: 'var(--display)',
                  fontWeight: 700, fontSize: '.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{i + 1}</span>
                <span style={{ fontSize: '.95rem', color: 'var(--ink)', lineHeight: 1.55 }}>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section id="faq" aria-labelledby="faq-title" style={{ marginTop: 64 }}>
          <h2 id="faq-title" style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800, marginBottom: 18, textAlign: 'center' }}>
            {t('faq_title')}
          </h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {faqs.map(item => (
              <details key={item.q} style={{
                background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '14px 20px',
              }}>
                <summary style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.95rem', cursor: 'pointer' }}>
                  {item.q}
                </summary>
                <p style={{ margin: '10px 0 0', fontSize: '.9rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <p style={{ textAlign: 'center', marginTop: 44, fontSize: '.82rem', color: 'var(--ink-soft)' }}>
          <Link href={`/${locale}`} style={{ color: 'var(--guide-deep)', fontWeight: 600 }}>{t('back_home')}</Link>
        </p>
      </div>
    </div>
  );
}
