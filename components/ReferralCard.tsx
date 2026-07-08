'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase';
import { referralLinkFor, getReferralCount } from '@/lib/referral';

export default function ReferralCard({ userId, locale }: { userId: string; locale: string }) {
  const t = useTranslations('referral');
  const [link, setLink] = useState('');
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLink(referralLinkFor(userId, locale));
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      getReferralCount(createClient(), userId).then(setCount);
    }
  }, [userId, locale]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: t('share_title'), text: t('share_text'), url: link });
        return;
      } catch {}
    }
    handleCopy();
  }

  const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

  return (
    <div style={{ background: '#fff', borderRadius: 18, padding: '24px 28px', marginBottom: 20, border: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
        <div style={{ fontSize: '.72rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
          {t('heading')}
        </div>
        <div style={{ background: 'var(--paint)', color: 'var(--guide-deep)', fontFamily: 'var(--display)', fontWeight: 800, fontSize: '.8rem', padding: '4px 12px', borderRadius: 99 }}>
          {t('invited', { count })}
        </div>
      </div>

      <div style={{ fontSize: '.85rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 14 }}>{t('intro')}</div>

      <label style={{ display: 'block', fontSize: '.72rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 6 }}>
        {t('your_link')}
      </label>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          readOnly
          value={link}
          onFocus={e => e.currentTarget.select()}
          style={{ flex: 1, minWidth: 200, padding: '9px 12px', border: '1.5px solid var(--line)', borderRadius: 10, fontFamily: 'monospace', fontSize: '.82rem', background: 'var(--paint-2)', outline: 'none', boxSizing: 'border-box' }}
        />
        <button
          onClick={handleCopy}
          style={{ padding: '9px 16px', background: copied ? 'rgba(27,156,86,.15)' : 'var(--asphalt)', color: copied ? 'var(--guide-deep)' : '#fff', border: 'none', borderRadius: 10, fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.82rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          {copied ? t('copied') : t('copy')}
        </button>
        {canShare && (
          <button
            onClick={handleShare}
            style={{ padding: '9px 16px', background: 'var(--guide)', color: '#fff', border: 'none', borderRadius: 10, fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.82rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            {t('share')}
          </button>
        )}
      </div>
    </div>
  );
}
