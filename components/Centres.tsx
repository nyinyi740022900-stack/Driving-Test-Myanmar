'use client';

import { useState, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useCountry } from './CountryProvider';

type Locale = 'en' | 'my' | 'ja';
type LangStr = Record<Locale, string>;

const CENTRES_SG = [
  {
    code: 'CDC',
    name: 'ComfortDelGro Driving Centre',
    area: { en: 'Ubi · East', my: 'Ubi · အရှေ့ပိုင်း', ja: 'ウビ・東部' },
    addr: '205 Ubi Ave 4, Singapore 408805',
    desc: {
      en: "Singapore's largest driving centre, serving all vehicle classes including BTT and FTT tests.",
      my: "စင်ကာပူ၏ အကြီးဆုံး မောင်းနှင်ရေးစင်တာ၊ BTT နှင့် FTT အပါအဝင် ယာဉ်အမျိုးအစားအားလုံးကို ဝန်ဆောင်မှုပေးသည်။",
      ja: "シンガポール最大の教習所。BTT・FTTを含むすべての車種に対応しています。",
    },
    rating: '4.3',
    color: '#1B9C56',
    lat: 1.3358621,
    lng: 103.8966983,
    phone: '6471 1111',
    website: 'https://www.cdc.com.sg',
    hours: { en: 'Mon–Fri 8 am–9 pm · Sat 8 am–5 pm · Sun/PH 8 am–1 pm', my: 'တနင်္လာ–သောကြာ နံနက် ၈ – ညနေ ၉ · စနေ နံနက် ၈ – ညနေ ၅ · တနင်္ဂနွေ/PH နံနက် ၈ – မွန်းတည့် ၁', ja: '月〜金 8:00〜21:00 · 土 8:00〜17:00 · 日/祝 8:00〜13:00' },
    classes: {
      en: ['Class 3 / 3A (car)', 'Class 2B / 2A / 2 (motorcycle)', 'Class 4 / 4A / 5'],
      my: ['Class 3 / 3A (ကား)', 'Class 2B / 2A / 2 (မော်တော်ဆိုင်ကယ်)', 'Class 4 / 4A / 5'],
      ja: ['クラス 3 / 3A（普通車）', 'クラス 2B / 2A / 2（バイク）', 'クラス 4 / 4A / 5'],
    },
    fees: {
      car: { en: 'S$26–35 / lesson', my: 'S$26–35 / သင်ခန်း', ja: 'S$26〜35 / 限' },
      moto: { en: 'S$20–27 / lesson', my: 'S$20–27 / သင်ခန်း', ja: 'S$20〜27 / 限' },
      reg: { en: '~S$6–10', my: '~S$6–10', ja: '約 S$6〜10' },
    },
    highlights: {
      en: ['Largest circuit in Singapore', 'In-house TP test routes', 'Online booking via OneMotoring'],
      my: ['စင်ကာပူ၏ အကြီးဆုံး ကျင်းပွဲကွင်း', 'TP စာမေးပွဲ လမ်းကြောင်း ပါဝင်', 'OneMotoring မှတဆင့် အွန်လိုင်းမှာ ကြိုတင်မှတ်ပုံတင်နိုင်'],
      ja: ['シンガポール最大のサーキット', '場内TPコース完備', 'OneMotoring でオンライン予約可能'],
    },
  },
  {
    code: 'BBDC',
    name: 'Bukit Batok Driving Centre',
    area: { en: 'Bukit Batok · West', my: 'Bukit Batok · အနောက်ပိုင်း', ja: 'ブキバトック・西部' },
    addr: '811 Bukit Batok West Ave 5, Singapore 659085',
    desc: {
      en: 'Located in western Singapore, known for modern facilities and well-structured driving courses for all classes.',
      my: "စင်ကာပူ အနောက်ပိုင်းတွင် တည်ရှိပြီး ခေတ်မီသော အဆောက်အဦးနှင့် ဖွဲ့စည်းပုံကောင်းသော မောင်းနှင်သင်တန်းများဖြင့် ထင်ရှားသည်။",
      ja: '西シンガポールにあり、モダンな施設と体系的なカリキュラムで知られています。',
    },
    rating: null,
    color: '#2563EB',
    lat: 1.3668106,
    lng: 103.7501406,
    phone: '6561 1233',
    website: 'https://www.bbdc.sg',
    hours: { en: 'Mon–Fri 8 am–9 pm · Sat 8 am–5 pm · Sun/PH 8 am–1 pm', my: 'တနင်္လာ–သောကြာ နံနက် ၈ – ညနေ ၉ · စနေ နံနက် ၈ – ညနေ ၅ · တနင်္ဂနွေ/PH နံနက် ၈ – မွန်းတည့် ၁', ja: '月〜金 8:00〜21:00 · 土 8:00〜17:00 · 日/祝 8:00〜13:00' },
    classes: {
      en: ['Class 3 / 3A (car)', 'Class 2B / 2A / 2 (motorcycle)', 'Class 4 / 4A / 5'],
      my: ['Class 3 / 3A (ကား)', 'Class 2B / 2A / 2 (မော်တော်ဆိုင်ကယ်)', 'Class 4 / 4A / 5'],
      ja: ['クラス 3 / 3A（普通車）', 'クラス 2B / 2A / 2（バイク）', 'クラス 4 / 4A / 5'],
    },
    fees: {
      car: { en: 'S$25–34 / lesson', my: 'S$25–34 / သင်ခန်း', ja: 'S$25〜34 / 限' },
      moto: { en: 'S$19–25 / lesson', my: 'S$19–25 / သင်ခန်း', ja: 'S$19〜25 / 限' },
      reg: { en: '~S$6–10', my: '~S$6–10', ja: '約 S$6〜10' },
    },
    highlights: {
      en: ['Modern simulator facilities', 'Convenient to Bukit Batok MRT', 'Structured lesson packages available'],
      my: ['ခေတ်မီ simulator အဆောက်အဦး', 'Bukit Batok MRT နှင့် အဆင်ပြေ', 'စနစ်ကျသော သင်ကြားရေး package ရနိုင်'],
      ja: ['最新シミュレーター設備', 'ブキバトックMRT便利', '体系的な教習パッケージあり'],
    },
  },
  {
    code: 'SSDC',
    name: 'Singapore Safety Driving Centre',
    area: { en: 'Woodlands · North', my: 'Woodlands · မြောက်ပိုင်း', ja: 'ウッドランズ・北部' },
    addr: '2 Woodlands Ave 3, Singapore 738343',
    desc: {
      en: 'Serving northern residents of Woodlands, Yishun and Sembawang with comprehensive driving programmes.',
      my: "Woodlands၊ Yishun နှင့် Sembawang မြောက်ပိုင်း နေထိုင်သူများကို ဘက်စုံ မောင်းနှင်သင်တန်းများဖြင့် ဝန်ဆောင်မှုပေးသည်။",
      ja: 'ウッドランズ・イシュン・センバワン北部の住民に総合的な運転プログラムを提供。',
    },
    rating: '4.8',
    color: '#7C3AED',
    lat: 1.4528393,
    lng: 103.7939018,
    phone: '6481 0123',
    website: 'https://www.ssdc.com.sg',
    hours: { en: 'Mon–Fri 8 am–9 pm · Sat 8 am–5 pm · Sun/PH 8 am–1 pm', my: 'တနင်္လာ–သောကြာ နံနက် ၈ – ညနေ ၉ · စနေ နံနက် ၈ – ညနေ ၅ · တနင်္ဂနွေ/PH နံနက် ၈ – မွန်းတည့် ၁', ja: '月〜金 8:00〜21:00 · 土 8:00〜17:00 · 日/祝 8:00〜13:00' },
    classes: {
      en: ['Class 3 / 3A (car)', 'Class 2B / 2A / 2 (motorcycle)'],
      my: ['Class 3 / 3A (ကား)', 'Class 2B / 2A / 2 (မော်တော်ဆိုင်ကယ်)'],
      ja: ['クラス 3 / 3A（普通車）', 'クラス 2B / 2A / 2（バイク）'],
    },
    fees: {
      car: { en: 'S$25–33 / lesson', my: 'S$25–33 / သင်ခန်း', ja: 'S$25〜33 / 限' },
      moto: { en: 'S$18–25 / lesson', my: 'S$18–25 / သင်ခန်း', ja: 'S$18〜25 / 限' },
      reg: { en: '~S$6–10', my: '~S$6–10', ja: '約 S$6〜10' },
    },
    highlights: {
      en: ['Highest-rated centre (4.8★)', 'Quieter roads in north Singapore', 'Near Woodlands MRT'],
      my: ['အဆင့်သတ်မှတ်ချက် အမြင့်ဆုံး (4.8★)', 'စင်ကာပူ မြောက်ပိုင်းတွင် ယာဉ်အင်အားနည်း လမ်းများ', 'Woodlands MRT နှင့် နီးကပ်'],
      ja: ['最高評価の教習所（4.8★）', '北部の静かな道路環境', 'ウッドランズMRT近く'],
    },
  },
];

const SG_REQUIREMENTS = [
  {
    icon: '🪪',
    label: { en: 'Valid ID', my: 'မှတ်ပုံတင် / FIN', ja: '有効な身分証明書' },
    detail: {
      en: 'NRIC (citizen / PR) or FIN with valid EP, S Pass, WP, DP, or LTVP',
      my: 'NRIC (နိုင်ငံသား/PR) သို့မဟုတ် FIN (EP, S Pass, WP, DP, LTVP ရှိသူ)',
      ja: 'NRIC（市民・永住者）またはFIN（EP・Sパス・WP・DP・LTVP所持者）',
    },
  },
  {
    icon: '👁️',
    label: { en: 'Eyesight test', my: 'မျက်စိစစ်ဆေး', ja: '視力検査' },
    detail: {
      en: 'Minimum 6/9 vision in each eye (corrected). Tested on-site at registration — free',
      my: 'မျက်စိတစ်ဖက်စီ အနည်းဆုံး 6/9 (မျက်မှန်ဖြင့်). မှတ်ပုံတင်ချိန် စစ်ဆေး — အခမဲ့',
      ja: '各眼 6/9 以上（矯正可）。登録時に無料で検査あり',
    },
  },
  {
    icon: '🎂',
    label: { en: 'Minimum age', my: 'အသက်အနည်းဆုံး', ja: '最低年齢' },
    detail: {
      en: 'Class 3 / 3A car: 17 years old · Class 2B / 2A / 2 motorcycle: 18 years old',
      my: 'Class 3 / 3A ကား: ၁၇ နှစ် · Class 2B / 2A / 2 ဆိုင်ကယ်: ၁၈ နှစ်',
      ja: 'Class 3 / 3A（普通車）：17歳 · Class 2B / 2A / 2（バイク）：18歳',
    },
  },
  {
    icon: '🚫',
    label: { en: 'Not disqualified', my: 'ပိတ်ပင်မခံရဘဲ', ja: '資格停止なし' },
    detail: {
      en: 'Must not be under a driving disqualification order or have a suspended licence',
      my: 'မောင်းနှင်ခွင့် ဆိုင်းငံ့ ခြင်း သို့ လိုင်စင် ပိတ်ပင်ခြင်း မခံထားရ',
      ja: '運転資格停止中または免許停止中でないこと',
    },
  },
  {
    icon: '🌐',
    label: { en: 'Foreigners', my: 'နိုင်ငံခြားသားများ', ja: '外国籍の方' },
    detail: {
      en: 'Valid long-term pass required (EP, S Pass, WP, DP, LTVP). Tourist visa holders cannot register',
      my: 'ရေရှည်ဗီဇာ (EP, S Pass, WP, DP, LTVP) လိုအပ်သည်။ ခရီးသွားဗီဇာဖြင့် မှတ်ပုံတင်၍ မရ',
      ja: '有効な長期ビザ（EP・Sパス・WP・DP・LTVP）が必要。観光ビザ保持者は登録不可',
    },
  },
];

const SG_STEPS = [
  {
    n: 1,
    icon: '📋',
    title: { en: 'Register & Pass Eyesight Test', my: 'မှတ်ပုံတင်ပြီး မျက်စိစစ်ဆေးပါ', ja: '入校登録・視力検査' },
    body: {
      en: "Register online or walk in to the centre. Bring your NRIC/FIN and pass a basic eyesight check on-site. Pay the registration fee (~S$6–10). You will be enrolled in the centre's system.",
      my: "ကျောင်းသို့ တိုက်ရိုက် သွားရောက် သို့ အွန်လိုင်းမှ မှတ်ပုံတင်ပါ။ NRIC/FIN ယူဆောင်ပြီး မျက်စိစမ်းသပ်မှုကို ကျောင်းတွင် ဖြတ်ပါ။ မှတ်ပုံတင်ကြေး (~S$6–10) ပေးပြီး ကျောင်း၏ system တွင် ဝင်ရောက်မည်။",
      ja: '教習所に直接来校またはオンラインで申し込み。NRIC/FINを持参し、簡単な視力検査を受けます。登録料（約S$6〜10）を支払い、教習所システムに登録されます。',
    },
  },
  {
    n: 2,
    icon: '📝',
    title: { en: 'Book & Pass the BTT', my: 'BTT မှာကြိုတင် မှတ်ပုံတင်ပြီး ဖြေဆိုပါ', ja: 'BTTを予約・合格' },
    body: {
      en: 'Book the Basic Theory Test via OneMotoring (onemotoring.lta.gov.sg). The test has 50 multiple-choice questions — pass mark is 45/50 (90%). Fee: S$7.09. You can retake after 3 days if needed.',
      my: 'OneMotoring မှတဆင့် BTT မှာ ကြိုတင်မှတ်ပုံတင်ပါ။ မေးခွန်း ၅၀ ပုဒ်ရှိပြီး ၄၅/၅၀ (90%) ရမှတ် ရမှ အောင်သည်။ ကြေး: S$7.09. မအောင်က ၃ ရက်ကြာ ပြန်ဖြေနိုင်သည်။',
      ja: 'OneMotoring（onemotoring.lta.gov.sg）でBTTを予約。50問の選択式、合格点は45/50（90%）。受験料：S$7.09。不合格でも3日後に再受験可。',
    },
  },
  {
    n: 3,
    icon: '🚗',
    title: { en: 'Start Practical Lessons', my: 'လက်တွေ့ သင်ခန်းများ စတင်ပါ', ja: '技能教習の開始' },
    body: {
      en: "Book circuit and road lessons through the centre's portal. A Class 3 course typically takes 20–35 lessons depending on ability. Each lesson is 1 hour. Peak-hour slots cost slightly more.",
      my: "ကျောင်း portal မှတဆင့် ကွင်းပေါ် နှင့် လမ်းပေါ် သင်ကြားခန်းများ မှာပါ။ Class 3 သင်တန်းတွင် ကျွမ်းကျင်မှုပေါ်မူတည်ကာ ပုံမှန် ၂၀–၃၅ ခန်း ကြာသည်။ တစ်ခန်း ၁ နာရီ။",
      ja: '教習所のポータルで場内・路上教習を予約。Class 3の場合、通常20〜35時限（能力次第）。1時限1時間。ピーク時間帯はやや高め。',
    },
  },
  {
    n: 4,
    icon: '📖',
    title: { en: 'Book & Pass the FTT', my: 'FTT မှာကြိုတင် မှတ်ပုံတင်ပြီး ဖြေဆိုပါ', ja: 'FTTを予約・合格' },
    body: {
      en: 'After completing at least 5 practical lessons, book the Final Theory Test via OneMotoring. 50 questions on advanced driving, hazard perception and expressway rules — 90% pass mark. Fee: S$7.09.',
      my: 'လက်တွေ့သင်ခန်း အနည်းဆုံး ၅ ခု ပြီးသည့်နောက် OneMotoring မှ FTT မှာပါ။ မြင့်မားသောမောင်းနှင်မှု၊ အန္တရာယ်ပညာ၊ expressway စည်းကမ်းများ ၅၀ ပုဒ် — 90% ရမှတ်လိုသည်။ ကြေး: S$7.09.',
      ja: '技能教習5時限以上修了後、OneMotoringでFTTを予約。応用運転・危険予測・高速道路ルールに関する50問、合格点90%。受験料：S$7.09。',
    },
  },
  {
    n: 5,
    icon: '🛣️',
    title: { en: 'Complete Remaining Practical Lessons', my: 'ကျန်ရှိသော လက်တွေ့ သင်ခန်းများ ပြီးဆုံးပါ', ja: '残りの技能教習を修了' },
    body: {
      en: "Continue lessons until the centre's instructor certifies you are ready for the TP test. Most centres require a minimum performance standard before allowing you to book the test.",
      my: "ကျောင်း ဆရာ/ဆရာမ မှ TP စာမေးပွဲ အတွက် အသင့်ဖြစ်ကြောင်း အတည်ပြုသည်အထိ ဆက်လက် သင်ကြားပါ။ ကျောင်းအများစုသည် စာမေးပွဲ မမှာမီ အနည်းဆုံး performance စစ်ဆေးသည်။",
      ja: '教習所の指導員がTP試験の受験準備完了を認定するまで教習を継続。多くの教習所では最低限の技術水準を確認してから試験予約が可能です。',
    },
  },
  {
    n: 6,
    icon: '🏆',
    title: { en: 'Pass the TP Driving Test', my: 'TP မောင်းနှင်မှု စာမေးပွဲ အောင်ပါ', ja: 'TP実技試験に合格' },
    body: {
      en: 'A 45-minute on-road driving test with a Traffic Police evaluator. You start with 20 points — deductions for mistakes. A score of ≤18 demerit points passes. Fee: S$35.97. Rebook if you fail.',
      my: 'ယာဉ်ထိန်းရဲ စစ်ဆေးသူနှင့် ၄၅ မိနစ် လမ်းပေါ် မောင်းနှင်မှု စာမေးပွဲ။ ၂၀ မှတ်ဖြင့် စတင်ပြီး အမှားများပါက နုတ်သည်။ ≤18 negative မှတ်ဖြင့် အောင်သည်။ ကြေး: S$35.97.',
      ja: '交通警察の試験官による45分の路上試験。20点からスタートし、ミスで減点。18点以上残れば合格。受験料：S$35.97。不合格の場合は再予約可。',
    },
  },
  {
    n: 7,
    icon: '🪪',
    title: { en: 'Collect Your Driving Licence', my: 'ကား မောင်းနှင်ခွင့် လိုင်စင် ယူပါ', ja: '免許証の受け取り' },
    body: {
      en: 'After passing, collect your Probationary Driving Licence (PDL) from the Traffic Police counter or via post. Display the PDL plate on your car for 1 year. Full licence issued after 1 year with no serious offences.',
      my: 'အောင်ပြီးနောက် ယာဉ်ထိန်းရဲ ကောင်တာ သို့ ဆောင်ဆောင်မှ Probationary Driving Licence (PDL) ယူပါ။ PDL ပြားကို ၁ နှစ် ကားပေါ် တပ်ဆင်ပါ။ ၁ နှစ် ကြောင်းမဲ့မိမှုမရှိပါက လိုင်စင်အပြည့်ရမည်။',
      ja: '合格後、交通警察の窓口または郵送でPDL（仮免許）を受け取ります。1年間はPDLプレートを車に表示。重大な違反なく1年経過後に本免許が発行されます。',
    },
  },
];

const JP_REGIONS = [
  { name: '東京', url: 'https://www.google.com/maps/search/公安委員会指定+自動車教習所+東京都' },
  { name: '大阪', url: 'https://www.google.com/maps/search/公安委員会指定+自動車教習所+大阪府' },
  { name: '愛知', url: 'https://www.google.com/maps/search/公安委員会指定+自動車教習所+愛知県' },
  { name: '福岡', url: 'https://www.google.com/maps/search/公安委員会指定+自動車教習所+福岡県' },
  { name: '北海道', url: 'https://www.google.com/maps/search/公安委員会指定+自動車教習所+北海道' },
  { name: '神奈川', url: 'https://www.google.com/maps/search/公安委員会指定+自動車教習所+神奈川県' },
  { name: '埼玉', url: 'https://www.google.com/maps/search/公安委員会指定+自動車教習所+埼玉県' },
  { name: '千葉', url: 'https://www.google.com/maps/search/公安委員会指定+自動車教習所+千葉県' },
];

const JP_STEPS = [
  { step: '第1段階', detail: { en: 'In-circuit training — min 10 h (MT) / 9 h (AT) + 10 h theory class', my: 'ကွင်းတွင်း လေ့ကျင့်မှု — MT အနည်းဆုံး ၁၀ နာရီ / AT ၉ နာရီ + သီအိုရီ ၁၀ နာရီ', ja: '場内教習 — MT最低10時限/AT9時限＋学科10時限' }, icon: '🏫' },
  { step: '仮免許試験', detail: { en: '50-question written test + in-circuit skill test at the school', my: 'ကျောင်းတွင် စာဖြေ ၅၀ ပုဒ် + ကွင်းတွင်း ကျွမ်းကျင်မှု စစ်ဆေး', ja: '学科50問の筆記試験＋場内技能試験' }, icon: '📝' },
  { step: '第2段階', detail: { en: 'On-road training — min 19 h + 16 h theory (emergency / highway)', my: 'လမ်းပေါ် လေ့ကျင့်မှု — အနည်းဆုံး ၁၉ နာရီ + သီအိုရီ ၁၆ နာရီ (အရေးပေါ် / expressway)', ja: '路上教習 — 最低19時限＋学科16時限（緊急・高速）' }, icon: '🛣️' },
  { step: '卒業検定', detail: { en: 'School graduation road test — pass = skill test exemption at licence centre', my: 'ကျောင်း ဆင်းစာမေးပွဲ — အောင်ပါက လိုင်စင်စင်တာတွင် လက်တွေ့ မဖြေရ', ja: '卒業検定（路上）に合格すると免許センターでの技能試験が免除' }, icon: '🎓' },
  { step: '本免許学科試験', detail: { en: '95-question written test at the 免許センター — 90% pass mark', my: '免許センター တွင် ၉၅ ပုဒ် စာဖြေ — 90% ရမှတ် လိုသည်', ja: '免許センターで95問の学科試験、合格点90%' }, icon: '🏛️' },
];

function SectionLabel({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div style={{ fontSize: '.72rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.09em', textTransform: 'uppercase', color, marginBottom: 12, borderBottom: `1.5px solid ${color}30`, paddingBottom: 6 }}>
      {children}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: '.85rem' }}>
      <span style={{ flexShrink: 0 }}>{icon}</span>
      <div>
        <span style={{ fontFamily: 'var(--display)', fontWeight: 700 }}>{label}: </span>
        <span style={{ color: 'var(--ink-soft)' }}>{value}</span>
      </div>
    </div>
  );
}

function loc(obj: Record<string, string>, locale: string): string {
  return obj[locale] ?? obj.en;
}

export default function Centres() {
  const t = useTranslations('centre');
  const locale = useLocale() as Locale;
  const { country } = useCountry();
  const [expanded, setExpanded] = useState<string | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  function handleExpand(code: string) {
    const next = expanded === code ? null : code;
    setExpanded(next);
    if (next) {
      setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
    }
  }

  return (
    <section id="centres">
      <div className="wrap">
        <div className="shead">
          <div className="eyebrow">{t('eyebrow')}</div>
          <h2>{t('heading')}</h2>
          <p>{country === 'sg' ? t('sub_sg') : t('sub_jp')}</p>
        </div>

        {country === 'sg' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Summary cards row */}
            <div className="ccentres-grid">
              {CENTRES_SG.map(c => (
                <div key={c.code} className="ccentre-card" style={{ cursor: 'pointer', outline: expanded === c.code ? `2px solid ${c.color}` : undefined }} onClick={() => handleExpand(c.code)}>
                  <div className="ccentre-header" style={{ background: `linear-gradient(135deg, ${c.color}22 0%, ${c.color}44 100%)`, borderBottom: `3px solid ${c.color}` }}>
                    <div className="ccentre-code" style={{ color: c.color }}>{c.code}</div>
                  </div>
                  <div className="ccentre-body">
                    <h3 className="ccentre-name">{c.name}</h3>
                    <div className="ccentre-area">{loc(c.area, locale)}</div>
                    <div className="ccentre-addr">{c.addr}</div>
                    <p className="ccentre-desc">{loc(c.desc, locale)}</p>
                    <div className="ccentre-foot">
                      {c.rating ? (
                        <span className="ccentre-rating">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--guide)">
                            <path d="M12 2l3 6.3 6.9 1-5 4.8 1.2 6.9L12 17.8 5.9 21l1.2-6.9-5-4.8 6.9-1z" />
                          </svg>
                          {c.rating}
                        </span>
                      ) : <span />}
                      <button
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.82rem', color: c.color, padding: 0 }}
                        onClick={e => { e.stopPropagation(); handleExpand(c.code); }}
                      >
                        {expanded === c.code ? t('hide_details') : t('view_details')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Expanded detail panel */}
            {expanded && (() => {
              const c = CENTRES_SG.find(x => x.code === expanded)!;
              return (
                <div ref={detailRef} style={{ background: '#fff', border: `2px solid ${c.color}`, borderRadius: 18, overflow: 'hidden' }}>
                  {/* Panel header */}
                  <div className="ccentre-detail-header" style={{ background: `linear-gradient(135deg, ${c.color}18 0%, ${c.color}30 100%)`, borderBottom: `2px solid ${c.color}30`, padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                      <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.3rem', color: c.color }}>{c.code}</div>
                      <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1rem', color: 'var(--asphalt)' }}>{c.name}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: '.82rem', fontFamily: 'var(--display)', fontWeight: 700, padding: '7px 14px', borderRadius: 8, background: 'var(--asphalt)', color: '#fff', textDecoration: 'none' }}>
                        {t('directions')}
                      </a>
                      <a href={c.website} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: '.82rem', fontFamily: 'var(--display)', fontWeight: 700, padding: '7px 14px', borderRadius: 8, border: `1.5px solid ${c.color}`, color: c.color, textDecoration: 'none' }}>
                        {t('visit_website')}
                      </a>
                    </div>
                  </div>

                  <div className="ccentres-detail-inner" style={{ padding: '20px 16px 28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>

                    {/* Contact & Info */}
                    <div>
                      <SectionLabel color={c.color}>{t('contact_info')}</SectionLabel>
                      <InfoRow icon="📍" label={locale === 'ja' ? '住所' : locale === 'my' ? 'လိပ်စာ' : 'Address'} value={c.addr} />
                      <InfoRow icon="📞" label={locale === 'ja' ? '電話' : locale === 'my' ? 'ဖုန်း' : 'Phone'} value={c.phone} />
                      <InfoRow icon="🕐" label={locale === 'ja' ? '営業時間' : locale === 'my' ? 'ဖွင့်ချိန်' : 'Hours'} value={loc(c.hours, locale)} />
                      <div style={{ marginTop: 14 }}>
                        <div style={{ fontSize: '.72rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 8 }}>{t('highlights_label')}</div>
                        {(c.highlights[locale] ?? c.highlights.en).map((h: string) => (
                          <div key={h} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: '.85rem', color: 'var(--ink-soft)' }}>
                            <span style={{ color: c.color, fontWeight: 700 }}>✓</span>{h}
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: 14 }}>
                        <div style={{ fontSize: '.72rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 8 }}>{t('classes_label')}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {(c.classes[locale] ?? c.classes.en).map((cl: string) => (
                            <span key={cl} style={{ fontSize: '.82rem', background: `${c.color}12`, color: c.color, padding: '4px 10px', borderRadius: 6, fontFamily: 'var(--display)', fontWeight: 600, width: 'fit-content' }}>{cl}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ marginTop: 14, background: 'var(--paint)', borderRadius: 10, padding: '12px 14px' }}>
                        <div style={{ fontSize: '.72rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 8 }}>{t('fees_label')}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem' }}>
                            <span style={{ color: 'var(--ink-soft)' }}>{t('fee_car')}</span>
                            <span style={{ fontFamily: 'var(--display)', fontWeight: 700 }}>{loc(c.fees.car, locale)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem' }}>
                            <span style={{ color: 'var(--ink-soft)' }}>{t('fee_moto')}</span>
                            <span style={{ fontFamily: 'var(--display)', fontWeight: 700 }}>{loc(c.fees.moto, locale)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.85rem' }}>
                            <span style={{ color: 'var(--ink-soft)' }}>{t('fee_reg')}</span>
                            <span style={{ fontFamily: 'var(--display)', fontWeight: 700 }}>{loc(c.fees.reg, locale)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div>
                      <SectionLabel color={c.color}>{t('requirements')}</SectionLabel>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {SG_REQUIREMENTS.map(r => (
                          <div key={r.icon} style={{ display: 'flex', gap: 12, background: 'var(--paint)', borderRadius: 10, padding: '10px 14px' }}>
                            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{r.icon}</span>
                            <div>
                              <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.85rem', marginBottom: 2 }}>{loc(r.label, locale)}</div>
                              <div style={{ fontSize: '.8rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{loc(r.detail, locale)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Step-by-step */}
                    <div style={{ gridColumn: '1 / -1' }}>
                      <SectionLabel color={c.color}>{t('steps_heading')}</SectionLabel>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                        {SG_STEPS.map(s => (
                          <div key={s.n} style={{ display: 'flex', gap: 14, background: 'var(--paint)', borderRadius: 12, padding: '14px 16px' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: c.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontWeight: 800, fontSize: '.85rem', flexShrink: 0 }}>{s.n}</div>
                            <div>
                              <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.88rem', marginBottom: 4 }}>{s.icon} {loc(s.title, locale)}</div>
                              <div style={{ fontSize: '.78rem', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{loc(s.body, locale)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="centre-jp">
            {/* Intro */}
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 8 }}>{t('jp_1')}</p>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 28 }}>{t('jp_2')}</p>

            {/* Course flow */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: '.72rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 14 }}>
                {locale === 'ja' ? '指定校コースの流れ' : locale === 'my' ? 'သင်တန်းအဆင့်များ' : 'Designated-school course flow'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {JP_STEPS.map((s, i) => (
                  <div key={s.step} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--asphalt)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>{s.icon}</div>
                      {i < JP_STEPS.length - 1 && <div style={{ width: 2, flex: 1, background: 'var(--line)', minHeight: 18, margin: '3px 0' }} />}
                    </div>
                    <div style={{ paddingBottom: i < JP_STEPS.length - 1 ? 18 : 0, paddingTop: 6 }}>
                      <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.9rem', marginBottom: 2 }}>{s.step}</div>
                      <div style={{ fontSize: '.82rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{loc(s.detail, locale)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Find a school by region */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: '.72rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 12 }}>
                {locale === 'ja' ? '都道府県別 — Google マップで検索' : locale === 'my' ? 'ခရိုင်အလိုက် Google Maps မှာ ရှာဖွေပါ' : 'Find a school — search on Google Maps'}
              </div>
              <div className="regions">
                {JP_REGIONS.map(r => (
                  <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="region" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                    {r.name} →
                  </a>
                ))}
              </div>
              <p style={{ fontSize: '.78rem', color: 'var(--ink-soft)', marginTop: 12, lineHeight: 1.6 }}>
                {locale === 'ja'
                  ? '各ボタンをタップするとGoogle マップで指定校を検索できます。ピンをタップして住所・口コミ・連絡先を確認してください。'
                  : locale === 'my'
                  ? 'ခလုတ်တစ်ခုကို နှိပ်လိုက်ရင် ထို prefecture ရှိ 公安委員会指定 ကျောင်းများကို Google Maps မှာ ပြပေးမည်။ pin ကို နှိပ်ပြီး လိပ်စာ၊ review နှင့် ဆက်သွယ်ရန် အချက်အလက် ကြည့်နိုင်သည်။'
                  : 'Each button opens a Google Maps search for 公安委員会指定 schools in that prefecture — tap a pin to see address, reviews and contact details.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
