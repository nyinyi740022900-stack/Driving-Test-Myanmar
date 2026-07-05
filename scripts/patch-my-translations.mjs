#!/usr/bin/env node
/**
 * Patch common Myanmar translation gaps in messages/my.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, '../messages/my.json');
let text = fs.readFileSync(file, 'utf8');

const pairs = [
  // Full phrases first (order matters)
  ['← Back to home', '← ပင်မသို့ ပြန်'],
  ['← Home', '← ပင်မသို့'],
  ['Foreigners\' Guide', 'နိုင်ငံခြားသားများ လမ်းညွှန်'],
  ['Road Signs Library', 'လမ်းဆိုင်းဘုတ် စာကြည့်တိုက်'],
  ['Study material', 'လေ့လာရေး ပစ္စည်း'],
  ['Transaction ID / Reference number', 'ငွေလွှဲအမှတ် / ကိုးကားနံပါတ်'],
  ['Mock Test', 'စမ်းသပ်စာမေးပွဲ'],
  ['mock tests', 'စမ်းသပ်စာမေးပွဲများ'],
  ['mock test', 'စမ်းသပ်စာမေးပွဲ'],
  ['Mock test', 'စမ်းသပ်စာမေးပွဲ'],
  ['mock စာမေးပွဲ', 'စမ်းသပ်စာမေးပွဲ'],
  ['Mode သုံးမျိုး', 'မုဒ် သုံးမျိုး'],
  ['Mode ရွေးပါ', 'မုဒ် ရွေးပါ'],
  ['သင်ယူမည့် Mode', 'သင်ယူ မုဒ်'],
  ['လေ့ကျင့်ခန်း Mode', 'လေ့ကျင့်ခန်း မုဒ်'],
  ['TheoryLane mock test', 'TheoryLane စမ်းသပ်စာမေးပွဲ'],
  ['Japan mock tests', 'ဂျပန် စမ်းသပ်စာမေးပွဲများ'],
  ['BTT mock test', 'BTT စမ်းသပ်စာမေးပွဲ'],
  ['FTT mock test', 'FTT စမ်းသပ်စာမေးပွဲ'],
  ['RTT mock test', 'RTT စမ်းသပ်စာမေးပွဲ'],
  ['lesson နှင့် practice', 'သင်ခန်းစာ နှင့် လေ့ကျင့်ခန်း'],
  ['BTT lesson', 'BTT သင်ခန်းစာ'],
  ['RTT lesson/practice', 'RTT သင်ခန်းစာ/လေ့ကျင့်ခန်း'],
  ['transaction ID', 'ငွေလွှဲအမှတ်'],
  ['ပေးချေမှု screenshot', 'ပေးချေမှု မျက်နှာပြင် ဓာတ်ပုံ'],
  ['screenshot', 'မျက်နှာပြင် ဓာတ်ပုံ'],
  ['refresh လုပ်ပါ', 'ပြန်လည်ဖွင့်ပါ'],
  ['upgrade လုပ်ပါ', 'အဆင့်မြှင့်ပါ'],
  ['report တိုင်းကို', 'တင်ပြချက် တိုင်းကို'],
  ['infographic', 'ရှင်းလင်းပုံ'],
  ['animation', 'အန်နီမရှင်း'],
  ['feedback', 'တုံ့ပြန်ချက်'],
  ['free plan', 'အခမဲ့ အစီအစဉ်'],
  ['theory test', 'သီအိုရီစာမေးပွဲ'],
  ['Theory test', 'သီအိုရီစာမေးပွဲ'],
  ['Path A', 'လမ်း A'],
  ['Path B', 'လမ်း B'],
  ['Tip:', 'အကြံပြုချက် —'],
  ['"english": "English"', '"english": "အင်္ဂလိပ်"'],
  ['premium အဖွဲ့ဝင်', 'Premium အဖွဲ့ဝင်'],
  ['free account', 'အခမဲ့ အကောင့်'],
  ['အခမဲ့ account', 'အခမဲ့ အကောင့်'],
  ['category တစ်ခု', 'အမျိုးအစား တစ်ခု'],
  ['category တစ်ခုစီ', 'အမျိုးအစား တစ်ခုစီ'],
  ['category တစ်ခုမှာ', 'အမျိုးအစား တစ်ခုမှာ'],
  ['quiz မှတ်တမ်း', 'စာမေးပွဲ မှတ်တမ်း'],
  ['Quiz မှတ်တမ်း', 'စာမေးပွဲ မှတ်တမ်း'],
  ['format', 'ပုံစံ'],
  ['hero.eyebrow_sg": "Singapore', 'hero.eyebrow_sg": "စင်္ကာပူ'],
];

for (const [from, to] of pairs) {
  text = text.split(from).join(to);
}

// Structured object patches
const my = JSON.parse(text);

my.resourcesForeigners.hero.lead =
  'နိုင်ငံခြားလိုင်စင် ပြောင်းလဲခြင်း၊ IDP စည်းမျဉ်းများနှင့် မြန်မာနိုင်ငံသားများ Singapore နှင့် Japan တွင် တရားဝင် ကားမောင်းရန် လိုအပ်ချက်များ။';

my.resourcesSigns.hero.lead =
  'စည်းမျဉ်း၊ သတိပေးနှင့် အချက်အလက် ဆိုင်းဘုတ်တိုင်း — အဓိပ္ပာယ်နှင့် လုပ်ရမည့်အရာ ရှင်းလင်းပြထားသည်။';

my.resourcesForeigners.back_home = '← ပင်မသို့ ပြန်';
my.resourcesSigns.back_home = '← ပင်မသို့ ပြန်';

my.resourcesGuide.sg.title = 'စင်္ကာပူ';
my.resourcesGuide.jp.title = 'ဂျပန်';
my.resourcesCosts.sg_title = 'စင်္ကာပူ';
my.resourcesCosts.jp_title = 'ဂျပန်';
my.resourcesFaq.sg_title = 'စင်္ကာပူ';
my.resourcesFaq.jp_title = 'ဂျပန်';
my.resourcesLicenceClasses.sg_title = 'စင်္ကာပူ';
my.resourcesLicenceClasses.jp_title = 'ဂျပန်';
my.resourcesForeigners.sg_title = 'စင်္ကာပူ';
my.resourcesForeigners.jp_title = 'ဂျပန်';

my.hero.lead =
  'မေးခွန်းတိုင်းမှာ ပုံ သို့မဟုတ် အန်နီမရှင်း ပါတယ် — ဆိုင်းဘုတ်ကို မြင်၊ စည်းမျဉ်းကို နားလည်၊ အသင့်ဖြစ်ပြီး ဝင်ဖြေပါ။';

my.how.s1_p =
  'စည်းမျဉ်းတစ်ခုစီကို ဆိုင်းဘုတ် သို့မဟုတ် အန်နီမရှင်းနဲ့အတူ ဖတ်ပါ — သင့်ဘာသာစကားနဲ့ ရှင်းလင်းချက်ပါ။';

my.how.s3_h = 'စမ်းသပ်စာမေးပွဲ';

my.tests.sub =
  'စာမေးပွဲတစ်ခုစီအတွက် လေ့လာရေး မုဒ် သုံးမျိုး — စင်္ကာပူ BTT၊ FTT၊ RTT အတွက် လေ့ကျင့်ခန်း မေးခွန်း {count} ခု။';

my.tests.sub_jp =
  'စာမေးပွဲတစ်ခုစီအတွက် လေ့လာရေး မုဒ် သုံးမျိုး — 普通免許 နှင့် 二輪免許 အတွက် လေ့ကျင့်ခန်း မေးခွန်း {count} ခု။';

my.centre.sub_sg =
  'စင်္ကာပူ သီအိုရီစာမေးပွဲနှင့် သင်တန်းအားလုံးကို ယာဉ်ထိန်းရဲ အသိအမှတ်ပြု ကျောင်းသုံးခုမှ ဆောင်ရွက်သည်။';

my.centre.jp_2 =
  'သင့်ခရိုင် (ပြည်နယ်) ရှိ ကျောင်းတစ်ကျောင်း ရွေးချယ်ပါ။ ကျောင်းအများစုသည် လက်ဖြင့် (MT) နှင့် အလိုအလျောက် (AT) သင်တန်းနှစ်မျိုးလုံး ဖွင့်လှစ်သည်။ သင်တန်းအပြည့် ၂ – ၄ လကြာပြီး 第1段階 (ကွင်းတွင်း) နှင့် 第2段階 (လမ်းပေါ်) ဟူ၍ နှစ်အဆင့် ပါဝင်သည်။';

my.faq.sub_sg = 'စင်္ကာပူ BTT, FTT & RTT — လေ့လာသူများအတွက် လက်တွေ့အဖြေများ';

fs.writeFileSync(file, JSON.stringify(my, null, 2) + '\n', 'utf8');
console.log('Patched messages/my.json');
