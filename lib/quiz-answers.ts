import type { Question } from './types';

export type QuizAnswer = number | (number | null)[] | null;

const PART_LABELS = ['ア', 'イ', 'ウ'] as const;

export function isHazardQuestion(q: Question): boolean {
  return (q.parts?.length ?? 0) > 0;
}

export function emptyAnswerFor(q: Question): QuizAnswer {
  if (isHazardQuestion(q)) return q.parts!.map(() => null);
  return null;
}

export function isAnswerComplete(q: Question, ans: QuizAnswer): boolean {
  if (isHazardQuestion(q)) {
    if (!Array.isArray(ans)) return false;
    return ans.length === q.parts!.length && ans.every(a => a !== null);
  }
  return ans !== null;
}

export function isQuestionCorrect(q: Question, ans: QuizAnswer): boolean {
  if (isHazardQuestion(q)) {
    if (!Array.isArray(ans)) return false;
    return q.parts!.every((part, i) => ans[i] === part.answer);
  }
  return ans === q.answer;
}

export function questionPoints(q: Question): number {
  return q.points ?? 1;
}

export function scorePool(pool: Question[], answers: QuizAnswer[]) {
  let earned = 0;
  let total = 0;
  let correctQuestions = 0;

  pool.forEach((q, i) => {
    const pts = questionPoints(q);
    total += pts;
    if (isQuestionCorrect(q, answers[i])) {
      earned += pts;
      correctQuestions += 1;
    }
  });

  const percent = total ? Math.round((earned / total) * 100) : 0;
  return { earned, total, correctQuestions, percent };
}

export function partLabel(index: number): string {
  return PART_LABELS[index] ?? String.fromCharCode(65 + index);
}
