'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import type { Category } from '@/lib/types';
import type { Question } from '@/lib/types';
import QuizSession from './QuizSession';
import QuizLoadingSkeleton from './QuizLoadingSkeleton';

type Mode = 'lesson' | 'practice' | 'test';

interface Props {
  category: Category;
  mode: Mode;
  questionCount: number;
  testTag: string;
}

export default function QuizLoader({ category, mode, questionCount, testTag }: Props) {
  const t = useTranslations('quiz');
  const locale = useLocale();
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setQuestions(null);
    setError(false);

    fetch(`/api/questions/${category}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('fetch failed');
        const data = (await res.json()) as Question[];
        if (!cancelled) setQuestions(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [category]);

  if (error) {
    return (
      <div
        style={{
          minHeight: '60vh',
          display: 'grid',
          placeItems: 'center',
          padding: '40px 24px',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <p style={{ color: 'var(--ink-soft)', marginBottom: 16 }}>
            {t('load_error')}
          </p>
          <Link href={`/${locale}`} className="btn btn-ghost">
            ← {t('back')}
          </Link>
        </div>
      </div>
    );
  }

  if (!questions) {
    return <QuizLoadingSkeleton testTag={testTag} questionCount={questionCount} />;
  }

  if (questions.length === 0) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2
          style={{
            fontFamily: 'var(--display)',
            fontSize: '1.6rem',
            marginBottom: 16,
          }}
        >
          {t('no_questions')}
        </h2>
        <Link
          href={`/${locale}`}
          style={{ color: 'var(--guide-deep)', fontWeight: 700 }}
        >
          ← {t('back')}
        </Link>
      </div>
    );
  }

  return <QuizSession category={category} mode={mode} questions={questions} />;
}
