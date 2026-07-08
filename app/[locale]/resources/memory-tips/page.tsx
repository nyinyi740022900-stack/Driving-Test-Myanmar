'use client';

import type React from 'react';
import { useTranslations } from 'next-intl';
import { useCountry } from '@/components/CountryProvider';
import BackButton from '@/components/BackButton';

interface Tip {
  hook: string;
  topic: string;
  detail: string;
}

interface Group {
  heading: string;
  tips: Tip[];
}

export default function MemoryTipsPage() {
  const { country } = useCountry();
  const t = useTranslations('resourcesMemory');

  const groups = t.raw(`${country}.groups`) as Group[];
  const sectionTitle = t(`${country}.title`);
  const noteLabel = t('note_label');

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
          <p style={{ color: 'var(--ink-soft)', maxWidth: '38em', margin: '0 auto', fontSize: '1.05rem' }}>
            {t('hero.lead')}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <span style={{ fontSize: '1.4rem' }}>{country === 'sg' ? '🇸🇬' : '🇯🇵'}</span>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>{sectionTitle}</h2>
        </div>

        {groups.map(group => (
          <div key={group.heading} style={{ marginBottom: 36 }}>
            <h3 style={{ fontFamily: 'var(--display)', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 14, borderBottom: '1px solid var(--line)', paddingBottom: 8 }}>
              {group.heading}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
              {group.tips.map(tip => (
                <div key={tip.topic} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--guide-deep)', lineHeight: 1.3 }}>
                    {tip.hook}
                  </div>
                  <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.82rem', letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
                    {tip.topic}
                  </div>
                  <div style={{ background: 'var(--paint-2)', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 14px', fontSize: '.85rem', color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                    <strong>{noteLabel}</strong> {tip.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <BackButton label={t('back_home')} style={{ color: 'var(--guide-deep)', fontWeight: 600, fontSize: '.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
        </div>
      </div>
    </div>
  );
}
