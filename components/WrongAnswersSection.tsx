'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { getWrongAnswers, clearWrongAnswers } from '@/lib/wrong-answers';
import { TEST_META } from '@/lib/types';
import type { WrongAnswerEntry } from '@/lib/wrong-answers';
import QuizModeLink from '@/components/QuizModeLink';

interface Props {
  locale: string;
}

export default function WrongAnswersSection({ locale }: Props) {
  const t = useTranslations('profile');
  const [entries, setEntries] = useState<WrongAnswerEntry[]>([]);

  useEffect(() => {
    setEntries(getWrongAnswers());
  }, []);

  function handleClear() {
    clearWrongAnswers();
    setEntries([]);
  }

  return (
    <div style={{ background: '#fff', borderRadius: 18, padding: '24px 28px', marginBottom: 20, border: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ fontSize: '.72rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
          {t('wrong_answers_heading')}
        </div>
        {entries.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            style={{ fontSize: '.78rem', fontFamily: 'var(--display)', fontWeight: 600, color: 'var(--ink-soft)', background: 'none', border: '1px solid var(--line)', borderRadius: 8, cursor: 'pointer', padding: '5px 12px' }}
          >
            {t('wrong_answers_clear')}
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <p style={{ fontSize: '.88rem', color: 'var(--ink-soft)', margin: 0, lineHeight: 1.6 }}>
          {t('wrong_answers_empty')}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {entries.slice(0, 20).map((entry) => {
            const meta = TEST_META.find((m) => m.category === entry.category);
            const name = meta
              ? locale === 'my'
                ? meta.nameMy
                : locale === 'ja'
                  ? meta.nameJa
                  : meta.nameEn
              : entry.category;
            return (
              <div key={`${entry.questionId}-${entry.at}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--paint)', borderRadius: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.88rem' }}>{name}</div>
                  <div style={{ fontSize: '.76rem', color: 'var(--ink-soft)', marginTop: 2 }}>{entry.questionId}</div>
                </div>
                <QuizModeLink
                  href={`/${locale}/quiz/${entry.category}/practice`}
                  category={entry.category}
                  style={{ fontSize: '.78rem', fontFamily: 'var(--display)', fontWeight: 700, color: 'var(--guide-deep)', textDecoration: 'none' }}
                >
                  {t('wrong_answers_practice_link')} →
                </QuizModeLink>
              </div>
            );
          })}
          {entries.length > 20 && (
            <p style={{ fontSize: '.78rem', color: 'var(--ink-soft)', margin: '4px 0 0' }}>
              {t('wrong_answers_more', { count: entries.length - 20 })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
