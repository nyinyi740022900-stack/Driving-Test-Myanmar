import type { Country } from './types';

export interface Handbook {
  id: string;
  country: Country;
  tag: string;
  titleEn: string;
  titleMy: string;
  titleJa: string;
  descEn: string;
  descMy: string;
  descJa: string;
  /** Official PDF or resource URL — opens in new tab */
  downloadUrl: string;
  /** Optional unofficial Myanmar-translated PDF hosted locally in /public */
  translatedUrl?: string;
  sourceLabelEn: string;
  sourceLabelMy: string;
  sourceLabelJa: string;
}

export const HANDBOOKS: Handbook[] = [
  {
    id: 'sg_btt',
    country: 'sg',
    tag: 'BTT',
    titleEn: 'Basic Theory of Driving',
    titleMy: 'အခြေခံ ယာဉ်မောင်းသီအိုရီ',
    titleJa: '基礎運転理論',
    descEn: 'Official Traffic Police handbook for the Basic Theory Test — signs, rules and safe driving.',
    descMy: 'BTT အတွက် Traffic Police တရားဝင် handbook — ဆိုင်းဘုတ်၊ စည်းမျဉ်းနှင့် လုံခြုံမောင်းနှင်နည်း။',
    descJa: 'シンガポール基礎学科試験の公式ハンドブック。',
    downloadUrl: 'https://www.police.gov.sg/-/media/Spf/Files/TP/Online-Learning-Portal/FINAL-English-Updated-cover-v2-10th-Edition-BTT-(270218).pdf',
    translatedUrl: '/handbooks/sg-btt-myanmar.pdf',
    sourceLabelEn: 'Singapore Police Force',
    sourceLabelMy: 'Singapore Police Force',
    sourceLabelJa: 'シンガポール警察',
  },
  {
    id: 'sg_ftt',
    country: 'sg',
    tag: 'FTT',
    titleEn: 'Final Theory of Driving',
    titleMy: 'နောက်ဆုံး ယာဉ်မောင်းသီအိုရီ',
    titleJa: '最終運転理論',
    descEn: 'Official handbook for the Final Theory Test — expressways, hazards and advanced rules.',
    descMy: 'FTT အတွက် တရားဝင် handbook — အမြန်လမ်း၊ အန္တရာယ်နှင့် အဆင့်မြင့် စည်းမျဉ်းများ။',
    descJa: '最終学科試験の公式ハンドブック。',
    downloadUrl: 'https://www.police.gov.sg/E-Services/Practise-Driving-and-Riding-Theory-Test',
    translatedUrl: '/handbooks/sg-ftt-myanmar.pdf',
    sourceLabelEn: 'Singapore Police Force — online portal',
    sourceLabelMy: 'Singapore Police Force — အွန်လိုင်း portal',
    sourceLabelJa: 'シンガポール警察オンラインポータル',
  },
  {
    id: 'sg_rtt',
    country: 'sg',
    tag: 'RTT',
    titleEn: 'Riding Theory Booklet',
    titleMy: 'ဆိုင်ကယ် သီအိုရီ စာအုပ်',
    titleJa: '二輪理論ブックレット',
    descEn: 'Official motorcycle riding theory handbook for Class 2B riders.',
    descMy: 'Class 2B ဆိုင်ကယ်စီးသူများအတွက် တရားဝင် riding theory handbook။',
    descJa: '二輪免許学科試験の公式ブックレット。',
    downloadUrl: 'https://www.police.gov.sg/-/media/Spf/Files/TP/Online-Learning-Portal/Riding-Theory-Booklet-Official-Handbook.pdf',
    sourceLabelEn: 'Singapore Police Force',
    sourceLabelMy: 'Singapore Police Force',
    sourceLabelJa: 'シンガポール警察',
  },
  {
    id: 'jp_car',
    country: 'jp',
    tag: '普通免許',
    titleEn: 'Car licence study materials',
    titleMy: 'ကား လိုင်စင် လေ့လာရေး ပစ္စည်းများ',
    titleJa: '普通免許 学習資料',
    descEn: 'National Police Agency guidance for provisional and full car licence written tests.',
    descMy: '仮免 နှင့် 本免 ကား လိုင်စင် စာမေးပွဲအတွက် နိုင်ငံတော်ရဲချုပ် လမ်းညွှန်။',
    descJa: '仮免許・本免許学科試験の警察庁公式ガイド。',
    downloadUrl: 'https://www.npa.go.jp/policies/application/license_renewal/index.html',
    sourceLabelEn: 'National Police Agency (Japan)',
    sourceLabelMy: 'Japan National Police Agency',
    sourceLabelJa: '警察庁',
  },
  {
    id: 'jp_moto',
    country: 'jp',
    tag: '二輪免許',
    titleEn: 'Motorcycle licence study materials',
    titleMy: 'ဆိုင်ကယ် လိုင်စင် လေ့လာရေး ပစ္စည်းများ',
    titleJa: '二輪免許 学習資料',
    descEn: 'Official guidance for motorcycle licence written tests in Japan.',
    descMy: 'Japan ဆိုင်ကယ် လိုင်စင် စာမေးပွဲအတွက် တရားဝင် လမ်းညွှန်။',
    descJa: '二輪免許学科試験の公式ガイド。',
    downloadUrl: 'https://www.npa.go.jp/policies/application/license_renewal/index.html',
    sourceLabelEn: 'National Police Agency (Japan)',
    sourceLabelMy: 'Japan National Police Agency',
    sourceLabelJa: '警察庁',
  },
];

export function getHandbooksForCountry(country: Country): Handbook[] {
  return HANDBOOKS.filter(h => h.country === country);
}

export function pickHandbookText(
  handbook: Handbook,
  field: 'title' | 'desc' | 'sourceLabel',
  locale: string
): string {
  const suffix = locale === 'my' ? 'My' : locale === 'ja' ? 'Ja' : 'En';
  const key = `${field}${suffix}` as keyof Handbook;
  return String(handbook[key]);
}
