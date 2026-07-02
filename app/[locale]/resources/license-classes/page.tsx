'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCountry } from '@/components/CountryProvider';
import BackButton from '@/components/BackButton';

type ClassInfo = {
  code: string;
  name: string;
  vehicle: string;
  limit: string;
  age: string;
  note?: string;
  highlight?: boolean;
};

export default function LicenseClassesPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const { country } = useCountry();
  const t = useTranslations('resourcesLicenceClasses');
  const sgClasses = t.raw('sg_classes') as ClassInfo[];
  const jpClasses = t.raw('jp_classes') as ClassInfo[];
  const compareHeaders = t.raw('compare.headers') as string[];
  const compareRows = t.raw('compare.rows') as { label: string; values: string[] }[];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paint)', paddingBottom: 80 }}>
      {/* Breadcrumb */}
      <div style={{ background: 'var(--paint-2)', borderBottom: '1px solid var(--line)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <BackButton label={t('breadcrumb_home')} style={{ fontSize: '.82rem', color: 'var(--ink-soft)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
          <span style={{ color: 'var(--line)' }}>/</span>
          <span style={{ fontSize: '.82rem', color: 'var(--ink)' }}>{t('breadcrumb_title')}</span>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>
        {/* Hero */}
        <div style={{ marginBottom: 56, textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>{t('hero.eyebrow')}</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, marginBottom: 14 }}>
            {t('hero.title')}
          </h1>
          <p style={{ color: 'var(--ink-soft)', maxWidth: '42em', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
            {t('hero.lead')}
          </p>
        </div>

        {/* SG */}
        {country === 'sg' && (<div style={{ marginBottom: 72 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: '1.4rem' }}>🇸🇬</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>{t('sg_title')}</h2>
          </div>
          <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem', marginBottom: 28, lineHeight: 1.6 }}>
            {t('sg_intro')}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {sgClasses.map(c => (
              <ClassCard key={c.code} info={c} commonLabel={t('common_badge')} />
            ))}
          </div>

          <Note>
            {t('sg_note')}
          </Note>
        </div>)}

        {/* JP */}
        {country === 'jp' && (<div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: '1.4rem' }}>🇯🇵</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>{t('jp_title')}</h2>
          </div>
          <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem', marginBottom: 28, lineHeight: 1.6 }}>
            {t('jp_intro')}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {jpClasses.map(c => (
              <ClassCard key={c.code} info={c} accentJp commonLabel={t('common_badge')} />
            ))}
          </div>

          <Note>
            {t('jp_note')}{' '}
            <Link href={`/${locale}/resources/foreigners`} style={{ color: 'var(--guide-deep)', fontWeight: 600 }}>
              {t('foreigners_link')}
            </Link>.
          </Note>
        </div>)}

        {/* Quick compare */}
        <div style={{ marginTop: 56, background: '#fff', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', background: 'var(--asphalt)', color: '#fff' }}>
            <h3 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1rem', margin: 0 }}>{t('compare.title')}</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--paint)', borderBottom: '1px solid var(--line)' }}>
                  {compareHeaders.map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.75rem', letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, i, arr) => (
                  <tr key={row.label} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : undefined }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.82rem', color: 'var(--ink-soft)' }}>{row.label}</td>
                    {row.values.map((v, idx) => (
                      <td key={`${row.label}-${idx}`} style={{ padding: '12px 16px', color: 'var(--ink-soft)' }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <BackButton label={t('back_home')} style={{ color: 'var(--guide-deep)', fontWeight: 600, fontSize: '.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
        </div>
      </div>
    </div>
  );
}

function ClassCard({ info, accentJp, commonLabel }: { info: ClassInfo; accentJp?: boolean; commonLabel: string }) {
  const accent = accentJp ? '#e63329' : 'var(--guide)';
  return (
    <div style={{
      background: '#fff',
      border: info.highlight ? `2px solid ${accent}` : '1px solid var(--line)',
      borderRadius: 14,
      padding: '20px 20px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{
          fontFamily: 'var(--display)',
          fontWeight: 800,
          fontSize: accentJp ? '.85rem' : '1.5rem',
          color: info.highlight ? accent : 'var(--asphalt)',
          lineHeight: 1,
          padding: accentJp ? '4px 10px' : '2px 10px',
          background: info.highlight ? `${accent}12` : 'var(--paint)',
          borderRadius: 8,
          flexShrink: 0,
        }}>
          {info.code}
        </div>
        {info.highlight && (
          <span style={{ fontSize: '.68rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', background: `${accent}18`, color: accent, padding: '3px 8px', borderRadius: 6 }}>
            {commonLabel}
          </span>
        )}
      </div>
      <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '.95rem' }}>{info.name}</div>
      <div style={{ fontSize: '.82rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{info.vehicle}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 2 }}>
        <Row icon="⚖️" text={info.limit} />
        <Row icon="🎂" text={info.age} />
      </div>
      {info.note && (
        <div style={{ fontSize: '.78rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 4, paddingTop: 8, borderTop: '1px solid var(--line)' }}>
          {info.note}
        </div>
      )}
    </div>
  );
}

function Row({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', fontSize: '.8rem', color: 'var(--ink-soft)' }}>
      <span style={{ fontSize: '.75rem' }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--paint-2)', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 14px', fontSize: '.82rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 16 }}>
      <strong>Note:</strong> {children}
    </div>
  );
}

import type React from 'react';
