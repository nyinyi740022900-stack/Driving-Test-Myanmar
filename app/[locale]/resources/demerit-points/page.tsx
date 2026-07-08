'use client';

import type React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useCountry } from '@/components/CountryProvider';
import BackButton from '@/components/BackButton';

interface Stat {
  label: string;
  value: string;
  sub?: string;
}

interface Level {
  label: string;
  value: string;
}

export default function DemeritPointsPage() {
  const locale = useLocale();
  const { country } = useCountry();
  const t = useTranslations('resourcesDemerit');

  const title = t(`${country}.title`);
  const golden = t(`${country}.golden`);
  const hook = t(`${country}.hook`);
  const stats = t.raw(`${country}.stats`) as Stat[];
  const offenceHeaders = t.raw(`${country}.offences_headers`) as string[];
  const offences = t.raw(`${country}.offences`) as string[][];
  const levels = t.raw(`${country}.levels`) as Level[];
  const newdriverBody = t(`${country}.newdriver_body`);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paint)', paddingBottom: 80 }}>
      <div style={{ background: 'var(--paint-2)', borderBottom: '1px solid var(--line)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <BackButton label={t('breadcrumb_home')} style={{ fontSize: '.82rem', color: 'var(--ink-soft)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
          <span style={{ color: 'var(--line)' }}>/</span>
          <span style={{ fontSize: '.82rem', color: 'var(--ink)' }}>{t('breadcrumb_title')}</span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>{t('hero.eyebrow')}</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, marginBottom: 12 }}>
            {t('hero.title')}
          </h1>
          <p style={{ color: 'var(--ink-soft)', maxWidth: '38em', margin: '0 auto', fontSize: '1.05rem' }}>
            {t('hero.lead')}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <span style={{ fontSize: '1.4rem' }}>{country === 'sg' ? '🇸🇬' : '🇯🇵'}</span>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>{title}</h2>
        </div>

        {/* Golden rule callout */}
        <div style={{ background: 'linear-gradient(135deg, var(--guide-deep), var(--guide))', color: '#fff', borderRadius: 16, padding: '24px 26px', marginBottom: 20 }}>
          <div style={{ fontSize: '.72rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', opacity: 0.85, marginBottom: 8 }}>
            {t('golden_label')}
          </div>
          <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 'clamp(1.3rem,3.5vw,1.9rem)', lineHeight: 1.3 }}>
            {golden}
          </div>
        </div>

        {/* Memory hook */}
        <div style={{ background: 'var(--paint-2)', border: '1px solid var(--line)', borderRadius: 12, padding: '14px 18px', marginBottom: 40, fontSize: '.9rem', color: 'var(--ink)', lineHeight: 1.55 }}>
          <strong>{t('remember_label')}</strong> {hook}
        </div>

        {/* At a glance stats */}
        <Section title={t('stats_title')}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {stats.map(({ label, value, sub }) => (
              <div key={label} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '18px 16px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--guide-deep)', lineHeight: 1, marginBottom: 6 }}>{value}</div>
                <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.82rem', marginBottom: 4 }}>{label}</div>
                {sub && <div style={{ fontSize: '.75rem', color: 'var(--ink-soft)' }}>{sub}</div>}
              </div>
            ))}
          </div>
        </Section>

        {/* Escalation levels */}
        <Section title={t('levels_title')}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {levels.map(({ label, value }, i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', border: '1px solid var(--line)', borderRadius: 10, padding: '12px 16px' }}>
                <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 99, background: 'var(--paint-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontWeight: 800, fontSize: '.8rem', color: 'var(--guide-deep)' }}>{i + 1}</span>
                <span style={{ flex: 1, fontSize: '.9rem', color: 'var(--ink-soft)', minWidth: 0 }}>{label}</span>
                <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.88rem', color: 'var(--ink)', textAlign: 'right' }}>{value}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Common offences */}
        <Section title={t('offences_title')}>
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--paint-2)', borderBottom: '1px solid var(--line)' }}>
                  {offenceHeaders.map((h, i) => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: i === 0 ? 'left' : 'right', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {offences.map(([offence, points], i, arr) => (
                  <tr key={offence} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : undefined }}>
                    <td style={{ padding: '11px 16px', color: 'var(--ink)' }}>{offence}</td>
                    <td style={{ padding: '11px 16px', textAlign: 'right', fontFamily: 'var(--display)', fontWeight: 700, color: 'var(--guide-deep)', whiteSpace: 'nowrap' }}>{points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ background: 'var(--paint-2)', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 14px', fontSize: '.82rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 12 }}>
            <strong>{t('note_label')}</strong> {t('offences_note')}
          </div>
        </Section>

        {/* New driver */}
        <Section title={t('newdriver_title')}>
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderLeft: '4px solid var(--guide)', borderRadius: 12, padding: '16px 20px', fontSize: '.92rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            {newdriverBody}
          </div>
        </Section>

        {/* Cross links */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
          <Link href={`/${locale}/resources/guide`} style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.88rem', color: 'var(--guide-deep)', textDecoration: 'none', background: '#fff', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 16px' }}>
            {t('see_guide')}
          </Link>
          <Link href={`/${locale}/resources/memory-tips`} style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.88rem', color: 'var(--guide-deep)', textDecoration: 'none', background: '#fff', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 16px' }}>
            {t('see_memory')}
          </Link>
        </div>

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <BackButton label={t('back_home')} style={{ color: 'var(--guide-deep)', fontWeight: 600, fontSize: '.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h3 style={{ fontFamily: 'var(--display)', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 14, borderBottom: '1px solid var(--line)', paddingBottom: 8 }}>
        {title}
      </h3>
      {children}
    </div>
  );
}
