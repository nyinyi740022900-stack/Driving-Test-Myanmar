import type { SupabaseClient } from '@supabase/supabase-js';

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

// ── Cloud sync (signed-in users) ──────────────────────────────────────
// Progress is mirrored to Supabase so history survives a device change.

export interface CloudCategoryStat {
  attempts: number;
  bestPct: number | null;
}

const MIGRATED_KEY = 'rr_cloud_migrated';

/** Insert one completed result into the cloud. Safe to fire-and-forget. */
export async function saveQuizResultCloud(
  supabase: SupabaseClient,
  userId: string,
  category: string,
  result: QuizResult,
): Promise<void> {
  const { error } = await supabase.from('quiz_progress').insert({
    user_id: userId,
    category,
    score: result.score,
    total: result.total,
    passed: result.passed,
  });
  if (error) console.error('[saveQuizResultCloud]', error.message);
}

/** Read all cloud results for a user, aggregated per category. */
export async function getCloudProgress(
  supabase: SupabaseClient,
  userId: string,
): Promise<Record<string, CloudCategoryStat>> {
  const { data, error } = await supabase
    .from('quiz_progress')
    .select('category, score, total')
    .eq('user_id', userId);

  if (error) {
    console.error('[getCloudProgress]', error.message);
    return {};
  }

  const map: Record<string, CloudCategoryStat> = {};
  for (const row of data ?? []) {
    const total = Number(row.total) || 0;
    const pct = total > 0 ? Math.round((Number(row.score) / total) * 100) : 0;
    const cur = map[row.category] ?? { attempts: 0, bestPct: null };
    cur.attempts += 1;
    cur.bestPct = cur.bestPct === null ? pct : Math.max(cur.bestPct, pct);
    map[row.category] = cur;
  }
  return map;
}

/**
 * One-time upload of any locally-stored history to the cloud.
 * Skips (and marks done) if the cloud already has rows, so going-forward
 * writes are never duplicated.
 */
export async function migrateLocalProgressToCloud(
  supabase: SupabaseClient,
  userId: string,
  categories: string[],
): Promise<void> {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(MIGRATED_KEY)) return;

  const { count, error: countError } = await supabase
    .from('quiz_progress')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (countError) {
    console.error('[migrateLocalProgressToCloud]', countError.message);
    return;
  }

  // Cloud already has data — nothing to migrate, avoid duplicates.
  if ((count ?? 0) > 0) {
    localStorage.setItem(MIGRATED_KEY, '1');
    return;
  }

  const rows = categories.flatMap((cat) =>
    getProgress(cat).sessions.map((s) => ({
      user_id: userId,
      category: cat,
      score: s.score,
      total: s.total,
      passed: s.passed,
      created_at: s.date,
    })),
  );

  if (rows.length > 0) {
    const { error } = await supabase.from('quiz_progress').insert(rows);
    if (error) {
      console.error('[migrateLocalProgressToCloud]', error.message);
      return;
    }
  }
  localStorage.setItem(MIGRATED_KEY, '1');
}
