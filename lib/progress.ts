export interface QuizResult {
  date: string;
  score: number;
  total: number;
  passed: boolean;
}

export interface CategoryProgress {
  sessions: QuizResult[];
}

const key = (cat: string) => `rr_progress_${cat}`;

export function saveQuizResult(category: string, result: QuizResult): void {
  if (typeof window === 'undefined') return;
  const existing = getProgress(category);
  existing.sessions = [result, ...existing.sessions].slice(0, 20);
  localStorage.setItem(key(category), JSON.stringify(existing));
}

export function getProgress(category: string): CategoryProgress {
  if (typeof window === 'undefined') return { sessions: [] };
  try {
    const raw = localStorage.getItem(key(category));
    if (raw) return JSON.parse(raw) as CategoryProgress;
  } catch {}
  return { sessions: [] };
}

export function getBestScore(category: string): QuizResult | null {
  const { sessions } = getProgress(category);
  if (!sessions.length) return null;
  return sessions.reduce((best, s) =>
    s.score / s.total > best.score / best.total ? s : best
  );
}

export function getAttemptCount(category: string): number {
  return getProgress(category).sessions.length;
}
