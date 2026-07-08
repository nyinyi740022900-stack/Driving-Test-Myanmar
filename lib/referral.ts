// Referral / invite helpers.
// A user's referral code is the first 8 chars of their auth id — deterministic,
// no extra storage needed. Pending invite codes are held in localStorage until
// the invited user logs in for the first time and the referral is redeemed.

import type { SupabaseClient } from '@supabase/supabase-js';

const PENDING_KEY = 'rr_pending_ref';
const REDEEMED_KEY = 'rr_ref_redeemed';

export function referralCodeFor(userId: string): string {
  return userId.slice(0, 8);
}

export function referralLinkFor(userId: string, locale: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/${locale}/auth/signup?ref=${referralCodeFor(userId)}`;
}

/** Store an inviter's code from the current URL, if present. */
export function capturePendingReferral(): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  if (ref && /^[a-f0-9]{4,12}$/i.test(ref)) {
    localStorage.setItem(PENDING_KEY, ref);
  }
}

/**
 * If a pending invite code exists and hasn't been redeemed, record the referral
 * for this signed-in user. Safe to call repeatedly.
 */
export async function redeemPendingReferral(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(REDEEMED_KEY)) return;

  const code = localStorage.getItem(PENDING_KEY);
  if (!code) return;

  // Ignore self-referrals.
  if (code === referralCodeFor(userId)) {
    localStorage.setItem(REDEEMED_KEY, '1');
    localStorage.removeItem(PENDING_KEY);
    return;
  }

  const { error } = await supabase.from('referrals').insert({
    referrer_code: code,
    referred_user_id: userId,
  });

  // Unique-violation (already recorded) is fine — mark redeemed regardless.
  if (error && error.code !== '23505') {
    console.error('[redeemPendingReferral]', error.message);
    return;
  }

  localStorage.setItem(REDEEMED_KEY, '1');
  localStorage.removeItem(PENDING_KEY);
}

/** Count how many friends joined via this user's code. */
export async function getReferralCount(
  supabase: SupabaseClient,
  userId: string,
): Promise<number> {
  const { count, error } = await supabase
    .from('referrals')
    .select('id', { count: 'exact', head: true })
    .eq('referrer_code', referralCodeFor(userId));

  if (error) {
    console.error('[getReferralCount]', error.message);
    return 0;
  }
  return count ?? 0;
}
