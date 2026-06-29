'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCountry } from '@/components/CountryProvider';
import BackButton from '@/components/BackButton';

interface DbFaq {
  id: string;
  question_en: string; question_my: string; question_ja: string;
  answer_en: string; answer_my: string; answer_ja: string;
}

const SG_FEES = [
  { test: 'Basic Theory Test (BTT)',   fee: '$6.50', gst: '$7.09',  note: 'Taken before practical lessons begin' },
  { test: 'Final Theory Test (FTT)',   fee: '$6.50', gst: '$7.09',  note: 'Taken after at least 5 practical lessons' },
  { test: 'Riding Theory Test (RTT)',  fee: '$6.50', gst: '$7.09',  note: 'For motorcycle licence (Class 2/2A/2B)' },
  { test: 'Class 3 Driving Test',      fee: '$33.00', gst: '$35.97', note: 'Traffic Police practical test — car' },
  { test: 'Class 3A Driving Test',     fee: '$33.00', gst: '$35.97', note: 'Auto-only car licence' },
  { test: 'Class 2/2A/2B Riding Test', fee: '$33.00', gst: '$35.97', note: 'Traffic Police practical test — motorcycle' },
];

const JP_FEES = [
  { test: '本免許学科試験',       fee: '¥1,750',            note: 'Written theory test at the licence centre' },
  { test: '本免許技能試験',       fee: '¥7,200',            note: 'Practical test at licence centre (指定校 graduates are exempt)' },
  { test: '仮免許試験（学科）',   fee: '¥1,700',            note: 'Provisional licence theory test' },
  { test: '仮免許試験（技能）',   fee: '¥2,850',            note: 'Provisional licence practical test' },
  { test: '指定校 full course',   fee: '¥250,000–¥400,000', note: 'Total cost varies by school and prefecture' },
];

const SG_FAQ = [
  {
    q: 'How many times can I retake the BTT/FTT/RTT?',
    a: 'There is no limit on retakes. You pay the fee each time and can rebook after 3 days.',
  },
  {
    q: 'Can I book the FTT before completing all practical lessons?',
    a: 'You must have completed at least 5 practical lessons (Class 3/3A) before booking the FTT.',
  },
  {
    q: 'How long is a Singapore licence valid?',
    a: 'A full Class 3/3A licence is valid for 10 years and can be renewed online via OneMotoring.',
  },
  {
    q: 'What happens if I accumulate 24 demerit points?',
    a: 'Your licence is suspended for 3 months. A new driver (within 1 year of passing) is suspended at 12 points.',
  },
  {
    q: 'Is there a minimum age to sit the BTT?',
    a: 'Yes — 17 years old for car licence (Class 3/3A) and 18 for motorcycle (Class 2/2A/2B).',
  },
  {
    q: 'Which driving centres are Traffic Police approved?',
    a: 'Three centres: BBDC (Bukit Batok), CDC (ComfortDelGro), and SSDC (Serangoon). All offer the same standard.',
  },
];

const JP_FAQ = [
  {
    q: '本免許学科試験に落ちたらどうなる？',
    a: '再受験できます。費用は毎回かかります。次の受験日は翌日以降に予約可能です。',
  },
  {
    q: '指定校を卒業すると技能試験は免除されますか？',
    a: 'はい。公安委員会指定の自動車教習所を卒業すると、免許センターでの技能試験が免除されます。学科試験のみ受験すれば取得できます。',
  },
  {
    q: '本免許の合格点は？',
    a: '95問中86問以上正解（90%）で合格です（二輪は同様）。',
  },
  {
    q: '日本の免許証の有効期間は？',
    a: '取得時の年齢や違反歴によって異なりますが、通常はゴールド免許で5年、一般免許で3年です。',
  },
  {
    q: '仮免許の有効期間は？',
    a: '6ヶ月間です。仮免取得後6ヶ月以内に路上教習・卒業試験を修了する必要があります。',
  },
];

export default function ResourceFaqPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const { country } = useCountry();
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
          <BackButton label="← Home" style={{ fontSize: '.82rem', color: 'var(--ink-soft)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
          <span style={{ color: 'var(--line)' }}>/</span>
          <span style={{ fontSize: '.82rem', color: 'var(--ink)' }}>FAQ & Fees</span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Study material</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, marginBottom: 12 }}>
            FAQ & Fees
          </h1>
          <p style={{ color: 'var(--ink-soft)', maxWidth: '38em', margin: '0 auto', fontSize: '1.05rem' }}>
            Official test fees, retake rules, and the questions new drivers ask most.
          </p>
        </div>

        {/* Singapore */}
        {country === 'sg' && (<div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <span style={{ fontSize: '1.4rem' }}>🇸🇬</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>Singapore</h2>
          </div>

          <h3 style={{ fontFamily: 'var(--display)', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 14 }}>
            Official Test Fees (includes 9% GST)
          </h3>
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden', marginBottom: 36 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--paint-2)', borderBottom: '1px solid var(--line)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase' }}>Test</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase' }}>Fee (before GST)</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase' }}>With 9% GST</th>
                </tr>
              </thead>
              <tbody>
                {SG_FEES.map((row, i) => (
                  <tr key={row.test} style={{ borderBottom: i < SG_FEES.length - 1 ? '1px solid var(--line)' : undefined }}>
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
            Fees are set by the Traffic Police and reviewed periodically. Course lesson fees vary by driving centre and are paid directly to BBDC, CDC, or SSDC.
          </p>

          <h3 style={{ fontFamily: 'var(--display)', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 14 }}>
            Common Questions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SG_FAQ.map(({ q, a }) => (
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
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>Japan</h2>
          </div>

          <h3 style={{ fontFamily: 'var(--display)', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 14 }}>
            Official Test Fees
          </h3>
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden', marginBottom: 36 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--paint-2)', borderBottom: '1px solid var(--line)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase' }}>Test</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase' }}>Fee</th>
                </tr>
              </thead>
              <tbody>
                {JP_FEES.map((row, i) => (
                  <tr key={row.test} style={{ borderBottom: i < JP_FEES.length - 1 ? '1px solid var(--line)' : undefined }}>
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
            Fees at the licence centre are set by prefecture and may vary slightly. 指定自動車教習所 course fees are paid directly to the school.
          </p>

          <h3 style={{ fontFamily: 'var(--display)', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 14 }}>
            よくある質問 — Common Questions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {JP_FAQ.map(({ q, a }) => (
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
          <BackButton label="← Back to home" style={{ color: 'var(--guide-deep)', fontWeight: 600, fontSize: '.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
        </div>
      </div>
    </div>
  );
}
