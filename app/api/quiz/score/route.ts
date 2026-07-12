import { NextResponse } from 'next/server';
import type { Category } from '@/lib/types';
import { TEST_META } from '@/lib/types';
import { getQuestions } from '@/lib/questions';
import { evaluateAnswer, scoreAnsweredPool } from '@/lib/quiz-evaluate';
import type { QuizAnswer } from '@/lib/quiz-answers';

const VALID = new Set(TEST_META.map(m => m.category));

export async function POST(request: Request) {
  let body: {
    category?: string;
    items?: { id: string; answer: QuizAnswer }[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const category = body.category as Category;
  if (!category || !VALID.has(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }
  if (!body.items?.length) {
    return NextResponse.json({ error: 'Missing items' }, { status: 400 });
  }

  const meta = TEST_META.find(m => m.category === category)!;
  const bank = await getQuestions(category);
  const byId = new Map(bank.map(q => [q.id, q]));

  const pool = body.items.map(item => byId.get(item.id)).filter(Boolean) as typeof bank;
  if (pool.length !== body.items.length) {
    return NextResponse.json({ error: 'Invalid question ids' }, { status: 400 });
  }

  const answers = body.items.map(item => item.answer);
  const scored = scoreAnsweredPool(pool, answers, meta.passPercent);
  const items = body.items.map(item => {
    const question = byId.get(item.id)!;
    return { id: item.id, ...evaluateAnswer(question, item.answer) };
  });

  return NextResponse.json({
    ...scored,
    passPercent: meta.passPercent,
    items,
  });
}
