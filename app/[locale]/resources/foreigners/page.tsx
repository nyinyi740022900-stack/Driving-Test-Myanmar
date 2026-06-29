'use client';

import { useParams } from 'next/navigation';
import { useCountry } from '@/components/CountryProvider';
import BackButton from '@/components/BackButton';

export default function ForeignersPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const { country } = useCountry();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paint)', paddingBottom: 80 }}>
      <div style={{ background: 'var(--paint-2)', borderBottom: '1px solid var(--line)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <BackButton label="← Home" style={{ fontSize: '.82rem', color: 'var(--ink-soft)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
          <span style={{ color: 'var(--line)' }}>/</span>
          <span style={{ fontSize: '.82rem', color: 'var(--ink)' }}>Foreigners&apos; Guide</span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Study material</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, marginBottom: 12 }}>
            Foreigners&apos; Guide
          </h1>
          <p style={{ color: 'var(--ink-soft)', maxWidth: '40em', margin: '0 auto', fontSize: '1.05rem' }}>
            Converting an overseas licence, IDP rules, and what Myanmar nationals need to legally drive in Singapore and Japan.
          </p>
        </div>

        {/* Singapore */}
        {country === 'sg' && (<div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <span style={{ fontSize: '1.4rem' }}>🇸🇬</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>Singapore</h2>
          </div>

          <InfoBlock title="Using a Foreign Licence as a Tourist">
            <p>Holders of a valid foreign driving licence may drive in Singapore for up to <strong>12 months</strong> from the date of entry without converting, provided the licence is valid and in English (or accompanied by an English translation).</p>
            <p style={{ marginTop: 8 }}>An <strong>International Driving Permit (IDP)</strong> issued in your home country alongside your national licence is also accepted for the same 12-month period.</p>
          </InfoBlock>

          <InfoBlock title="Converting a Foreign Licence (PR / Work Pass Holders)">
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 20, color: 'var(--ink-soft)', fontSize: '.9rem', lineHeight: 1.6 }}>
              <li>Eligible if you hold a valid PR, EP, S Pass, WP, or DP.</li>
              <li>Your foreign licence must be valid and issued by a recognised country. Myanmar is on the list — see <strong>requirements below</strong>.</li>
              <li>Visit the <strong>Traffic Police (OneMotoring)</strong> counter at SLA Building, 8 Shenton Way.</li>
              <li>Submit: valid foreign licence + certified English translation (if not in English), FIN card, passport, 1 passport photo.</li>
              <li>Pay a fee of approx. S$25–S$50 (check current rates at OneMotoring).</li>
              <li>Your Singapore provisional licence is issued; a full licence follows after 1 year with no offences.</li>
            </ul>
          </InfoBlock>

          <InfoBlock title="Myanmar Nationals — Specific Requirements 🇲🇲">
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 20, color: 'var(--ink-soft)', fontSize: '.9rem', lineHeight: 1.6 }}>
              <li>Myanmar licence is recognised for conversion — you do <strong>not</strong> need to sit the Singapore BTT or driving test.</li>
              <li>Must have held the Myanmar licence for <strong>at least 1 year</strong> and have driven on it.</li>
              <li>Bring: original Myanmar licence + certified English translation (by a notary or embassy), passport, FIN card.</li>
              <li>If your Myanmar licence is not in English, get it translated at the Myanmar Embassy in Singapore or a certified translator.</li>
              <li>If you have been in Singapore &gt;12 months without converting, you may need to sit the BTT — check with Traffic Police.</li>
            </ul>
          </InfoBlock>
        </div>)}

        {/* Japan */}
        {country === 'jp' && (<div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <span style={{ fontSize: '1.4rem' }}>🇯🇵</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>Japan</h2>
          </div>

          <InfoBlock title="Using a Foreign Licence / IDP in Japan">
            <p>Japan accepts an <strong>International Driving Permit (IDP)</strong> issued under the Geneva Convention 1949. The IDP is valid for <strong>1 year from the date of latest entry into Japan</strong> (not from the issue date of the IDP).</p>
            <p style={{ marginTop: 8 }}>Japan does <strong>not</strong> accept IDPs issued under the Vienna Convention 1968 — check which convention your home country uses before travelling.</p>
          </InfoBlock>

          <InfoBlock title="Converting a Foreign Licence (外国免許切替)">
            <p style={{ marginBottom: 8 }}>Japan has reciprocal licence conversion agreements with some countries (e.g. Germany, France, Australia). Myanmar is <strong>not</strong> on this list, which means:</p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 20, color: 'var(--ink-soft)', fontSize: '.9rem', lineHeight: 1.6 }}>
              <li>You must obtain a certified Japanese translation of your Myanmar licence from <strong>JAF (Japan Automobile Federation)</strong>.</li>
              <li>Submit to your prefecture&apos;s 免許センター: Myanmar licence + JAF translation, residence card (在留カード), passport, 住民票 (residence certificate), photo.</li>
              <li>Take a <strong>written knowledge test</strong> (10 questions, pass mark 7/10) in Japanese or some centres allow English.</li>
              <li>Take a <strong>practical skill test</strong> (in-circuit) at the licence centre — this tests basic car control and circuit route.</li>
              <li>If you pass both, your Japanese licence is issued. JAF translation fee: approx. ¥3,000.</li>
            </ul>
          </InfoBlock>

          <InfoBlock title="Myanmar Nationals — Fastest Path 🇲🇲">
            <p style={{ marginBottom: 8 }}>Because Myanmar has no reciprocal agreement with Japan, the fastest legal path to a Japanese licence is:</p>
            <ol style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 20, color: 'var(--ink-soft)', fontSize: '.9rem', lineHeight: 1.6 }}>
              <li><strong>Option A — Driving School:</strong> Enrol in a 指定自動車教習所. Expensive (¥250,000–¥400,000) but the school skill test replaces the licence centre skill test. You only need to pass the 本免許学科試験 (theory) at the licence centre. This is the most reliable path.</li>
              <li><strong>Option B — Licence Centre Direct:</strong> Cheaper, but you must pass the skill test at the licence centre, which is harder to pass first-time without school training.</li>
            </ol>
            <p style={{ marginTop: 10, fontSize: '.82rem', color: 'var(--ink-soft)' }}>Tip: This app covers the 本免許学科試験 — use the Japan mock tests to prepare.</p>
          </InfoBlock>
        </div>)}

        <div style={{ background: 'var(--paint-2)', border: '1px solid var(--line)', borderRadius: 12, padding: '16px 20px', marginTop: 32, fontSize: '.82rem', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          <strong>Disclaimer:</strong> This information is for general guidance only. Requirements may change — always verify with the Traffic Police (Singapore), your prefecture&apos;s 免許センター (Japan), or a registered immigration adviser before making decisions.
        </div>

        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <BackButton label="← Back to home" style={{ color: 'var(--guide-deep)', fontWeight: 600, fontSize: '.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '22px 24px', marginBottom: 16 }}>
      <h3 style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1rem', marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid var(--line)' }}>{title}</h3>
      <div style={{ fontSize: '.9rem', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

import type React from 'react';
