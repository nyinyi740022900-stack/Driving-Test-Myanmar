import type { Category } from '@/lib/types';

const inflight = new Map<Category, Promise<void>>();
const warmed = new Set<Category>();

/** Warm the question-bank cache before the user navigates to a quiz page. */
export function prefetchQuestionBank(category: Category): void {
  if (typeof window === 'undefined' || warmed.has(category)) return;

  const existing = inflight.get(category);
  if (existing) return;

  const task = fetch(`/api/questions/${category}`, { priority: 'low' } as RequestInit)
    .then((res) => {
      if (res.ok) warmed.add(category);
    })
    .catch(() => {})
    .finally(() => {
      inflight.delete(category);
    });

  inflight.set(category, task);
}
