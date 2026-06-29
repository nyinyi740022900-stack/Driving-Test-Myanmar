import { useTranslations } from 'next-intl';

export default function FAQ() {
  const t = useTranslations('faq');

  return (
    <section id="faq" style={{ background: 'var(--paint-2)' }}>
      <div className="wrap">
        <div className="shead" style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
          <div className="eyebrow">{t('eyebrow')}</div>
          <h2>{t('heading')}</h2>
        </div>
        <div className="faq">
          <details open>
            <summary>{t('q1')}</summary>
            <div className="ans">{t('a1')}</div>
          </details>
          <details>
            <summary>{t('q2')}</summary>
            <div className="ans">{t('a2')}</div>
          </details>
          <details>
            <summary>{t('q3')}</summary>
            <div className="ans">{t('a3')}</div>
          </details>
        </div>
      </div>
    </section>
  );
}
