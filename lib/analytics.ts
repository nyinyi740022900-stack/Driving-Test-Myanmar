export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '';

export function analyticsConfigured(): boolean {
  return Boolean(GA_MEASUREMENT_ID);
}

export function pageview(path: string) {
  if (!analyticsConfigured() || typeof window === 'undefined') return;
  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
  });
}

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>,
) {
  if (!analyticsConfigured() || typeof window === 'undefined') return;
  window.gtag?.('event', name, params);
}

/** Business events for funnel monitoring */
export const AnalyticsEvents = {
  mockTestStart: (category: string) => trackEvent('mock_test_start', { category }),
  mockTestLimit: (category: string) => trackEvent('mock_test_limit', { category }),
  premiumView: () => trackEvent('premium_page_view'),
  paymentSubmit: (plan: string) => trackEvent('payment_submit', { plan }),
  shareApp: (method: string) => trackEvent('share_app', { method }),
  adConsent: (choice: 'accepted' | 'rejected') => trackEvent('ad_consent', { choice }),
} as const;
