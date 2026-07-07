/**
 * Central ad placement rules for TheoryLane.
 * Premium users and users who reject cookies never see ads.
 */

export const AD_SLOTS = {
  home_mid: '5983088447',
  home_footer: '5983088447',
  quiz_result: '5983088447',
  quiz_interstitial: '5983088447',
} as const;

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
    case 'quiz_lesson_practice':
    case 'quiz_result':
    case 'quiz_interstitial':
    case 'rewarded_unlock':
      return true;
    case 'quiz_test':
      // No ads during timed mock exams — reduces stress and abandonment.
      return false;
    default:
      return false;
  }
}
