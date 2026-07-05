'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import AdSlot from './AdSlot';

declare global {
  interface Window {
    adBreak?: (options: Record<string, unknown>) => void;
  }
}

interface QuizInterstitialAdProps {
  onContinue: () => void;
}

export default function QuizInterstitialAd({ onContinue }: QuizInterstitialAdProps) {
  const t = useTranslations('quiz');
  const isDev = !process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (isDev || typeof window.adBreak !== 'function') return;

    window.adBreak({
      type: 'next',
      name: 'quiz_milestone',
      beforeAd: () => {},
      afterAd: () => {},
    });
  }, [isDev]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-ad-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(15, 23, 42, .55)',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          width: 'min(100%, 420px)',
          background: 'var(--paint)',
          borderRadius: 18,
          border: '1px solid var(--line)',
          boxShadow: 'var(--shadow)',
          padding: '24px 20px',
        }}
      >
        <h2
          id="quiz-ad-title"
          style={{
            fontFamily: 'var(--display)',
            fontWeight: 800,
            fontSize: '1.15rem',
            marginBottom: 8,
            textAlign: 'center',
          }}
        >
          {t('ad_break_title')}
        </h2>
        <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem', textAlign: 'center', marginBottom: 18, lineHeight: 1.55 }}>
          {t('ad_break_desc')}
        </p>
        <AdSlot slot="5983088447" format="rectangle" className="quiz-ad" />
        <button
          type="button"
          className="btn btn-primary"
          onClick={onContinue}
          style={{ width: '100%', marginTop: 18 }}
        >
          {t('ad_break_continue')} →
        </button>
      </div>
    </div>
  );
}
