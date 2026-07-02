import type { Category, Question } from './types';
import { CATEGORY_COUNTRY } from './types';

const JP_CATEGORIES: Category[] = ['jp_car', 'jp_moto'];

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

/** Pick question/content text for the active UI locale and question category. */
export function pickLocalized(
  loc: Partial<Record<string, string>>,
  locale: string,
  category?: Category
): string {
  const isJp = category ? JP_CATEGORIES.includes(category) : false;

  if (isJp) {
    if (locale === 'ja') return loc.ja ?? loc.en ?? loc.my ?? '';
    if (locale === 'my') return loc.my ?? loc.en ?? loc.ja ?? '';
    // en — never fall back to Japanese when English is selected
    return loc.en ?? loc.my ?? '';
  }

  if (locale === 'ja') return loc.ja ?? loc.en ?? loc.my ?? '';
  return loc[locale] ?? loc.en ?? loc.my ?? loc.ja ?? Object.values(loc)[0] ?? '';
}

export function isJpCategory(category: Category): boolean {
  return CATEGORY_COUNTRY[category] === 'jp';
}

/** Standard JP true/false choice labels (正しい / 誤り). */
export function isJpTrueFalseChoice(text: Partial<Record<string, string>>): boolean {
  const ja = text.ja?.trim();
  return ja === '正しい' || ja === '誤り';
}

export function shuffleArray<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
