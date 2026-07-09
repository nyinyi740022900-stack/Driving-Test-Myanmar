'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useCountry } from '@/components/CountryProvider';
import BackButton from '@/components/BackButton';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import { extractYouTubeId } from '@/lib/youtube';

interface DbTutorial {
  id: string;
  title_en: string; title_my: string; title_ja: string;
  description_en: string; description_my: string; description_ja: string;
  youtube_url: string;
}

function pick(row: DbTutorial, field: 'title' | 'description', locale: string): string {
  const map = row as unknown as Record<string, string>;
  return map[`${field}_${locale}`] || map[`${field}_en`] || map[`${field}_my`] || map[`${field}_ja`] || '';
}

export default function ResourceTutorialsPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const { country } = useCountry();
  const t = useTranslations('resourcesTutorials');
  const [tutorials, setTutorials] = useState<DbTutorial[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    fetch(`/api/tutorials?country=${country}`)
      .then(r => r.json())
      .then(data => setTutorials(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [country]);

  const videos = tutorials
    .map(row => ({ row, videoId: extractYouTubeId(row.youtube_url) }))
    .filter((v): v is { row: DbTutorial; videoId: string } => v.videoId !== null);

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

        {!loaded && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--ink-soft)', fontSize: '.92rem' }}>
            {t('loading')}
          </div>
        )}

        {loaded && videos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--ink-soft)', fontSize: '.92rem' }}>
            {t('empty')}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {videos.map(({ row, videoId }) => {
            const title = pick(row, 'title', locale);
            const description = pick(row, 'description', locale);
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
      </div>
    </div>
  );
}
