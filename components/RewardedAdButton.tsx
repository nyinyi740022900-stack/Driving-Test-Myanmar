'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

declare global {
  interface Window {
    adBreak?: (o: Record<string, unknown>) => void;
    adConfig?: (o: Record<string, unknown>) => void;
  }
}

interface Props {
  onRewarded: () => void;
  label?: string;
  className?: string;
}

type State = 'idle' | 'confirm' | 'loading' | 'skipped';

export default function RewardedAdButton({ onRewarded, label, className = '' }: Props) {
  const t = useTranslations('rewardedAd');
  const [state, setState] = useState<State>('idle');
  const isDev = !process.env.NEXT_PUBLIC_ADSENSE_ID;
  const buttonLabel = label ?? t('button_default');

  function handleWatchAd() {
    setState('loading');

    if (isDev) {
      setTimeout(() => {
        setState('idle');
        onRewarded();
      }, 2000);
      return;
    }

    if (typeof window.adBreak !== 'function') {
      setState('idle');
      onRewarded();
      return;
    }

    window.adBreak({
      type: 'reward',
      name: 'retry_unlock',
      beforeReward: (showAdFn: unknown) => {
        (showAdFn as () => void)();
      },
      adDismissed: () => {
        setState('skipped');
        setTimeout(() => setState('idle'), 2500);
      },
      adViewed: () => {
        onRewarded();
      },
      afterAd: () => {
        setState(prev => prev !== 'skipped' ? 'idle' : prev);
      },
    });
  }

  if (state === 'confirm') {
    return (
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 500,
      }}>
        <div style={{
          background: '#fff', borderRadius: 20, padding: '28px 24px',
          width: 'min(320px, 90vw)', textAlign: 'center',
          border: '1px solid var(--line)',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'rgba(217,119,6,.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <p style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1rem', marginBottom: 8 }}>
            {t('modal_title')}
          </p>
          <p style={{ fontSize: '.85rem', color: 'var(--ink-soft)', marginBottom: 22, lineHeight: 1.5 }}>
            {t('modal_body')}
          </p>
          <button
            onClick={handleWatchAd}
            style={{
              width: '100%', padding: '12px', marginBottom: 10,
              background: 'var(--guide)', color: '#fff', border: 'none',
              borderRadius: 12, fontFamily: 'var(--display)', fontWeight: 700,
              fontSize: '.9rem', cursor: 'pointer',
            }}
          >
            {t('modal_watch')}
          </button>
          <button
            onClick={() => setState('idle')}
            style={{
              width: '100%', padding: '10px',
              background: 'transparent', color: 'var(--ink-soft)',
              border: '1.5px solid var(--line)', borderRadius: 12,
              fontFamily: 'var(--display)', fontWeight: 600,
              fontSize: '.85rem', cursor: 'pointer',
            }}
          >
            {t('modal_cancel')}
          </button>
        </div>
      </div>
    );
  }

  if (state === 'loading') {
    return (
      <button disabled className={className} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        opacity: 0.7, cursor: 'not-allowed',
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur=".8s" repeatCount="indefinite" />
          </path>
        </svg>
        {t('loading')}
      </button>
    );
  }

  if (state === 'skipped') {
    return (
      <button disabled className={className} style={{ opacity: 0.6, cursor: 'not-allowed' }}>
        {t('skipped')}
      </button>
    );
  }

  return (
    <button className={className} onClick={() => setState('confirm')}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }}>
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
      {buttonLabel}
    </button>
  );
}
