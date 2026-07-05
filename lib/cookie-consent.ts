export const COOKIE_CONSENT_KEY = 'tl_cookie_consent';

export type CookieConsentChoice = 'accepted' | 'rejected';

export function getStoredConsent(): CookieConsentChoice | null {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (value === 'accepted' || value === 'rejected') return value;
  return null;
}

export function setStoredConsent(choice: CookieConsentChoice) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COOKIE_CONSENT_KEY, choice);
  window.dispatchEvent(new Event('tl-cookie-consent-changed'));
}

export function hasAdConsent(): boolean {
  return getStoredConsent() === 'accepted';
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function updateGoogleConsent(granted: boolean) {
  if (typeof window === 'undefined') return;
  window.gtag?.('consent', 'update', {
    ad_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
    analytics_storage: granted ? 'denied' : 'denied',
  });
}

export function applyStoredConsentOnLoad() {
  const choice = getStoredConsent();
  if (choice === 'accepted') updateGoogleConsent(true);
}
