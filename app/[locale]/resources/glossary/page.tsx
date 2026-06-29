import Link from 'next/link';
import BackButton from '@/components/BackButton';

const TERMS = [
  { en: 'Traffic light',     my: 'မီးပွိုင့်',                    ja: '信号機（しんごうき）' },
  { en: 'Roundabout',        my: 'လည်ပတ်လမ်းဆုံ',                ja: 'ロータリー / 環状交差点' },
  { en: 'Pedestrian',        my: 'လမ်းသွားပြည်သူ',               ja: '歩行者（ほこうしゃ）' },
  { en: 'Speed limit',       my: 'အမြန်နှုန်း ကန့်သတ်ချက်',     ja: '速度制限（そくどせいげん）' },
  { en: 'Give way / Yield',  my: 'လမ်းပေးရမည်',                   ja: '譲れ / 徐行（じょこう）' },
  { en: 'Intersection',      my: 'လမ်းဆုံ',                        ja: '交差点（こうさてん）' },
  { en: 'Lane',              my: 'လမ်းကြောင်း',                   ja: '車線（しゃせん）' },
  { en: 'Overtake',          my: 'ကျော်ဖြတ်',                     ja: '追い越し（おいこし）' },
  { en: 'U-turn',            my: 'U ကွေ့',                         ja: 'Uターン' },
  { en: 'Seat belt',         my: 'ကိုယ်ဘေးကာ',                   ja: 'シートベルト' },
  { en: 'Headlights',        my: 'ရှေ့မီး',                        ja: 'ヘッドライト' },
  { en: 'Horn',              my: 'ဘိလပ်ငှေ့ (ကင်ပွန်း)',          ja: 'クラクション / 警音器' },
  { en: 'Emergency lane',    my: 'အရေးပေါ် လမ်းကြောင်း',         ja: '路肩（ろかた）' },
  { en: 'Right of way',      my: 'ဦးစားပေး ဖြတ်သန်းခွင့်',       ja: '優先権（ゆうせんけん）' },
  { en: 'Demerit points',    my: 'အမှတ်နုတ်',                      ja: '違反点数（いはんてんすう）' },
  { en: 'Driving licence',   my: 'ကားမောင်းလိုင်စင်',             ja: '運転免許証（うんてんめんきょしょう）' },
  { en: 'Blind spot',        my: 'မမြင်ရသောနေရာ',                 ja: '死角（しかく）' },
  { en: 'Hazard lights',     my: 'အဆင့်ဆင့်မီးများ',              ja: 'ハザードランプ' },
  { en: 'Tyre',              my: 'တာယာ',                           ja: 'タイヤ' },
  { en: 'Brakes',            my: 'ဘရိတ်',                          ja: 'ブレーキ' },
  { en: 'Suspension (licence)', my: 'လိုင်စင် ရပ်ဆိုင်းခြင်း',   ja: '免許停止（めんきょていし）' },
  { en: 'Revocation',        my: 'လိုင်စင် ပယ်ဖျက်ခြင်း',        ja: '取消し（とりけし）' },
  { en: 'Expressway',        my: 'မြန်နှုန်းလမ်း',                ja: '高速道路（こうそくどうろ）' },
  { en: 'Zebra crossing',    my: 'ကြက်ဆောင်လမ်းဖြတ်',            ja: '横断歩道（おうだんほどう）' },
  { en: 'Kerb',              my: 'လမ်းနောင်',                      ja: '縁石（えんせき）' },
  { en: 'Median',            my: 'လမ်းအလယ်ပိုင်း',               ja: '中央分離帯（ちゅうおうぶんりたい）' },
  { en: 'Turning radius',    my: 'ကွေ့ကောက်အချင်းဝက်',          ja: '旋回半径（せんかいはんけい）' },
  { en: 'Yield right of way',my: 'ဦးစားပေး ဖြတ်သန်းစေ',          ja: '優先道路を譲る' },
  { en: 'BAC',               my: 'သွေးတွင်းအရက်ဓာတ်',            ja: '血中アルコール濃度' },
  { en: 'Probationary licence', my: 'ယာယီ လိုင်စင်',            ja: '仮免許（かりめんきょ）' },
];

export default async function GlossaryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paint)', paddingBottom: 80 }}>
      <div style={{ background: 'var(--paint-2)', borderBottom: '1px solid var(--line)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <BackButton label="← Home" style={{ fontSize: '.82rem', color: 'var(--ink-soft)', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
          <span style={{ color: 'var(--line)' }}>/</span>
          <span style={{ fontSize: '.82rem', color: 'var(--ink)' }}>Bilingual Traffic Glossary</span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Human-reviewed</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, marginBottom: 12 }}>
            Bilingual Traffic Glossary
          </h1>
          <p style={{ color: 'var(--ink-soft)', maxWidth: '38em', margin: '0 auto', fontSize: '1.05rem' }}>
            Every key traffic term in English, Myanmar (Burmese) and Japanese — checked by a human so a mistranslation never costs you a mark.
          </p>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--asphalt)', color: '#fff' }}>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.08em', textTransform: 'uppercase' }}>English</th>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.08em', textTransform: 'uppercase' }}>မြန်မာ</th>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', letterSpacing: '.08em', textTransform: 'uppercase' }}>日本語</th>
              </tr>
            </thead>
            <tbody>
              {TERMS.map((term, i) => (
                <tr
                  key={term.en}
                  style={{
                    borderBottom: i < TERMS.length - 1 ? '1px solid var(--line)' : undefined,
                    background: i % 2 === 0 ? '#fff' : 'var(--paint)',
                  }}
                >
                  <td style={{ padding: '12px 20px', fontFamily: 'var(--display)', fontWeight: 700 }}>{term.en}</td>
                  <td style={{ padding: '12px 20px', color: 'var(--ink-soft)' }}>{term.my}</td>
                  <td style={{ padding: '12px 20px', color: 'var(--ink-soft)' }}>{term.ja}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: 20, fontSize: '.82rem', color: 'var(--ink-soft)', textAlign: 'center' }}>
          30 terms · Updated June 2025 · Human-reviewed
        </p>

        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <BackButton label="← Back to home" style={{ color: 'var(--guide-deep)', fontWeight: 600, fontSize: '.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
        </div>
      </div>
    </div>
  );
}
