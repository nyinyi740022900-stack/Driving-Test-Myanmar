import type { Category, Question } from './types';
import { isHazardQuestion } from './quiz-answers';
import { isJpCategory } from './questions';
import { shuffleArray } from './questions';

const JP_HAZARD_CAP = 5;
const JP_MOCK_SIZE = 95;
const JP_NON_HAZARD = JP_MOCK_SIZE - JP_HAZARD_CAP;

/** Build a mock-test pool matching official exam shape (JP: 90 T/F + 5 hazard = 100 pts). */
export function buildMockTestPool(
  questions: Question[],
  category: Category,
  count: number,
): Question[] {
  if (!isJpCategory(category) || count !== JP_MOCK_SIZE) {
    return shuffleArray([...questions]).slice(0, count);
  }

  const hazards = questions.filter(isHazardQuestion);
  const nonHazards = questions.filter(q => !isHazardQuestion(q));

  const hazardPick = shuffleArray([...hazards]).slice(0, JP_HAZARD_CAP);
  const nonHazardPick = shuffleArray([...nonHazards]).slice(0, JP_NON_HAZARD);

  const combined = [...nonHazardPick, ...hazardPick];
  if (combined.length < count) {
    const used = new Set(combined.map(q => q.id));
    const filler = shuffleArray(questions.filter(q => !used.has(q.id))).slice(
      0,
      count - combined.length,
    );
    combined.push(...filler);
  }

  return shuffleArray(combined.slice(0, count));
}
