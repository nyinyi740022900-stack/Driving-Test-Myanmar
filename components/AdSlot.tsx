'use client';

import { useEffect, useRef, useState } from 'react';
import { getStoredConsent, hasAdConsent } from '@/lib/cookie-consent';

interface AdSlotProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
}

declare global {
  interface Window { adsbygoogle: unknown[] }
}

export default function AdSlot({ slot, format = 'auto', className = '' }: AdSlotProps) {
  const pushed = useRef(false);
  const isDev = !process.env.NEXT_PUBLIC_ADSENSE_ID;
  const [canShowAds, setCanShowAds] = useState(false);

  useEffect(() => {
    const sync = () => setCanShowAds(hasAdConsent());
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener('tl-cookie-consent-changed', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('tl-cookie-consent-changed', sync);
    };
  }, []);

  useEffect(() => {
    if (isDev || !canShowAds || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {}
  }, [isDev, canShowAds]);

  if (isDev) {
    return (
      <div
        className={className}
        style={{
          background: 'var(--paint-2)',
          border: '1.5px dashed var(--line)',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: format === 'rectangle' ? 250 : 90,
          color: 'var(--ink-soft)',
          fontSize: '.78rem',
          fontFamily: 'var(--display)',
          fontWeight: 700,
          letterSpacing: '.06em',
          textTransform: 'uppercase',
        }}
      >
        AD — {format.toUpperCase()}
        {getStoredConsent() === 'rejected' ? ' (consent off)' : ''}
      </div>
    );
  }

  if (!canShowAds) return null;

  return (
    <div className={className} style={{ textAlign: 'center', overflow: 'hidden' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
