// Daily practice streak — tracked locally so it works for guests too.

const STORAGE_KEY = 'rr_streak';

export interface StreakData {
  current: number;
  longest: number;
  lastDate: string | null; // yyyy-mm-dd
}

const EMPTY: StreakData = { current: 0, longest: 0, lastDate: null };

function dayKey(d: Date): string {
  // Use the local calendar date, not UTC. Target users are in UTC+6:30/+8/+9,
  // so a UTC key would flip to "yesterday" for anyone practising after midnight
  // local time and silently break their streak.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getStreak(): StreakData {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...EMPTY, ...JSON.parse(raw) };
  } catch {}
  return EMPTY;
}

/**
 * Current streak adjusted for missed days: a streak only counts if the last
 * practice was today or yesterday, otherwise it has effectively reset to 0.
 */
export function getEffectiveStreak(): StreakData {
  const data = getStreak();
  if (!data.lastDate) return data;
  const today = dayKey(new Date());
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const yesterday = dayKey(y);
  if (data.lastDate === today || data.lastDate === yesterday) return data;
  return { ...data, current: 0 };
}

/** Mark today as a practice day and update the streak. Idempotent per day. */
export function recordPracticeDay(): StreakData {
  if (typeof window === 'undefined') return EMPTY;
  const data = getStreak();
  const today = dayKey(new Date());
  if (data.lastDate === today) return data;

  const y = new Date();
  y.setDate(y.getDate() - 1);
  const yesterday = dayKey(y);

  const current = data.lastDate === yesterday ? data.current + 1 : 1;
  const next: StreakData = {
    current,
    longest: Math.max(data.longest, current),
    lastDate: today,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
