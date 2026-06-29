'use client';

import { useParams } from 'next/navigation';
import { useCountry } from '@/components/CountryProvider';
import BackButton from '@/components/BackButton';

const SG_SIGNS = [
  {
    category: 'Regulatory — Must Obey',
    signs: [
      { file: 'stop.png',              en: 'Stop',               my: 'ရပ်ရမည်',               desc: 'Come to a complete stop at the line before proceeding.' },
      { file: 'give-way.png',          en: 'Give Way',           my: 'လမ်းပေးရမည်',           desc: 'Yield to traffic on the major road before entering.' },
      { file: 'no-entry.png',          en: 'No Entry',           my: 'ဝင်ခွင့်မပြု',          desc: 'No vehicles may enter this road.' },
      { file: 'speed-50.png',          en: 'Speed Limit 50',     my: 'အမြန်နှုန်း ၅၀',        desc: 'Maximum speed of 50 km/h on this road.' },
      { file: 'no-overtaking.png',     en: 'No Overtaking',      my: 'ကျော်ဖြတ်ခွင့်မရှိ',   desc: 'Overtaking other vehicles is prohibited ahead.' },
      { file: 'mandatory-sign.png',    en: 'Mandatory Direction', my: 'ညွှန်ကြားသောဘက် သွားရမည်', desc: 'Must proceed in the direction shown by the arrow.' },
    ],
  },
  {
    category: 'Warning — Hazard Ahead',
    signs: [
      { file: 'warning-sign.png',        en: 'General Warning',       my: 'သတိပေး',              desc: 'Exercise caution — a hazard lies ahead.' },
      { file: 'pedestrian-crossing.png', en: 'Pedestrian Crossing',   my: 'လမ်းဖြတ်ကူးရှိ',     desc: 'Slow down; pedestrians may be crossing ahead.' },
      { file: 'school-zone.png',         en: 'School Zone',           my: 'ကျောင်းဇုန်',        desc: 'Slow to 40 km/h during school hours; children may be present.' },
      { file: 'traffic-signals-sign.png',en: 'Traffic Signals Ahead', my: 'မီးပွိုင့်ရှိ',       desc: 'Traffic lights at the next junction — be prepared to stop.' },
    ],
  },
  {
    category: 'Informational',
    signs: [
      { file: 'parking-sign.png', en: 'Parking / No Parking', my: 'ကားရပ်နားခြင်း', desc: 'Check posted restrictions for times and conditions.' },
      { file: 'roundabout.png',   en: 'Roundabout Ahead',     my: 'လည်ပတ်လမ်းဆုံ',  desc: 'Give way to traffic already in the roundabout.' },
    ],
  },
];

const JP_SIGNS = [
  {
    category: '規制標識 — Regulatory',
    signs: [
      { file: 'jp-stop.png',            en: 'Stop',            ja: '止まれ',        desc: 'Come to a complete stop at the line. — 停止線の手前で一時停止。' },
      { file: 'jp-no-entry.png',        en: 'No Entry',        ja: '進入禁止',      desc: 'Vehicles may not enter this road. — この道路へは進入禁止。' },
      { file: 'jp-speed-limit.png',     en: 'Speed Limit',     ja: '最高速度',      desc: 'Do not exceed the posted speed. — 表示速度を超えてはいけない。' },
      { file: 'jp-no-overtaking.png',   en: 'No Overtaking',   ja: '追い越し禁止',  desc: 'Overtaking prohibited in this section. — この区間は追い越し禁止。' },
      { file: 'jp-give-way.png',        en: 'Proceed Slowly',  ja: '徐行',          desc: 'Slow down and be prepared to stop at any moment. — いつでも止まれる速度で徐行。' },
      { file: 'jp-one-way.png',         en: 'One Way',         ja: '一方通行',      desc: 'Traffic flows in one direction only. — 一方向のみ通行可。' },
      { file: 'jp-parking.png',         en: 'No Parking',      ja: '駐車禁止',      desc: 'Stopping to park is prohibited. — 駐車は禁止。' },
    ],
  },
  {
    category: '警戒標識 — Warning',
    signs: [
      { file: 'jp-pedestrian-cross.png', en: 'Pedestrian Crossing', ja: '横断歩道',          desc: 'Yield to pedestrians crossing. — 横断歩道あり、歩行者優先。' },
      { file: 'jp-school-zone.png',      en: 'School Zone',         ja: 'スクールゾーン',    desc: 'Slow down; children may be present. — 子供が多い区域、徐行。' },
      { file: 'jp-warning.png',          en: 'Hazard Warning',      ja: '警戒',              desc: 'Danger or unusual road conditions ahead. — 前方に危険箇所あり。' },
      { file: 'jp-pedestrian.png',       en: 'Pedestrians Present', ja: '歩行者通行あり',    desc: 'Pedestrians may be using this road. — 歩行者の通行に注意。' },
    ],
  },
];

export default function SignsPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const { country } = useCountry();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paint)', paddingBottom: 80 }}>
      <div style={{ background: 'var(--paint-2)', borderBottom: '1px solid var(--line)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <BackButton label="← Home" style={{ fontSize: '.82rem', color: 'var(--ink-soft)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
          <span style={{ color: 'var(--line)' }}>/</span>
          <span style={{ fontSize: '.82rem', color: 'var(--ink)' }}>Road Signs Library</span>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Study material</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, marginBottom: 12 }}>
            Road Signs Library
          </h1>
          <p style={{ color: 'var(--ink-soft)', maxWidth: '40em', margin: '0 auto', fontSize: '1.05rem' }}>
            Every regulatory, warning and informational sign — with what each one means and what you must do.
          </p>
        </div>

        {/* Singapore Section */}
        {country === 'sg' && (<div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <span style={{ fontSize: '1.5rem' }}>🇸🇬</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>Singapore Signs</h2>
          </div>

          {SG_SIGNS.map(({ category, signs }) => (
            <div key={category} style={{ marginBottom: 40 }}>
              <h3 style={{ fontFamily: 'var(--display)', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 16, borderBottom: '1px solid var(--line)', paddingBottom: 8 }}>
                {category}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {signs.map(sign => (
                  <div key={sign.file} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '20px 16px', textAlign: 'center' }}>
                    <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                      <img
                        src={`/signs/sg/${sign.file}`}
                        alt={sign.en}
                        style={{ maxHeight: 90, maxWidth: 140, objectFit: 'contain' }}
                        onError={undefined}
                      />
                    </div>
                    <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.95rem', marginBottom: 4 }}>{sign.en}</div>
                    <div style={{ fontSize: '.8rem', color: 'var(--guide-deep)', fontWeight: 600, marginBottom: 8 }}>{sign.my}</div>
                    <div style={{ fontSize: '.8rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{sign.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>)}

        {/* Japan Section */}
        {country === 'jp' && (<div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <span style={{ fontSize: '1.5rem' }}>🇯🇵</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800 }}>Japan Signs</h2>
          </div>

          {JP_SIGNS.map(({ category, signs }) => (
            <div key={category} style={{ marginBottom: 40 }}>
              <h3 style={{ fontFamily: 'var(--display)', fontSize: '.75rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 16, borderBottom: '1px solid var(--line)', paddingBottom: 8 }}>
                {category}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {signs.map(sign => (
                  <div key={sign.file} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '20px 16px', textAlign: 'center' }}>
                    <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                      <img
                        src={`/signs/jp/${sign.file}`}
                        alt={sign.en}
                        style={{ maxHeight: 90, maxWidth: 140, objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.95rem', marginBottom: 4 }}>{sign.ja}</div>
                    <div style={{ fontSize: '.8rem', color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 6 }}>{sign.en}</div>
                    <div style={{ fontSize: '.78rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{sign.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>)}

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <BackButton label="← Back to home" style={{ color: 'var(--guide-deep)', fontWeight: 600, fontSize: '.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
        </div>
      </div>
    </div>
  );
}
