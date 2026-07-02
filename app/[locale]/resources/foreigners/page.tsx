'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCountry } from '@/components/CountryProvider';
import BackButton from '@/components/BackButton';

export default function ForeignersPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const { country } = useCountry();
  const t = useTranslations('resourcesForeigners');

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
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>{t('hero.eyebrow')}</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, marginBottom: 12 }}>
            {t('hero.title')}
          </h1>
          <p style={{ color: 'var(--ink-soft)', maxWidth: '40em', margin: '0 auto', fontSize: '1.05rem' }}>
            {t('hero.lead')}
          </p>
        </div>

        {/* Singapore */}
        {country === 'sg' && (<div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <span style={{ fontSize: '1.4rem' }}>🇸🇬</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>{t('sg_title')}</h2>
          </div>

          <InfoBlock title={t('sg.tourist.title')}>
            <p>{t('sg.tourist.p1')}</p>
            <p style={{ marginTop: 8 }}>{t('sg.tourist.p2')}</p>
          </InfoBlock>

          <InfoBlock title={t('sg.convert.title')}>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 20, color: 'var(--ink-soft)', fontSize: '.9rem', lineHeight: 1.6 }}>
              <li>{t('sg.convert.bullets.0')}</li>
              <li>{t('sg.convert.bullets.1')}</li>
              <li>{t('sg.convert.bullets.2')}</li>
              <li>{t('sg.convert.bullets.3')}</li>
              <li>{t('sg.convert.bullets.4')}</li>
              <li>{t('sg.convert.bullets.5')}</li>
            </ul>
          </InfoBlock>

          <InfoBlock title={t('sg.myanmar.title')}>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 20, color: 'var(--ink-soft)', fontSize: '.9rem', lineHeight: 1.6 }}>
              <li>{t('sg.myanmar.bullets.0')}</li>
              <li>{t('sg.myanmar.bullets.1')}</li>
              <li>{t('sg.myanmar.bullets.2')}</li>
              <li>{t('sg.myanmar.bullets.3')}</li>
              <li>{t('sg.myanmar.bullets.4')}</li>
            </ul>
          </InfoBlock>
        </div>)}

        {/* Japan */}
        {country === 'jp' && (<div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <span style={{ fontSize: '1.4rem' }}>🇯🇵</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>{t('jp_title')}</h2>
          </div>

          <InfoBlock title={t('jp.tourist.title')}>
            <p>{t('jp.tourist.p1')}</p>
            <p style={{ marginTop: 8 }}>{t('jp.tourist.p2')}</p>
          </InfoBlock>

          <InfoBlock title={t('jp.convert.title')}>
            <p style={{ marginBottom: 8 }}>{t('jp.convert.p1')}</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 20, color: 'var(--ink-soft)', fontSize: '.9rem', lineHeight: 1.6 }}>
              <li>{t('jp.convert.bullets.0')}</li>
              <li>{t('jp.convert.bullets.1')}</li>
              <li>{t('jp.convert.bullets.2')}</li>
              <li>{t('jp.convert.bullets.3')}</li>
              <li>{t('jp.convert.bullets.4')}</li>
            </ul>
          </InfoBlock>

          <InfoBlock title={t('jp.myanmar.title')}>
            <p style={{ marginBottom: 8 }}>{t('jp.myanmar.p1')}</p>
            <ol style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 20, color: 'var(--ink-soft)', fontSize: '.9rem', lineHeight: 1.6 }}>
              <li>{t('jp.myanmar.options.0')}</li>
              <li>{t('jp.myanmar.options.1')}</li>
            </ol>
            <p style={{ marginTop: 10, fontSize: '.82rem', color: 'var(--ink-soft)' }}>{t('jp.myanmar.tip')}</p>
          </InfoBlock>
        </div>)}

        <div style={{ background: 'var(--paint-2)', border: '1px solid var(--line)', borderRadius: 12, padding: '16px 20px', marginTop: 32, fontSize: '.82rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          <strong>{t('disclaimer_label')}</strong> {t('disclaimer_text')}
        </div>

        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <BackButton label={t('back_home')} style={{ color: 'var(--guide-deep)', fontWeight: 600, fontSize: '.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '22px 24px', marginBottom: 16 }}>
      <h3 style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1rem', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--line)' }}>{title}</h3>
      <div style={{ fontSize: '.9rem', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

import type React from 'react';
