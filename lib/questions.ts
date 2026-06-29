import type { Category, Question } from './types';

const cache: Partial<Record<Category, Question[]>> = {};

export async function getQuestions(category: Category): Promise<Question[]> {
  if (cache[category]) return cache[category]!;

  try {
    const data = await import(`../content/questions/${category}.json`);
    const questions: Question[] = Array.isArray(data.default) ? data.default : data;
    cache[category] = questions;
    return questions;
  } catch {
    return [];
  }
}

export function getSampleQuestion(category: Category): Question | null {
  const cached = cache[category];
  if (cached && cached.length > 0) return cached[0];
  return null;
}

export function pickLocalized(
  loc: Partial<Record<string, string>>,
  locale: string
): string {
  return loc[locale] ?? loc['en'] ?? loc['ja'] ?? Object.values(loc)[0] ?? '';
}

export function shuffleArray<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
