'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { getEffectiveStreak, type StreakData } from '@/lib/streak';

export default function StreakCard() {
  const t = useTranslations('streak');
  const [streak, setStreak] = useState<StreakData | null>(null);

  useEffect(() => {
    setStreak(getEffectiveStreak());
  }, []);

  if (!streak) return null;

  const hasStreak = streak.current > 0;

  return (
    <div style={{ background: '#fff', borderRadius: 18, padding: '24px 28px', marginBottom: 20, border: '1px solid var(--line)' }}>
      <div style={{ fontSize: '.72rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 16 }}>
        {t('heading')}
      </div>

      {hasStreak ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <Stat icon="🔥" label={t('current')} value={t('days', { count: streak.current })} accent="var(--amber)" />
          <Stat icon="🏆" label={t('longest')} value={t('days', { count: streak.longest })} accent="var(--guide)" />
          <div style={{ flex: 1, minWidth: 160, fontSize: '.82rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            {t('keep_going')}
          </div>
        </div>
      ) : (
        <div style={{ fontSize: '.85rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{t('none')}</div>
      )}
    </div>
  );
}

function Stat({ icon, label, value, accent }: { icon: string; label: string; value: string; accent: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: '1.9rem', lineHeight: 1 }}>{icon}</span>
      <div>
        <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.4rem', lineHeight: 1.1, color: accent }}>{value}</div>
        <div style={{ fontSize: '.72rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}
