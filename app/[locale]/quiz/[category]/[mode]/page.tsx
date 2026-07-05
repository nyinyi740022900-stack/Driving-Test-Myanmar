import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { Category } from '@/lib/types';
import { TEST_META } from '@/lib/types';
import { getQuestions } from '@/lib/questions';
import { buildQuizMetadata } from '@/lib/seo';
import QuizSession from '@/components/QuizSession';
import Link from 'next/link';

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

  const questions = await getQuestions(category as Category);
  const t = await getTranslations({ locale, namespace: 'seo.quiz' });
  const meta = TEST_META.find(m => m.category === category);

  if (questions.length === 0) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.6rem', marginBottom: 16 }}>
          No questions found
        </h2>
        <Link href={`/${locale}`} style={{ color: 'var(--guide-deep)', fontWeight: 700 }}>
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <>
      {meta && (
        <section
          className="sr-only"
          aria-label="Quiz overview"
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0,0,0,0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          <h1>
            {t(`${mode}_title`, { test: meta.tag })}
          </h1>
          <p>
            {t('description', {
              test: meta.tag,
              count: meta.bankQuestionCount,
              mock: meta.questionCount,
              pass: meta.passPercent,
            })}
          </p>
        </section>
      )}
      <QuizSession
        category={category as Category}
        mode={mode as Mode}
        questions={questions}
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
