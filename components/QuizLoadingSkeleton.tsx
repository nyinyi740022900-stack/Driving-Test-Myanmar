'use client';

import { useTranslations } from 'next-intl';

interface Props {
  testTag: string;
  questionCount: number;
}

export default function QuizLoadingSkeleton({ testTag, questionCount }: Props) {
  const t = useTranslations('quiz');

  return (
    <div className="quiz-layout" aria-busy="true" aria-live="polite">
      <div className="quiz-wrap">
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              width: 120,
              height: 36,
              borderRadius: 9,
              background: 'var(--paint-2)',
            }}
          />
        </div>

        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div
            className="eyebrow"
            style={{ marginBottom: 8, opacity: 0.7 }}
          >
            {testTag}
          </div>
          <h2
            style={{
              fontFamily: 'var(--display)',
              fontSize: '1.6rem',
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            {t('loading')}
          </h2>
          {questionCount > 0 && (
            <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem' }}>
              {questionCount} {t('questions_count')}
            </p>
          )}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 14,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                border: '2px solid var(--line)',
                borderRadius: 16,
                padding: '24px 16px',
                minHeight: 148,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'var(--paint-2)',
                  margin: '0 auto 12px',
                }}
              />
              <div
                style={{
                  height: 14,
                  borderRadius: 6,
                  background: 'var(--paint-2)',
                  margin: '0 auto',
                  width: '60%',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
