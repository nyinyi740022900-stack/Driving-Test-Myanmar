'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useCountry } from '@/components/CountryProvider';
import BackButton from '@/components/BackButton';

interface DbFaq {
  id: string;
  question_en: string; question_my: string; question_ja: string;
  answer_en: string; answer_my: string; answer_ja: string;
}



export default function ResourceFaqPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const { country } = useCountry();
  const t = useTranslations('resourcesFaq');
  const sgFees = t.raw('sg_fees') as { test: string; fee: string; gst?: string; note: string }[];
  const jpFees = t.raw('jp_fees') as { test: string; fee: string; note: string }[];
  const sgFaq = t.raw('sg_faq') as { q: string; a: string }[];
  const jpFaq = t.raw('jp_faq') as { q: string; a: string }[];
  const [dbFaqs, setDbFaqs] = useState<DbFaq[]>([]);

  useEffect(() => {
    fetch(`/api/faqs?country=${country}`)
      .then(r => r.json())
      .then(data => setDbFaqs(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [country]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paint)', paddingBottom: 80 }}>
      <div style={{ background: 'var(--paint-2)', borderBottom: '1px solid var(--line)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <BackButton label={t('breadcrumb_home')} style={{ fontSize: '.82rem', color: 'var(--ink-soft)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
          <span style={{ color: 'var(--line)' }}>/</span>
          <span style={{ fontSize: '.82rem', color: 'var(--ink)' }}>{t('breadcrumb_title')}</span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>{t('hero.eyebrow')}</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, marginBottom: 12 }}>
            {t('hero.title')}
          </h1>
          <p style={{ color: 'var(--ink-soft)', maxWidth: '38em', margin: '0 auto', fontSize: '1.05rem' }}>
            {t('hero.lead')}
          </p>
        </div>

        {/* Singapore */}
        {country === 'sg' && (<div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <span style={{ fontSize: '1.4rem' }}>🇸🇬</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>{t('sg_title')}</h2>
          </div>

          <h3 style={{ fontFamily: 'var(--display)', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 14 }}>
            {t('sg_fees_title')}
          </h3>
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden', marginBottom: 36 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--paint-2)', borderBottom: '1px solid var(--line)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase' }}>{t('sg_table.test')}</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase' }}>{t('sg_table.fee')}</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase' }}>{t('sg_table.gst')}</th>
                </tr>
              </thead>
              <tbody>
                {sgFees.map((row, i) => (
                  <tr key={row.test} style={{ borderBottom: i < sgFees.length - 1 ? '1px solid var(--line)' : undefined }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>{row.test}</div>
                      <div style={{ fontSize: '.78rem', color: 'var(--ink-soft)' }}>{row.note}</div>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--ink-soft)' }}>{row.fee}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--display)', fontWeight: 700, color: 'var(--guide-deep)' }}>{row.gst}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '.82rem', color: 'var(--ink-soft)', marginBottom: 36 }}>
            {t('sg_fees_note')}
          </p>

          <h3 style={{ fontFamily: 'var(--display)', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 14 }}>
            {t('sg_questions_title')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sgFaq.map(({ q, a }) => (
              <details key={q} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '16px 20px' }}>
                <summary style={{ fontFamily: 'var(--display)', fontWeight: 700, cursor: 'pointer', fontSize: '.95rem', lineHeight: 1.4 }}>{q}</summary>
                <div style={{ marginTop: 10, fontSize: '.9rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{a}</div>
              </details>
            ))}
            {dbFaqs.map(f => {
              const q = (locale === 'my' ? f.question_my : locale === 'ja' ? f.question_ja : f.question_en) || f.question_en;
              const a = (locale === 'my' ? f.answer_my : locale === 'ja' ? f.answer_ja : f.answer_en) || f.answer_en;
              if (!q) return null;
              return (
                <details key={f.id} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '16px 20px' }}>
                  <summary style={{ fontFamily: 'var(--display)', fontWeight: 700, cursor: 'pointer', fontSize: '.95rem', lineHeight: 1.4 }}>{q}</summary>
                  <div style={{ marginTop: 10, fontSize: '.9rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{a}</div>
                </details>
              );
            })}
          </div>
        </div>)}

        {/* Japan */}
        {country === 'jp' && (<div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <span style={{ fontSize: '1.4rem' }}>🇯🇵</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>{t('jp_title')}</h2>
          </div>

          <h3 style={{ fontFamily: 'var(--display)', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 14 }}>
            {t('jp_fees_title')}
          </h3>
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden', marginBottom: 36 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--paint-2)', borderBottom: '1px solid var(--line)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase' }}>{t('jp_table.test')}</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase' }}>{t('jp_table.fee')}</th>
                </tr>
              </thead>
              <tbody>
                {jpFees.map((row, i) => (
                  <tr key={row.test} style={{ borderBottom: i < jpFees.length - 1 ? '1px solid var(--line)' : undefined }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>{row.test}</div>
                      <div style={{ fontSize: '.78rem', color: 'var(--ink-soft)' }}>{row.note}</div>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--display)', fontWeight: 700, color: 'var(--guide-deep)', whiteSpace: 'nowrap' }}>{row.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '.82rem', color: 'var(--ink-soft)', marginBottom: 36 }}>
            {t('jp_fees_note')}
          </p>

          <h3 style={{ fontFamily: 'var(--display)', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 14 }}>
            {t('jp_questions_title')}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {jpFaq.map(({ q, a }) => (
              <details key={q} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '16px 20px' }}>
                <summary style={{ fontFamily: 'var(--display)', fontWeight: 700, cursor: 'pointer', fontSize: '.95rem', lineHeight: 1.4 }}>{q}</summary>
                <div style={{ marginTop: 10, fontSize: '.9rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{a}</div>
              </details>
            ))}
            {dbFaqs.map(f => {
              const q = (locale === 'my' ? f.question_my : locale === 'ja' ? f.question_ja : f.question_en) || f.question_en;
              const a = (locale === 'my' ? f.answer_my : locale === 'ja' ? f.answer_ja : f.answer_en) || f.answer_en;
              if (!q) return null;
              return (
                <details key={f.id} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '16px 20px' }}>
                  <summary style={{ fontFamily: 'var(--display)', fontWeight: 700, cursor: 'pointer', fontSize: '.95rem', lineHeight: 1.4 }}>{q}</summary>
                  <div style={{ marginTop: 10, fontSize: '.9rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{a}</div>
                </details>
              );
            })}
          </div>
        </div>)}

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <BackButton label={t('back_home')} style={{ color: 'var(--guide-deep)', fontWeight: 600, fontSize: '.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
        </div>
      </div>
    </div>
  );
}
