import { useTranslations } from 'next-intl';

export default function HowItWorks() {
  const t = useTranslations('how');

  return (
    <section id="how">
      <div className="wrap">
        <div className="shead">
          <div className="eyebrow">{t('eyebrow')}</div>
          <h2>{t('heading')}</h2>
        </div>
        <div className="steps">
          <div className="step">
            <div className="num">01</div>
            <h3>{t('s1_h')}</h3>
            <p>{t('s1_p')}</p>
          </div>
          <div className="step">
            <div className="num">02</div>
            <h3>{t('s2_h')}</h3>
            <p>{t('s2_p')}</p>
          </div>
          <div className="step">
            <div className="num">03</div>
            <h3>{t('s3_h')}</h3>
            <p>{t('s3_p')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
