'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCountry } from '@/components/CountryProvider';
import BackButton from '@/components/BackButton';

export default function RoadmapPage() {
  const params = useParams();
  const { country } = useCountry();
  const t = useTranslations('resourcesRoadmap');
  const sgSteps = t.raw('sg_steps') as { n: number; title: string; body: string }[];
  const jpSteps = t.raw('jp_steps') as { n: number; title: string; body: string }[];

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

        {/* Singapore */}
        {country === 'sg' && (<div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <span style={{ fontSize: '1.4rem' }}>🇸🇬</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>{t('sg_title')}</h2>
          </div>
          <Steps steps={sgSteps} />
          <div style={{ background: 'var(--paint-2)', border: '1px solid var(--line)', borderRadius: 12, padding: '16px 20px', marginTop: 16, fontSize: '.88rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            <strong>{t('sg_timeline_label')}</strong> {t('sg_timeline_body')}
          </div>
        </div>)}

        {/* Japan */}
        {country === 'jp' && (<div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <span style={{ fontSize: '1.4rem' }}>🇯🇵</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>{t('jp_title')}</h2>
          </div>
          <Steps steps={jpSteps} />
          <div style={{ background: 'var(--paint-2)', border: '1px solid var(--line)', borderRadius: 12, padding: '16px 20px', marginTop: 16, fontSize: '.88rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            <strong>{t('jp_timeline_label')}</strong> {t('jp_timeline_body')}
          </div>
        </div>)}

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <BackButton label={t('back_home')} style={{ color: 'var(--guide-deep)', fontWeight: 600, fontSize: '.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
        </div>
      </div>
    </div>
  );
}

function Steps({ steps }: { steps: { n: number; title: string; body: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {steps.map((step, i) => (
        <div key={step.n} style={{ display: 'flex', gap: 20 }}>
          {/* Timeline line */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--guide)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--display)', fontWeight: 800, fontSize: '.9rem', flexShrink: 0,
            }}>
              {step.n}
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 2, flex: 1, background: 'var(--line)', minHeight: 24, margin: '4px 0' }} />
            )}
          </div>
          {/* Content */}
          <div style={{ paddingBottom: i < steps.length - 1 ? 24 : 0, paddingTop: 6, flex: 1 }}>
            <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>{step.title}</div>
            <div style={{ fontSize: '.88rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{step.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
