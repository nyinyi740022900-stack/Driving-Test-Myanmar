'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

export default function Pricing() {
  const t = useTranslations('pricing');
  const locale = useLocale();

  return (
    <section className="price-sec" id="pricing">
      <div className="wrap">
        <div className="shead">
          <div className="eyebrow">{t('eyebrow')}</div>
          <h2>{t('heading')}</h2>
          <p>{t('sub')}</p>
        </div>
        <div className="plans">
          <div className="plan">
            <div className="pname">{t('free')}</div>
            <div className="pprice">{t('free_price')}</div>
            <ul>
              <li>{t('free_1')}</li>
              <li>{t('free_2')}</li>
              <li>{t('free_3')}</li>
            </ul>
          </div>
          <div className="plan feature">
            <div className="pname">{t('monthly')}</div>
            <div className="pprice">{t('monthly_price')}</div>
            <ul>
              <li>{t('pro_1')}</li>
              <li>{t('pro_2')}</li>
              <li>{t('pro_3')}</li>
            </ul>
            <div className="pay">
              <span className="chip">KBZPay</span>
              <span className="chip">WavePay</span>
              <span>{t('manual')}</span>
            </div>
            <Link href={`/${locale}/payment?plan=monthly`} className="btn btn-primary" style={{ marginTop: 'auto', width: '100%', justifyContent: 'center', display: 'flex' }}>
              {t('cta_monthly')} →
            </Link>
          </div>
          <div className="plan">
            <div className="pname">{t('yearly')}</div>
            <div className="pprice">{t('yearly_price')}</div>
            <ul>
              <li>{t('year_1')}</li>
              <li>{t('year_2')}</li>
              <li>{t('year_3')}</li>
            </ul>
            <div className="pay">
              <span className="chip">KBZPay</span>
              <span className="chip">WavePay</span>
              <span>{t('manual')}</span>
            </div>
            <Link href={`/${locale}/payment?plan=yearly`} className="btn btn-ghost" style={{ marginTop: 'auto', width: '100%', justifyContent: 'center', display: 'flex', color: 'var(--paint)', borderColor: 'rgba(255,255,255,.25)' }}>
              {t('cta_yearly')} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
