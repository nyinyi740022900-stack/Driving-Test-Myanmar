/**
 * Central ad placement rules for TheoryLane.
 * Premium users and users who reject cookies never see ads.
 */

/**
 * Ad unit ids, supplied per environment.
 *
 * These were previously hardcoded to 5983088447 — the `myanpass-display`
 * unit, which belongs to an earlier project and is ARCHIVED in the AdSense
 * account. Every <ins> the site rendered pointed at a dead slot, so nothing
 * could ever fill. They stay empty until TheoryLane's own units exist:
 * create them under Ads > By ad unit once the site is approved, then set
 * these variables. An unset slot renders no <ins> at all, which is the
 * correct behaviour — an <ins> aimed at a non-existent unit is worse than
 * no ad markup.
 *
 * NEXT_PUBLIC_* values are inlined at build time, so each must be read as a
 * static property access rather than through a computed key.
 */
export const AD_SLOTS = {
  home_mid: process.env.NEXT_PUBLIC_AD_SLOT_HOME_MID,
  home_footer: process.env.NEXT_PUBLIC_AD_SLOT_HOME_FOOTER,
  quiz_result: process.env.NEXT_PUBLIC_AD_SLOT_QUIZ_RESULT,
  quiz_interstitial: process.env.NEXT_PUBLIC_AD_SLOT_QUIZ_INTERSTITIAL,
} as const;

/** The unit id for a placement, or undefined when none is configured yet. */
export function adSlotFor(placement: keyof typeof AD_SLOTS): string | undefined {
  const slot = AD_SLOTS[placement];
  return slot && slot.trim() ? slot : undefined;
}

export type AdPlacement =
  | 'home_mid'
  | 'home_footer'
  | 'quiz_lesson_practice'
  | 'quiz_test'
  | 'quiz_result'
  | 'quiz_interstitial'
  | 'rewarded_unlock';

/** Interstitial every N questions in lesson/practice (free users). */
export const QUESTIONS_PER_INTERSTITIAL = 50;

/** Quiz-screen ads are held back until AdSense site approval, then re-enabled. */
export const ADS_ON_QUIZ_SCREENS = false;

export function adsConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_ADSENSE_ID);
}

export function canShowPlacement(
  placement: AdPlacement,
  opts: { isPremium: boolean; hasConsent: boolean },
): boolean {
  if (!adsConfigured()) return false;
  if (opts.isPremium) return false;
  if (!opts.hasConsent) return false;

  switch (placement) {
    case 'home_mid':
    case 'home_footer':
      return true;
    case 'quiz_lesson_practice':
    case 'quiz_result':
    case 'quiz_interstitial':
    case 'rewarded_unlock':
      return ADS_ON_QUIZ_SCREENS;
    case 'quiz_test':
      // No ads during timed mock exams — reduces stress and abandonment.
      return false;
    default:
      return false;
  }
}
