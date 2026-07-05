'use client';

import { useTranslations } from 'next-intl';
import { useCountry } from './CountryProvider';

type FaqItem = { q: string; a: string };

export default function FAQ() {
  const t = useTranslations('faq');
  const { country } = useCountry();

  const countryFaqs = t.raw(country === 'sg' ? 'sg' : 'jp') as FaqItem[];
  const sharedFaqs = t.raw('shared') as FaqItem[];
  const items = [...countryFaqs, ...sharedFaqs];

  return (
    <section id="faq" style={{ background: 'var(--paint-2)' }}>
      <div className="wrap">
        <div className="shead" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
          <div className="eyebrow">{t('eyebrow')}</div>
          <h2>{t('heading')}</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: '.95rem', marginTop: 8 }}>
            {country === 'sg' ? t('sub_sg') : t('sub_jp')}
          </p>
        </div>
        <div className="faq">
          {items.map((item, index) => (
            <details key={item.q} open={index === 0}>
              <summary>{item.q}</summary>
              <div className="ans">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
