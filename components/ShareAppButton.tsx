'use client';

import { useTranslations } from 'next-intl';
import { SITE_URL } from '@/lib/brand';
import { AnalyticsEvents } from '@/lib/analytics';

export default function ShareAppButton() {
  const t = useTranslations('growth');

  async function handleShare() {
    const url = SITE_URL;
    const text = t('share_text');

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: t('share_title'), text, url });
        AnalyticsEvents.shareApp('native');
        return;
      } catch {
        // user cancelled or unsupported
      }
    }

    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      AnalyticsEvents.shareApp('clipboard');
      alert(t('copied'));
    } catch {
      AnalyticsEvents.shareApp('failed');
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="btn btn-ghost"
      style={{ marginTop: 12 }}
    >
      {t('share_cta')}
    </button>
  );
}
