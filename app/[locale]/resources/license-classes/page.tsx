'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCountry } from '@/components/CountryProvider';
import BackButton from '@/components/BackButton';

type ClassInfo = {
  code: string;
  name: string;
  vehicle: string;
  limit: string;
  age: string;
  note?: string;
  highlight?: boolean;
};

const SG_CLASSES: ClassInfo[] = [
  {
    code: '3',
    name: 'Car — Manual',
    vehicle: 'Saloon, MPV, SUV (manual gearbox)',
    limit: 'Max 3,000 kg GVW · max 7 passengers',
    age: 'Min. 18 years',
    note: 'Most common licence. Requires BTT + FTT + TP test.',
    highlight: true,
  },
  {
    code: '3A',
    name: 'Car — Automatic',
    vehicle: 'Saloon, MPV, SUV (auto only)',
    limit: 'Max 3,000 kg GVW · max 7 passengers',
    age: 'Min. 18 years',
    note: 'Restricted to automatic vehicles only. Cannot drive manual cars.',
    highlight: true,
  },
  {
    code: '2B',
    name: 'Motorcycle — Entry',
    vehicle: 'Motorcycle / scooter',
    limit: '≤ 200 cc or ≤ 30 kW power output',
    age: 'Min. 18 years',
    note: 'Entry-level motorcycle licence. Requires BTT + RTT + TP test.',
    highlight: true,
  },
  {
    code: '2A',
    name: 'Motorcycle — Mid',
    vehicle: 'Motorcycle / scooter',
    limit: '201–400 cc or 26–47 kW',
    age: 'Min. 18 years',
    note: 'Must hold Class 2B for at least 1 year before upgrading.',
  },
  {
    code: '2',
    name: 'Motorcycle — Full',
    vehicle: 'Motorcycle, any engine size',
    limit: 'Unlimited engine size / power',
    age: 'Min. 18 years',
    note: 'Must hold Class 2A for at least 1 year. Covers all motorcycles.',
  },
  {
    code: '4',
    name: 'Light Goods Vehicle',
    vehicle: 'Panel van, light truck',
    limit: '3,001 – 5,000 kg GVW',
    age: 'Min. 18 years',
    note: 'Separate practical test required.',
  },
  {
    code: '4A',
    name: 'Light Goods — Articulated',
    vehicle: 'Articulated light goods',
    limit: '3,001 – 5,000 kg GVW',
    age: 'Min. 21 years',
    note: 'Requires Class 3 or 4 first.',
  },
  {
    code: '5',
    name: 'Bus',
    vehicle: 'All passenger buses',
    limit: '> 7 passengers or > 3,000 kg',
    age: 'Min. 21 years',
    note: 'Requires separate bus-specific training and test.',
  },
];

const JP_CLASSES: ClassInfo[] = [
  {
    code: '普通免許',
    name: 'Regular Car',
    vehicle: '普通自動車 — standard car / MPV',
    limit: '≤ 3,500 kg · ≤ 10 passengers · trailer ≤ 750 kg',
    age: 'Min. 18 years',
    note: 'The standard licence obtained at a 指定教習所. Covers most everyday cars.',
    highlight: true,
  },
  {
    code: '準中型免許',
    name: 'Semi-medium Truck',
    vehicle: '準中型自動車 — light-to-medium truck',
    limit: '≤ 7,500 kg · ≤ 4 passengers',
    age: 'Min. 18 years',
    note: 'Introduced in 2017. Allows driving delivery trucks from age 18 without waiting.',
  },
  {
    code: '中型免許',
    name: 'Medium Truck',
    vehicle: '中型自動車 — medium truck / bus',
    limit: '≤ 11,000 kg · ≤ 29 passengers',
    age: 'Min. 20 years · held licence ≥ 2 years',
    note: 'Needed for larger delivery vehicles, minibuses.',
  },
  {
    code: '大型免許',
    name: 'Large Truck',
    vehicle: '大型自動車 — large truck / coach',
    limit: 'Unlimited weight / passengers',
    age: 'Min. 21 years · held licence ≥ 3 years',
    note: 'Required for heavy goods vehicles, full-size coaches.',
  },
  {
    code: '普通二輪',
    name: 'Regular Motorcycle',
    vehicle: '普通自動二輪車 — motorcycle / scooter',
    limit: '≤ 400 cc',
    age: 'Min. 16 years (小型 ≤125cc) / 18 years (full 普通二輪)',
    note: '小型限定 (≤125cc) licence is available from age 16. Full licence covers up to 400cc.',
    highlight: true,
  },
  {
    code: '大型二輪',
    name: 'Large Motorcycle',
    vehicle: '大型自動二輪車 — large motorcycle',
    limit: '> 400 cc, unlimited power',
    age: 'Min. 18 years',
    note: 'Must already hold 普通二輪 (or equivalent). Covers all engine sizes.',
  },
  {
    code: '原付免許',
    name: 'Moped',
    vehicle: '原動機付自転車 — moped / scooter',
    limit: '≤ 50 cc · max 30 km/h',
    age: 'Min. 16 years',
    note: 'Simplest licence — 1-day test at licence centre, no driving school needed.',
  },
  {
    code: '大型特殊',
    name: 'Large Special',
    vehicle: '大型特殊自動車 — construction machinery',
    limit: 'Bulldozers, cranes, forklifts on public road',
    age: 'Min. 18 years',
    note: 'Covers slow-moving construction vehicles on public roads (not off-road operation).',
  },
];

export default function LicenseClassesPage() {
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
          <span style={{ fontSize: '.82rem', color: 'var(--ink)' }}>Licence Classes</span>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>
        {/* Hero */}
        <div style={{ marginBottom: 56, textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Licence guide</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, marginBottom: 14 }}>
            Licence Classes
          </h1>
          <p style={{ color: 'var(--ink-soft)', maxWidth: '42em', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Every class of driving licence in Singapore and Japan — what vehicle it covers, weight limits, minimum age, and key restrictions.
          </p>
        </div>

        {/* SG */}
        {country === 'sg' && (<div style={{ marginBottom: 72 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: '1.4rem' }}>🇸🇬</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>Singapore</h2>
          </div>
          <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem', marginBottom: 28, lineHeight: 1.6 }}>
            Singapore licences are issued by the Traffic Police. This app covers the theory tests for the three most common classes — Class 3, 3A (cars) and Class 2B (entry motorcycle).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {SG_CLASSES.map(c => (
              <ClassCard key={c.code} info={c} />
            ))}
          </div>

          <Note>
            Class 3 / 3A requires BTT + FTT + TP practical test. Motorcycle classes (2B/2A/2) require BTT + RTT + TP. GVW = Gross Vehicle Weight.
          </Note>
        </div>)}

        {/* JP */}
        {country === 'jp' && (<div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: '1.4rem' }}>🇯🇵</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>Japan</h2>
          </div>
          <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem', marginBottom: 28, lineHeight: 1.6 }}>
            Japan's licence system is governed by the 道路交通法 (Road Traffic Act). This app covers the 本免許学科試験 for 普通自動車 and 普通二輪 — the two most common paths for Myanmar nationals in Japan.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {JP_CLASSES.map(c => (
              <ClassCard key={c.code} info={c} accentJp />
            ))}
          </div>

          <Note>
            Myanmar nationals cannot directly convert their licence — they must pass the 知識試験 (written test) and 技能試験 (skill test) or complete a Japanese driving school. See our <Link href={`/${locale}/resources/foreigners`} style={{ color: 'var(--guide-deep)', fontWeight: 600 }}>Foreigners' Guide</Link>.
          </Note>
        </div>)}

        {/* Quick compare */}
        <div style={{ marginTop: 56, background: '#fff', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', background: 'var(--asphalt)', color: '#fff' }}>
            <h3 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1rem', margin: 0 }}>Quick comparison — most common class</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--paint)', borderBottom: '1px solid var(--line)' }}>
                  {['', 'Singapore Class 3', 'Singapore Class 2B', 'Japan 普通免許', 'Japan 普通二輪'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.75rem', letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Theory tests', 'BTT + FTT', 'BTT + RTT', '仮免 + 本免 (学科)', '仮免 + 本免 (学科)'],
                  ['Practical test', 'TP test', 'TP test', '指定校卒 or 技能試験', '指定校卒 or 技能試験'],
                  ['Minimum age', '18', '18', '18', '18 (16 for ≤125cc)'],
                  ['Pass mark', '90% (45/50)', '90% (45/50)', '90% (86/95)', '90% (46/50)'],
                  ['Validity', '10 years', '10 years', '3 years (initial)', '3 years (initial)'],
                ].map(([label, ...vals], i, arr) => (
                  <tr key={label} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : undefined }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.82rem', color: 'var(--ink-soft)' }}>{label}</td>
                    {vals.map(v => (
                      <td key={v} style={{ padding: '12px 16px', color: 'var(--ink-soft)' }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <BackButton label="← Back to home" style={{ color: 'var(--guide-deep)', fontWeight: 600, fontSize: '.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
        </div>
      </div>
    </div>
  );
}

function ClassCard({ info, accentJp }: { info: ClassInfo; accentJp?: boolean }) {
  const accent = accentJp ? '#e63329' : 'var(--guide)';
  return (
    <div style={{
      background: '#fff',
      border: info.highlight ? `2px solid ${accent}` : '1px solid var(--line)',
      borderRadius: 14,
      padding: '20px 20px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{
          fontFamily: 'var(--display)',
          fontWeight: 800,
          fontSize: accentJp ? '.85rem' : '1.5rem',
          color: info.highlight ? accent : 'var(--asphalt)',
          lineHeight: 1,
          padding: accentJp ? '4px 10px' : '2px 10px',
          background: info.highlight ? `${accent}12` : 'var(--paint)',
          borderRadius: 8,
          flexShrink: 0,
        }}>
          {info.code}
        </div>
        {info.highlight && (
          <span style={{ fontSize: '.68rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', background: `${accent}18`, color: accent, padding: '3px 8px', borderRadius: 6 }}>
            Common
          </span>
        )}
      </div>
      <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '.95rem' }}>{info.name}</div>
      <div style={{ fontSize: '.82rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{info.vehicle}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 2 }}>
        <Row icon="⚖️" text={info.limit} />
        <Row icon="🎂" text={info.age} />
      </div>
      {info.note && (
        <div style={{ fontSize: '.78rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 4, paddingTop: 8, borderTop: '1px solid var(--line)' }}>
          {info.note}
        </div>
      )}
    </div>
  );
}

function Row({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', fontSize: '.8rem', color: 'var(--ink-soft)' }}>
      <span style={{ fontSize: '.75rem' }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--paint-2)', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 14px', fontSize: '.82rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 16 }}>
      <strong>Note:</strong> {children}
    </div>
  );
}

import type React from 'react';
