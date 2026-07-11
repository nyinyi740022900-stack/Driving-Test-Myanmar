export type Category = 'sg_btt' | 'sg_ftt' | 'sg_rtt' | 'jp_car' | 'jp_moto';
export type Country = 'sg' | 'jp';
export type MediaType = 'image' | 'animation';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Locale = 'en' | 'my' | 'ja';

export type Localized = Partial<Record<Locale, string>>;

export interface Media {
  type: MediaType;
  src: string;
  alt: Localized;
}

export interface Choice {
  text: Localized;
}

/** JP 危険予測問題 — three true/false sub-statements (ア/イ/ウ); all must be correct. */
export interface QuestionPart {
  label?: string;
  prompt: Localized;
  /** 0 = 正しい, 1 = 誤り */
  answer: number;
}

export interface Question {
  id: string;
  category: Category;
  topic: string;
  difficulty: Difficulty;
  prompt: Localized;
  choices: Choice[];
  answer: number;
  explanation: Localized;
  media?: Media;
  /** Handbook syllabus section id (Method A coverage tracking). */
  syllabusRef?: string;
  /** Official-style hazard illustration with ア/イ/ウ sub-parts. */
  parts?: QuestionPart[];
  /** Points in mock scoring (hazard illustration = 2). */
  points?: number;
  /** Exam-style practice set mapped to BTT topic progression (not copied papers). */
  inspiredSet?: {
    id: string;
    number: number;
    title?: string;
    titleMy?: string;
    /** Internal reference to practice-paper topic focus (e.g. btt-test-1). */
    refPaper?: string;
  };
}

export const CATEGORY_COUNTRY: Record<Category, Country> = {
  sg_btt: 'sg',
  sg_ftt: 'sg',
  sg_rtt: 'sg',
  jp_car: 'jp',
  jp_moto: 'jp',
};

export interface TestMeta {
  category: Category;
  tag: string;
  /** Total practice questions in the JSON bank (learn / practise modes). */
  bankQuestionCount: number;
  /** Questions drawn per mock test session (official exam size). */
  questionCount: number;
  /** JP 本免許試験 is officially 50 min for 95 questions; SG tests are 50 min for 50 questions. */
  timeLimitMinutes: number;
  passPercent: number;
  nameEn: string;
  nameMy: string;
  nameJa: string;
  descEn: string;
  descMy: string;
  descJa: string;
}

export type SubscriptionStatus = 'free' | 'premium';

export interface Subscription {
  id: string;
  user_id: string;
  status: SubscriptionStatus;
  expires_at: string | null;
  created_at: string;
}

export interface UserDevice {
  id: string;
  device_id: string;
  device_label: string;
  last_seen_at: string;
  created_at: string;
}

export const MAX_DEVICES_PER_USER = 2;

export interface PaymentSubmission {
  id: string;
  user_id: string;
  plan: 'monthly' | 'yearly';
  amount: number;
  wallet: 'KBZPay' | 'WavePay';
  transaction_id: string;
  screenshot_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by: string | null;
  reviewed_at: string | null;
  notes: string | null;
  created_at: string;
  user_email?: string;
}

export type ReviewCategory = Category | 'general';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface MemberReview {
  id: string;
  user_id: string;
  country: Country;
  category: ReviewCategory;
  display_name: string;
  title: string;
  body: string;
  rating: number;
  passed: boolean | null;
  status: ReviewStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notes: string | null;
  created_at: string;
  user_email?: string;
}

export type FeedbackType = 'bug' | 'difficulty' | 'feedback' | 'other';
export type FeedbackArea = 'quiz' | 'account' | 'payment' | 'content' | 'ui' | 'other';
export type FeedbackStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed';
export type FeedbackPriority = 'low' | 'normal' | 'high';

export interface UserFeedback {
  id: string;
  user_id: string | null;
  country: Country | null;
  locale: Locale | null;
  type: FeedbackType;
  area: FeedbackArea;
  subject: string;
  body: string;
  page_url: string | null;
  contact_email: string | null;
  status: FeedbackStatus;
  priority: FeedbackPriority;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  user_email?: string;
}

/** Japan practice question total — sum of jp_car + jp_moto bank counts (must stay 600). */
export const JP_PRACTICE_QUESTION_TOTAL = 600;

/** Practice question total for overview UI. */
export function getCountryBankTotal(country: Country): number {
  return TEST_META
    .filter(m => CATEGORY_COUNTRY[m.category] === country)
    .reduce((sum, m) => sum + m.bankQuestionCount, 0);
}

export const TEST_META: TestMeta[] = [
  {
    category: 'sg_btt',
    tag: 'BTT',
    bankQuestionCount: 500,
    questionCount: 50,
    timeLimitMinutes: 50,
    passPercent: 90,
    nameEn: 'Basic Theory Test',
    nameMy: 'အခြေခံ သီအိုရီ စာမေးပွဲ',
    nameJa: 'BTT',
    descEn: 'Your first test — traffic signs, road markings and basic rules.',
    descMy: 'ပထမဆုံး စာမေးပွဲ — ယာဉ်ဆိုင်ရာ ဆိုင်းဘုတ်များ၊ လမ်းအမှတ်အသားနှင့် အခြေခံစည်းမျဉ်းများ။',
    descJa: 'シンガポール基礎学科試験 — 道路標識・路面標示・基本ルール。',
  },
  {
    category: 'sg_ftt',
    tag: 'FTT',
    bankQuestionCount: 500,
    questionCount: 50,
    timeLimitMinutes: 50,
    passPercent: 90,
    nameEn: 'Final Theory Test',
    nameMy: 'နောက်ဆုံး သီအိုရီ စာမေးပွဲ',
    nameJa: 'FTT',
    descEn: 'After practical lessons — hazard perception and advanced driving.',
    descMy: 'လက်တွေ့သင်တန်းပြီးနောက် — အန္တရာယ်ခန့်မှန်းခြင်းနှင့် အဆင့်မြင့် ယာဉ်မောင်းနည်း။',
    descJa: '実技教習後 — 危険予測と高度な運転技術。',
  },
  {
    category: 'sg_rtt',
    tag: 'RTT',
    bankQuestionCount: 109,
    questionCount: 50,
    timeLimitMinutes: 50,
    passPercent: 90,
    nameEn: 'Riding Theory Test',
    nameMy: 'ဆိုင်ကယ် သီအိုရီ စာမေးပွဲ',
    nameJa: 'RTT',
    descEn: 'For motorcycle riders — Class 2B, 2A and 2 theory.',
    descMy: 'ဆိုင်ကယ်စီးသူများအတွက် — Class 2B, 2A နှင့် 2 သီအိုရီ။',
    descJa: 'バイク用学科試験 — Class 2B, 2A, 2。',
  },
  {
    category: 'jp_car',
    tag: '普通免許',
    bankQuestionCount: 350,
    questionCount: 95,
    timeLimitMinutes: 50,
    passPercent: 90,
    nameEn: 'Car Licence (Standard)',
    nameMy: 'ကား လိုင်စင် (ပုံမှန်)',
    nameJa: '普通自動車免許',
    descEn: 'Provisional and final written tests for car licence.',
    descMy: 'ကားမောင်းလိုင်စင်အတွက် ယာယီ (仮免) နှင့် တရားဝင် (本免) စာမေးပွဲများ။',
    descJa: '仮免許と本免許の学科試験。標識・標示・交通ルールを完全カバー。',
  },
  {
    category: 'jp_moto',
    tag: '二輪免許',
    bankQuestionCount: 250,
    questionCount: 95,
    timeLimitMinutes: 50,
    passPercent: 90,
    nameEn: 'Motorcycle Licence',
    nameMy: 'ဆိုင်ကယ် လိုင်စင်',
    nameJa: '二輪自動車免許',
    descEn: 'Theory test for motorcycle licence — small and standard.',
    descMy: 'ဆိုင်ကယ်လိုင်စင်အတွက် သီအိုရီစာမေးပွဲ — အသေးစားနှင့် ပုံမှန် နှစ်မျိုးလုံး။',
    descJa: '小型・普通二輪免許の学科試験対策。',
  },
];
