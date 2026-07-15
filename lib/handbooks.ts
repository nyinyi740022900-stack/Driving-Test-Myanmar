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
    downloadUrl: 'https://www.police.gov.sg/-/media/Spf/Advisories/BT-ENG-101024.ashx',
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
    downloadUrl: 'https://www.police.gov.sg/-/media/SPF/Advisories/FTTEN24.pdf',
    sourceLabelEn: 'Singapore Police Force',
    sourceLabelMy: 'Singapore Police Force',
    sourceLabelJa: 'シンガポール警察',
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
    descEn: 'National Police Agency circular — official car licence written exam format, syllabus and scoring (仮免・本免).',
    descMy: 'နိုင်ငံတော်ရဲချုပ် တရားဝင် စာတမ်း — ကား လိုင်စင် စာမေးပွဲ ပုံစံ၊ သင်ရိုးညွှန်းနှင့် အမှတ်ပေးစည်းမျဉ်း (仮免・本免)။',
    descJa: '警察庁の公式通達 — 普通免許学科試験の出題形式・範囲・配点（仮免・本免）。',
    downloadUrl: 'https://www.npa.go.jp/laws/notification/koutuu/menkyo/menkyo20230330_46.pdf',
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
    descEn: 'Same NPA circular covers motorcycle (二輪) written exam format, syllabus and scoring rules.',
    descMy: 'နိုင်ငံတော်ရဲချုပ် တရားဝင် စာတမ်း — ဆိုင်ကယ် (二輪) စာမေးပွဲ ပုံစံ၊ သင်ရိုးညွှန်းနှင့် အမှတ်ပေးစည်းမျဉ်း ပါဝင်သည်။',
    descJa: '警察庁の公式通達 — 二輪免許学科試験の出題形式・範囲・配点を含みます。',
    downloadUrl: 'https://www.npa.go.jp/laws/notification/koutuu/menkyo/menkyo20230330_46.pdf',
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
