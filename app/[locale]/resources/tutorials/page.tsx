import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import BackButton from '@/components/BackButton';
import StudyArticle from '@/components/StudyArticle';
import AdSenseScript from '@/components/AdSenseScript';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import { buildResourceMetadata } from '@/lib/resourceMetadata';
import { getPublishedTutorials, pickTutorialText, type TutorialWithVideo } from '@/lib/tutorials';

type PageProps = { params: Promise<{ locale: string }> };

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildResourceMetadata(locale, 'resourcesTutorials', '/resources/tutorials');
}

function VideoGrid({ videos, locale }: { videos: TutorialWithVideo[]; locale: string }) {
  if (videos.length === 0) return null;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
      {videos.map(({ videoId, ...row }) => {
        const title = pickTutorialText(row, 'title', locale);
        const description = pickTutorialText(row, 'description', locale);
        return (
          <div key={row.id} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 12, paddingBottom: 0 }}>
              <YouTubeEmbed videoId={videoId} title={title} />
            </div>
            <div style={{ padding: '14px 18px 18px' }}>
              <h3 style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1rem', lineHeight: 1.4, marginBottom: description ? 6 : 0 }}>
                {title}
              </h3>
              {description && (
                <p style={{ fontSize: '.85rem', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default async function ResourceTutorialsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations('resourcesTutorials');
  const [sgVideos, jpVideos] = await Promise.all([
    getPublishedTutorials('sg'),
    getPublishedTutorials('jp'),
  ]);

  const sections = [
    { key: 'sg' as const, videos: sgVideos, title: t('section_sg'), lead: t('section_sg_lead') },
    { key: 'jp' as const, videos: jpVideos, title: t('section_jp'), lead: t('section_jp_lead') },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paint)', paddingBottom: 80 }}>
      <AdSenseScript />
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

        <StudyArticle title={t('article.title')} paragraphs={t.raw('article.paragraphs') as string[]} />

        {sections.map((section, i) => (
          <section key={section.key} aria-labelledby={`tutorials-${section.key}`} style={{ marginTop: i === 0 ? 0 : 56 }}>
            <h2 id={`tutorials-${section.key}`} style={{ fontFamily: 'var(--display)', fontSize: '1.35rem', fontWeight: 800, marginBottom: 6 }}>
              {section.title}
            </h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: '.95rem', marginBottom: 22 }}>{section.lead}</p>
            <VideoGrid videos={section.videos} locale={locale} />
          </section>
        ))}
      </div>
    </div>
  );
}
