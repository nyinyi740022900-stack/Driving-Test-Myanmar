import type { Question } from './types';
import type { QuizAnswer } from './quiz-answers';
import { isHazardQuestion, isQuestionCorrect, questionPoints, scorePool } from './quiz-answers';

export function findQuestion(questions: Question[], questionId: string): Question | undefined {
  return questions.find(q => q.id === questionId);
}

export function evaluateAnswer(question: Question, answer: QuizAnswer) {
  const correct = isQuestionCorrect(question, answer);
  const result: {
    correct: boolean;
    correctAnswer?: number;
    correctParts?: number[];
    explanation?: Question['explanation'];
  } = { correct, explanation: question.explanation };

  if (isHazardQuestion(question)) {
    result.correctParts = question.parts!.map(p => p.answer);
  } else {
    result.correctAnswer = question.answer;
  }

  return result;
}

export function scoreAnsweredPool(
  pool: Question[],
  answers: QuizAnswer[],
  passPercent: number,
) {
  const scored = scorePool(pool, answers);
  return {
    ...scored,
    passed: scored.percent >= passPercent,
  };
}

export function questionPointsForPool(pool: Question[]): number {
  return pool.reduce((sum, q) => sum + questionPoints(q), 0);
}
