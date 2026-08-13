import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getTranslations } from 'next-intl/server';
import ResourceChrome from '@/components/ResourceChrome';
import ExperiencesForm from '@/components/ExperiencesForm';
import { buildResourceMetadata } from '@/lib/resourceMetadata';
import { getApprovedReviews } from '@/lib/publicContent';
import { TEST_META } from '@/lib/types';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildResourceMetadata(locale, 'experiences', '/experiences');
}

function categoryLabel(cat: string, locale: string): string {
  if (cat === 'general') return locale === 'my' ? 'အထွေထွေ' : locale === 'ja' ? '一般' : 'General';
  const meta = TEST_META.find(m => m.category === cat);
  if (!meta) return cat;
  return locale === 'my' ? meta.nameMy : locale === 'ja' ? meta.nameJa : meta.nameEn;
}

export default async function ExperiencesPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'experiences' });
  const reviews = await getApprovedReviews();
  const articleParagraphs = t.raw('article.paragraphs') as string[];

  return (
    <>
      <Header />
    <ResourceChrome
      breadcrumbHome={t('breadcrumb_home')}
      breadcrumbTitle={t('breadcrumb_title')}
      eyebrow={t('hero.eyebrow')}
      title={t('hero.title')}
      lead={t('hero.lead')}
      backHome={t('back_home')}
      articleTitle={t('article.title')}
      articleParagraphs={articleParagraphs}
      maxWidth={900}
    >
      <ExperiencesForm />

      <h2
        style={{
          fontFamily: 'var(--display)',
          fontWeight: 800,
          fontSize: '1.1rem',
          marginBottom: 16,
        }}
      >
        {t('published_title')}
      </h2>
      {reviews.length === 0 ? (
        <div
          style={{
            background: '#fff',
            border: '1px solid var(--line)',
            borderRadius: 14,
            padding: '40px 24px',
            textAlign: 'center',
            color: 'var(--ink-soft)',
          }}
        >
          {t('empty')}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {reviews.map(r => (
            <article
              key={r.id}
              style={{
                background: '#fff',
                border: '1px solid var(--line)',
                borderRadius: 14,
                padding: '22px 24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 12,
                  marginBottom: 10,
                }}
              >
                <div>
                  <div style={{ fontSize: '.78rem', color: 'var(--ink-soft)', marginBottom: 4 }}>
                    {r.display_name} · {categoryLabel(r.category, locale)}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--display)',
                      fontWeight: 800,
                      fontSize: '1.05rem',
                      margin: 0,
                    }}
                  >
                    {r.title}
                  </h3>
                </div>
                <div style={{ color: '#F5A623', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                  {'★'.repeat(r.rating)}
                  {'☆'.repeat(5 - r.rating)}
                </div>
              </div>
              <p
                style={{
                  fontSize: '.92rem',
                  color: 'var(--ink-soft)',
                  lineHeight: 1.65,
                  margin: '0 0 12px',
                }}
              >
                {r.body}
              </p>
              <div style={{ display: 'flex', gap: 16, fontSize: '.78rem', color: 'var(--ink-soft)' }}>
                {r.passed !== null && (
                  <span>{r.passed ? t('badge_passed') : t('badge_studying')}</span>
                )}
                <span>
                  {new Date(r.created_at).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-SG')}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </ResourceChrome>
      <Footer />
    </>
  );
}
