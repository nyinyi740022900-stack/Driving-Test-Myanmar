'use client';

import { useEffect } from 'react';
import { AnalyticsEvents } from '@/lib/analytics';

export default function PremiumPageTracker() {
  useEffect(() => {
    AnalyticsEvents.premiumView();
  }, []);
  return null;
}
