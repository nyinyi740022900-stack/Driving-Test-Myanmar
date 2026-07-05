#!/usr/bin/env node
/**
 * Restore familiar English terms in my.json for migrant learners (BTT, Mock Test, mode, etc.)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, '../messages/my.json');

const REPLACEMENTS = [
  ['စမ်းသပ်စာမေးပွဲများ', 'mock tests'],
  ['စမ်းသပ်စာမေးပွဲ', 'Mock Test'],
  ['လေ့လာရေး မုဒ်', 'လေ့လာရေး mode'],
  ['မုဒ် သုံးမျိုး', 'mode သုံးမျိုး'],
  ['မုဒ် ရွေးပါ', 'Mode ရွေးပါ'],
  ['သင်ယူ မုဒ်', 'Learn Mode'],
  ['လေ့ကျင့်ခန်း မုဒ်', 'Practice Mode'],
  ['တုံ့ပြန်ချက်', 'feedback'],
  ['အန်နီမရှင်း', 'animation'],
  ['ငွေလွှဲအမှတ်', 'transaction ID'],
  ['မျက်နှာပြင် ဓာတ်ပုံ', 'screenshot'],
  ['ပြန်လည်ဖွင့်ပါ', 'refresh လုပ်ပါ'],
  ['သီအိုရီစာမေးပွဲ', 'theory test'],
  ['သင်ခန်းစာ နှင့် လေ့ကျင့်ခန်း', 'lesson နှင့် practice'],
  ['BTT သင်ခန်းစာ', 'BTT lesson'],
  ['RTT သင်ခန်းစာ/လေ့ကျင့်ခန်း', 'RTT lesson/practice'],
  ['အခမဲ့ အကောင့်', 'အခမဲ့ account'],
  ['အမျိုးအစား တစ်ခုစီ', 'category တစ်ခုစီ'],
  ['အမျိုးအစား တစ်ခု', 'category တစ်ခု'],
  ['အမျိုးအစား တစ်ခုမှာ', 'category တစ်ခုမှာ'],
  ['စာမေးပွဲ မှတ်တမ်း', 'quiz မှတ်တမ်း'],
  ['လမ်း A', 'Path A'],
  ['လမ်း B', 'Path B'],
  ['အဆင့်မြှင့်ပါ', 'upgrade လုပ်ပါ'],
  ['အဆင့်မြှင့်မည်', 'upgrade လုပ်မည်'],
  ['အဆင့်မြှင့်မည်', 'upgrade လုပ်မည်'],
  ['"english": "အင်္ဂလိပ်"', '"english": "English"'],
];

function patchString(s) {
  let out = s;
  for (const [from, to] of REPLACEMENTS) {
    out = out.split(from).join(to);
  }
  return out;
}

function walk(value) {
  if (typeof value === 'string') return patchString(value);
  if (Array.isArray(value)) return value.map(walk);
  if (value && typeof value === 'object') {
    const next = {};
    for (const [k, v] of Object.entries(value)) {
      const key = k === 'step_မျက်နှာပြင် ဓာတ်ပုံ' ? 'step_screenshot' : k;
      next[key] = walk(v);
    }
    return next;
  }
  return value;
}

const my = walk(JSON.parse(fs.readFileSync(file, 'utf8')));

// Country titles — keep English place names
const englishTitles = [
  'resourcesGuide',
  'resourcesCosts',
  'resourcesFaq',
  'resourcesLicenceClasses',
  'resourcesForeigners',
];
for (const ns of englishTitles) {
  if (my[ns]?.sg_title) my[ns].sg_title = 'Singapore';
  if (my[ns]?.jp_title) my[ns].jp_title = 'Japan';
}

my.hero.eyebrow_sg = 'Singapore · BTT / FTT / RTT';
my.tests.mock_questions = 'mock exam';
my.tests.sub =
  'စာမေးပွဲတစ်ခုစီအတွက် လေ့လာရေး mode သုံးမျိုး — Singapore BTT၊ FTT၊ RTT အတွက် လေ့ကျင့်ခန်း မေးခွန်း {count} ခု။';
my.centre.sub_sg =
  'Singapore theory test နှင့် သင်တန်းအားလုံးကို ယာဉ်ထိန်းရဲ အသိအမှတ်ပြု ကျောင်းသုံးခုမှ ဆောင်ရွက်သည်။';
my.faq.sub_sg = 'Singapore BTT, FTT & RTT — လေ့လာသူများအတွက် လက်တွေ့အဖြေများ';
my.how.s3_h = 'Mock test';
my.payment.step_txn = '၃။ Transaction ID / Reference number';
my.payment.step_screenshot = '၄။ ပေးချေပြီး screenshot (ရွေးချယ်နိုင်၊ အတည်ပြုမှု မြန်စေသည်)';
my.quiz.lesson_title = 'Learn Mode';
my.quiz.practice_title = 'Practice Mode';
my.quiz.test_title = 'Mock Test';
my.quiz.mode_test = 'Mock Test';
my.quiz.choose_mode = 'Mode ရွေးပါ';

fs.writeFileSync(file, JSON.stringify(my, null, 2) + '\n', 'utf8');
console.log('Restored English terms in messages/my.json');
