import { NextResponse } from 'next/server';
import type { Category } from '@/lib/types';
import { TEST_META } from '@/lib/types';
import { getQuestions } from '@/lib/questions';
import { sanitizeQuestionsForPublicApi } from '@/lib/question-sanitize';

const VALID = new Set(TEST_META.map(m => m.category));

export async function GET(
  req: Request,
  { params }: { params: Promise<{ category: string }> },
) {
  const { category } = await params;

  if (!VALID.has(category as Category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 404 });
  }

  const questions = await getQuestions(category as Category);
  const url = new URL(req.url);
  const mode = url.searchParams.get('mode');
  const payload =
    mode === 'lesson'
      ? questions
      : sanitizeQuestionsForPublicApi(questions);

  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
