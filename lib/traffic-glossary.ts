export interface GlossaryTerm {
  en: string;
  my: string;
  ja: string;
}

export interface GlossaryCategory {
  id: 'signs' | 'rules' | 'vehicle' | 'licence' | 'penalties' | 'expressway';
  terms: GlossaryTerm[];
}

export const TRAFFIC_GLOSSARY: GlossaryCategory[] = [
  {
    id: 'signs',
    terms: [
      { en: 'Stop sign', my: 'ရပ်ဆိုင်းဆိုင်းဘုတ်', ja: '一時停止（いちじていし）' },
      { en: 'Give way / Yield sign', my: 'လမ်းပေးဆိုင်းဘုတ်', ja: '譲れ（ゆずれ）' },
      { en: 'No entry', my: 'ဝင်ခွင့်မရှိ', ja: '進入禁止（しんにゅうきんし）' },
      { en: 'One-way street', my: 'တစ်လမ်းသွားလမ်း', ja: '一方通行（いっぽうつうこう）' },
      { en: 'Warning sign (triangle)', my: 'သတိပေးဆိုင်းဘုတ် (တြိဂံ)', ja: '警戒標識（けいかいひょうしき）' },
      { en: 'Mandatory sign (blue circle)', my: 'လိုက်နာရမည့် ဆိုင်းဘုတ် (အပြာဝိုင်း)', ja: '規制標識（きせいひょうしき）' },
      { en: 'Prohibitory sign (red circle)', my: 'တားမြစ်ဆိုင်းဘုတ် (အနီဝိုင်း)', ja: '禁止標識（きんしひょうしき）' },
      { en: 'Zebra crossing', my: 'ကြက်ဆောင်လမ်းဖြတ်', ja: '横断歩道（おうだんほどう）' },
      { en: 'Zig-zag lines', my: 'ဇစ်ဇက်လိုင်း (zig-zag)', ja: 'ゼブラゾーン / 斜線' },
      { en: 'Yellow box junction', my: 'အဝါရောင် box junction', ja: '黄色ボックス' },
      { en: 'Double yellow lines', my: 'အဝါနှစ်ကြောင်း', ja: '二重黄線（にじゅうおうせん）' },
      { en: 'Bus lane', my: 'ဘတ်စ်ကားလမ်း', ja: 'バスレーン' },
      { en: 'Centre line', my: 'လမ်းအလယ်မျဉ်း', ja: '中央線（ちゅうおうせん）' },
      { en: 'Broken white line', my: 'အဖြတ်ဖြတ်ဖြူရောင်မျဉ်း', ja: '破線（はせん）' },
      { en: 'Solid white line', my: 'ဆက်တိုက် ဖြူရောင်မျဉ်း', ja: '実線（じっせん）' },
    ],
  },
  {
    id: 'rules',
    terms: [
      { en: 'Traffic light', my: 'မီးပွိုင့်', ja: '信号機（しんごうき）' },
      { en: 'Roundabout', my: 'လည်ပတ်လမ်းဆုံ', ja: 'ロータリー / 環状交差点' },
      { en: 'Intersection', my: 'လမ်းဆုံ', ja: '交差点（こうさてん）' },
      { en: 'Right of way', my: 'ဦးစားပေး ဖြတ်သန်းခွင့်', ja: '優先権（ゆうせんけん）' },
      { en: 'Give way / Yield', my: 'လမ်းပေးရမည်', ja: '譲れ / 徐行（じょこう）' },
      { en: 'Pedestrian', my: 'လမ်းသွားပြည်သူ', ja: '歩行者（ほこうしゃ）' },
      { en: 'Speed limit', my: 'အမြန်နှုန်း ကန့်သတ်ချက်', ja: '速度制限（そくどせいげん）' },
      { en: 'Following distance', my: 'နောက်လိုက်အကွာအဝေး', ja: '車間距離（しゃかんきょり）' },
      { en: 'Overtake', my: 'ကျော်ဖြတ်', ja: '追い越し（おいこし）' },
      { en: 'U-turn', my: 'U ကွေ့', ja: 'Uターン' },
      { en: 'Lane', my: 'လမ်းကြောင်း', ja: '車線（しゃせん）' },
      { en: 'Full stop', my: 'လုံးဝရပ်ခြင်း', ja: '完全停止（かんぜんていし）' },
      { en: 'Joko (slow driving)', my: '徐行 (joko) — 1m အတွင်း ရပ်နိုင်သည့် အမြန်နှုန်း', ja: '徐行（じょこう）' },
      { en: 'Blind spot', my: 'မမြင်ရသောနေရာ', ja: '死角（しかく）' },
    ],
  },
  {
    id: 'vehicle',
    terms: [
      { en: 'Seat belt', my: 'ကိုယ်ဘေးကာ', ja: 'シートベルト' },
      { en: 'Headlights', my: 'ရှေ့မီး', ja: 'ヘッドライト' },
      { en: 'Hazard lights', my: 'အဆင့်ဆင့်မီးများ', ja: 'ハザードランプ' },
      { en: 'Horn', my: 'ဘိလပ်ငှေ့ (ကင်ပွန်း)', ja: 'クラクション / 警音器' },
      { en: 'Tyre', my: 'တာယာ', ja: 'タイヤ' },
      { en: 'Brakes', my: 'ဘရိတ်', ja: 'ブレーキ' },
      { en: 'Mirrors', my: 'နောက်ကြည့်မှန်', ja: 'ミラー' },
      { en: 'Indicator / Turn signal', my: 'လမ်းကြောင်းပြ မီး', ja: '方向指示器（ほうこうしじき）' },
      { en: 'Child restraint', my: 'ကလေးထိုင်ခုံ', ja: 'チャイルドシート' },
      { en: 'Helmet (motorcycle)', my: 'ဟယ်လ်မက်', ja: 'ヘルメット' },
    ],
  },
  {
    id: 'licence',
    terms: [
      { en: 'Driving licence', my: 'ကားမောင်းလိုင်စင်', ja: '運転免許証（うんてんめんきょしょう）' },
      { en: 'Probationary licence', my: 'ယာယီ / probationary လိုင်စင်', ja: '仮免許（かりめんきょ）' },
      { en: 'BTT (Basic Theory Test)', my: 'BTT — အခြေခံ သီအိုရီ', ja: 'BTT（基礎学科）' },
      { en: 'FTT (Final Theory Test)', my: 'FTT — နောက်ဆုံး သီအိုရီ', ja: 'FTT（最終学科）' },
      { en: 'RTT (Riding Theory Test)', my: 'RTT — ဆိုင်ကယ် သီအိုရီ', ja: 'RTT（二輪学科）' },
      { en: 'Provisional licence (仮免)', my: '仮免 — ယာယီလိုင်စင် (ဂျပန်)', ja: '仮免許（かりめんきょ）' },
      { en: 'Full licence (本免)', my: '本免 — တရားဝင်လိုင်စင် (ဂျပန်)', ja: '本免許（ほんめんきょ）' },
      { en: 'Hazard perception', my: 'အန္တရာယ်ခန့်မှန်းခြင်း', ja: '危険予測（きけんよそく）' },
    ],
  },
  {
    id: 'penalties',
    terms: [
      { en: 'Demerit points', my: 'အမှတ်နုတ်', ja: '違反点数（いはんてんすう）' },
      { en: 'Suspension (licence)', my: 'လိုင်စင် ရပ်ဆိုင်းခြင်း', ja: '免許停止（めんきょていし）' },
      { en: 'Revocation', my: 'လိုင်စင် ပယ်ဖျက်ခြင်း', ja: '取消し（とりけし）' },
      { en: 'Composition fine', my: 'ပြစ်ဒဏ်ငွေ (composition)', ja: '反則金（はんそくきん）' },
      { en: 'BAC (blood alcohol)', my: 'သွေးတွင်းအရက်ဓာတ်', ja: '血中アルコール濃度' },
      { en: 'Drink-driving', my: 'အရက်သောက်မောင်းခြင်း', ja: '飲酒運転（いんしゅうんてん）' },
      { en: 'Traffic offence', my: 'ယာဉ်စည်းမျဉ်းချိုးဖောက်မှု', ja: '交通違反（こうつういはん）' },
    ],
  },
  {
    id: 'expressway',
    terms: [
      { en: 'Expressway', my: 'မြန်နှုန်းလမ်း', ja: '高速道路（こうそくどうろ）' },
      { en: 'Emergency lane', my: 'အရေးပေါ် လမ်းကြောင်း', ja: '路肩（ろかた）' },
      { en: 'Minimum speed', my: 'အနည်းဆုံး အမြန်နှုန်း', ja: '最低速度（さいていそくど）' },
      { en: 'Tunnel', my: 'တန်နယ်', ja: 'トンネル' },
      { en: 'School zone', my: 'ကျောင်းဇုန်', ja: 'スクールゾーン' },
      { en: 'Silver zone', my: 'Silver zone (သက်ကြီးရွယ်အို)', ja: 'シルバーゾーン' },
      { en: 'Kerb', my: 'လမ်းနောင်', ja: '縁石（えんせき）' },
      { en: 'Median', my: 'လမ်းအလယ်ပိုင်း', ja: '中央分離帯（ちゅうおうぶんりたい）' },
      { en: 'Turning radius', my: 'ကွေ့ကောက်အချင်းဝက်', ja: '旋回半径（せんかいはんけい）' },
    ],
  },
];

export const GLOSSARY_TERM_COUNT = TRAFFIC_GLOSSARY.reduce((n, c) => n + c.terms.length, 0);
