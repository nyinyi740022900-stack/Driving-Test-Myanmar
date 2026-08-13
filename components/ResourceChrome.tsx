import type { ReactNode } from 'react';
import BackButton from '@/components/BackButton';
import StudyArticle from '@/components/StudyArticle';

interface Props {
  breadcrumbHome: string;
  breadcrumbTitle: string;
  eyebrow: string;
  title: string;
  lead: string;
  backHome: string;
  articleTitle?: string;
  articleParagraphs?: string[];
  maxWidth?: number;
  children: ReactNode;
}

export default function ResourceChrome({
  breadcrumbHome,
  breadcrumbTitle,
  eyebrow,
  title,
  lead,
  backHome,
  articleTitle,
  articleParagraphs,
  maxWidth = 960,
  children,
}: Props) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--paint)', paddingBottom: 80 }}>
        <div
          style={{
            background: 'var(--paint-2)',
            borderBottom: '1px solid var(--line)',
            padding: '20px 24px',
          }}
        >
          <div
            style={{
              maxWidth,
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <BackButton
              label={breadcrumbHome}
              style={{
                fontSize: '.82rem',
                color: 'var(--ink-soft)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            />
            <span style={{ color: 'var(--line)' }}>/</span>
            <span style={{ fontSize: '.82rem', color: 'var(--ink)' }}>{breadcrumbTitle}</span>
          </div>
        </div>

        <div style={{ maxWidth, margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ marginBottom: 48, textAlign: 'center' }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>
              {eyebrow}
            </div>
            <h1
              style={{
                fontFamily: 'var(--display)',
                fontSize: 'clamp(1.8rem,4vw,2.6rem)',
                fontWeight: 800,
                marginBottom: 12,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                color: 'var(--ink-soft)',
                maxWidth: '40em',
                margin: '0 auto',
                fontSize: '1.05rem',
                lineHeight: 1.6,
              }}
            >
              {lead}
            </p>
          </div>

          {articleTitle && articleParagraphs && (
            <StudyArticle title={articleTitle} paragraphs={articleParagraphs} />
          )}

          {children}

          <div style={{ marginTop: 48, textAlign: 'center' }}>
            <BackButton
              label={backHome}
              style={{
                color: 'var(--guide-deep)',
                fontWeight: 600,
                fontSize: '.9rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          </div>
        </div>
    </div>
  );
}

export function CountryBlock({
  flag,
  title,
  children,
}: {
  flag: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section style={{ marginBottom: 64 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <span style={{ fontSize: '1.4rem' }}>{flag}</span>
        <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}
