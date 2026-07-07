'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { pageview } from '@/lib/analytics';
import { hasAdConsent } from '@/lib/cookie-consent';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    pageview(pathname);
  }, [pathname]);

  useEffect(() => {
    const onConsent = () => pageview(pathname);
    window.addEventListener('tl-cookie-consent-changed', onConsent);
    return () => window.removeEventListener('tl-cookie-consent-changed', onConsent);
  }, [pathname]);

  // Re-fire pageview once analytics consent granted
  useEffect(() => {
    if (hasAdConsent()) pageview(pathname);
  }, [pathname]);

  return <>{children}</>;
}
