#!/usr/bin/env node
/**
 * Append round-2 Method A gap-fill questions and merge into banks.
 * Usage: node scripts/sg-method-a-gap-fill-round2.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gapFillPath = path.join(__dirname, '..', 'content', 'syllabus', 'sg-method-a-gap-fill.json');
const questionsDir = path.join(__dirname, '..', 'content', 'questions');

const ROUND2 = [
  {
    id: 'sg_btt_0556',
    category: 'sg_btt',
    syllabusRef: 'btt.rules.give_way',
    topic: 'give_way',
    difficulty: 'easy',
    prompt: {
      en: 'You reach a T-junction where your road ends. A vehicle is approaching on the through road from your right. Who must give way?',
      my: 'သင် မောင်းနေသော လမ်း ပြီးဆုံးသော T-လမ်းဆုံ တွင် ရောက်ပါသည်။ ညာဘက် မှ ဖြတ်သွားလမ်း ပေါ် ယာဉ် ချဉ်းကပ်လာပါသည်။ မည်သူ ဦးစားပေးရမလဲ?',
    },
    choices: [
      { text: { en: 'You must give way to traffic on the through road', my: 'ဖြတ်သွားလမ်း ပေါ် ယာဉ်ကို ဦးစားပေးရမည်' } },
      { text: { en: 'The through-road driver must give way to you', my: 'ဖြတ်သွားလမ်း ယာဉ်မောင်း သင့်ကို ဦးစားပေးရမည်' } },
      { text: { en: 'Whoever arrives first has priority', my: 'ပထမရောက်သူ ဦးစားပေး' } },
    ],
    answer: 0,
    explanation: {
      en: 'At a T-junction, traffic on the terminating road must give way to traffic on the through road unless signs say otherwise.',
      my: 'T-လမ်းဆုံ တွင် လမ်း ပြီးဆုံးသော ဘက်မှ ယာဉ်သည် ဆိုင်းဘုတ် မညွှန်ပြလျှင် ဖြတ်သွားလမ်း ယာဉ်ကို ဦးစားပေးရမည်။',
    },
    media: { type: 'image', src: '/signs/sg/give-way.png', alt: { en: 'T-junction give way', my: 'T-လမ်းဆုံ ဦးစားပေးခြင်း' } },
  },
  {
    id: 'sg_btt_0557',
    category: 'sg_btt',
    syllabusRef: 'btt.rules.give_way',
    topic: 'give_way',
    difficulty: 'medium',
    prompt: {
      en: 'You emerge from a side road onto a busier main road with no signs or signals. What is your priority duty?',
      my: 'ဆိုင်းဘုတ် သို့မဟုတ် မီး မရှိဘဲ ဘေးလမ်း မှ အဓိကလမ်း သို့ ထွက်တော့မည် ဖြစ်ပါသည်။ သင်၏ ဦးစားပေး တာဝန် ဘာလဲ?',
    },
    choices: [
      { text: { en: 'Give way to all traffic already on the main road', my: 'အဓိကလမ်း ပေါ် ရှိပြီးသော ယာဉ်အားလုံးကို ဦးစားပေးပါ' } },
      { text: { en: 'Enter quickly because side-road traffic is lighter', my: 'ဘေးလမ်း ယာဉ် နည်းသောကြောင့် မြန်မြန် ဝင်ပါ' } },
      { text: { en: 'Sound the horn so main-road drivers slow down', my: 'အဓိကလမ်း ယာဉ်များ နှေးစေရန် ဟော်န် နှိုးပါ' } },
    ],
    answer: 0,
    explanation: {
      en: 'At an uncontrolled junction, entering traffic from a side road must give way to traffic on the main road.',
      my: 'ထိန်းချုပ်မှု မရှိသော မီးပွိုင့် တွင် ဘေးလမ်း မှ ဝင်ရောက်မည့် ယာဉ်သည် အဓိကလမ်း ယာဉ်ကို ဦးစားပေးရမည်။',
    },
    media: { type: 'image', src: '/signs/sg/junction.png', alt: { en: 'Side road joining main road', my: 'ဘေးလမ်း မှ အဓိကလမ်း သို့ ဝင်ခြင်း' } },
  },
  {
    id: 'sg_btt_0558',
    category: 'sg_btt',
    syllabusRef: 'btt.rules.give_way',
    topic: 'give_way',
    difficulty: 'hard',
    prompt: {
      en: 'Two cars arrive at an uncontrolled cross junction at the same time. You are on the right of the other driver. What usually applies in Singapore?',
      my: 'ထိန်းချုပ်မှု မရှိသော လမ်းဆုံ တွင် ကား နှစ်စီး တစ်ချိန်တည်း ရောက်ပါသည်။ အခြား ယာဉ်မောင်း ၏ ညာဘက် တွင် သင် ရှိပါသည်။ စင်္ကာပူ တွင် ပုံမှန်အားဖြင့် ဘာသက်ရောက်လဲ?',
    },
    choices: [
      { text: { en: 'Give way to traffic from the right unless road markings direct otherwise', my: 'လမ်း အမှတ်အသား မညွှန်ပြလျှင် ညာဘက် မှ ယာဉ်ကို ဦးစားပေးပါ' } },
      { text: { en: 'You always have priority because you are on the right', my: 'ညာဘက် ရှိသောကြောင့် အမြဲ ဦးစားပေး' } },
      { text: { en: 'The larger vehicle has priority', my: 'ယာဉ် ကြီးသော ဘက်က ဦးစားပေး' } },
    ],
    answer: 0,
    explanation: {
      en: 'At uncontrolled junctions, give way to traffic from the right when rules apply, but always follow signs, signals, and markings first.',
      my: 'ထိန်းချုပ်မှု မရှိသော မီးပွိုင့် တွင် ဥပဒေ သက်ရောက်လျှင် ညာဘက် ယာဉ်ကို ဦးစားပေးပါ။ ဆိုင်းဘုတ်၊ မီး နှင့် အမှတ်အသား ကို ဦးစွာ လိုက်နာပါ။',
    },
    media: { type: 'image', src: '/signs/sg/junction.png', alt: { en: 'Uncontrolled cross junction', my: 'ထိန်းချုပ်မှု မရှိသော လမ်းဆုံ' } },
  },
  {
    id: 'sg_btt_0559',
    category: 'sg_btt',
    syllabusRef: 'btt.licence.basics',
    topic: 'licence_basics',
    difficulty: 'easy',
    prompt: {
      en: 'Before you may practise driving on public roads with an instructor, which licence must a learner normally hold?',
      my: 'သင်တန်းဆရာ နှင့် အများပြည်သူ လမ်း ပေါ် လေ့ကျင့်ခွင့် မရမီ သင်ယူသူ သည် ပုံမှန်အားဖြင့် မည်သည့် လိုင်စင် ရှိရမလဲ?',
    },
    choices: [
      { text: { en: 'A valid Provisional Driving Licence (PDL)', my: 'မှန်ကန်သော ယာယီ မောင်းနှင်ခွင့် (PDL)' } },
      { text: { en: 'A full Class 3 licence only', my: 'အပြည့်အဝ Class 3 လိုင်စင် သာ' } },
      { text: { en: 'No licence if an instructor is beside you', my: 'သင်တန်းဆရာ ဘေးတွင် ရှိလျှင် လိုင်စင် မလို' } },
    ],
    answer: 0,
    explanation: {
      en: 'Learners must hold a valid PDL and display L-plates when practising on public roads under approved conditions.',
      my: 'သင်ယူသူများသည် အများပြည်သူ လမ်း ပေါ် ခွင့်ပြုထားသော အခြေအနေဖြင့် လေ့ကျင့်ရန် မှန်ကန်သော PDL ရှိပြီး L ဆိုင်းဘုတ် ပြရမည်။',
    },
    media: { type: 'image', src: '/signs/sg/car-interior.png', alt: { en: 'Learner driver with instructor', my: 'သင်တန်းဆရာ နှင့် သင်ယူသူ' } },
  },
  {
    id: 'sg_btt_0560',
    category: 'sg_btt',
    syllabusRef: 'btt.licence.basics',
    topic: 'licence_basics',
    difficulty: 'medium',
    prompt: {
      en: 'A Class 3 licence in Singapore generally allows you to drive which vehicles on public roads?',
      my: 'စင်္ကာပူ Class 3 လိုင်စင် ဖြင့် အများပြည်သူ လမ်း ပေါ် မည်သည့်ယာဉ် မောင်းခွင့် ရမလဲ?',
    },
    choices: [
      { text: { en: 'Motor cars up to the permitted unladen weight for that class', my: 'ထို class အတွက် ခွင့်ပြုထားသော မတင်ဘဲ အလေးချိန် အထိ မော်တော်ကား' } },
      { text: { en: 'Any heavy goods vehicle without restriction', my: 'ကန့်သတ်ချက် မရှိဘဲ လေးလံကုန်တင်ယာဉ် အားလုံး' } },
      { text: { en: 'Motorcycles above 400 cc only', my: '၄၀၀ cc အထက် ဆိုင်ကယ် သာ' } },
    ],
    answer: 0,
    explanation: {
      en: 'Class 3 covers private cars within the weight limits set for that licence class. Larger or commercial vehicles need other classes.',
      my: 'Class 3 သည် ထို လိုင်စင် class အတွက် သတ်မှတ်ထားသော အလေးချိန် အတွင်း ကားပိုင် မောင်းခွင့် ပေးသည်။ ပိုကြီး သို့မဟုတ် ကုန်တင်ယာဉ်များအတွက် အခြား class လိုသည်။',
    },
    media: { type: 'image', src: '/signs/sg/car-interior.png', alt: { en: 'Class 3 private car driving', my: 'Class 3 ကားပိုင် မောင်းခြင်း' } },
  },
  {
    id: 'sg_btt_0561',
    category: 'sg_btt',
    syllabusRef: 'btt.licence.basics',
    topic: 'licence_basics',
    difficulty: 'medium',
    prompt: {
      en: 'Under the Driver Improvement Points System (DIPS), what can happen if you accumulate too many demerit points?',
      my: 'Driver Improvement Points System (DIPS) အရ demerit အမှတ် အလွန်အကျွံ စုဆောင်းလျှင် ဘာဖြစ်နိုင်လဲ?',
    },
    choices: [
      { text: { en: 'Your licence may be suspended or revoked depending on the offences', my: 'ပြစ်မှုအလိုက် လိုင်စင် ဆိုင်းငံ့ သို့မဟုတ် ပယ်ဖျက်ခံရနိုင်သည်' } },
      { text: { en: 'Points reset automatically every month with no penalty', my: 'အမှတ် လစဉ် အလိုအလျောက် ပြန်လည်သတ်မှတ်၍ ဒဏ်မရှိ' } },
      { text: { en: 'DIPS applies only to commercial drivers', my: 'DIPS သည် ကုန်တင်ယာဉ်မောင်း သာ သက်ရောက်' } },
    ],
    answer: 0,
    explanation: {
      en: 'DIPS records demerit points for traffic offences. Enough points can lead to suspension, revocation, or other penalties.',
      my: 'DIPS သည် ယာဉ်ကြောင်း်မှုများအတွက် demerit အမှတ် မှတ်တမ်းတင်သည်။ အမှတ် လုံလောက်လျှင် ဆိုင်းငံ့၊ ပယ်ဖျက်ခြင်း သို့မဟုတ် အခြား ဒဏ်ခတ်မှု ရနိုင်သည်။',
    },
    media: { type: 'image', src: '/signs/sg/traffic-signals-sign.png', alt: { en: 'Traffic offence and licence points', my: 'ယာဉ်ကြောင်း ပြစ်မှုနှင့် လိုင်စင် အမှတ်' } },
  },
  {
    id: 'sg_btt_0562',
    category: 'sg_btt',
    syllabusRef: 'btt.signs.police',
    topic: 'police_signals',
    difficulty: 'easy',
    prompt: {
      en: 'A police officer faces you and extends one arm straight up. What must you do?',
      my: 'ရဲတစ်ဦး သင်ကို မျက်နှာချင်းဆိုင်၍ လက်တစ်ဖက် ဖြောင့်တန်း အပေါ်သို့ ထောင်ပါသည်။ ဘာလုပ်ရမလဲ?',
    },
    choices: [
      { text: { en: 'Stop', my: 'ရပ်ပါ' } },
      { text: { en: 'Turn left only', my: 'ဘယ်ဘက် သာ ကွေ့ပါ' } },
      { text: { en: 'Speed up to clear the junction', my: 'မီးပွိုင့် ရှင်းရန် အရှိန်တိုးပါ' } },
    ],
    answer: 0,
    explanation: {
      en: 'An arm raised straight up is a stop signal for traffic facing the officer and traffic from behind the officer.',
      my: 'လက် ဖြောင့်တန်း အပေါ်ထောင် ခြင်းသည် ရဲကို မျက်နှာချင်းဆိုင် နှင့် နောက်ကျောဘက် ယာဉ်များအတွက် ရပ်ရန် အချက်ပြခြင်း ဖြစ်သည်။',
    },
    media: { type: 'image', src: '/signs/sg/junction.png', alt: { en: 'Police officer stop signal', my: 'ရဲ ရပ်ခိုင်း အချက်ပြမှု' } },
  },
  {
    id: 'sg_btt_0563',
    category: 'sg_btt',
    syllabusRef: 'btt.signs.police',
    topic: 'police_signals',
    difficulty: 'medium',
    prompt: {
      en: 'Traffic lights show green but a police officer signals you to stop. What should you do?',
      my: 'မီး အစိမ်း ဖြစ်သော်လည်း ရဲတစ်ဦး သင့်ကို ရပ်ခိုင်းပါသည်။ ဘာလုပ်ရမလဲ?',
    },
    choices: [
      { text: { en: 'Obey the police officer and stop', my: 'ရဲ ညွှန်ကြားချက် လိုက်ပြီး ရပ်ပါ' } },
      { text: { en: 'Follow the green light because it is legal', my: 'ဥပဒေအရ အစိမ်း မီး လိုက်ပါ' } },
      { text: { en: 'Flash your headlights and continue', my: 'မီး လင်းအောင် လုပ်ပြီး ဆက်သွားပါ' } },
    ],
    answer: 0,
    explanation: {
      en: 'Directions from a police officer on duty override traffic lights when they are controlling the junction.',
      my: 'တာဝန်ကျ ရဲ ညွှန်ကြားချက် သည် မီးပွိုင့် ထိန်းချုပ်နေသည့်အခါ မီးထက် ဦးစားပေး ဖြစ်သည်။',
    },
    media: { type: 'image', src: '/signs/sg/traffic-light.png', alt: { en: 'Police overriding traffic lights', my: 'မီး ထက် ရဲ ညွှန်ကြားချက် ဦးစီး' } },
  },
  {
    id: 'sg_btt_0564',
    category: 'sg_btt',
    syllabusRef: 'btt.rules.overtaking',
    topic: 'overtaking',
    difficulty: 'medium',
    prompt: {
      en: 'You want to overtake but a solid white centre line separates your lane from oncoming traffic. What should you do?',
      my: 'ကြားဖြတ် အဖြူရောင် မျဉ်း သည် သင် လမ်း နှင့် ဆန့်ကျင်ဘက် ယာဉ်ကြောင်း ကို ခွဲထားပါသည်။ ကျော်တက် လိုပါသည်။ ဘာလုပ်ရမလဲ?',
    },
    choices: [
      { text: { en: 'Do not overtake — wait until broken lines or a safe overtaking lane appears', my: 'မကျော်တက်ပါ — မျဉ်း ပြတ် သို့မဟုတ် ဘေးကင်း ကျော်တက်လမ်း မပေါ်မချင်း စောင့်ပါ' } },
      { text: { en: 'Overtake if oncoming traffic is far away', my: 'ဆန့်ကျင်ဘက် ယာဉ် ဝေးလျှင် ကျော်တက်ပါ' } },
      { text: { en: 'Overtake quickly using your horn', my: 'ဟော်န် နှိုးပြီး မြန်မြန် ကျော်တက်ပါ' } },
    ],
    answer: 0,
    explanation: {
      en: 'A solid centre line means overtaking is not permitted when it would require crossing that line into oncoming traffic.',
      my: 'ကြားဖြတ် အစိုင်း မျဉ်း သည် ဆန့်ကျင်ဘက် ယာဉ်ကြောင်း ဖြတ်ကျော်ရန် လိုသော ကျော်တက်ခြင်း ခွင့်မပြု ကြောင်း ဆိုလိုသည်။',
    },
    media: { type: 'image', src: '/signs/sg/no-overtaking.png', alt: { en: 'Solid line overtaking restriction', my: 'အစိုင်း မျဉ်း ကျော်တက် ကန့်သတ်ချက်' } },
  },
  {
    id: 'sg_btt_0565',
    category: 'sg_btt',
    syllabusRef: 'btt.conduct.defensive',
    topic: 'defensive_driving',
    difficulty: 'easy',
    prompt: {
      en: 'Before moving off from the kerb, which defensive check helps you spot cyclists in your blind spot?',
      my: 'ဘေးလမ်း ဘေး မှ ရွေ့မီ ဘယ်ဘက် မျက်လုံး မမြင်ရသော နေရာ တွင် စက်ဘီး စီးသူများ မြင်ရန် ကာကွယ်ရေး စစ်ဆေးမှု ဘာလဲ?',
    },
    choices: [
      { text: { en: 'Mirror check and a shoulder glance over your blind spot', my: 'မှန်ဘီလူး စစ်ပြီး မျက်လုံး မမြင်ရသော နေရာ ကို ပခုံး မျှော်ကြည့်ခြင်း' } },
      { text: { en: 'Rely on the horn only', my: 'ဟော်န် သာ အမှီပြုပါ' } },
      { text: { en: 'Accelerate quickly to merge before others react', my: 'အခြားသူ မတုံ့ပြန်မီ မြန်မြန် ပေါင်းဝင်ပါ' } },
    ],
    answer: 0,
    explanation: {
      en: 'Defensive drivers mirror-check and glance over the shoulder to cover blind spots before pulling out.',
      my: 'ကာကွယ်ရေး ယာဉ်မောင်းသည် ထွက်မီ မှန်ဘီလူး စစ်ပြီး ပခုံး မျှော်ကြည့်ကာ မျက်လုံး မမြင်ရသော နေရာ ကို စစ်ဆေးသည်။',
    },
    media: { type: 'image', src: '/signs/sg/car-interior.png', alt: { en: 'Mirror and blind-spot check', my: 'မှန်ဘီလူး နှင့် မျက်လုံး မမြင်ရသော နေရာ စစ်ဆေးခြင်း' } },
  },
  {
    id: 'sg_ftt_0505',
    category: 'sg_ftt',
    syllabusRef: 'ftt.skills.roundabout',
    topic: 'roundabouts',
    difficulty: 'medium',
    prompt: {
      en: 'You are in the right lane approaching a two-lane roundabout and intend to take the first exit. Which lane should you have chosen?',
      my: 'လမ်း နှစ်ကြောင်း အဝိုင်းလမ်းမ ကို ညာဘက် လမ်း ဖြင့် ချဉ်းကပ်ပြီး ပထမ ထွက်ရာ ယူမည် ဖြစ်ပါသည်။ မည်သည့် လမ်း ရွေးသင့်ခဲ့သလဲ?',
    },
    choices: [
      { text: { en: 'The left lane unless signs or markings show otherwise', my: 'ဆိုင်းဘုတ် မညွှန်ပြလျှင် ဘယ်ဘက် လမ်း' } },
      { text: { en: 'The right lane for every exit', my: 'ထွက်ရာ အားလုံးအတွက် ညာဘက် လမ်း' } },
      { text: { en: 'Either lane — lane choice does not matter on roundabouts', my: 'မည်သည့်လမ်း မဆို — အဝိုင်းလမ်းမ တွင် လမ်း ရွေးချယ်မှု မအရေးကြီး' } },
    ],
    answer: 0,
    explanation: {
      en: 'Choose the correct lane before entering. For an immediate left or first exit, use the left lane unless markings direct otherwise.',
      my: 'ဝင်မီ မှန်ကန်သော လမ်း ရွေးပါ။ ဘယ်ဘက် သို့မဟုတ် ပထမ ထွက်ရာ အတွက် ဆိုင်းဘုတ် မညွှန်ပြလျှင် ဘယ်ဘက် လမ်း သုံးပါ။',
    },
    media: { type: 'image', src: '/signs/sg/roundabout.png', alt: { en: 'Lane choice at a roundabout', my: 'အဝိုင်းလမ်းမ တွင် လမ်း ရွေးချယ်မှု' } },
  },
  {
    id: 'sg_ftt_0506',
    category: 'sg_ftt',
    syllabusRef: 'ftt.skills.roundabout',
    topic: 'roundabouts',
    difficulty: 'hard',
    prompt: {
      en: 'Circulating traffic is heavy on a roundabout and you miss your intended exit. What is the safest action?',
      my: 'အဝိုင်းလမ်းမ ပေါ် လည်ပတ်နေသော ယာဉ်များ များပြီး သင် ရည်ရွယ်ထားသော ထွက်ရာ လွဲသွားပါသည်။ အလုံခြုံဆုံး လုပ်ဆောင်ချက် ဘာလဲ?',
    },
    choices: [
      { text: { en: 'Stay circulating and take the next safe exit — do not stop or reverse', my: 'လည်ပတ်ဆက်ပြီး နောက်ထပ် ဘေးကင်း ထွက်ရာ ယူပါ — ရပ်ခြင်း သို့မဟုတ် နောက်ပြန် မလုပ်ပါ' } },
      { text: { en: 'Stop on the roundabout and reverse to the missed exit', my: 'အဝိုင်းလမ်းမ ပေါ် ရပ်ပြီး လွဲသွားသော ထွက်ရာ သို့ နောက်ပြန် လုပ်ပါ' } },
      { text: { en: 'Cut across lanes to reach the exit immediately', my: 'ထွက်ရာ ရောက်ရန် လမ်း ဖြတ်ကူး ပြောင်းပါ' } },
    ],
    answer: 0,
    explanation: {
      en: 'Never stop or reverse on a roundabout. Continue circulating and leave safely at the next opportunity.',
      my: 'အဝိုင်းလမ်းမ ပေါ် ရပ်ခြင်း သို့မဟုတ် နောက်ပြန် လုပ်ခြင်း မလုပ်ပါနှင့်။ လည်ပတ်ဆက်ပြီး နောက်ထပ် အခွင့်အရေး တွင် ဘေးကင်းစွာ ထွက်ပါ။',
    },
    media: { type: 'image', src: '/signs/sg/roundabout.png', alt: { en: 'Missing an exit on a roundabout', my: 'အဝိုင်းလမ်းမ တွင် ထွက်ရာ လွဲခြင်း' } },
  },
  {
    id: 'sg_ftt_0507',
    category: 'sg_ftt',
    syllabusRef: 'ftt.skills.roundabout',
    topic: 'roundabouts',
    difficulty: 'medium',
    prompt: {
      en: 'You enter a roundabout behind a large lorry blocking your view of circulating traffic. How should you proceed?',
      my: 'လည်ပတ်နေသော ယာဉ်ကို မမြင်ရအောင် ပိတ်ထားသော လေးလံကုန်တင်ယာဉ် နောက်မှ အဝိုင်းလမ်းမ သို့ ဝင်ပါသည်။ မည်သို့ ဆက်လုပ်ရမလဲ?',
    },
    choices: [
      { text: { en: 'Enter only when you can see a safe gap — do not follow the lorry blindly', my: 'ဘေးကင်း ကွာဟချက် မြင်မှသာ ဝင်ပါ — လေးလံကုန်တင်ယာဉ် ကို မျက်စိမွှာလျက် မလိုက်ပါ' } },
      { text: { en: 'Follow closely because the lorry will clear the way', my: 'လေးလံကုန်တင်ယာဉ် လမ်း ရှင်းပေးမည် ဟု ယူဆပြီး နီးနီး လိုက်ပါ' } },
      { text: { en: 'Sound the horn and enter immediately', my: 'ဟော်န် နှိုးပြီး ချက်ချင်း ဝင်ပါ' } },
    ],
    answer: 0,
    explanation: {
      en: 'Large vehicles can hide circulating traffic. Give way only when you can confirm it is safe, not just because the vehicle ahead moved.',
      my: 'ယာဉ် ကြီးများသည် လည်ပတ်နေသော ယာဉ်ကို ဖုံးကွယ်နိုင်သည်။ ရှေ့ယာဉ် ရွေ့သောကြောင့် မဟုတ် ဘဲ ဘေးကင်းကြောင်း သေချာမှသာ ဝင်ပါ။',
    },
    media: { type: 'image', src: '/signs/sg/roundabout.png', alt: { en: 'Limited view entering a roundabout', my: 'အဝိုင်းလမ်းမ ဝင်ရာ မြင်ကွင်း ကန့်သတ်ခြင်း' } },
  },
  {
    id: 'sg_ftt_0508',
    category: 'sg_ftt',
    syllabusRef: 'ftt.skills.roundabout',
    topic: 'roundabouts',
    difficulty: 'easy',
    prompt: {
      en: 'When exiting a roundabout, when should you cancel your left signal?',
      my: 'အဝိုင်းလမ်းမ မှ ထွက်သည့်အခါ ဘယ်ဘက် ညွှန်ပြမီး ကို မည်သည့်အချိန် ပိတ်ရမလဲ?',
    },
    choices: [
      { text: { en: 'After you have fully left the roundabout', my: 'အဝိုင်းလမ်းမ ကို လုံးဝ ထွက်ပြီးနောက်' } },
      { text: { en: 'Before you pass the exit before yours', my: 'သင် ထွက်မည့် ထွက်ရာ မတိုင်မီ ထွက်ရာ တစ်ခု မကျော်မီ' } },
      { text: { en: 'Signals are never used when leaving roundabouts', my: 'အဝိုင်းလမ်းမ မှ ထွက်သည့်အခါ ညွှန်ပြမီး မသုံးပါ' } },
    ],
    answer: 0,
    explanation: {
      en: 'Keep the left signal on until you have completely exited so other drivers understand your movement.',
      my: 'အခြား ယာဉ်မောင်းများ သင်၏ လှုပ်ရှားမှု နားလည်နိုင်ရန် လုံးဝ ထွက်ပြီးသည်အထိ ဘယ်ဘက် ညွှန်ပြမီး ထားပါ။',
    },
    media: { type: 'image', src: '/signs/sg/roundabout.png', alt: { en: 'Signalling when leaving a roundabout', my: 'အဝိုင်းလမ်းမ မှ ထွက်ရာ ညွှန်ပြခြင်း' } },
  },
  {
    id: 'sg_ftt_0509',
    category: 'sg_ftt',
    syllabusRef: 'ftt.skills.emergency_stop',
    topic: 'emergency_stop',
    difficulty: 'medium',
    prompt: {
      en: 'During a driving test emergency-stop exercise, a signal is given suddenly. What is the correct braking technique?',
      my: 'မောင်းနှင်မှု စမ်းသပ်ခြင်း အရေးပေါ် ရပ်မှု လေ့ကျင့်ခန်းတွင် အချက်ပြမှု ရုတ်တရက် ပေးပါသည်။ မှန်ကန်သော ဘရိက် နည်းလမ်း ဘာလဲ?',
    },
    choices: [
      { text: { en: 'Brake firmly and progressively without locking the wheels if ABS is not active', my: 'ABS မလုပ်ဆောင်လျှင် စီးရီး မချည်အောင် ခိုင်မာစွာ တ်းဖြည်း ဘရိက် နှပ်ပါ' } },
      { text: { en: 'Stamp the brake and clutch together at maximum force instantly', my: 'ဘရိက် နှင့် ကလပ်ချ် ကို အမြင့်ဆုံး အားဖြင့် ချက်ချင်း နှိပ်ပါ' } },
      { text: { en: 'Swerve off the road before braking', my: 'ဘရိက် မနှက်မီ လမ်း ဘေးသို့ ရှောင်ကွေ့ပါ' } },
    ],
    answer: 0,
    explanation: {
      en: 'Emergency stop means controlled maximum braking while keeping steering control. Practice firm progressive pressure.',
      my: 'အရေးပေါ် ရပ်မှု ဆိုလိုသည်မှာ ထိန်းချုပ်မှု ထိန်းသိမ်းရင်း အမြင့်ဆုံး ဘရိက် နှက်ခြင်း ဖြစ်သည်။ ခိုင်မာသော တ်းဖြည်း နှိပ်မှု လေ့ကျင့်ပါ။',
    },
    media: { type: 'image', src: '/signs/sg/wet-road.png', alt: { en: 'Emergency stop braking practice', my: 'အရေးပေါ် ရပ်မှု ဘရိက် လေ့ကျင့်ခြင်း' } },
  },
  {
    id: 'sg_ftt_0510',
    category: 'sg_ftt',
    syllabusRef: 'ftt.skills.emergency_stop',
    topic: 'emergency_stop',
    difficulty: 'hard',
    prompt: {
      en: 'You must perform an emergency stop on a wet road. How should your technique differ from a dry road?',
      my: 'စိုစွတ်သော လမ်း ပေါ် အရေးပေါ် ရပ်မှု လုပ်ရမည် ဖြစ်ပါသည်။ လမ်း ခြောပေါ် ထက် နည်းလမ်း ဘယ်လို ကွဲပြားရမလဲ?',
    },
    choices: [
      { text: { en: 'Apply firm braking earlier and avoid harsh steering while stopping', my: 'စောစော ခိုင်မာ ဘရိက် နှပ်ပြီး ရပ်နေစဉ် ပြင်းထန် လှည့်ခြင်း ရှောင်ပါ' } },
      { text: { en: 'Brake as late as possible to reduce stopping distance', my: 'ရပ်တန့် အကွာအဝေး လျော့ရန် နောက်ကျဆုံး ဘရိက် နှပ်ပါ' } },
      { text: { en: 'Use the handbrake only for a faster stop', my: 'ပိုမြန် ရပ်ရန် လက်ဘရိက် သာ သုံးပါ' } },
    ],
    answer: 0,
    explanation: {
      en: 'Wet surfaces reduce grip. Start braking earlier with smooth pressure and keep the vehicle straight.',
      my: 'စိုစွတ်သော မျက်နှာပြင် ကိုင်တွယ်မှု လျော့သည်။ ချောမွေ့ နှိပ်မှု ဖြင့် စောစော ဘရိက် နှပ်ပြီး ယာဉ် တည့်တည့် ထားပါ။',
    },
    media: { type: 'image', src: '/signs/sg/wet-road.png', alt: { en: 'Emergency stop on wet road', my: 'စိုစွတ်သော လမ်း ပေါ် အရေးပေါ် ရပ်မှု' } },
  },
  {
    id: 'sg_ftt_0511',
    category: 'sg_ftt',
    syllabusRef: 'ftt.behaviour',
    topic: 'courteous_driving',
    difficulty: 'easy',
    prompt: {
      en: 'Another driver cuts sharply into your lane without signalling. What is the courteous and safe response?',
      my: 'အခြား ယာဉ်မောင်း ညွှန်ပြမီ မထုတ်ဘဲ သင် လမ်း သို့ ရုတ်တရက် ဝင်လာပါသည်။ ယဉ်ကျয়ှု ရှိပြီး ဘေးကင်း တုံ့ပြန်မှု ဘာလဲ?',
    },
    choices: [
      { text: { en: 'Ease off the accelerator and create space without retaliating', my: 'အရှိန်လျှော့ပြီး ပြန်လှန်မလုပ်ဘဲ နေရာ ဖန်တီးပါ' } },
      { text: { en: 'Tailgate and flash your high beam to teach them a lesson', my: 'နောက်လိုက် အလွန်နီး ပြီး အမြင့် မီး လင်းအောင် လုပ်ပါ' } },
      { text: { en: 'Sound your horn continuously until they move away', my: 'သူတို့ ရွေ့သွားသည်အထိ ဟော်န် အဆက်မပြတ် နှိုးပါ' } },
    ],
    answer: 0,
    explanation: {
      en: 'Courteous driving means de-escalating risk. Create space and avoid road rage behaviours that increase danger.',
      my: 'ယဉ်ကျয়သော မောင်းနှင်မှု ဆိုလိုသည်မှာ အန္တရာယ် လျှော့ခြင်း ဖြစ်သည်။ နေရာ ဖန်တီးပြီး လမ်းဒေါသပြုမှု ရှောင်ပါ။',
    },
    media: { type: 'image', src: '/signs/sg/highway.png', alt: { en: 'Courteous response to careless lane change', my: 'လမ်း ပြောင်း မသတိစိုက်မှု အတွက် ယဉ်ကျয় တုံ့ပြန်မှု' } },
  },
  {
    id: 'sg_ftt_0512',
    category: 'sg_ftt',
    syllabusRef: 'ftt.behaviour',
    topic: 'courteous_driving',
    difficulty: 'medium',
    prompt: {
      en: 'You feel angry after being honked at for a slow merge. What helps prevent road rage from affecting your driving?',
      my: 'နှေးကွေးစွာ ပေါင်းဝင်မှုအတွက် ဟော်န် နှိုးခံရပြီး စိတ်တိုလာပါသည်။ လမ်းဒေါသသည် မောင်းနှင်မှု ကို မထိခိုက်စေရန် ဘာကူညီလဲ?',
    },
    choices: [
      { text: { en: 'Take a breath, focus on the road ahead, and avoid engaging the other driver', my: 'အသက်ရှူပြီး ရှေ့လမ်း အာရုံစိုက် ကာ အခြား ယာဉ်မောင်း နှင့် မရန်ဖြစ်ပါ' } },
      { text: { en: 'Brake-check the driver behind to assert yourself', my: 'ကိုယ့်ကို ပြရန် နောက်က ယာဉ်ကို ဘရိက် စမ်းပါ' } },
      { text: { en: 'Drive faster and weave through traffic to release stress', my: 'စိတ်ဖိစီးမှု လျော့ရန် ပိုမြန် မောင်းပြီး ယာဉ်ကြောင်း ဖြတ်ကူပါ' } },
    ],
    answer: 0,
    explanation: {
      en: 'Road rage impairs judgement. Calm yourself and concentrate on safe driving rather than confrontation.',
      my: 'လမ်းဒေါသသည် ဆုံးဖြတ်ချက် မှားစေသည်။ စိတ်ငြိမ်ပြီး ရန်ဖြစ်မှု ထက် ဘေးကင်း မောင်းနှင်မှု အာရုံစိုက်ပါ။',
    },
    media: { type: 'image', src: '/signs/sg/car-interior.png', alt: { en: 'Managing anger while driving', my: 'မောင်းနေစဉ် စိတ်တို စံခြင်း' } },
  },
  {
    id: 'sg_ftt_0513',
    category: 'sg_ftt',
    syllabusRef: 'ftt.alcohol',
    topic: 'alcohol',
    difficulty: 'easy',
    prompt: {
      en: 'You had two beers three hours ago at lunch. A friend says you are fine to drive home. What is the safest approach?',
      my: 'နေ့လည်စာ တွင် ဘီယာ နှစ်ခွက် သုံးနာရီ အကြာ သောက်ထားပါသည်။ သူငယ်ချင်း မောင်းပြန်လို့ ရတယ် ဟု ပြောပါသည်။ အလုံခြုံဆုံး နည်းလမ်း ဘာလဲ?',
    },
    choices: [
      { text: { en: 'Do not drive if there is any doubt — alcohol affects judgement and reaction time', my: 'သံသယ ရှိလျှင် မမောင်းပါ — အရက် သည် ဆုံးဖြတ်ချက် နှင့် တုံ့ပြန်ချိန် ကို ထိခိုက်စေသည်' } },
      { text: { en: 'Drive slowly in the left lane to reduce risk', my: 'အန္တရာယ် လျော့ရန် ဘယ်ဘက် လမ်း်းဖြည်း မောင်းပါ' } },
      { text: { en: 'Coffee will make you legal to drive immediately', my: 'ကော်ဖီ သောက်လျှင် ချက်ချင်း ဥပဒေအရ မောင်းခွင့် ရသည်' } },
    ],
    answer: 0,
    explanation: {
      en: 'Even small amounts of alcohol can impair driving. If unsure, use alternative transport.',
      my: 'အရက် အနည်းငယ်ပင် မောင်းနှင်မှု ထိခိုက်စေနိုင်သည်။ မသေချာလျှင် အခြား သယ်ယူပို့ဆောင်ရေး သုံးပါ။',
    },
    media: { type: 'image', src: '/signs/sg/car-interior.png', alt: { en: 'Drink driving risk decision', my: 'အရက်သောက်မောင်းခြင်း အန္တရာယ် ဆုံးဖြတ်ချက်' } },
  },
  {
    id: 'sg_ftt_0514',
    category: 'sg_ftt',
    syllabusRef: 'ftt.alcohol',
    topic: 'alcohol',
    difficulty: 'medium',
    prompt: {
      en: 'Which statement about drink driving in Singapore is correct?',
      my: 'စင်္ကာပူ တွင် အရက်သောက်မောင်းခြင်း အကြောင်း မည်သည့်ပြောဆိုချက် မှန်ကန်သလဲ?',
    },
    choices: [
      { text: { en: 'It is an offence to drive when your blood alcohol exceeds the legal limit', my: 'ဥပဒေအရ ခွင့်ပြုထားသော အရက် အဆင့် ကျော်လျှင် မောင်းခြင်း ပြစ်မှုဖြစ်သည်' } },
      { text: { en: 'You are safe to drive as long as you feel sober', my: 'သတိထားနိုင်လျှင် မောင်းခွင့် ရသည်' } },
      { text: { en: 'Only drivers involved in accidents are breath-tested', my: 'မတော်တဆမှု ဖြစ်သူများ သာ အသက်ရှူ စမ်းသပ်ခံရသည်' } },
    ],
    answer: 0,
    explanation: {
      en: 'Singapore enforces strict drink-driving limits. Being below the limit and fit to drive is a legal requirement.',
      my: 'စင်္ကာပူ တွင် အရက်သောက်မောင်းခြင်း ကန့်သတ်ချက် တင်းကျပ်စွာ လိုက်နာရသည်။ ကန့်သတ်ချက် အောက် ရှိပြီး မောင်းနိုင်ရန် သင့်လျော်မှု ဥပဒေအရ လိုအပ်သည်။',
    },
    media: { type: 'image', src: '/signs/sg/traffic-signals-sign.png', alt: { en: 'Drink driving law awareness', my: 'အရက်သောက်မောင်းခြင်း ဥပဒေ သတိပြုမှု' } },
  },
  {
    id: 'sg_ftt_0515',
    category: 'sg_ftt',
    syllabusRef: 'ftt.skills.slopes',
    topic: 'hill_start',
    difficulty: 'medium',
    prompt: {
      en: 'You must hill-start uphill after stopping on a steep slope. What sequence reduces rollback risk?',
      my: 'စောင်းတက်လျှောက် ဆင်းသော နေရာ တွင် ရပ်ပြီးနောက် တောင်တက်လမ်း မှ ပြန် စတင်ရမည် ဖြစ်ပါသည်။ နောက်ပြန် လျှောကျခြင်း အန္တရာယ် လျော့ရန် မည်သည့် အစီအစဉ် လဲ?',
    },
    choices: [
      { text: { en: 'Handbrake on, find biting point, then release handbrake smoothly as you accelerate', my: 'လက်ဘရိက် ဆွဲ၊ ကလပ်ချ် biting point ရှာ၊ အရှိန်တိုးရင်း လက်ဘရိက် ချောမွေ့ဖြေပါ' } },
      { text: { en: 'Release handbrake first, then find the clutch biting point quickly', my: 'ပထမ လက်ဘရိက် ဖြေပြီး ကလပ်ချ် biting point မြန်မြန် ရှာပါ' } },
      { text: { en: 'Use neutral and coast backwards before restarting', my: 'ဂီယာလွတ် ထားပြီး နောက်ပြန် လျှောချကာ ပြန် စပါ' } },
    ],
    answer: 0,
    explanation: {
      en: 'On uphill starts, secure the vehicle with the handbrake, engage drive gently, then release the brake as power transfers to the wheels.',
      my: 'တောင်တက်လမ်း မှ စတင်ရာတွင် လက်ဘရိက် ဖြင့် ယာဉ် တည်ငြိမ်စေပြီး ချောမွေ့စွာ ဂီယာ ချိတ်ကာ စီးရီး သို့ အားလွှဲသည့်အခါ ဘရိက် ဖြေပါ။',
    },
    media: { type: 'image', src: '/signs/sg/junction.png', alt: { en: 'Uphill hill start on a slope', my: 'စောင်းတက်လမ်း ပေါ် တောင်တက် hill start' } },
  },
  {
    id: 'sg_ftt_0516',
    category: 'sg_ftt',
    syllabusRef: 'ftt.traffic.motorcyclists',
    topic: 'motorcyclists',
    difficulty: 'medium',
    prompt: {
      en: 'You are driving in slow traffic and a motorcyclist filters between lanes near your car. What should you do before changing lanes?',
      my: 'ယာဉ်ကြောင်း နှေးကွေးစွာ ရွေ့နေပြီး ဆိုင်ကယ် တစ်စီး သင် ကား နှင့် ကား ကြား လမ်း ဖြတ်ကူ ဖြတ်သွားပါသည်။ လမ်း ပြောင်းမီ ဘာလုပ်ရမလဲ?',
    },
    choices: [
      { text: { en: 'Check mirrors and blind spots specifically for filtering motorcycles', my: 'လမ်း ဖြတ်ကူ ဖြတ်သွားသော ဆိုင်ကယ်များအတွက် မှန်ဘီလူး နှင့် မျက်လုံး မမြင်ရသော နေရာ စစ်ပါ' } },
      { text: { en: 'Signal and move immediately — motorcycles must give way to cars', my: 'ညွှန်ပြပြီး ချက်ချင်း ရွေ့ပါ — ဆိုင်ကယ်များ ကားကို လမ်းပေးရမည်' } },
      { text: { en: 'Open your door slightly to warn the rider', my: 'စီးသူကို သတိပေးရန် တံခါး အနည်းငယ် ဖွင့်ပါ' } },
    ],
    answer: 0,
    explanation: {
      en: 'Motorcyclists may filter legally in some conditions. Always check blind spots before lane changes in slow traffic.',
      my: 'အချို့ အခြေအနေတွင် ဆိုင်ကယ်များ ဥပဒေအရ လမ်း ဖြတ်ကူ ဖြတ်သွားနိုင်သည်။ ယာဉ်ကြောင်း နှေးကွေးစွာ ရွေ့နေစဉ် လမ်း ပြောင်းမီ မျက်လုံး မမြင်ရသော နေရာ စစ်ပါ။',
    },
    media: { type: 'image', src: '/signs/sg/motorcycle-city.png', alt: { en: 'Motorcycle filtering in slow traffic', my: 'ယာဉ်ကြောင်း နှေးကွေးစွာ ဆိုင်ကယ် လမ်း ဖြတ်ကူ ဖြတ်သွားခြင်း' } },
  },
];

const existing = JSON.parse(fs.readFileSync(gapFillPath, 'utf8'));
const ids = new Set(existing.map((q) => q.id));
const toAdd = ROUND2.filter((q) => !ids.has(q.id));
const merged = [...existing, ...toAdd];
fs.writeFileSync(gapFillPath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');
console.log(`gap-fill.json: appended ${toAdd.length} questions (${merged.length} total)`);

for (const category of ['sg_btt', 'sg_ftt']) {
  const mainPath = path.join(questionsDir, `${category}.json`);
  const main = JSON.parse(fs.readFileSync(mainPath, 'utf8'));
  const bankIds = new Set(main.map((q) => q.id));
  const incoming = toAdd.filter((q) => q.category === category);
  const added = [];
  for (const question of incoming) {
    if (bankIds.has(question.id)) continue;
    main.push(question);
    bankIds.add(question.id);
    added.push(question.id);
  }
  if (added.length > 0) {
    fs.writeFileSync(mainPath, `${JSON.stringify(main, null, 2)}\n`, 'utf8');
  }
  console.log(`${category}: merged ${added.length}, bank total ${main.length}`);
}
