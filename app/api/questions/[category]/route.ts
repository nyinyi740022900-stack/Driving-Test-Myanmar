import { NextResponse } from 'next/server';
import type { Category } from '@/lib/types';
import { TEST_META } from '@/lib/types';
import { getQuestions } from '@/lib/questions';

const VALID = new Set(TEST_META.map((m) => m.category));

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ category: string }> },
) {
  const { category } = await params;

  if (!VALID.has(category as Category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 404 });
  }

  const questions = await getQuestions(category as Category);

  return NextResponse.json(questions, {
    headers: {
      // Question banks change infrequently — cache aggressively at CDN + browser.
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
