import type { Category } from './types';

export interface WrongAnswerEntry {
  questionId: string;
  category: Category;
  picked: number;
  at: string;
}

const STORAGE_KEY = 'tl_wrong_answers';
const MAX_ENTRIES = 120;

export function getWrongAnswers(category?: Category): WrongAnswerEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? (JSON.parse(raw) as WrongAnswerEntry[]) : [];
    return category ? all.filter((e) => e.category === category) : all;
  } catch {
    return [];
  }
}

export function addWrongAnswer(entry: Omit<WrongAnswerEntry, 'at'> & { at?: string }) {
  if (typeof window === 'undefined') return;
  const row: WrongAnswerEntry = {
    ...entry,
    at: entry.at ?? new Date().toISOString(),
  };
  const existing = getWrongAnswers().filter((e) => e.questionId !== row.questionId);
  const next = [row, ...existing].slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function clearWrongAnswers(category?: Category) {
  if (typeof window === 'undefined') return;
  if (!category) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  const next = getWrongAnswers().filter((e) => e.category !== category);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
