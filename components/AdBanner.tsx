'use client';

import AdSlot from './AdSlot';
import { hasAdConsent } from '@/lib/cookie-consent';
import { canShowPlacement, type AdPlacement } from '@/lib/ad-strategy';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';

interface Props {
  placement: AdPlacement;
  slot: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
}

export default function AdBanner({ placement, slot, format = 'auto', className = '' }: Props) {
  const { isPremiumUser, loading } = usePremiumStatus();

  if (loading) return null;
  if (!canShowPlacement(placement, { isPremium: isPremiumUser, hasConsent: hasAdConsent() })) {
    return null;
  }

  return <AdSlot slot={slot} format={format} className={className} />;
}
