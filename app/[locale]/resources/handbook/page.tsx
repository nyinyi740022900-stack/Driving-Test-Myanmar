'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCountry } from '@/components/CountryProvider';
import BackButton from '@/components/BackButton';
import { getHandbooksForCountry, pickHandbookText } from '@/lib/handbooks';

export default function HandbookPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const { country } = useCountry();
  const t = useTranslations('resourcesHandbook');
  const handbooks = getHandbooksForCountry(country);

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

        <div style={{ background: 'var(--paint-2)', border: '1px solid var(--line)', borderRadius: 12, padding: '14px 18px', marginBottom: 16, fontSize: '.88rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          <strong>{t('disclaimer_label')}</strong> {t('disclaimer')}
        </div>

        <div style={{ background: 'var(--guide-pale, #eef6f1)', border: '1px solid var(--guide-mid, #b8d4c4)', borderRadius: 12, padding: '16px 18px', marginBottom: 32, fontSize: '.9rem', color: 'var(--ink)', lineHeight: 1.6 }}>
          <strong>{t('studyInApp_label')}</strong> {t('studyInApp')}
          <div style={{ marginTop: 12 }}>
            <Link
              href={`/${locale}/quiz/${country === 'jp' ? 'jp_car' : 'sg_btt'}/lesson`}
              className="btn btn-primary"
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              {t('studyInApp_cta')} →
            </Link>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {handbooks.map(hb => (
            <div
              key={hb.id}
              style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '22px 24px', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div style={{ flex: '1 1 240px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '.72rem', letterSpacing: '.08em', textTransform: 'uppercase', background: 'var(--paint-2)', padding: '4px 10px', borderRadius: 99 }}>
                    {hb.tag}
                  </span>
                  <span style={{ fontSize: '.78rem', color: 'var(--ink-soft)' }}>
                    {pickHandbookText(hb, 'sourceLabel', locale)}
                  </span>
                </div>
                <h2 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.1rem', marginBottom: 6 }}>
                  {pickHandbookText(hb, 'title', locale)}
                </h2>
                <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)', margin: 0, lineHeight: 1.5 }}>
                  {pickHandbookText(hb, 'desc', locale)}
                </p>
              </div>
              <a
                href={hb.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                {t('download')} ↓
              </a>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <BackButton label={t('back_home')} style={{ color: 'var(--guide-deep)', fontWeight: 600, fontSize: '.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
        </div>
      </div>
    </div>
  );
}
