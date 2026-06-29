'use client';

import { useParams } from 'next/navigation';
import { useCountry } from '@/components/CountryProvider';
import BackButton from '@/components/BackButton';

export default function GuidePage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const { country } = useCountry();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paint)', paddingBottom: 80 }}>
      <div style={{ background: 'var(--paint-2)', borderBottom: '1px solid var(--line)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <BackButton label="← Home" style={{ fontSize: '.82rem', color: 'var(--ink-soft)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
          <span style={{ color: 'var(--line)' }}>/</span>
          <span style={{ fontSize: '.82rem', color: 'var(--ink)' }}>Study Guide</span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Study material</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, marginBottom: 12 }}>
            Study Guide & Key Facts
          </h1>
          <p style={{ color: 'var(--ink-soft)', maxWidth: '38em', margin: '0 auto', fontSize: '1.05rem' }}>
            Speed limits, alcohol limits, demerit points and stopping distances — the numbers you must know for the test.
          </p>
        </div>

        {/* Singapore */}
        {country === 'sg' && (<div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <span style={{ fontSize: '1.4rem' }}>🇸🇬</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>Singapore</h2>
          </div>

          <Section title="Speed Limits">
            <StatGrid items={[
              { label: 'Built-up areas',          value: '50 km/h', sub: 'Default urban limit' },
              { label: 'Major roads / arterials',  value: '70 km/h', sub: 'Signed roads' },
              { label: 'Expressways (PIE, CTE…)',  value: '90 km/h', sub: 'Unless signed otherwise' },
              { label: 'School zones',             value: '40 km/h', sub: '7 am – 7 pm school days' },
            ]} />
          </Section>

          <Section title="Alcohol Limits">
            <StatGrid items={[
              { label: 'Breath test limit',  value: '35 µg',   sub: 'per 100 ml of breath' },
              { label: 'Blood test limit',   value: '80 mg',   sub: 'per 100 ml of blood' },
              { label: 'New drivers',        value: '0',       sub: 'Zero tolerance in first year' },
            ]} />
            <Note>Exceeding the limit: fine up to S$10,000 and/or up to 12 months jail for first offence. Disqualification from driving.</Note>
          </Section>

          <Section title="Demerit Points">
            <StatGrid items={[
              { label: 'Suspension threshold',     value: '24 pts', sub: 'within any 2-year period' },
              { label: 'New driver threshold',     value: '12 pts', sub: 'within first year of licence' },
              { label: 'Suspension duration',      value: '3 months', sub: 'for 24-point accumulation' },
              { label: 'Revocation',               value: '24 pts', sub: '(already suspended) = revocation' },
            ]} />
            <Note>Common offences: Speeding (+30 km/h over limit = 6–24 points). Running red light = 12 points. Using mobile phone = 6 points.</Note>
          </Section>

          <Section title="Stopping Distances (dry road)">
            <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--paint-2)', borderBottom: '1px solid var(--line)' }}>
                    {['Speed', 'Thinking (14–15 m/s)', 'Braking', 'Total'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'center', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.06em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['50 km/h', '~14 m', '~14 m', '~28 m'],
                    ['70 km/h', '~19 m', '~28 m', '~47 m'],
                    ['90 km/h', '~25 m', '~46 m', '~71 m'],
                  ].map(([speed, think, brake, total], i, arr) => (
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
            <Note>Double these distances on wet roads. Always maintain a 2-second following gap in normal conditions.</Note>
          </Section>

          <Section title="Key Rules to Know">
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 0, listStyle: 'none' }}>
              {[
                'Seat belts are compulsory for ALL occupants — front and rear.',
                'Mobile phone use while driving: illegal unless on hands-free.',
                'Children under 1.35 m must use an approved child restraint.',
                'Minimum following distance: 2 seconds in normal conditions.',
                'Flashing amber at a pedestrian crossing — must yield to pedestrians.',
                'At a stop line with a red light or STOP sign — wheels must stop completely.',
                'Lane discipline: keep left unless overtaking.',
                'Motorcyclists must wear an approved helmet at all times.',
              ].map(rule => (
                <li key={rule} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#fff', border: '1px solid var(--line)', borderRadius: 10, padding: '12px 16px', fontSize: '.9rem', color: 'var(--ink-soft)' }}>
                  <span style={{ color: 'var(--guide)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {rule}
                </li>
              ))}
            </ul>
          </Section>
        </div>)}

        {/* Japan */}
        {country === 'jp' && (<div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <span style={{ fontSize: '1.4rem' }}>🇯🇵</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>Japan</h2>
          </div>

          <Section title="Speed Limits (最高速度)">
            <StatGrid items={[
              { label: 'Residential / school zones', value: '30 km/h', sub: '生活道路 / ゾーン30' },
              { label: 'General roads',              value: '60 km/h', sub: '一般道路 (default)' },
              { label: 'Expressways',                value: '100 km/h', sub: '高速道路 (default)' },
              { label: 'Some expressways',           value: '120 km/h', sub: '指定区間のみ' },
            ]} />
          </Section>

          <Section title="Alcohol Limits (飲酒運転)">
            <StatGrid items={[
              { label: '酒気帯び (impaired)',   value: '0.15 mg/L', sub: 'breath / 0.3 mg/dL blood' },
              { label: '酔い (drunk)',          value: '0.05 mg/L', sub: 'breath / 0.1 mg/dL blood — harsher penalty' },
              { label: 'Designated drivers',    value: '0',          sub: '代行・ハンドルキーパーは飲酒不可' },
            ]} />
            <Note>Passengers who knowingly accompany a drunk driver also face penalties. Providing alcohol to someone about to drive is also illegal.</Note>
          </Section>

          <Section title="Demerit Points (違反点数)">
            <StatGrid items={[
              { label: '30-day suspension',  value: '6–8 pts',  sub: 'in 1 year (no prior offences)' },
              { label: '60-day suspension',  value: '9–11 pts', sub: 'in 1 year' },
              { label: '90-day suspension',  value: '12–14 pts',sub: 'in 1 year' },
              { label: 'Revocation',         value: '15+ pts',  sub: 'or prior suspension on record' },
            ]} />
            <Note>Speeding 30–50 km/h over limit = 6 points. Running a red light = 2 points. Mobile phone while driving = 3 points.</Note>
          </Section>

          <Section title="Key Rules to Know (重要事項)">
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 0, listStyle: 'none' }}>
              {[
                '徐行 (joko) means slow to a speed where you can stop within 1 metre at any time.',
                'At unmarked intersections, yield to vehicles approaching from the right.',
                'Seat belts: compulsory for all seats. Child seats required for children under 6.',
                'Mobile phone use: illegal while driving — even stopping at a red light.',
                'Left turn: cyclists and pedestrians have priority; check mirrors and blind spots.',
                'Horn use: only allowed in emergencies or at designated horn-use zones (警笛鳴らせ).',
                'Headlights must be on in tunnels and at night — even if street lighting is present.',
                'Right of way at intersections: broad road > narrow road; otherwise yield to the right.',
              ].map(rule => (
                <li key={rule} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: '#fff', border: '1px solid var(--line)', borderRadius: 10, padding: '12px 16px', fontSize: '.9rem', color: 'var(--ink-soft)' }}>
                  <span style={{ color: 'var(--guide)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {rule}
                </li>
              ))}
            </ul>
          </Section>
        </div>)}

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <BackButton label="← Back to home" style={{ color: 'var(--guide-deep)', fontWeight: 600, fontSize: '.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
        </div>
      </div>
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

function StatGrid({ items }: { items: { label: string; value: string; sub?: string }[] }) {
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

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--paint-2)', border: '1px solid var(--line)', borderRadius: 10, padding: '10px 14px', fontSize: '.82rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
      <strong>Note:</strong> {children}
    </div>
  );
}

import type React from 'react';
