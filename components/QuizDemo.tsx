'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useCountry } from './CountryProvider';
import { NoEntrySign, MediaPlaceholder } from './Signs';
import { pickLocalized } from '@/lib/questions';

const DEMO_DATA = {
  sg: {
    en: {
      q: 'What does this sign mean?',
      choices: ['No entry for all vehicles', 'No parking at any time', 'One-way street ahead'],
      answer: 0,
      ok: 'Correct — this sign means no vehicles may enter.',
      no: 'Not quite — the red circle with a white bar means no entry.',
    },
    my: {
      q: 'ဒီဆိုင်းဘုတ်က ဘာကို ဆိုလိုသလဲ။',
      choices: ['ယာဉ်အားလုံး ဝင်ခွင့်မရှိ', 'အချိန်မရွေး ရပ်နားခွင့်မရှိ', 'ရှေ့တွင် တစ်လမ်းသွား'],
      answer: 0,
      ok: 'မှန်ပါတယ် — ဒီဆိုင်းဘုတ်က ယာဉ်များ ဝင်ခွင့်မရှိ ဟု ဆိုလိုပါတယ်။',
      no: 'မမှန်သေးပါ — အဖြူရောင်တန်းပါ အနီရောင်စက်ဝိုင်းက ဝင်ခွင့်မရှိ ဖြစ်ပါတယ်။',
    },
  },
  jp: {
    ja: {
      q: 'この標識の意味は？',
      choices: ['車両進入禁止', '駐車禁止', 'この先一方通行'],
      answer: 0,
      ok: '正解 — この標識は車両進入禁止を意味します。',
      no: '不正解 — 白い横棒のある赤い円は「進入禁止」です。',
    },
    my: {
      q: 'ဒီဆိုင်းဘုတ်က ဘာကို ဆိုလိုသလဲ။',
      choices: ['ယာဉ်အားလုံး ဝင်ခွင့်မရှိ', 'အချိန်မရွေး ရပ်နားခွင့်မရှိ', 'ရှေ့တွင် တစ်လမ်းသွား'],
      answer: 0,
      ok: 'မှန်ပါတယ် — ဒီဆိုင်းဘုတ်က ယာဉ်များ ဝင်ခွင့်မရှိ ဟု ဆိုလိုပါတယ်။',
      no: 'မမှန်သေးပါ — အဖြူရောင်တန်းပါ အနီရောင်စက်ဝိုင်းက ဝင်ခွင့်မရှိ ဖြစ်ပါတယ်။',
    },
  },
};

type DemoKey = keyof typeof DEMO_DATA['sg'];

export default function QuizDemo() {
  const t = useTranslations('demo');
  const locale = useLocale() as 'en' | 'my' | 'ja';
  const { country } = useCountry();
  const [picked, setPicked] = useState<number | null>(null);

  const countryData = DEMO_DATA[country] as Record<string, typeof DEMO_DATA['sg']['en']>;
  const d = countryData[locale] ?? countryData[country === 'sg' ? 'en' : 'ja'];

  function reset() {
    setPicked(null);
  }

  return (
    <section className="demo-sec" id="try">
      <div className="wrap">
        <div className="shead">
          <div className="eyebrow">{t('eyebrow')}</div>
          <h2>{t('heading')}</h2>
          <p>{t('sub')}</p>
        </div>
        <div className="demo" key={`${country}-${locale}`}>
          <div className="vis" aria-hidden="true">
            <NoEntrySign />
          </div>
          <div>
            <div className="qtext">{d.q}</div>
            <div className="opts">
              {d.choices.map((choice, i) => {
                let cls = 'opt';
                if (picked !== null) {
                  if (i === d.answer) cls += ' correct';
                  else if (i === picked) cls += ' wrong';
                }
                return (
                  <button
                    key={i}
                    className={cls}
                    disabled={picked !== null}
                    onClick={() => { setPicked(i); }}
                  >
                    <span className="k">{String.fromCharCode(65 + i)}</span>
                    <span>{choice}</span>
                  </button>
                );
              })}
            </div>
            <div
              className={`verdict ${picked === null ? '' : picked === d.answer ? 'ok' : 'no'}`}
              aria-live="polite"
            >
              {picked !== null && (
                picked === d.answer
                  ? `${t('correct')} ${d.ok}`
                  : `${t('wrong')} ${d.no}`
              )}
            </div>
            {picked !== null && (
              <button
                className="btn btn-ghost"
                style={{ marginTop: 14, fontSize: '.85rem' }}
                onClick={reset}
              >
                Try again
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
