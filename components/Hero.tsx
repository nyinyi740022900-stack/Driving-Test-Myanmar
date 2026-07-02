'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useCountry } from './CountryProvider';
import { TEST_META, getCountryBankTotal } from '@/lib/types';

function formatQuestionCount(n: number): string {
  if (n >= 1000) return `${Math.floor(n / 100) * 100}+`;
  return String(n);
}

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const { country } = useCountry();

  const exits = TEST_META.filter(m => {
    if (country === 'sg') return ['sg_btt', 'sg_ftt', 'sg_rtt'].includes(m.category);
    return ['jp_car', 'jp_moto'].includes(m.category);
  });

  const eyebrow = country === 'sg' ? t('eyebrow_sg') : t('eyebrow_jp');
  const statLang = country === 'sg' ? t('stat_lang_sg') : t('stat_lang_jp');
  const questionTotal = formatQuestionCount(getCountryBankTotal(country));

  return (
    <div className="hero">
      <div className="wrap">
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <div className="board">
            <h1>{t('title')}</h1>
            <div className="exits">
              {exits.map(m => (
                <div key={m.category} className="exit">
                  <b>{country === 'sg' ? 'TEST' : '試験'}</b>
                  {m.tag}
                </div>
              ))}
            </div>
          </div>
          <p className="lead">{t('lead')}</p>
          <div className="hero-cta">
            <Link className="btn btn-primary" href="#try">
              {t('cta_start')} →
            </Link>
            <Link className="btn btn-ghost" href="#how">
              {t('cta_how')}
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <div className="n">{questionTotal}</div>
              <div className="l">{t('stat_q')}</div>
            </div>
            <div>
              <div className="n">90%</div>
              <div className="l">{t('stat_pass')}</div>
            </div>
            <div>
              <div className="n">{statLang}</div>
              <div className="l">{t('stat_lang')}</div>
            </div>
          </div>
        </div>
        <div className="signfloat" aria-hidden="true">
          <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="92" fill="#E0474C" />
            <circle cx="100" cy="100" r="92" fill="none" stroke="#fff" strokeWidth="6" />
            <rect x="46" y="86" width="108" height="28" rx="5" fill="#fff" />
          </svg>
        </div>
      </div>
    </div>
  );
}
