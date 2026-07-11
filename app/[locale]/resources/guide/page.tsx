'use client';

import type React from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCountry } from '@/components/CountryProvider';
import BackButton from '@/components/BackButton';

type StatItem = { label: string; value: string; sub?: string };

export default function GuidePage() {
  const params = useParams();
  const { country } = useCountry();
  const t = useTranslations('resourcesGuide');
  const noteLabel = t('note_label');

  const sgTestFormat = t.raw('sg.test_format.items') as StatItem[];
  const sgSpeedLimits = t.raw('sg.speed_limits.items') as StatItem[];
  const sgAlcoholLimits = t.raw('sg.alcohol_limits.items') as StatItem[];
  const sgDemeritPoints = t.raw('sg.demerit_points.items') as StatItem[];
  const sgStoppingHeaders = t.raw('sg.stopping_distances.headers') as string[];
  const sgStoppingRows = t.raw('sg.stopping_distances.rows') as string[][];
  const sgRightOfWay = t.raw('sg.right_of_way.items') as string[];
  const sgExpressway = t.raw('sg.expressway_tunnel.items') as string[];
  const sgCrossings = t.raw('sg.crossings_parking.items') as string[];
  const sgKeyRules = t.raw('sg.key_rules') as string[];

  const jpTestFormat = t.raw('jp.test_format.items') as StatItem[];
  const jpSpeedLimits = t.raw('jp.speed_limits.items') as StatItem[];
  const jpAlcoholLimits = t.raw('jp.alcohol_limits.items') as StatItem[];
  const jpDemeritPoints = t.raw('jp.demerit_points.items') as StatItem[];
  const jpStoppingHeaders = t.raw('jp.stopping_distances.headers') as string[];
  const jpStoppingRows = t.raw('jp.stopping_distances.rows') as string[][];
  const jpKeyRules = t.raw('jp.key_rules') as string[];

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

        {country === 'sg' && (
          <div style={{ marginBottom: 64 }}>
            <CountryHeading flag="🇸🇬" title={t('sg.title')} />

            <Section title={t('sg.test_format.title')}>
              <StatGrid items={sgTestFormat} />
            </Section>

            <Section title={t('sg.speed_limits.title')}>
              <StatGrid items={sgSpeedLimits} />
            </Section>

            <Section title={t('sg.alcohol_limits.title')}>
              <StatGrid items={sgAlcoholLimits} />
              <Note label={noteLabel}>{t('sg.alcohol_limits.note')}</Note>
            </Section>

            <Section title={t('sg.demerit_points.title')}>
              <StatGrid items={sgDemeritPoints} />
              <Note label={noteLabel}>{t('sg.demerit_points.note')}</Note>
            </Section>

            <Section title={t('sg.stopping_distances.title')}>
              <StoppingTable headers={sgStoppingHeaders} rows={sgStoppingRows} />
              <Note label={noteLabel}>{t('sg.stopping_distances.note')}</Note>
            </Section>

            <Section title={t('sg.right_of_way.title')}>
              <BulletList items={sgRightOfWay} />
            </Section>

            <Section title={t('sg.expressway_tunnel.title')}>
              <BulletList items={sgExpressway} />
              <Note label={noteLabel}>{t('sg.expressway_tunnel.note')}</Note>
            </Section>

            <Section title={t('sg.crossings_parking.title')}>
              <BulletList items={sgCrossings} />
            </Section>

            <Section title={t('sg.key_rules_title')}>
              <BulletList items={sgKeyRules} />
            </Section>
          </div>
        )}

        {country === 'jp' && (
          <div>
            <CountryHeading flag="🇯🇵" title={t('jp.title')} />

            <Section title={t('jp.test_format.title')}>
              <StatGrid items={jpTestFormat} />
            </Section>

            <Section title={t('jp.speed_limits.title')}>
              <StatGrid items={jpSpeedLimits} />
            </Section>

            <Section title={t('jp.alcohol_limits.title')}>
              <StatGrid items={jpAlcoholLimits} />
              <Note label={noteLabel}>{t('jp.alcohol_limits.note')}</Note>
            </Section>

            <Section title={t('jp.demerit_points.title')}>
              <StatGrid items={jpDemeritPoints} />
              <Note label={noteLabel}>{t('jp.demerit_points.note')}</Note>
            </Section>

            <Section title={t('jp.stopping_distances.title')}>
              <StoppingTable headers={jpStoppingHeaders} rows={jpStoppingRows} />
              <Note label={noteLabel}>{t('jp.stopping_distances.note')}</Note>
            </Section>

            <Section title={t('jp.key_rules_title')}>
              <BulletList items={jpKeyRules} />
            </Section>
          </div>
        )}

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <BackButton label={t('back_home')} style={{ color: 'var(--guide-deep)', fontWeight: 600, fontSize: '.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
        </div>
      </div>
    </div>
  );
}

function CountryHeading({ flag, title }: { flag: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
      <span style={{ fontSize: '1.4rem' }}>{flag}</span>
      <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>{title}</h2>
    </div>
  );
}

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

function StatGrid({ items }: { items: StatItem[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 12 }}>
      {items.map(({ label, value, sub }) => (
        <div key={label} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '18px 16px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--guide-deep)', lineHeight: 1, marginBottom: 6 }}>{value}</div>
          <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.82rem', marginBottom: 4 }}>{label}</div>
          {sub && <div style={{ fontSize: '.75rem', color: 'var(--ink-soft)' }}>{sub}</div>}
        </div>
      ))}
    </div>
  );
}

function StoppingTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
        <thead>
          <tr style={{ background: 'var(--paint-2)', borderBottom: '1px solid var(--line)' }}>
            {headers.map(h => (
              <th key={h} style={{ padding: '10px 16px', textAlign: 'center', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([speed, think, brake, total], i, arr) => (
            <tr key={speed} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : undefined, textAlign: 'center' }}>
              <td style={{ padding: '10px 16px', fontFamily: 'var(--display)', fontWeight: 700 }}>{speed}</td>
              <td style={{ padding: '10px 16px', color: 'var(--ink-soft)' }}>{think}</td>
              <td style={{ padding: '10px 16px', color: 'var(--ink-soft)' }}>{brake}</td>
              <td style={{ padding: '10px 16px', fontFamily: 'var(--display)', fontWeight: 700, color: 'var(--guide-deep)' }}>{total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 0, listStyle: 'none' }}>
      {items.map(item => (
        <li key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#fff', border: '1px solid var(--line)', borderRadius: 10, padding: '12px 16px', fontSize: '.9rem', color: 'var(--ink-soft)' }}>
          <span style={{ color: 'var(--guide)', fontWeight: 700, flexShrink: 0 }}>✓</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function Note({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div style={{ background: 'var(--paint-2)', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 14px', fontSize: '.82rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 12 }}>
      <strong>{label}</strong> {children}
    </div>
  );
}
