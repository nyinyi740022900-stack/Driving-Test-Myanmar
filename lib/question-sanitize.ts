import type { Question } from './types';

/** Strip answers and explanations before sending questions to the client (practice/test). */
export function sanitizeQuestionsForClient(questions: Question[]): Question[] {
  return questions.map(q => {
    const { answer: _a, explanation: _e, parts, ...rest } = q;
    const sanitized: Question = {
      ...rest,
      answer: -1,
      explanation: {},
    };
    if (parts?.length) {
      sanitized.parts = parts.map(({ answer: _pa, ...part }) => ({
        ...part,
        answer: -1,
      }));
    }
    return sanitized;
  });
}

/** Public API / prefetch — never expose scoring fields. */
export function sanitizeQuestionsForPublicApi(questions: Question[]): Question[] {
  return sanitizeQuestionsForClient(questions);
}
