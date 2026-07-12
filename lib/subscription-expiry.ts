import type { PlanKey } from './subscription';
import { PLANS } from './subscription';

/** Stack premium days onto an existing future expiry (or from today if lapsed). */
export function computeStackedExpiry(
  planKey: PlanKey,
  existingExpiresAt: string | null | undefined,
  now: Date = new Date(),
): Date {
  const plan = PLANS[planKey];
  let base = now;

  if (existingExpiresAt) {
    const current = new Date(existingExpiresAt);
    if (!Number.isNaN(current.getTime()) && current > base) {
      base = current;
    }
  }

  const expiresAt = new Date(base);
  expiresAt.setDate(expiresAt.getDate() + plan.days);
  return expiresAt;
}
