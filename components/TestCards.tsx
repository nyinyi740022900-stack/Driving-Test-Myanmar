'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useCountry } from './CountryProvider';
import { TEST_META, getCountryBankTotal } from '@/lib/types';

export default function TestCards() {
  const t = useTranslations('tests');
  const locale = useLocale() as 'en' | 'my' | 'ja';
  const { country } = useCountry();

  const tests = TEST_META.filter(m => {
    if (country === 'sg') return ['sg_btt', 'sg_ftt', 'sg_rtt'].includes(m.category);
    return ['jp_car', 'jp_moto'].includes(m.category);
  });

  function getName(m: typeof TEST_META[0]) {
    if (locale === 'my') return m.nameMy;
    if (locale === 'ja') return m.nameJa || m.nameEn;
    return m.nameEn;
  }

  function getDesc(m: typeof TEST_META[0]) {
    if (locale === 'my') return m.descMy;
    if (locale === 'ja') return m.descJa;
    return m.descEn;
  }

  return (
    <section id="tests">
      <div className="wrap">
        <div className="shead">
          <div className="eyebrow">{t('eyebrow')}</div>
          <h2>{t('heading')}</h2>
          <p>
            {country === 'jp'
              ? t('sub_jp', { count: getCountryBankTotal('jp') })
              : t('sub', { count: getCountryBankTotal('sg') })}
          </p>
        </div>
        <div className="tests">
          {tests.map(m => (
            <div key={m.category} className={`card ${country === 'jp' ? 'alt' : ''}`}>
              <span className="tag">{m.tag}</span>
              <h3>{getName(m)}</h3>
              <p className="desc">{getDesc(m)}</p>
              <div className="meta">
                <span><b>{m.bankQuestionCount}</b> {t('practice_questions')}</span>
                <span><b>{m.questionCount}</b> {t('mock_questions')}</span>
                <span><b>{m.timeLimitMinutes} min</b></span>
                <span><b>{m.passPercent}%</b> {t('to_pass')}</span>
              </div>
              <div className="card-actions">
                <Link href={`/${locale}/quiz/${m.category}/lesson`} className="card-btn">
                  {t('learn')}
                </Link>
                <Link href={`/${locale}/quiz/${m.category}/practice`} className="card-btn">
                  {t('practise')}
                </Link>
                <Link href={`/${locale}/quiz/${m.category}/test`} className="card-btn primary">
                  {t('mock')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
