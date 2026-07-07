import type { Category } from '@/lib/types';
import { QUESTIONS_PER_INTERSTITIAL } from '@/lib/ad-strategy';

export const QUESTIONS_PER_AD = QUESTIONS_PER_INTERSTITIAL;

const storageKey = (category: Category, mode: 'lesson' | 'practice') =>
  `tl_qprog_${category}_${mode}`;

export function getQuestionProgressCount(
  category: Category,
  mode: 'lesson' | 'practice',
): number {
  if (typeof window === 'undefined') return 0;
  const raw = sessionStorage.getItem(storageKey(category, mode));
  const n = raw ? Number.parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function bumpQuestionProgress(
  category: Category,
  mode: 'lesson' | 'practice',
): number {
  const next = getQuestionProgressCount(category, mode) + 1;
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(storageKey(category, mode), String(next));
  }
  return next;
}

export function shouldShowQuizInterstitial(count: number): boolean {
  return count > 0 && count % QUESTIONS_PER_AD === 0;
}

export function resetQuestionProgress(category: Category, mode: 'lesson' | 'practice') {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(storageKey(category, mode));
}
