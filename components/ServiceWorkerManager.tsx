'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

/**
 * Registers the service worker (offline caching + reminders) and shows a
 * small banner while the device is offline.
 */
export default function ServiceWorkerManager() {
  const t = useTranslations('offline');
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    setOffline(!navigator.onLine);
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 300,
        background: 'var(--asphalt)',
        color: '#fff',
        fontFamily: 'var(--display)',
        fontWeight: 600,
        fontSize: '.82rem',
        textAlign: 'center',
        padding: '10px 16px',
        boxShadow: '0 -2px 12px rgba(0,0,0,.18)',
      }}
    >
      {t('banner')}
    </div>
  );
}
