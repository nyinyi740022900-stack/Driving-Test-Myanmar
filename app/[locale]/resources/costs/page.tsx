'use client';

import { useParams } from 'next/navigation';
import { useCountry } from '@/components/CountryProvider';
import BackButton from '@/components/BackButton';

export default function CostsPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const { country } = useCountry();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paint)', paddingBottom: 80 }}>
      {/* Breadcrumb */}
      <div style={{ background: 'var(--paint-2)', borderBottom: '1px solid var(--line)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <BackButton label="← Home" style={{ fontSize: '.82rem', color: 'var(--ink-soft)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
          <span style={{ color: 'var(--line)' }}>/</span>
          <span style={{ fontSize: '.82rem', color: 'var(--ink)' }}>Costs & Fees</span>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>
        {/* Hero */}
        <div style={{ marginBottom: 56, textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Licence guide</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, marginBottom: 14 }}>
            Costs & Fees
          </h1>
          <p style={{ color: 'var(--ink-soft)', maxWidth: '42em', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Full breakdown of every test fee, lesson cost, and total budget you need to get your licence in Singapore or Japan.
          </p>
        </div>

        {/* ──────── SINGAPORE ──────── */}
        {country === 'sg' && (<div style={{ marginBottom: 72 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <span style={{ fontSize: '1.4rem' }}>🇸🇬</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>Singapore</h2>
          </div>

          {/* Theory test fees */}
          <Section title="Theory Test Fees (Traffic Police)">
            <FeeTable rows={[
              { item: 'Basic Theory Test (BTT)', fee: 'S$7.09', note: 'Includes 9% GST. Payable at OneMotoring.' },
              { item: 'Final Theory Test (FTT)', fee: 'S$7.09', note: 'Can only book after ≥ 5 practical lessons.' },
              { item: 'Riding Theory Test (RTT) — motorcycle', fee: 'S$7.09', note: 'Replaces FTT for motorcycle classes.' },
              { item: 'Re-test (any theory)', fee: 'S$7.09', note: 'Same fee for each attempt.' },
            ]} />
            <Note>Theory test fees are set by the Traffic Police and do not vary between BBDC, CDC or SSDC.</Note>
          </Section>

          {/* TP Practical test fees */}
          <Section title="Traffic Police (TP) Practical Test Fees">
            <FeeTable rows={[
              { item: 'Class 3 / 3A (car) — first attempt', fee: 'S$35.97', note: 'Includes GST.' },
              { item: 'Class 3 / 3A — re-test', fee: 'S$35.97', note: 'Re-test booked through your centre.' },
              { item: 'Class 2B / 2A / 2 (motorcycle)', fee: '~S$33.00', note: 'Check current rate at your centre.' },
              { item: 'Class 4 / 5 (goods / bus)', fee: '~S$40–S$55', note: 'Varies by vehicle class.' },
            ]} />
          </Section>

          {/* Lesson fees */}
          <Section title="Practical Lesson Fees (per lesson, approx. 2025)">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
              {[
                { centre: 'BBDC', area: 'Bukit Batok', car: 'S$26–S$34', moto: 'S$19–S$26' },
                { centre: 'CDC', area: 'Ubi', car: 'S$27–S$35', moto: 'S$20–S$27' },
                { centre: 'SSDC', area: 'Serangoon', car: 'S$25–S$33', moto: 'S$18–S$25' },
              ].map(c => (
                <div key={c.centre} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '18px 16px' }}>
                  <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--guide-deep)', marginBottom: 4 }}>{c.centre}</div>
                  <div style={{ fontSize: '.78rem', color: 'var(--ink-soft)', marginBottom: 12 }}>{c.area}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem' }}>
                      <span style={{ color: 'var(--ink-soft)' }}>Car (Class 3/3A)</span>
                      <span style={{ fontFamily: 'var(--display)', fontWeight: 700 }}>{c.car}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem' }}>
                      <span style={{ color: 'var(--ink-soft)' }}>Motorcycle</span>
                      <span style={{ fontFamily: 'var(--display)', fontWeight: 700 }}>{c.moto}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Note>Lesson fees increase slightly during peak hours (evenings, weekends). Book off-peak to save. Prices include GST and are approximate for 2025 — check each centre's website for current rates.</Note>
          </Section>

          {/* Total estimate */}
          <Section title="Total Cost Estimate — Class 3 (Car)">
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem' }}>
                <thead>
                  <tr style={{ background: 'var(--paint)', borderBottom: '1px solid var(--line)' }}>
                    <th style={thStyle}>Item</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Fast learner</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Average</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>More lessons</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { item: 'BTT + FTT fees', fast: 'S$14.18', avg: 'S$21.27', slow: 'S$28.36', note: '(assume 1–2 re-tests)' },
                    { item: 'Practical lessons (×lessons)', fast: 'S$600', avg: 'S$1,000', slow: 'S$1,500', note: '20 / 35 / 50 lessons' },
                    { item: 'TP test (1–2 attempts)', fast: 'S$36', avg: 'S$72', slow: 'S$108', note: '' },
                    { item: 'Licence collection fee', fast: 'S$50', avg: 'S$50', slow: 'S$50', note: 'Approx.' },
                  ].map((r, i, arr) => (
                    <tr key={r.item} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : undefined }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600 }}>{r.item}</div>
                        {r.note && <div style={{ fontSize: '.75rem', color: 'var(--ink-soft)' }}>{r.note}</div>}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--ink-soft)' }}>{r.fast}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--ink-soft)' }}>{r.avg}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--ink-soft)' }}>{r.slow}</td>
                    </tr>
                  ))}
                  <tr style={{ background: 'var(--paint)', borderTop: '2px solid var(--line)' }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: 800 }}>TOTAL (approx.)</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontFamily: 'var(--display)', fontWeight: 800, color: 'var(--guide-deep)' }}>~S$700</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontFamily: 'var(--display)', fontWeight: 800, color: 'var(--guide-deep)' }}>~S$1,143</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontFamily: 'var(--display)', fontWeight: 800, color: 'var(--guide-deep)' }}>~S$1,686</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Note>These are estimates only. Registration fees at each centre and admin charges are not included. Check the BBDC, CDC, or SSDC website for the latest lesson packages which may include bundled discounts.</Note>
          </Section>

          {/* Class 2B estimate */}
          <Section title="Total Cost Estimate — Class 2B (Entry Motorcycle)">
            <FeeTable rows={[
              { item: 'BTT + RTT fees (1 attempt each)', fee: 'S$14.18', note: '' },
              { item: 'Practical lessons (~15–25 lessons)', fee: 'S$285–S$675', note: 'At S$19–S$27/lesson' },
              { item: 'TP test (1–2 attempts)', fee: 'S$33–S$66', note: '' },
              { item: 'Helmet (if not owned)', fee: 'S$80–S$250', note: 'Approved helmet required for test and road' },
              { item: 'Total estimate', fee: 'S$400–S$1,000', note: 'Varies significantly by ability and centre' },
            ]} highlight="Total estimate" />
          </Section>
        </div>)}

        {/* ──────── JAPAN ──────── */}
        {country === 'jp' && (<div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <span style={{ fontSize: '1.4rem' }}>🇯🇵</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>Japan</h2>
          </div>

          {/* Official test fees */}
          <Section title="Official Test & Licence Fees (免許センター)">
            <FeeTable rows={[
              { item: '仮免許学科試験 (Provisional theory test)', fee: '¥1,700', note: 'At the 免許センター / licence centre' },
              { item: '仮免許技能試験 (Provisional skill test)', fee: '¥1,700', note: 'Per attempt. Re-test fee is same.' },
              { item: '本免許学科試験 (Final theory test)', fee: '¥1,750', note: '95 questions, 90% pass mark' },
              { item: '本免許技能試験 (Final skill test)', fee: '¥1,750', note: 'Only if going 一発試験 (centre-direct)' },
              { item: '免許証交付 (Licence issue fee)', fee: '¥2,050', note: 'Payable at the licence centre on passing' },
              { item: 'JAF translation (required for foreign holders)', fee: '¥3,000', note: 'Japan Automobile Federation certified translation' },
            ]} />
            <Note>Fees are set nationally and do not vary between prefectures. Additional costs (photo, 住民票 certificate) are typically ¥300–¥600 each.</Note>
          </Section>

          {/* Paths */}
          <Section title="Two Paths to a Japanese Licence">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              <PathCard
                label="Path A"
                title="指定教習所 (Driving School)"
                badge="Most reliable"
                badgeColor="var(--guide)"
                rows={[
                  { label: 'Tuition (Stage 1 + Stage 2)', value: '¥250,000–¥400,000' },
                  { label: '仮免 + school tests (included)', value: '—' },
                  { label: '本免学科試験 at licence centre', value: '¥1,750' },
                  { label: 'Licence issue fee', value: '¥2,050' },
                  { label: 'Total estimate', value: '¥254,000–¥404,000', bold: true },
                ]}
                note="Passing the 卒業検定 exempts you from the 免許センター skill test. You only face the written theory test."
              />
              <PathCard
                label="Path B"
                title="一発試験 (Licence Centre Direct)"
                badge="Cheaper but harder"
                badgeColor="var(--asphalt)"
                rows={[
                  { label: 'JAF translation (if needed)', value: '¥3,000' },
                  { label: '仮免 tests (multiple attempts typical)', value: '¥5,000–¥15,000' },
                  { label: '本免 skill tests (multiple attempts)', value: '¥3,000–¥10,500' },
                  { label: '本免学科試験', value: '¥1,750' },
                  { label: 'Licence issue fee', value: '¥2,050' },
                  { label: 'Total estimate', value: '¥15,000–¥32,000', bold: true },
                ]}
                note="The skill test at the licence centre is notoriously difficult without school training. Most people need several attempts."
              />
            </div>
          </Section>

          {/* Myanmar specific */}
          <Section title="Myanmar Nationals — Recommended Budget 🇲🇲">
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '22px 24px' }}>
              <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 16 }}>
                Because Myanmar has no reciprocal licence agreement with Japan, you <strong>cannot</strong> convert directly. You must either attend a driving school or attempt the 一発試験. The recommended path for most people is <strong>Path A (指定教習所)</strong>:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: '指定教習所 full course', value: '¥250,000–¥400,000' },
                  { label: '本免学科試験 (theory at licence centre)', value: '¥1,750' },
                  { label: '免許証交付 (licence fee)', value: '¥2,050' },
                  { label: '住民票 + photos + misc.', value: '~¥1,500' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 10, fontSize: '.9rem' }}>
                    <span style={{ color: 'var(--ink-soft)' }}>{r.label}</span>
                    <span style={{ fontFamily: 'var(--display)', fontWeight: 700 }}>{r.value}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4, fontSize: '1rem' }}>
                  <span style={{ fontFamily: 'var(--display)', fontWeight: 800 }}>Total</span>
                  <span style={{ fontFamily: 'var(--display)', fontWeight: 800, color: '#e63329' }}>~¥255,000–¥405,000</span>
                </div>
              </div>
              <p style={{ fontSize: '.8rem', color: 'var(--ink-soft)', marginTop: 16, lineHeight: 1.6 }}>
                Tip: Some schools offer discount packages for foreign nationals or have staff who speak English. Ask when enrolling. The 本免学科試験 (which this app helps you prepare for) is taken at the end — after completing school.
              </p>
            </div>
          </Section>
        </div>)}

        <div style={{ background: 'var(--paint-2)', border: '1px solid var(--line)', borderRadius: 12, padding: '14px 18px', marginTop: 32, fontSize: '.8rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          <strong>Disclaimer:</strong> All fees are approximate and may change. Singapore fees include GST as of 2025. Japan fees are as published by the 警察庁. Always verify with the relevant authority (Traffic Police / OneMotoring for SG; your prefecture&apos;s 免許センター for JP) before budgeting.
        </div>

        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <BackButton label="← Back to home" style={{ color: 'var(--guide-deep)', fontWeight: 600, fontSize: '.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
        </div>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '12px 16px',
  textAlign: 'left',
  fontFamily: 'var(--display)',
  fontWeight: 700,
  fontSize: '.75rem',
  letterSpacing: '.07em',
  textTransform: 'uppercase',
  color: 'var(--ink-soft)',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h3 style={{ fontFamily: 'var(--display)', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 14, borderBottom: '1px solid var(--line)', paddingBottom: 8 }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function FeeTable({ rows, highlight }: { rows: { item: string; fee: string; note: string }[]; highlight?: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden', marginBottom: 12 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem' }}>
        <thead>
          <tr style={{ background: 'var(--paint)', borderBottom: '1px solid var(--line)' }}>
            <th style={thStyle}>Item</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Fee</th>
            <th style={{ ...thStyle }}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i, arr) => {
            const isHighlight = r.item === highlight;
            return (
              <tr key={r.item} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : undefined, background: isHighlight ? 'var(--paint)' : undefined }}>
                <td style={{ padding: '12px 16px', fontFamily: isHighlight ? 'var(--display)' : undefined, fontWeight: isHighlight ? 800 : undefined }}>{r.item}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--display)', fontWeight: isHighlight ? 800 : 600, color: isHighlight ? 'var(--guide-deep)' : undefined, whiteSpace: 'nowrap' }}>{r.fee}</td>
                <td style={{ padding: '12px 16px', color: 'var(--ink-soft)', fontSize: '.82rem' }}>{r.note}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PathCard({ label, title, badge, badgeColor, rows, note }: {
  label: string;
  title: string;
  badge: string;
  badgeColor: string;
  rows: { label: string; value: string; bold?: boolean }[];
  note: string;
}) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '20px 20px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '.78rem', letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>{label}</span>
        <span style={{ fontSize: '.7rem', fontFamily: 'var(--display)', fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: `${badgeColor}18`, color: badgeColor }}>{badge}</span>
      </div>
      <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '.95rem', marginBottom: 16 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {rows.map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderBottom: r.bold ? '1px solid var(--line)' : undefined, paddingBottom: r.bold ? 8 : undefined, paddingTop: r.bold ? 8 : undefined }}>
            <span style={{ fontSize: '.82rem', color: 'var(--ink-soft)', flexShrink: 1 }}>{r.label}</span>
            <span style={{ fontFamily: 'var(--display)', fontWeight: r.bold ? 800 : 600, fontSize: r.bold ? '.9rem' : '.82rem', color: r.bold ? '#e63329' : undefined, flexShrink: 0 }}>{r.value}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '.78rem', color: 'var(--ink-soft)', lineHeight: 1.55, background: 'var(--paint)', padding: '10px 12px', borderRadius: 8 }}>{note}</div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--paint-2)', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 14px', fontSize: '.82rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 4 }}>
      <strong>Note:</strong> {children}
    </div>
  );
}

import type React from 'react';
