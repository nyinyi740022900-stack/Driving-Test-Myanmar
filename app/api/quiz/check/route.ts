import { NextResponse } from 'next/server';
import type { Category } from '@/lib/types';
import { TEST_META } from '@/lib/types';
import { getQuestions } from '@/lib/questions';
import { evaluateAnswer } from '@/lib/quiz-evaluate';
import type { QuizAnswer } from '@/lib/quiz-answers';

const VALID = new Set(TEST_META.map(m => m.category));

export async function POST(request: Request) {
  let body: { category?: string; questionId?: string; answer?: QuizAnswer };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const category = body.category as Category;
  if (!category || !VALID.has(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }
  if (!body.questionId) {
    return NextResponse.json({ error: 'Missing questionId' }, { status: 400 });
  }

  const questions = await getQuestions(category);
  const question = questions.find(q => q.id === body.questionId);
  if (!question) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  }

  const result = evaluateAnswer(question, body.answer ?? null);
  return NextResponse.json(result);
}
