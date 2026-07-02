'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCountry } from '@/components/CountryProvider';
import BackButton from '@/components/BackButton';

export default function SignsPage() {
  const params = useParams();
  const { country } = useCountry();
  const t = useTranslations('resourcesSigns');
  const sgSigns = t.raw('sg_sections') as { category: string; signs: { file: string; title: string; subtitle?: string; desc: string }[] }[];
  const jpSigns = t.raw('jp_sections') as { category: string; signs: { file: string; title: string; subtitle?: string; desc: string }[] }[];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paint)', paddingBottom: 80 }}>
      <div style={{ background: 'var(--paint-2)', borderBottom: '1px solid var(--line)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <BackButton label={t('breadcrumb_home')} style={{ fontSize: '.82rem', color: 'var(--ink-soft)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
          <span style={{ color: 'var(--line)' }}>/</span>
          <span style={{ fontSize: '.82rem', color: 'var(--ink)' }}>{t('breadcrumb_title')}</span>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>{t('hero.eyebrow')}</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, marginBottom: 12 }}>
            {t('hero.title')}
          </h1>
          <p style={{ color: 'var(--ink-soft)', maxWidth: '40em', margin: '0 auto', fontSize: '1.05rem' }}>
            {t('hero.lead')}
          </p>
        </div>

        {/* Singapore Section */}
        {country === 'sg' && (<div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <span style={{ fontSize: '1.5rem' }}>🇸🇬</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>{t('sg_title')}</h2>
          </div>

          {sgSigns.map(({ category, signs }) => (
            <div key={category} style={{ marginBottom: 40 }}>
              <h3 style={{ fontFamily: 'var(--display)', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 16, borderBottom: '1px solid var(--line)', paddingBottom: 8 }}>
                {category}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {signs.map(sign => (
                  <div key={sign.file} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '20px 16px', textAlign: 'center' }}>
                    <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                      <img
                        src={`/signs/sg/${sign.file}`}
                        alt={sign.title}
                        style={{ maxHeight: 90, maxWidth: 140, objectFit: 'contain' }}
                        onError={undefined}
                      />
                    </div>
                    <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.95rem', marginBottom: 4 }}>{sign.title}</div>
                    {sign.subtitle && (
                      <div style={{ fontSize: '.8rem', color: 'var(--guide-deep)', fontWeight: 600, marginBottom: 8 }}>
                        {sign.subtitle}
                      </div>
                    )}
                    <div style={{ fontSize: '.8rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{sign.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>)}

        {/* Japan Section */}
        {country === 'jp' && (<div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <span style={{ fontSize: '1.5rem' }}>🇯🇵</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>{t('jp_title')}</h2>
          </div>

          {jpSigns.map(({ category, signs }) => (
            <div key={category} style={{ marginBottom: 40 }}>
              <h3 style={{ fontFamily: 'var(--display)', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 16, borderBottom: '1px solid var(--line)', paddingBottom: 8 }}>
                {category}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {signs.map(sign => (
                  <div key={sign.file} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '20px 16px', textAlign: 'center' }}>
                    <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                      <img
                        src={`/signs/jp/${sign.file}`}
                        alt={sign.title}
                        style={{ maxHeight: 90, maxWidth: 140, objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.95rem', marginBottom: 4 }}>{sign.title}</div>
                    {sign.subtitle && (
                      <div style={{ fontSize: '.8rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 6 }}>
                        {sign.subtitle}
                      </div>
                    )}
                    <div style={{ fontSize: '.78rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{sign.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>)}

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <BackButton label={t('back_home')} style={{ color: 'var(--guide-deep)', fontWeight: 600, fontSize: '.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
        </div>
      </div>
    </div>
  );
}
