import BackButton from '@/components/BackButton';
import { GLOSSARY_TERM_COUNT, TRAFFIC_GLOSSARY } from '@/lib/traffic-glossary';
import { getTranslations } from 'next-intl/server';

export default async function GlossaryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('resourcesGlossary');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paint)', paddingBottom: 80 }}>
      <div style={{ background: 'var(--paint-2)', borderBottom: '1px solid var(--line)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <BackButton label={t('breadcrumb_home')} style={{ fontSize: '.82rem', color: 'var(--ink-soft)', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
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

        {TRAFFIC_GLOSSARY.map(category => (
          <div key={category.id} style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 14, borderBottom: '1px solid var(--line)', paddingBottom: 8 }}>
              {t(`categories.${category.id}`)}
            </h2>
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--asphalt)', color: '#fff' }}>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.08em', textTransform: 'uppercase' }}>{t('table.english')}</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.08em', textTransform: 'uppercase' }}>{t('table.my')}</th>
                    <th style={{ padding: '12px 20px', textAlign: 'left', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.08em', textTransform: 'uppercase' }}>{t('table.ja')}</th>
                  </tr>
                </thead>
                <tbody>
                  {category.terms.map((term, i) => (
                    <tr
                      key={term.en}
                      style={{
                        borderBottom: i < category.terms.length - 1 ? '1px solid var(--line)' : undefined,
                        background: i % 2 === 0 ? '#fff' : 'var(--paint)',
                      }}
                    >
                      <td style={{ padding: '12px 20px', fontFamily: 'var(--display)', fontWeight: 700 }}>{term.en}</td>
                      <td style={{ padding: '12px 20px', color: 'var(--ink-soft)' }}>{term.my}</td>
                      <td style={{ padding: '12px 20px', color: 'var(--ink-soft)' }}>{term.ja}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <p style={{ marginTop: 8, fontSize: '.82rem', color: 'var(--ink-soft)', textAlign: 'center' }}>
          {t('footer_note', { count: GLOSSARY_TERM_COUNT })}
        </p>

        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <BackButton label={t('back_home')} style={{ color: 'var(--guide-deep)', fontWeight: 600, fontSize: '.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
        </div>
      </div>
    </div>
  );
}
