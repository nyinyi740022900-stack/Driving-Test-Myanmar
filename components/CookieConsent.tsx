'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import {
  applyStoredConsentOnLoad,
  getStoredConsent,
  setStoredConsent,
  updateGoogleConsent,
  type CookieConsentChoice,
} from '@/lib/cookie-consent';

export default function CookieConsent() {
  const t = useTranslations('cookies');
  const locale = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    applyStoredConsentOnLoad();
    if (getStoredConsent() === null) setVisible(true);
  }, []);

  function handleChoice(choice: CookieConsentChoice) {
    setStoredConsent(choice);
    updateGoogleConsent(choice === 'accepted');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        padding: '16px max(20px, env(safe-area-inset-right)) 16px max(20px, env(safe-area-inset-left))',
        background: 'rgba(13, 27, 15, .96)',
        borderTop: '1px solid rgba(255,255,255,.12)',
        boxShadow: '0 -8px 32px rgba(0,0,0,.2)',
      }}
    >
      <div
        style={{
          maxWidth: 1140,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: '1 1 280px', maxWidth: 720 }}>
          <p
            id="cookie-consent-title"
            style={{
              fontFamily: 'var(--display)',
              fontWeight: 800,
              fontSize: '.95rem',
              color: '#fff',
              marginBottom: 6,
            }}
          >
            {t('title')}
          </p>
          <p style={{ fontSize: '.84rem', lineHeight: 1.55, color: 'rgba(255,255,255,.75)', margin: 0 }}>
            {t('body')}{' '}
            <Link href={`/${locale}/privacy`} style={{ color: 'var(--guide)', fontWeight: 600 }}>
              {t('privacy_link')}
            </Link>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => handleChoice('rejected')}
            style={{ color: '#fff', borderColor: 'rgba(255,255,255,.25)' }}
          >
            {t('reject')}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => handleChoice('accepted')}>
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
