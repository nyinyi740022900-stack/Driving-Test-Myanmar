'use client';

import { useTranslations } from 'next-intl';
import { useCountry } from '@/components/CountryProvider';
import BackButton from '@/components/BackButton';

export default function CostsPage() {
  const { country } = useCountry();
  const t = useTranslations('resourcesCosts');
  const tableHeaders = t.raw('table_headers') as { item: string; fee: string; notes: string };
  const noteLabel = t('note_label');
  const sgTheoryRows = t.raw('sg.theory_rows') as { item: string; fee: string; note: string }[];
  const sgTpRows = t.raw('sg.tp_rows') as { item: string; fee: string; note: string }[];
  const sgLessonCentres = t.raw('sg.lesson_centres') as { centre: string; area: string; car: string; moto: string }[];
  const sgTotalRows = t.raw('sg.total_rows') as { item: string; fast: string; avg: string; slow: string; note?: string }[];
  const sgMotoRows = t.raw('sg.moto_rows') as { item: string; fee: string; note: string }[];
  const jpFeeRows = t.raw('jp.fee_rows') as { item: string; fee: string; note: string }[];
  const jpPathARows = t.raw('jp.path_a.rows') as { label: string; value: string; bold?: boolean }[];
  const jpPathBRows = t.raw('jp.path_b.rows') as { label: string; value: string; bold?: boolean }[];
  const jpMyanmarRows = t.raw('jp.myanmar_rows') as { label: string; value: string }[];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paint)', paddingBottom: 80 }}>
      {/* Breadcrumb */}
      <div style={{ background: 'var(--paint-2)', borderBottom: '1px solid var(--line)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <BackButton label={t('breadcrumb_home')} style={{ fontSize: '.82rem', color: 'var(--ink-soft)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
          <span style={{ color: 'var(--line)' }}>/</span>
          <span style={{ fontSize: '.82rem', color: 'var(--ink)' }}>{t('breadcrumb_title')}</span>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>
        {/* Hero */}
        <div style={{ marginBottom: 56, textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>{t('hero.eyebrow')}</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, marginBottom: 14 }}>
            {t('hero.title')}
          </h1>
          <p style={{ color: 'var(--ink-soft)', maxWidth: '42em', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
            {t('hero.lead')}
          </p>
        </div>

        {/* ──────── SINGAPORE ──────── */}
        {country === 'sg' && (<div style={{ marginBottom: 72 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <span style={{ fontSize: '1.4rem' }}>🇸🇬</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>{t('sg_title')}</h2>
          </div>

          {/* Theory test fees */}
          <Section title={t('sg.theory_title')}>
            <FeeTable rows={sgTheoryRows} headers={tableHeaders} />
            <Note label={noteLabel}>{t('sg.theory_note')}</Note>
          </Section>

          {/* TP Practical test fees */}
          <Section title={t('sg.tp_title')}>
            <FeeTable rows={sgTpRows} headers={tableHeaders} />
          </Section>

          {/* Lesson fees */}
          <Section title={t('sg.lesson_title')}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
              {sgLessonCentres.map(c => (
                <div key={c.centre} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '18px 16px' }}>
                  <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--guide-deep)', marginBottom: 4 }}>{c.centre}</div>
                  <div style={{ fontSize: '.78rem', color: 'var(--ink-soft)', marginBottom: 12 }}>{c.area}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem' }}>
                      <span style={{ color: 'var(--ink-soft)' }}>{t('sg.lesson_label_car')}</span>
                      <span style={{ fontFamily: 'var(--display)', fontWeight: 700 }}>{c.car}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem' }}>
                      <span style={{ color: 'var(--ink-soft)' }}>{t('sg.lesson_label_moto')}</span>
                      <span style={{ fontFamily: 'var(--display)', fontWeight: 700 }}>{c.moto}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Note label={noteLabel}>{t('sg.lesson_note')}</Note>
          </Section>

          {/* Total estimate */}
          <Section title={t('sg.total_car_title')}>
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem' }}>
                <thead>
                  <tr style={{ background: 'var(--paint)', borderBottom: '1px solid var(--line)' }}>
                    <th style={thStyle}>{t('sg.total_headers.item')}</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>{t('sg.total_headers.fast')}</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>{t('sg.total_headers.avg')}</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>{t('sg.total_headers.slow')}</th>
                  </tr>
                </thead>
                <tbody>
                  {sgTotalRows.map((r, i, arr) => (
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
                    <td style={{ padding: '14px 16px', fontFamily: 'var(--display)', fontWeight: 800 }}>{t('sg.total_footer')}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontFamily: 'var(--display)', fontWeight: 800, color: 'var(--guide-deep)' }}>~S$700</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontFamily: 'var(--display)', fontWeight: 800, color: 'var(--guide-deep)' }}>~S$1,143</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontFamily: 'var(--display)', fontWeight: 800, color: 'var(--guide-deep)' }}>~S$1,686</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Note label={noteLabel}>{t('sg.total_note')}</Note>
          </Section>

          {/* Class 2B estimate */}
          <Section title={t('sg.total_moto_title')}>
            <FeeTable rows={sgMotoRows} highlight={t('sg.moto_highlight')} headers={tableHeaders} />
          </Section>
        </div>)}

        {/* ──────── JAPAN ──────── */}
        {country === 'jp' && (<div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <span style={{ fontSize: '1.4rem' }}>🇯🇵</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>{t('jp_title')}</h2>
          </div>

          {/* Official test fees */}
          <Section title={t('jp.fees_title')}>
            <FeeTable rows={jpFeeRows} headers={tableHeaders} />
            <Note label={noteLabel}>{t('jp.fees_note')}</Note>
          </Section>

          {/* Paths */}
          <Section title={t('jp.paths_title')}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              <PathCard
                label={t('jp.path_a.label')}
                title={t('jp.path_a.title')}
                badge={t('jp.path_a.badge')}
                badgeColor="var(--guide)"
                rows={jpPathARows}
                note={t('jp.path_a.note')}
              />
              <PathCard
                label={t('jp.path_b.label')}
                title={t('jp.path_b.title')}
                badge={t('jp.path_b.badge')}
                badgeColor="var(--asphalt)"
                rows={jpPathBRows}
                note={t('jp.path_b.note')}
              />
            </div>
          </Section>

          {/* Myanmar specific */}
          <Section title={t('jp.myanmar_title')}>
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '22px 24px' }}>
              <p style={{ fontSize: '.9rem', color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 16 }}>
                {t('jp.myanmar_intro')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {jpMyanmarRows.map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 10, fontSize: '.9rem' }}>
                    <span style={{ color: 'var(--ink-soft)' }}>{r.label}</span>
                    <span style={{ fontFamily: 'var(--display)', fontWeight: 700 }}>{r.value}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4, fontSize: '1rem' }}>
                  <span style={{ fontFamily: 'var(--display)', fontWeight: 800 }}>{t('jp.myanmar_total')}</span>
                  <span style={{ fontFamily: 'var(--display)', fontWeight: 800, color: '#e63329' }}>~¥255,000–¥405,000</span>
                </div>
              </div>
              <p style={{ fontSize: '.8rem', color: 'var(--ink-soft)', marginTop: 16, lineHeight: 1.6 }}>
                {t('jp.myanmar_tip')}
              </p>
            </div>
          </Section>
        </div>)}

        <div style={{ background: 'var(--paint-2)', border: '1px solid var(--line)', borderRadius: 12, padding: '14px 18px', marginTop: 32, fontSize: '.8rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          <strong>{t('disclaimer_label')}</strong> {t('disclaimer_text')}
        </div>

        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <BackButton label={t('back_home')} style={{ color: 'var(--guide-deep)', fontWeight: 600, fontSize: '.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
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

function FeeTable({ rows, highlight, headers }: { rows: { item: string; fee: string; note: string }[]; highlight?: string; headers: { item: string; fee: string; notes: string } }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden', marginBottom: 12 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem' }}>
        <thead>
          <tr style={{ background: 'var(--paint)', borderBottom: '1px solid var(--line)' }}>
            <th style={thStyle}>{headers.item}</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>{headers.fee}</th>
            <th style={{ ...thStyle }}>{headers.notes}</th>
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

function Note({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div style={{ background: 'var(--paint-2)', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 14px', fontSize: '.82rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 4 }}>
      <strong>{label}</strong> {children}
    </div>
  );
}

import type React from 'react';
