import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { Category } from '@/lib/types';
import { TEST_META } from '@/lib/types';
import { buildQuizMetadata } from '@/lib/seo';
import { getQuestions } from '@/lib/questions';
import { sanitizeQuestionsForClient } from '@/lib/question-sanitize';
import QuizLoader from '@/components/QuizLoader';

const VALID_MODES = ['lesson', 'practice', 'test'] as const;
type Mode = typeof VALID_MODES[number];

type PageProps = {
  params: Promise<{ locale: string; category: string; mode: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, category, mode } = await params;
  const validCategories = TEST_META.map(m => m.category);

  if (!validCategories.includes(category as Category)) {
    return {};
  }
  if (!VALID_MODES.includes(mode as Mode)) {
    return {};
  }

  return buildQuizMetadata(category as Category, mode as Mode, locale);
}

export default async function QuizPage({ params }: PageProps) {
  const { locale, category, mode } = await params;

  const validCategories = TEST_META.map(m => m.category);
  if (!validCategories.includes(category as Category)) notFound();
  if (!VALID_MODES.includes(mode as Mode)) notFound();

  const t = await getTranslations({ locale, namespace: 'seo.quiz' });
  const meta = TEST_META.find(m => m.category === category);
  const allQuestions = await getQuestions(category as Category);
  const clientQuestions =
    mode === 'lesson' ? allQuestions : sanitizeQuestionsForClient(allQuestions);

  return (
    <>
      {meta && (
        <section aria-label="Quiz overview" style={{ padding: '16px 16px 0', maxWidth: 720, margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 4 }}>
            {t(`${mode}_title`, { test: meta.tag })}
          </h1>
          <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)' }}>
            {t('description', {
              test: meta.tag,
              count: meta.bankQuestionCount,
              mock: meta.questionCount,
              pass: meta.passPercent,
            })}
          </p>
        </section>
      )}
      <QuizLoader
        category={category as Category}
        mode={mode as Mode}
        questions={clientQuestions}
        answersHidden={mode !== 'lesson'}
        questionCount={meta?.bankQuestionCount ?? 0}
        testTag={meta?.tag ?? category}
      />
    </>
  );
}

export async function generateStaticParams() {
  const categories: Category[] = ['sg_btt', 'sg_ftt', 'sg_rtt', 'jp_car', 'jp_moto'];
  const modes: Mode[] = ['lesson', 'practice', 'test'];
  const locales = ['en', 'my', 'ja'];

  return locales.flatMap(locale =>
    categories.flatMap(category =>
      modes.map(mode => ({ locale, category, mode })),
    ),
  );
}
