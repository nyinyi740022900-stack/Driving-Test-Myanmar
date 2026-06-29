'use client';

import { useParams } from 'next/navigation';
import { useCountry } from '@/components/CountryProvider';
import BackButton from '@/components/BackButton';

const SG_STEPS = [
  {
    n: 1,
    title: 'Register at an Approved Centre',
    body: 'Choose BBDC (Bukit Batok), CDC (ComfortDelGro), or SSDC (Serangoon). You will need your NRIC/FIN and pass a basic eyesight test. Min. age: 17 (car), 18 (motorcycle).',
  },
  {
    n: 2,
    title: 'Pass the Basic Theory Test (BTT)',
    body: '50 multiple-choice questions, 90% pass mark (45/50). Tests traffic signs, road rules and hazard awareness. Book online via OneMotoring. Fee: $7.09 (with GST).',
  },
  {
    n: 3,
    title: 'Start Practical Lessons',
    body: 'Begin driving lessons at the centre. A Class 3 course typically requires 20–35 lessons depending on ability. Each lesson is 1 hour on an in-circuit or road session.',
  },
  {
    n: 4,
    title: 'Pass the Final Theory Test (FTT)',
    body: '50 questions on advanced driving — hazard perception, expressway rules, night driving. Must have completed at least 5 practical lessons before booking. Fee: $7.09.',
  },
  {
    n: 5,
    title: 'Complete Remaining Practical Lessons',
    body: 'Continue lessons until the centre certifies you ready. Most centres require a minimum standard before booking the TP (Traffic Police) test.',
  },
  {
    n: 6,
    title: 'Pass the Traffic Police Driving Test',
    body: 'A 45-min driving test with a TP evaluator. Routes are set by the centre. A score of 18 or fewer demerit points passes. Fee: $35.97 (with GST).',
  },
  {
    n: 7,
    title: 'Collect Your Driving Licence',
    body: 'Collect at the Traffic Police Road Safety Community Park or OneMotoring counter. The Probationary Driving Licence (PDL) is displayed on your car for 1 year.',
  },
];

const JP_STEPS = [
  {
    n: 1,
    title: '教習所に入学 — Enrol at a Driving School',
    body: 'Choose a 公安委員会指定 (government-designated) school in your prefecture. You will need: residence card (住民票), ID photo, and pass an initial health check (eyesight, hearing, etc.).',
  },
  {
    n: 2,
    title: '第1段階 — Stage 1 (In-circuit training)',
    body: 'Minimum 10 hours in-circuit driving (manual) or 9 hours (auto). Plus at least 10 hours of theory class covering road rules, signs and safety.',
  },
  {
    n: 3,
    title: '仮免許試験 — Provisional Licence Test',
    body: 'A theory test (50 questions, pass mark 90% = 45/50) plus an in-circuit skill test at the school. Passing grants 仮免許 (provisional licence).',
  },
  {
    n: 4,
    title: '第2段階 — Stage 2 (Road training with 仮免)',
    body: 'Minimum 19 hours of on-road driving (with instructor) and at least 16 hours of theory class including emergency response and highway driving.',
  },
  {
    n: 5,
    title: '卒業検定 — School Graduation Test',
    body: 'A road driving test conducted by the school. Pass and receive a 卒業証明書 (graduation certificate) valid for 1 year. This exempts you from the TP skill test.',
  },
  {
    n: 6,
    title: '本免許学科試験 — Final Theory Test at Licence Centre',
    body: '95 questions (car) or 95 questions (motorcycle), 90% pass mark (86/95). Tests road signs, traffic rules and case scenarios. Fee: ¥1,750. Book at your prefecture\'s 免許センター.',
  },
  {
    n: 7,
    title: '免許証交付 — Receive Your Licence',
    body: 'After passing the theory test and completing any remaining formalities (vision check, photo) at the licence centre, your 運転免許証 is issued the same day.',
  },
];

export default function RoadmapPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const { country } = useCountry();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paint)', paddingBottom: 80 }}>
      <div style={{ background: 'var(--paint-2)', borderBottom: '1px solid var(--line)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <BackButton label="← Home" style={{ fontSize: '.82rem', color: 'var(--ink-soft)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
          <span style={{ color: 'var(--line)' }}>/</span>
          <span style={{ fontSize: '.82rem', color: 'var(--ink)' }}>Licensing Roadmap</span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Study material</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, marginBottom: 12 }}>
            Licensing Roadmap
          </h1>
          <p style={{ color: 'var(--ink-soft)', maxWidth: '38em', margin: '0 auto', fontSize: '1.05rem' }}>
            Every step from registration to full licence — for Singapore and Japan.
          </p>
        </div>

        {/* Singapore */}
        {country === 'sg' && (<div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <span style={{ fontSize: '1.4rem' }}>🇸🇬</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>Singapore — Class 3 / 3A Car Licence</h2>
          </div>
          <Steps steps={SG_STEPS} />
          <div style={{ background: 'var(--paint-2)', border: '1px solid var(--line)', borderRadius: 12, padding: '16px 20px', marginTop: 16, fontSize: '.88rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            <strong>Typical timeline:</strong> 4–12 months depending on lesson frequency. Most people take 3–6 months. The theory tests can be taken within 1–2 months of starting.
          </div>
        </div>)}

        {/* Japan */}
        {country === 'jp' && (<div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <span style={{ fontSize: '1.4rem' }}>🇯🇵</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>Japan — 普通自動車免許 (via 指定校)</h2>
          </div>
          <Steps steps={JP_STEPS} />
          <div style={{ background: 'var(--paint-2)', border: '1px solid var(--line)', borderRadius: 12, padding: '16px 20px', marginTop: 16, fontSize: '.88rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            <strong>Typical timeline:</strong> 2–4 months for the full course if attending regularly. The minimum course period is set by law and cannot be shortened. Peak seasons (March–April, August) may have longer waiting times.
          </div>
        </div>)}

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <BackButton label="← Back to home" style={{ color: 'var(--guide-deep)', fontWeight: 600, fontSize: '.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
        </div>
      </div>
    </div>
  );
}

function Steps({ steps }: { steps: typeof SG_STEPS }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {steps.map((step, i) => (
        <div key={step.n} style={{ display: 'flex', gap: 20 }}>
          {/* Timeline line */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--guide)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--display)', fontWeight: 800, fontSize: '.9rem', flexShrink: 0,
            }}>
              {step.n}
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 2, flex: 1, background: 'var(--line)', minHeight: 24, margin: '4px 0' }} />
            )}
          </div>
          {/* Content */}
          <div style={{ paddingBottom: i < steps.length - 1 ? 24 : 0, paddingTop: 6, flex: 1 }}>
            <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>{step.title}</div>
            <div style={{ fontSize: '.88rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{step.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
