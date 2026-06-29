'use client';

import type React from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

type Card = { key: string; path: string; icon: React.ReactNode; star?: boolean };

export default function Resources() {
  const t = useTranslations('res');
  const locale = useLocale();

  const cards: Card[] = [
    {
      key: 'r1',
      path: 'resources/signs',
      icon: (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path d="M7 12h10" />
        </svg>
      ),
    },
    {
      key: 'r2',
      path: 'resources/guide',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M4 5h16v14H4z" />
          <path d="M8 9h8M8 13h5" />
        </svg>
      ),
    },
    {
      key: 'r3',
      path: 'resources/roadmap',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M4 18 12 4l8 14" />
          <path d="M4 18h16" />
        </svg>
      ),
    },
    {
      key: 'r7',
      path: 'resources/license-classes',
      icon: (
        <svg viewBox="0 0 24 24">
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M3 10h18" />
          <path d="M7 14h2M7 17h5" />
        </svg>
      ),
    },
    {
      key: 'r8',
      path: 'resources/costs',
      icon: (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v1.5M12 15.5V17M9.5 9.5C9.5 8.1 10.6 7 12 7c1.4 0 2.5 1.1 2.5 2.5 0 2-2.5 2.5-2.5 4.5" />
        </svg>
      ),
    },
    {
      key: 'r4',
      path: 'resources/glossary',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M5 8h14M5 12h9M5 16h6" />
          <path d="M16 14l3 3" />
        </svg>
      ),
      star: true,
    },
    {
      key: 'r5',
      path: 'resources/foreigners',
      icon: (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" />
          <path d="M5 20c0-4 3-6 7-6s7 2 7 6" />
        </svg>
      ),
    },
    {
      key: 'r6',
      path: 'resources/faq',
      icon: (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9.5a2.5 2.5 0 1 1 3 2.4V14" />
          <path d="M12 17h.01" />
        </svg>
      ),
    },
  ];

  return (
    <section id="resources">
      <div className="wrap">
        <div className="shead">
          <div className="eyebrow">{t('eyebrow')}</div>
          <h2>{t('heading')}</h2>
          <p>{t('sub')}</p>
        </div>
        <div className="res">
          {cards.map(({ key, path, icon, star }) => (
            <Link
              key={key}
              href={`/${locale}/${path}`}
              className={`rcard ${star ? 'star' : ''}`}
              style={{ textDecoration: 'none', position: 'relative' }}
            >
              {star && <span className="rbadge">{t('human_reviewed')}</span>}
              <div className="ic">{icon}</div>
              <h3>{t(`${key}_h` as Parameters<typeof t>[0])}</h3>
              <p>{t(`${key}_p` as Parameters<typeof t>[0])}</p>
              <span className="go">{t('open')}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
