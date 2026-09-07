import type { Metadata } from 'next';
import AdSenseScript from '@/components/AdSenseScript';
import ResourceChrome, { CountryBlock } from '@/components/ResourceChrome';
import { getSgSignLibrary, pickSignText } from '@/lib/signs-library';
import { buildResourceMetadata } from '@/lib/resourceMetadata';
import { getTranslations } from 'next-intl/server';

type PageProps = { params: Promise<{ locale: string }> };

type JpSign = { file: string; title: string; subtitle?: string; desc: string };
type JpSection = { category: string; signs: JpSign[] };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildResourceMetadata(locale, 'resourcesSigns', '/resources/signs');
}

export default async function SignsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'resourcesSigns' });
  const sgLibrary = await getSgSignLibrary();
  const jpSections = t.raw('jp_sections') as JpSection[];
  const articleParagraphs = t.raw('article.paragraphs') as string[];

  return (
    <>
    <AdSenseScript />
    <ResourceChrome
      breadcrumbHome={t('breadcrumb_home')}
      breadcrumbTitle={t('breadcrumb_title')}
      eyebrow={t('hero.eyebrow')}
      title={t('hero.title')}
      lead={t('hero.lead')}
      backHome={t('back_home')}
      articleTitle={t('article.title')}
      articleParagraphs={articleParagraphs}
    >
      <CountryBlock flag="🇸🇬" title={t('sg_title')}>
        {sgLibrary.sections.map(({ category, signs }) => (
          <div key={pickSignText(category, locale)} style={{ marginBottom: 40 }}>
            <h3
              style={{
                fontFamily: 'var(--display)',
                fontSize: '.75rem',
                fontWeight: 700,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: 'var(--ink-soft)',
                marginBottom: 16,
                borderBottom: '1px solid var(--line)',
                paddingBottom: 8,
              }}
            >
              {pickSignText(category, locale)}
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 16,
              }}
            >
              {signs.map((sign, index) => (
                <div
                  key={sign.file}
                  style={{
                    background: '#fff',
                    border: '1px solid var(--line)',
                    borderRadius: 14,
                    padding: '20px 16px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      height: 100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 14,
                    }}
                  >
                    <img
                      src={`/signs/sg/${sign.file}`}
                      alt={pickSignText(sign.title, locale)}
                      width={140}
                      height={90}
                      loading={index < 8 ? 'eager' : 'lazy'}
                      style={{ maxHeight: 90, maxWidth: 140, objectFit: 'contain' }}
                    />
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--display)',
                      fontWeight: 700,
                      fontSize: '.95rem',
                      marginBottom: 8,
                    }}
                  >
                    {pickSignText(sign.title, locale)}
                  </div>
                  <div style={{ fontSize: '.8rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                    {pickSignText(sign.desc, locale)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CountryBlock>

      <CountryBlock flag="🇯🇵" title={t('jp_title')}>
        {jpSections.map(({ category, signs }) => (
          <div key={category} style={{ marginBottom: 40 }}>
            <h3
              style={{
                fontFamily: 'var(--display)',
                fontSize: '.75rem',
                fontWeight: 700,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: 'var(--ink-soft)',
                marginBottom: 16,
                borderBottom: '1px solid var(--line)',
                paddingBottom: 8,
              }}
            >
              {category}
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 16,
              }}
            >
              {signs.map(sign => (
                <div
                  key={sign.file}
                  style={{
                    background: '#fff',
                    border: '1px solid var(--line)',
                    borderRadius: 14,
                    padding: '20px 16px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      height: 100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 14,
                    }}
                  >
                    <img
                      src={`/signs/jp/${sign.file}`}
                      alt={sign.title}
                      width={140}
                      height={90}
                      loading="lazy"
                      style={{ maxHeight: 90, maxWidth: 140, objectFit: 'contain' }}
                    />
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--display)',
                      fontWeight: 700,
                      fontSize: '.95rem',
                      marginBottom: 4,
                    }}
                  >
                    {sign.title}
                  </div>
                  {sign.subtitle && (
                    <div
                      style={{
                        fontSize: '.8rem',
                        color: 'var(--ink-soft)',
                        lineHeight: 1.5,
                        marginBottom: 6,
                      }}
                    >
                      {sign.subtitle}
                    </div>
                  )}
                  <div style={{ fontSize: '.78rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                    {sign.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CountryBlock>
    </ResourceChrome>
    </>
  );
}
