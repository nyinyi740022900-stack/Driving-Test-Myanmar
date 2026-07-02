#!/usr/bin/env node
/**
 * Rewrite low-value SG BTT/FTT questions and backfill missing media.
 * Usage: node scripts/fix-sg-question-quality.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUESTIONS_DIR = path.join(__dirname, '..', 'content', 'questions');
const SIGNS_DIR = path.join(__dirname, '..', 'public', 'signs', 'sg');

const AVAILABLE_MEDIA = new Set([
  'expressway.png',
  'junction.png',
  'wet-road.png',
  'parking-lot.png',
  'warning-sign.png',
  'stop.png',
  'give-way.png',
  'speed-50.png',
  'car-engine.png',
  'tyre-check.png',
  'traffic-light.png',
  'school-zone.png',
  'pedestrian-crossing.png',
  'erp-road.png',
  'ambulance.png',
  'car-interior.png',
  'roundabout.png',
  'night-driving.png',
  'fog-road.png',
  'children-road.png',
  'no-entry.png',
  'no-overtaking.png',
  'highway.png',
]);

/** Partial rewrites — id, category, topic, difficulty are preserved from the bank. */
const REWRITES = {
  sg_btt_0004: {
    prompt: {
      en: 'You approach a sharp left bend on Bukit Timah Road. A triangular warning sign with a red border is posted before the bend. What should you do?',
      my: 'Bukit Timah လမ်းပေါ်တွင် ဘယ်ဘက်ကောက်ကွေ့သို့ ချဉ်းကပ်နေသည်။ ကောက်ကွေ့မတိုင်မီ အနီရောင်နယ်နိမိတ်ပါ တြိဂံသတိပေးဆိုင်းဘုတ် တပ်ထားသည်။ သင် ဘာလုပ်သင့်သလဲ။',
    },
    choices: [
      {
        text: {
          en: 'Reduce speed and be prepared for the bend',
          my: 'အမြန်နှုန်းလျှော့ချပြီး ကောက်ကွေ့အတွက် ပြင်ဆင်ပါ',
        },
      },
      {
        text: {
          en: 'Maintain speed because the sign is only informational',
          my: 'ဆိုင်းဘုတ်သည် သတင်းအချက်အလက်သာဖြစ်သောကြောင့် အမြန်နှုန်းထိန်းပါ',
        },
      },
      {
        text: {
          en: 'Overtake slower vehicles before the bend',
          my: 'ကောက်ကွေ့မတိုင်မီ နှေးသော ယာဉ်များကို ကျော်တက်ပါ',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'Warning signs alert you to hazards ahead. Slow down before a sharp bend so you can steer safely without crossing into oncoming traffic.',
      my: 'သတိပေးဆိုင်းဘုတ်များသည် ရှေ့တွင် အန္တရာယ်ရှိကြောင်း သတိပေးသည်။ ကောက်ကွေ့တွင် ဆန့်ကျင်ဘက်ယာဉ်ကြောင်းသို့ ဖြတ်မသွားနိုင်ရန် ဘေးကင်းစွာ လှည့်နိုင်အောင် ကောက်ကွေ့မတိုင်မီ အမြန်နှုန်းလျှော့ချပါ။',
    },
  },
  sg_btt_0008: {
    prompt: {
      en: 'You are driving on a priority road marked with yellow diamond signs. A car pulls out from a side road on your right without stopping. What is the safest response?',
      my: 'ဝါရောင်စိန်ပုံဆိုင်းဘုတ်များဖြင့် ဦးစားပေးလမ်းအဖြစ် အမှတ်အသားပြုထားသော လမ်းပေါ်တွင် မောင်းနှင်နေသည်။ သင်၏ညာဘက်မှ ဘေးလမ်းတစ်ခုမှ ကား ရပ်မဘဲ ထွက်လာသည်။ အဘေးကင်းဆုံးတုံ့ပြန်မှု ဘာဖြစ်သလဲ။',
    },
    choices: [
      {
        text: {
          en: 'Brake if needed to avoid a collision — the side-road driver should have given way',
          my: 'တိုက်မိမှု ရှောင်ရန် လိုအပ်လျှင် ဘရိတ်နင်းပါ — ဘေးလမ်းမှ ယာဉ်မောင်းသည် လမ်းပေးရမည်ဖြစ်သည်',
        },
      },
      {
        text: {
          en: 'Continue at the same speed because you always have absolute right of way',
          my: 'အမြဲတမ်း လုံးဝ ဦးစားပေးခွင့်ရှိသောကြောင့် အမြန်နှုန်းတူဆက်မောင်းပါ',
        },
      },
      {
        text: {
          en: 'Sound your horn and accelerate past the other car',
          my: 'ဟွန်းတီးပြီး အခြားကားကို ကျော်တက်ပါ',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'On a priority road, traffic from side roads must give way to you. However, you must still be ready to brake — never assume other drivers will obey the rules.',
      my: 'ဦးစားပေးလမ်းပေါ်တွင် ဘေးလမ်းမှ ယာဉ်များသည် သင်ကို လမ်းပေးရမည်။ သို့သော် အခြားယာဉ်မောင်းများ စည်းမျဉ်းလိုက်နာမည်ဟု မယုံကြည်ဘဲ ဘရိတ်နိုင်ရန် အမြဲပြင်ဆင်ထားပါ။',
    },
  },
  sg_btt_0138: {
    prompt: {
      en: 'Near a primary school you see a yellow diamond sign showing two children crossing. School has just ended and pupils are walking along the pavement. What should you do?',
      my: 'မူလတန်းကျောင်းအနီးတွင် ကလေးနှစ်ဦး ဖြတ်ကူးနေပုံပါသော ဝါရောင်စိန်ပုံဆိုင်းဘုတ်ကို မြင်ရသည်။ ကျောင်းပြီးချိန်ဖြစ်ပြီး ကျောင်းသားများ လမ်းဘေးလျှောက်နေသည်။ သင် ဘာလုပ်သင့်သလဲ။',
    },
    choices: [
      {
        text: {
          en: 'Reduce speed and be ready to stop if a child steps onto the road',
          my: 'အမြန်နှုန်းလျှော့ချပြီး ကလေးတစ်ဦး လမ်းသို့ ခြေချလျှင် ရပ်နိုင်ရန် ပြင်ဆင်ပါ',
        },
      },
      {
        text: {
          en: 'Sound your horn continuously to warn children away',
          my: 'ကလေးများကို သတိပေးရန် ဟွန်းတီးဆက်တိုက်ပါ',
        },
      },
      {
        text: {
          en: 'Maintain normal speed because children should look before crossing',
          my: 'ကလေးများ ဖြတ်မီ ကြည့်သင့်သောကြောင့် ပုံမှန်အမြန်နှုန်းထိန်းပါ',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'School zone warning signs mean children may cross unexpectedly. Slow down, scan both sides, and be prepared to stop even if they are on the pavement.',
      my: 'ကျောင်းဇုန်သတိပေးဆိုင်းဘုတ်များသည် ကလေးများ မမျှော်လင့်ဘဲ ဖြတ်ကူးနိုင်သည်ဟု ဆိုလိုသည်။ အမြန်နှုန်းလျှော့ချပြီး နှစ်ဘက်လုံးကို ကြည့်ရှုပြီး လမ်းဘေးတွင်ရှိသော်လည်း ရပ်နိုင်ရန် ပြင်ဆင်ထားပါ။',
    },
  },
  sg_btt_0178: {
    prompt: {
      en: 'You want to change lanes on the PIE. Your mirrors show no vehicle behind, but a motorcycle could be in your blind spot. What must you do before moving?',
      my: 'PIE ပေါ်တွင် လမ်းကြောင်းပြောင်းလိုသည်။ မှန်များတွင် နောက်မှ ယာဉ်မမြင်ရသော်လည်း မော်တော်ဆိုင်ကယ်သည် မြင်မရသောနေရာတွင် ရှိနိုင်သည်။ ရွေ့မီ သင် ဘာလုပ်ရမည်လဲ။',
    },
    choices: [
      {
        text: {
          en: 'Turn your head to check the blind spot, then signal and move when safe',
          my: 'ပခုံးစစ်ဆေးမှု ပြုလုပ်ပြီး ဘေးကင်းသောအခါ အချက်ပြကာ ရွေ့ပါ',
        },
      },
      {
        text: {
          en: 'Signal and move immediately because the mirrors are clear',
          my: 'မှန်များ ရှင်းလင်းသောကြောင့် ချက်ချင်း အချက်ပြကာ ရွေ့ပါ',
        },
      },
      {
        text: {
          en: 'Check only the rear-view mirror before changing lanes',
          my: 'လမ်းကြောင်းမပြောင်းမီ နောက်မှန်သာ စစ်ဆေးပါ',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'Mirrors do not show the blind spots beside your vehicle. Always perform a shoulder check before changing lanes or turning, especially for motorcycles.',
      my: 'မှန်များသည် ယာဉ်ဘေးရှိ မြင်မရသောနေရာများကို မပြပါ။ လမ်းကြောင်းပြောင်း သို့မဟုတ် ကွေ့မီ အမြဲ ပခုံးစစ်ဆေးမှု ပြုလုပ်ပါ၊ အထူးသဖြင့် မော်တော်ဆိုင်ကယ်များအတွက်။',
    },
  },
  sg_btt_0267: {
    prompt: {
      en: 'A friend asks you to stop beside a zigzag yellow line outside an office to pick them up quickly. What should you do?',
      my: 'သူငယ်ချင်းတစ်ဦးသည် ရုံးအပြင်ရှိ ဇစ်ဇပ်အဝါကြောင်းဘေးတွင် မြန်ဆန်စွာ လာကြိုရန် ရပ်ခိုင်းသည်။ သင် ဘာလုပ်သင့်သလဲ။',
    },
    choices: [
      {
        text: {
          en: 'Do not stop — no stopping, waiting, or passenger pick-up/drop-off is allowed at any time',
          my: 'မရပ်ပါနှင့် — မည်သည့်အချိန်တွင်မဆို ရပ်ခြင်း၊ စောင့်ခြင်း သို့မဟုတ် ခရီးသည် တင်/ချခြင်း မပြုရ',
        },
      },
      {
        text: {
          en: 'Stop briefly with hazard lights on',
          my: 'အရေးပေါ်မီးဖွင့်ပြီး ခဏရပ်ပါ',
        },
      },
      {
        text: {
          en: 'Stop if you keep the engine running and stay under one minute',
          my: 'အင်ဂျင်မပိတ်ဘဲ တစ်မိနစ်အောက် ရပ်လျှင် ရပါသည်',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'Zigzag yellow lines prohibit stopping at any time, including quick passenger pick-ups. Find a legal stopping bay or car park nearby instead.',
      my: 'ဇစ်ဇပ်အဝါကြောင်းများသည် မြန်ဆန်သော ခရီးသည် တင်ခြင်းအပါအဝင် မည်သည့်အချိန်တွင်မဆို ရပ်ခြင်းကို တားမြစ်သည်။ အနီးရှိ တရားဝင်ရပ်နားရာ သို့မဟုတ် ကားရပ်နားရာနေရာကို ရှာပါ။',
    },
  },
  sg_btt_0287: {
    prompt: {
      en: 'You find a parking space 4 metres from a T-junction on a narrow HDB street. No other restrictions are posted. Can you park there?',
      my: 'ဘက်ကျဉ်းသော HDB လမ်းပေါ်ရှိ T-junction မှ မီတာ ၄ ကွာသော ကားရပ်နားရာနေရာ တစ်ခုတွေ့သည်။ အခြားကန့်သတ်ချက်မရှိ။ ထိုနေရာတွင် ရပ်နိုင်ပါသလား။',
    },
    choices: [
      {
        text: {
          en: 'No — you must not park within 6 metres of a junction',
          my: 'မရပါ — လမ်းဆုံမှ မီတာ ၆ အတွင်း ရပ်နား မရ',
        },
      },
      {
        text: {
          en: 'Yes — 3 metres from a junction is the minimum rule',
          my: 'ရပါသည် — လမ်းဆုံမှ မီတာ ၃ သည် အနည်းဆုံးစည်းမျဉ်း',
        },
      },
      {
        text: {
          en: 'Yes — if no vehicles are waiting to turn at the junction',
          my: 'ရပါသည် — လမ်းဆုံတွင် ကွေ့ရန် စောင့်နေသော ယာဉ်မရှိလျှင်',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'Parking within 6 metres of a junction blocks the view of drivers and pedestrians. Move to a space farther from the junction.',
      my: 'လမ်းဆုံမှ မီတာ ၆ အတွင်း ရပ်နားခြင်းသည် ယာဉ်မောင်းနှင့် လမ်းလျောက်သူများ၏ မြင်ကွင်းကို ပိတ်ဆို့သည်။ လမ်းဆုံမှ ပိုဝေးသော နေရာသို့ ရွှေ့ပါ။',
    },
  },
  sg_btt_0297: {
    prompt: {
      en: 'At a police roadblock your breath test reads 85mg of alcohol per 100ml of blood. What does this mean under Singapore law?',
      my: 'ရဲစစ်ဆေးရာတွင် သင့်အသက်ရှူစစ်ဆေးမှု ရလဒ်မှာ သွေးတစ်ရာ မီလီလီတာလျှင် အရက် ၈၅ မီလီဂရမ် ဖြစ်သည်။ စင်္ကာပူ ဥပဒေအရ ၎င်းသည် ဘာဆိုလိုသလဲ။',
    },
    choices: [
      {
        text: {
          en: 'You are above the legal limit of 80mg and may face drink-driving penalties',
          my: 'သင် ဥပဒေခွင့်ပြုသော ၈၀ မီလီဂရမ် ကန့်သတ်ထက် ကျော်လွန်ပြီး အရက်သောက်မောင်းနှင်မှု ဒဏ်ခတ်ခံရနိုင်သည်',
        },
      },
      {
        text: {
          en: 'You are within the legal limit and may continue driving',
          my: 'သင် ဥပဒေခွင့်ပြုကန့်သတ်ချက်အတွင်းရှိပြီး ဆက်မောင်းနိုင်သည်',
        },
      },
      {
        text: {
          en: 'The limit applies only to commercial vehicle drivers',
          my: 'ကန့်သတ်ချက်သည် ကုန်တင်ယာဉ်မောင်းများအတွက်သာ သက်ရောက်သည်',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'The legal alcohol limit in Singapore is 80mg per 100ml of blood (35 micrograms per 100ml of breath). At 85mg you are over the limit and must not drive.',
      my: 'စင်္ကာပူတွင် ဥပဒေခွင့်ပြုသော အရက်ကန့်သတ်ချက်မှာ သွေးတစ်ရာ မီလီလီတာလျှင် ၈၀ မီလီဂရမ် (အသက်ရှူတစ်ရာ မီလီလီတာလျှင် ၃၅ မိုက်ခရိုဂရမ်) ဖြစ်သည်။ ၈၅ မီလီဂရမ်တွင် သင် ကန့်သတ်ထက် ကျော်လွန်ပြီး မောင်းနှင် မရပါ။',
    },
  },
  sg_btt_0322: {
    prompt: {
      en: 'At a green traffic light you want to turn right. A car is approaching straight ahead from the opposite direction. What must you do?',
      my: 'မီးအစိမ်းတွင် ညာဘက်သို့ ကွေ့လိုသည်။ ဆန့်ကျင်ဘက်မှ ကားတစ်စီး တည့်တည့် ချဉ်းကပ်လာသည်။ သင် ဘာလုပ်ရမည်လဲ။',
    },
    choices: [
      {
        text: {
          en: 'Give way and wait until oncoming traffic has cleared before turning',
          my: 'ဦးစားပေးပြီး ဆန့်ကျင်ဘက်ယာဉ်များ ရှင်းသည်အထိ စောင့်ကာ ကွေ့ပါ',
        },
      },
      {
        text: {
          en: 'Turn quickly before the oncoming car reaches the junction',
          my: 'ဆန့်ကျင်ဘက်ကား လမ်းဆုံမရောက်မီ မြန်ဆန်စွာ ကွေ့ပါ',
        },
      },
      {
        text: {
          en: 'You have right of way because your light is green',
          my: 'မီးအစိမ်းဖြစ်သောကြောင့် သင့်တွင် ဦးစားပေးခွင့်ရှိသည်',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'When turning right, you must give way to oncoming traffic going straight and to vehicles turning left from the opposite direction. A green light does not give you priority to turn right.',
      my: 'ညာဘက်သို့ ကွေ့သောအခါ ဆန့်ကျင်ဘက်မှ တည့်တည့်သွားသော ယာဉ်များနှင့် ဆန့်ကျင်ဘက်မှ ဘယ်ဘက်သို့ ကွေ့နေသော ယာဉ်များကို ဦးစားပေးရမည်။ မီးအစိမ်းသည် ညာဘက်ကွေ့ရန် ဦးစားပေးခွင့် မပေးပါ။',
    },
  },
  sg_btt_0361: {
    prompt: {
      en: 'You approach a roundabout and a car is already circulating inside from your left. What should you do?',
      my: 'လမ်းကွင်းသို့ ချဉ်းကပ်နေပြီး ကားတစ်စီး သင်၏ဘယ်ဘက်မှ လည်ပတ်နေပြီးသား ဖြစ်သည်။ သင် ဘာလုပ်သင့်သလဲ။',
    },
    choices: [
      {
        text: {
          en: 'Slow down and give way — enter only when there is a safe gap',
          my: 'အမြန်နှုန်းလျှော့ချပြီး ဦးစားပေးပါ — ဘေးကင်းသော ကွာဟချက်ရှိမှသာ ဝင်ပါ',
        },
      },
      {
        text: {
          en: 'Enter immediately because you are on the main road',
          my: 'အဓိကလမ်းပေါ်ရှိသောကြောင့် ချက်ချင်း ဝင်ပါ',
        },
      },
      {
        text: {
          en: 'Sound your horn to make the circulating car slow down',
          my: 'လည်ပတ်နေသော ကားနှေးစေရန် ဟွန်းတီးပါ',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'Vehicles already inside a roundabout have right of way. Wait for a safe gap before entering and always signal when exiting.',
      my: 'လမ်းကွင်းအတွင်းရှိ ယာဉ်များတွင် ဦးစားပေးခွင့်ရှိသည်။ ဘေးကင်းသော ကွာဟချက်ရှိမှသာ ဝင်ပါ၊ ထွက်သောအခါ အမြဲ အချက်ပြပါ။',
    },
  },
  sg_btt_0388: {
    prompt: {
      en: 'You plan to drive from Singapore to Johor Bahru early tomorrow morning. It is raining tonight. What checks should you make before leaving?',
      my: 'မနက်ဖြန် စောစောစင်္ကာပူမှ ဂျိုဟိုဘာရူသို့ မောင်းမည်။ ယနေ့ည မိုးရွာနေသည်။ မထွက်မီ မည်သည်ကို စစ်ဆေးသင့်သလဲ။',
    },
    choices: [
      {
        text: {
          en: 'Tyre pressure and tread, engine oil, coolant, brakes, all lights, fuel and screen wash',
          my: 'တာယာဖိအားနှင့် ပွင့်လမ်း၊ အင်ဂျင်ဆီ၊ အေးဆေးရည်၊ ဘရိတ်၊ မီးအားလုံး၊ လောင်စာနှင့် မျက်နှာပြင်သန့်ရှင်းရေး ရည်',
        },
      },
      {
        text: {
          en: 'Fuel level only — the car was serviced recently',
          my: 'လောင်စာအဆင့်သာ — ကားကို မကြာသေးမီ ဝန်ဆောင်မှုပေးပြီး',
        },
      },
      {
        text: {
          en: 'Tyre pressure only because the trip is short',
          my: 'ခရီးတိုသောကြောင့် တာယာဖိအားသာ',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'Before a long journey, especially in wet weather, check tyres, fluids, brakes, lights and wipers. Poor tyre grip in rain increases stopping distance significantly.',
      my: 'ခရီးရှည်မတိုင်မီ၊ အထူးသဖြင့် မိုးရွာသည့်ရာသီဥတုတွင် တာယာ၊ အရည်များ၊ ဘရိတ်၊ မီးနှင့် ဝိုင်ပါများကို စစ်ဆေးပါ။ မိုးရာသီဥတုတွင် တာယာဆုပ်ကိုင်မှု ကျဆင်းသောကြောင့် ရပ်တပ်အကွာအဝေး သိသာစွာ တိုးလာသည်။',
    },
  },
  sg_btt_0401: {
    prompt: {
      en: 'On the BKE you are following a heavy lorry at 90 km/h with only one car-length gap. What is the main danger?',
      my: 'BKE ပေါ်တွင် လေးလံသော လော်ရီတစ်စီးကို တစ်ကားအလျားအကွာအဝေးသာ ထားပြီး နာရီကီလိုမီတာ ၉၀ ဖြင့် လိုက်နေသည်။ အဓိက အန္တရာယ် ဘာဖြစ်သလဲ။',
    },
    choices: [
      {
        text: {
          en: 'You cannot stop in time if the lorry brakes suddenly',
          my: 'လော်ရီ ရုတ်တရက် ဘရိတ်နင်းလျှင် အချိန်မီ ရပ်နိုင်မည် မဟုတ်',
        },
      },
      {
        text: {
          en: 'It is safe if you stay alert and watch the lorry closely',
          my: 'သတိထားပြီး လော်ရီကို နီးကပ်စွာ ကြည့်လျှင် ဘေးကင်းသည်',
        },
      },
      {
        text: {
          en: 'Tailgating is only dangerous below 50 km/h',
          my: 'နောက်မှ လွန်ကဲစွာ နီးကပ်လိုက်ခြင်းသည် နာရီကီလိုမီတာ ၅၀ အောက် တွင်သာ အန္တရာယ်ရှိသည်',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'Following too closely leaves no safety margin. At expressway speeds you need at least a two-second gap — more in rain or when following heavy vehicles.',
      my: 'လွန်ကဲစွာ နီးကပ်လိုက်ခြင်းသည် ဘေးကင်းရေး အကွာအဝေး မကျန်ပါ။ အမြန်လမ်းမ အမြန်နှုန်းတွင် အနည်းဆုံး စက္ကန့်နှစ်စက္ကန့် ကွာဟချက် လိုအပ်သည် — မိုးရာသီ သို့မဟုတ် လေးလံသော ယာဉ်လိုက်သည့်အခါ ပိုလိုသည်။',
    },
  },
  sg_btt_0429: {
    prompt: {
      en: 'Your engine suddenly loses power on the CTE expressway during peak hour. You can still steer and there is an emergency lane ahead. What should you do first?',
      my: 'အချိန်ပြည့်အချိန်တွင် CTE အမြန်လမ်းပေါ်တွင် အင်ဂျင် ရုတ်တရက် အားမရှိတော့ပါ။ လမ်းညွှန်နိုင်သေးပြီး အရေးပေါ်လမ်းကြောင်း ရှေ့တွင် ရှိသည်။ ပထမဦးစွာ ဘာလုပ်သင့်သလဲ။',
    },
    choices: [
      {
        text: {
          en: 'Signal left, move to the emergency lane, and switch on hazard lights',
          my: 'ဘယ်ဘက် အချက်ပြပြီး အရေးပေါ်လမ်းကြောင်းသို့ ရွေ့ကာ အရေးပေါ်မီးဖွင့်ပါ',
        },
      },
      {
        text: {
          en: 'Stop in your current lane and switch on hazard lights',
          my: 'လက်ရှိလမ်းကြောင်းတွင် ရပ်ပြီး အရေးပေါ်မီးဖွင့်ပါ',
        },
      },
      {
        text: {
          en: 'Call for help before attempting to move the vehicle',
          my: 'ယာဉ်ရွှေ့မီ အကူခေါ်ပါ',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'On an expressway, get out of the traffic lanes first. Move to the emergency lane, switch on hazard lights, then call for assistance. Exit on the left side when safe.',
      my: 'အမြန်လမ်းပေါ်တွင် ယာဉ်ကြောင်းမှ ဦးစွာ ထွက်ပါ။ အရေးပေါ်လမ်းကြောင်းသို့ ရွေ့ပြီး အရေးပေါ်မီးဖွင့်ကာ အကူခေါ်ပါ။ ဘေးကင်းသောအခါ ဘယ်ဘက်မှ ဆင်းပါ။',
    },
  },
  sg_btt_0432: {
    prompt: {
      en: 'You see an empty kerb space beside a yellow fire hydrant. The hydrant is about 2 metres from where your bumper would be. Should you park?',
      my: 'အဝါရောင် မီးသတ်ရေပိုက်ဘေးတွင် လမ်းဘေးနေရာလွတ် တစ်ခုတွေ့သည်။ သင်၏ ဘမ်ပါနဲ့ မီးသတ်ရေပိုက် အကွာအဝေး ခန့်မှန်း မီတာ ၂ ဖြစ်သည်။ ရပ်နိုင်ပါသလား။',
    },
    choices: [
      {
        text: {
          en: 'No — do not park within 3 metres of a fire hydrant',
          my: 'မရပါ — မီးသတ်ရေပိုက်မှ မီတာ ၃ အတွင်း ရပ်နား မရ',
        },
      },
      {
        text: {
          en: 'Yes — if you will only be away for ten minutes',
          my: 'ရပါသည် — မိနစ်ဆယ်သာ မရှိဘဲ ရောက်မည်ဆိုလျှင်',
        },
      },
      {
        text: {
          en: 'Yes — if other cars are already parked nearby',
          my: 'ရပါသည် — အခြားကားများ အနီးတွင် ရပ်ထားပြီးသားဆိုလျှင်',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'You must not park within 3 metres of a fire hydrant. Blocking access in an emergency can delay firefighting and endanger lives.',
      my: 'မီးသတ်ရေပိုက်မှ မီတာ ၃ အတွင်း ရပ်နား မရပါ။ အရေးပေါ်အချိန်တွင် ဝင်ရောက်မှု ပိတ်ဆို့ခြင်းသည် မီးသတ်ရာတွင် နှောင့်နှေးစေပြီး အသက်အန္တရာယ်ရှိစေနိုင်သည်။',
    },
  },
  sg_btt_0434: {
    prompt: {
      en: 'You want to wait in your car near an MRT bus stop while picking up a friend. The bus stop sign is 5 metres ahead of your chosen space. Can you park there?',
      my: 'သူငယ်ချင်းတစ်ဦးကို လာကြိုရန် ဘတ်စ်ကားရပ်နားရာနီးတွင် ကားထဲ စောင့်လိုသည်။ ရွေးချယ်ထားသော နေရာမှ ဘတ်စ်ကားရပ်နားရာ ဆိုင်းဘုတ်သည် မီတာ ၅ ရှေ့တွင် ရှိသည်။ ထိုနေရာတွင် ရပ်နိုင်ပါသလား။',
    },
    choices: [
      {
        text: {
          en: 'No — do not park within 9 metres of a bus stop',
          my: 'မရပါ — ဘတ်စ်ကားရပ်နားရာမှ မီတာ ၉ အတွင်း ရပ်နား မရ',
        },
      },
      {
        text: {
          en: 'Yes — 3 metres clearance is enough for buses',
          my: 'ရပါသည် — ဘတ်စ်ကားများအတွက် မီတာ ၃ ကွာဟချက် လုံလောက်သည်',
        },
      },
      {
        text: {
          en: 'Yes — if no bus is currently at the stop',
          my: 'ရပါသည် — ဘတ်စ်ကား လက်ရှိ မရှိလျှင်',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'Do not park within 9 metres of a bus stop. Buses need the full bay to pull in safely and passengers need space to board.',
      my: 'ဘတ်စ်ကားရပ်နားရာမှ မီတာ ၉ အတွင်း ရပ်နား မရပါ။ ဘတ်စ်ကားများသည် ဘေးကင်းစွာ ဝင်ရောက်နိုင်ရန် bay အပြည့် လိုအပ်ပြီး ခရီးသည်များလည်း တက်နိုင်ရန် နေရာလိုအပ်သည်။',
    },
  },
  sg_btt_0446: {
    prompt: {
      en: 'You are on the AYE in heavy rain. Visibility improves from 30 metres to about 80 metres but rain continues. Your rear fog lights are on. What should you do?',
      my: 'AYE ပေါ်တွင် မြင်းပြင်းရွာနေသည်။ မြင်ကွင်း မီတာ ၃၀ မှ ခန့်မှန်း ၈၀ အထိ ပိုကောင်းလာသော်လည်း မိုးဆက်ရွာနေသည်။ နောက်မြူမီး ဖွင့်ထားသည်။ သင် ဘာလုပ်သင့်သလဲ။',
    },
    choices: [
      {
        text: {
          en: 'Switch off rear fog lights — they can dazzle drivers behind once visibility improves',
          my: 'နောက်မြူမီး ပိတ်ပါ — မြင်ကွင်းကောင်းလာသောအခါ နောက်မှယာဉ်မောင်းများ မျက်စိဝေဝါးစေနိုင်သည်',
        },
      },
      {
        text: {
          en: 'Keep fog lights on for all rainy conditions',
          my: 'မိုးရွာသည့် အခြေအနေအားလုံးတွင် မြူမီး ဆက်ဖွင့်ထားပါ',
        },
      },
      {
        text: {
          en: 'Use fog lights instead of headlights at night',
          my: 'ညဘက် မီးအစားထိုး မြူမီး သုံးပါ',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'Fog lights are for severely reduced visibility. Switch them off when normal headlights are sufficient to avoid dazzling drivers behind you.',
      my: 'မြူမီးများသည် မြင်ကွင်း ပြင်းထန်စွာ ကျဆင်းသည့်အခါ အတွက်သာ ဖြစ်သည်။ ပုံမှန်မီးလုံလောက်သောအခါ နောက်မှယာဉ်မောင်းများ မျက်စိမဝေဝါးစေရန် ပိတ်ပါ။',
    },
  },
  sg_btt_0462: {
    prompt: {
      en: 'On the PIE you realise you have just passed your intended exit and traffic is heavy behind you. What is the correct action?',
      my: 'PIE ပေါ်တွင် သင်လိုချင်သော ထွက်ပေါက်ကို လွန်သွားပြီးဖြစ်ကြောင်း သိရသည်၊ နောက်မှ ယာဉ်ကြောင်းလည်း ထူထပ်နေသည်။ မှန်ကန်သော လုပ်ဆောင်ချက် ဘာဖြစ်သလဲ။',
    },
    choices: [
      {
        text: {
          en: 'Continue safely to the next exit and use local roads to return',
          my: 'နောက်ထွက်ပေါက်သို့ ဘေးကင်းစွာ ဆက်သွားပြီး ဒေသခံလမ်းများဖြင့် ပြန်ပါ',
        },
      },
      {
        text: {
          en: 'Reverse on the emergency lane to reach your exit',
          my: 'ထွက်ပေါက်ရောက်ရန် အရေးပေါ်လမ်းကြောင်းတွင် နောက်ပြန်မောင်းပါ',
        },
      },
      {
        text: {
          en: 'Stop in lane and wait for a gap to cut across to the exit',
          my: 'လမ်းကြောင်းတွင် ရပ်ပြီး ထွက်ပေါက်သို့ ဖြတ်ရန် ကွာဟချက် စောင့်ပါ',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'Never reverse, stop, or make a U-turn on an expressway. Continue to the next exit — it is the only safe and legal option.',
      my: 'အမြန်လမ်းပေါ်တွင် နောက်ပြန်မောင်း၊ ရပ် သို့မဟုတ် U-turn လုပ်ခြင်း မပြုပါနှင့်။ နောက်ထွက်ပေါက်သို့ ဆက်သွားပါ — ဤသာလျှင် ဘေးကင်းပြီး တရားဝင်သော ရွေးချယ်မှု ဖြစ်သည်။',
    },
  },
  sg_btt_0473: {
    prompt: {
      en: 'You approach a T-junction from a minor road. An inverted red triangle sign is posted and a car is approaching on the main road. What must you do?',
      my: 'ဘေးလမ်းမှ T-junction သို့ ချဉ်းကပ်နေသည်။ ပြောင်းပြန် အနီ တြိဂံဆိုင်းဘုတ် တပ်ထားပြီး အဓိကလမ်းပေါ်မှ ကားတစ်စီး ချဉ်းကပ်လာသည်။ သင် ဘာလုပ်ရမည်လဲ။',
    },
    choices: [
      {
        text: {
          en: 'Slow down, give way to traffic on the main road, and enter only when safe',
          my: 'အမြန်နှုန်းလျှော့ချပြီး အဓိကလမ်းပေါ်ယာဉ်များကို ဦးစားပေးကာ ဘေးကင်းသောအခါသာ ဝင်ပါ',
        },
      },
      {
        text: {
          en: 'Proceed without slowing — the sign applies only to pedestrians',
          my: 'မနှေးဘဲ ဆက်သွားပါ — ဆိုင်းဘုတ်သည် လမ်းလျောက်သူများအတွက်သာ',
        },
      },
      {
        text: {
          en: 'Stop completely even when the main road is clear',
          my: 'အဓိကလမ်း ရှင်းနေသော်လည်း လုံးဝ ရပ်ပါ',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'A Give Way sign means you must give way to traffic on the major road. Slow down and proceed only when it is safe — you do not need to stop if the road is clear.',
      my: 'ဦးစားပေးဆိုင်းဘုတ်ဆိုသည်မှာ အဓိကလမ်းပေါ်ယာဉ်များကို လမ်းပေးရမည်ဟု ဆိုလိုသည်။ အမြန်နှုန်းလျှော့ချပြီး ဘေးကင်းသောအခါသာ ဆက်သွားပါ — လမ်း ရှင်းနေလျှင် ရပ်ရန် မလိုပါ။',
    },
  },
  sg_ftt_0185: {
    prompt: {
      en: 'You are on a priority road in a housing estate. A car at a side junction starts to edge forward without looking. What should you do?',
      my: 'အိမ်ရာကျောင်းတွင်းရှိ ဦးစားပေးလမ်းပေါ်တွင် မောင်းနှင်နေသည်။ ဘေးလမ်းဆုံမှ ကားတစ်စီး မကြည့်ဘဲ ရှေ့သို့ တ်းဖြည်း ထွက်လာသည်။ သင် ဘာလုပ်သင့်သလဲ။',
    },
    choices: [
      {
        text: {
          en: 'Be ready to brake — the side-road driver must give way, but you must avoid a collision',
          my: 'ဘရိတ်နိုင်ရန် ပြင်ဆင်ထားပါ — ဘေးလမ်းမှ ယာဉ်မောင်းသည် လမ်းပေးရမည်ဖြစ်သော်လည်း တိုက်မိမှု ရှောင်ရမည်',
        },
      },
      {
        text: {
          en: 'Maintain speed and assume the other driver will stop',
          my: 'အခြားယာဉ်မောင်း ရပ်မည်ဟု ယုံကြည်ပြီး အမြန်နှုန်းထိန်းပါ',
        },
      },
      {
        text: {
          en: 'Flash your high beam and accelerate to pass first',
          my: 'အလြင်းမီး လှုပ်ရှားပြီး ဦးစွာကျော်တက်ရန် အရှိန်တိုး',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'Priority road status means others must give way to you, but defensive driving requires you to react if another driver makes a mistake.',
      my: 'ဦးစားပေးလမ်းအခြေအနေဆိုသည်မှာ အခြားသူများ သင်ကို လမ်းပေးရမည်ဟု ဆိုလိုသော်လည်း အခြားယာဉ်မောင်း အမှားပြုလျှင် တုံ့ပြန်နိုင်ရန် ကာကွယ်စွာ မောင်းနှင်ရမည်။',
    },
  },
  sg_ftt_0284: {
    prompt: {
      en: 'You approach a junction where a triangular red-bordered sign warns that traffic merges from the right. What should you do?',
      my: 'ညာဘက်မှ ယာဉ်များ ပေါင်းစည်းလာကြောင်း သတိပေးသော အနီရောင်နယ်နိမိတ်ပါ တြိဂံဆိုင်းဘုတ်ရှိသော လမ်းဆုံသို့ ချဉ်းကပ်နေသည်။ သင် ဘာလုပ်သင့်သလဲ။',
    },
    choices: [
      {
        text: {
          en: 'Reduce speed and check for vehicles merging from the joining road',
          my: 'အမြန်နှုန်းလျှော့ချပြီး ပေါင်းစည်းလာသော လမ်းမှ ယာဉ်များကို စစ်ဆေးပါ',
        },
      },
      {
        text: {
          en: 'Maintain speed — merging traffic must always give way to you',
          my: 'အမြန်နှုန်းထိန်းပါ — ပေါင်းစည်းလာသော ယာဉ်များသည် အမြဲ သင်ကို လမ်းပေးရမည်',
        },
      },
      {
        text: {
          en: 'Accelerate to clear the junction before merging traffic arrives',
          my: 'ပေါင်းစည်းလာသော ယာဉ်မရောက်မီ လမ်းဆုံကို ကျော်ရန် အရှိန်တိုး',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'Warning signs alert you to hazards ahead. At merging junctions, slow down and be prepared to give way if necessary.',
      my: 'သတိပေးဆိုင်းဘုတ်များသည် ရှေ့တွင် အန္တရာယ်ရှိကြောင်း သတိပေးသည်။ ပေါင်းစည်းသည့် လမ်းဆုံများတွင် အမြန်နှုန်းလျှော့ချပြီး လိုအပ်လျှင် လမ်းပေးရန် ပြင်ဆင်ထားပါ။',
    },
  },
  sg_ftt_0285: {
    prompt: {
      en: 'You are about to enter a one-way street but see a circular sign with a red border showing a white horizontal bar. What must you do?',
      my: 'တစ်လမ်းသွယ်လမ်းသို့ ဝင်တော့မည် ဆိုသော်လည်း အနီရောင်နယ်နိမိတ်ပါ စက်ဝိုင်းဆိုင်းဘုတ်တွင် အဖြူရောင် အလျားလိုက်မျဉ်း တပ်ထားသည်ကို မြင်ရသည်။ သင် ဘာလုပ်ရမည်လဲ။',
    },
    choices: [
      {
        text: {
          en: 'Do not enter — the sign prohibits entry in this direction',
          my: 'မဝင်ပါနှင့် — ဤဦးတည်ချက်ဖြင့် ဝင်ခွင့် တားမြစ်ထားသည်',
        },
      },
      {
        text: {
          en: 'Enter slowly if no oncoming traffic is visible',
          my: 'ဆန့်ကျင်ဘက်ယာဉ်မမြင်ရလျှင်ဖြည်းချင်း ဝင်ပါ',
        },
      },
      {
        text: {
          en: 'The sign only applies during peak hours',
          my: 'ဆိုင်းဘုတ်သည် အချိန်ပြည့်အချိန်တွင်သာ သက်ရောက်သည်',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'A circular sign with a red border and white bar means No Entry. Find another route — entering is illegal and risks a head-on collision.',
      my: 'အနီရောင်နယ်နိမိတ်နှင့် အဖြူရောင်မျဉ်းပါ စက်ဝိုင်းဆိုင်းဘုတ်ဆိုသည်မှာ မဝင်ရဟု ဆိုလိုသည်။ အခြားလမ်းကြောင်း ရှာပါ — ဝင်ခြင်းသည် တရားမဝင်ပြီး တည့်တည့်တိုက်မိမှု အန္တရာယ်ရှိသည်။',
    },
  },
  sg_ftt_0359: {
    prompt: {
      en: 'You drive through a roadworks area with no specific hazard sign, only a triangular warning sign with an exclamation mark. What is the correct response?',
      my: 'သတ်သတ်မှတ်မှတ် အန္တရာယ်ဆိုင်းဘုတ်မရှိဘဲ အာမေဍိတ်ပါ တြိဂံသတိပေးဆိုင်းဘုတ်သာ ရှိသော လမ်းပြင်ဆင်ရေးဧရိယာကို ဖြတ်သွားနေသည်။ မှန်ကန်သော တုံ့ပြန်မှု ဘာဖြစ်သလဲ။',
    },
    choices: [
      {
        text: {
          en: 'Slow down and proceed with extra caution for unexpected hazards',
          my: 'အမြန်နှုန်းလျှော့ချပြီး မမျှော်လင့်ထားသော အန္တရာယ်များအတွက် ပိုသတိထားကာ ဆက်သွားပါ',
        },
      },
      {
        text: {
          en: 'Ignore the sign if no workers are visible',
          my: 'လုပ်သားများ မမြင်ရလျှင် ဆိုင်းဘုတ်ကို လျစ်လျူရှုပါ',
        },
      },
      {
        text: {
          en: 'Turn around immediately — the road is closed',
          my: 'ချက်ချင်း ပြန်လှည့်ပါ — လမ်းပိတ်ထားသည်',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'A general hazard warning sign means conditions ahead may be unusual. Reduce speed and stay alert for workers, uneven surfaces, or temporary lane changes.',
      my: 'ယေဘုယျ အန္တရာယ်သတိပေးဆိုင်းဘုတ်ဆိုသည်မှာ ရှေ့တွင် အခြေအနေ ပုံမှန်မဟုတ်နိုင်ကြောင်း ဆိုလိုသည်။ အမြန်နှုန်းလျှော့ချပြီး လုပ်သားများ၊ မညီမညာမျက်နှာပြင် သို့မဟုတ် ယာယီလမ်းကြောင်းပြောင်းမှုများအတွက် သတိထားပါ။',
    },
  },
  sg_ftt_0380: {
    prompt: {
      en: 'On a rural road you see a yellow diamond sign showing a steep hill descending ahead. What should you do before the slope?',
      my: 'ကျေးလက်လမ်းပေါ်တွင် ရှေ့တွင် စောင်းတက်သော ကုန်းဆင်းရှိကြောင်း ပြသော ဝါရောင်စိန်ပုံဆိုင်းဘုတ်ကို မြင်ရသည်။ စောင်းမတိုင်မီ သင် ဘာလုပ်သင့်သလဲ။',
    },
    choices: [
      {
        text: {
          en: 'Reduce speed and check your brakes are responding properly',
          my: 'အမြန်နှုန်းလျှော့ချပြီး ဘရိတ်များ ကောင်းမွန်စွာ တုံ့ပြန်ကြောင်း စစ်ဆေးပါ',
        },
      },
      {
        text: {
          en: 'Shift to neutral and coast down to save fuel',
          my: 'ဂီယာလွတ်ထားပြီး လောင်စာချွေတာရန် စောင်းလျှောက် ဆင်းပါ',
        },
      },
      {
        text: {
          en: 'Overtake slower vehicles before the hill',
          my: 'ကုန်းမတိုင်မီ နှေးသော ယာဉ်များကို ကျော်တက်ပါ',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'Steep descent warning signs mean you should slow down early and use a lower gear to control speed, rather than relying only on the footbrake.',
      my: 'စောင်းဆင်းသတိပေးဆိုင်းဘုတ်များဆိုသည်မှာ စောစီးစွာ အမြန်နှုန်းလျှော့ချပြီး ခြေဘရိတ်သာမက အောက်ဂီယာသုံး၍ အမြန်နှုန်းထိန်းရမည်ဟု ဆိုလိုသည်။',
    },
  },
  sg_ftt_0279: {
    prompt: {
      en: 'While manoeuvring into a parallel parking bay, the steering wheel becomes unusually heavy and you hear a whining noise when turning. What is the most likely cause?',
      my: 'အပြိုင် ရပ်နားရာသို့ လှည့်ဝင်နေစဉ် လမ်းညွှန်ဘီး ပုံမှန်ထက် လေးလာပြီး လှည့်သည့်အခါ ညော်ညောည့်သံ ကြားရသည်။ အဖြစ်များဆုံး အကြောင်းရင်း ဘာဖြစ်နိုင်သလဲ။',
    },
    choices: [
      {
        text: {
          en: 'Power steering fluid may be low — check the level when safe',
          my: 'ပါဝါစတီယာင်း အရည်နည်းနိုင်သည် — ဘေးကင်းသောအခါ ပမာဏ စစ်ဆေးပါ',
        },
      },
      {
        text: {
          en: 'Tyre pressure is too high on the front wheels',
          my: 'ရှေ့ဘီးများ တာယာဖိအား အလွန်များနေသည်',
        },
      },
      {
        text: {
          en: 'The engine oil needs an immediate change',
          my: 'အင်ဂျင်ဆီ ချက်ချင်း လဲရမည်',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'Heavy steering with a whining noise often indicates low power steering fluid. Check the reservoir when parked safely and top up with the correct fluid if needed.',
      my: 'ညော်ညောည့်သံနှင့်အတူ လမ်းညွှန်လေးခြင်းသည် ပါဝါစတီယာင်း အရည်နည်းနေခြင်း ဖြစ်နိုင်သည်။ ဘေးကင်းစွာ ရပ်ပြီးနောက် သိုလှောင်ကန်ကို စစ်ဆေးပြီး လိုအပ်လျှင် သင့်လျော်သော အရည်ဖြည့်ပါ။',
    },
  },
  sg_ftt_0070: {
    prompt: {
      en: 'On the BKE you are in the middle lane but your exit is only 200 metres ahead in the left lane. Traffic is dense and you cannot merge safely in time. What should you do?',
      my: 'BKE ပေါ်တွင် အလယ်လမ်းကြောင်းတွင် ရှိသော်လည်း သင်၏ထွက်ပေါက်သည် ဘယ်လမ်းကြောင်းတွင် မီတာ ၂၀၀ အကွာတွင်သာ ရှိသည်။ ယာဉ်ကြောင်း ထူထပ်ပြီး အချိန်မီ ဘေးကင်းစွာ ပေါင်းဆွဲ မရပါ။ သင် ဘာလုပ်သင့်သလဲ။',
    },
    choices: [
      {
        text: {
          en: 'Stay in your lane and continue to the next exit to re-route',
          my: 'လက်ရှိလမ်းကြောင်းတွင် ဆက်ရှိပြီး နောက်ထွက်ပေါက်သို့ သွားကာ လမ်းကြောင်းပြန်ရှာပါ',
        },
      },
      {
        text: {
          en: 'Brake hard and force your way into the left lane',
          my: 'ဘရိြင်းပြင်းနင်းပြီး ဘယ်လမ်းကြောင်းသို့ အတင်းဝင်ပါ',
        },
      },
      {
        text: {
          en: 'Stop in the middle lane until a gap opens on the left',
          my: 'ဘယ်ဘက်တွင် ကွာဟချက်မဖွင့်မချင်း အလယ်လမ်းကြောင်းတွင် ရပ်ပါ',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'If you cannot reach your exit safely, continue to the next one. Sudden lane changes or stopping on an expressway cause serious collisions.',
      my: 'ထွက်ပေါက်ကို ဘေးကင်းစွာ မရောက်နိုင်လျှင် နောက်ထွက်ပေါက်သို့ ဆက်သွားပါ။ အမြန်လမ်းပေါ်တွင် ရုတ်တရက် လမ်းကြောင်းပြောင်း သို့မဟုတ် ရပ်ခြင်းသည် ပြင်းထန်သော တိုက်မိမှုများ ဖြစ်စေနိုင်သည်။',
    },
  },
  sg_ftt_0212: {
    prompt: {
      en: 'After missing your expressway exit, a passenger suggests turning around by crossing the grass central reservation. What should you do?',
      my: 'အမြန်လမ်းထွက်ပေါက် လွတ်သွားပြီးနောက် ခရီးသည် ကြားရှိ မြက်ခင်းပြင်ကို ဖြတ်ကာ ပြန်လှည့်ဖို့ အကြံပြုသည်။ သင် ဘာလုပ်သင့်သလဲ။',
    },
    choices: [
      {
        text: {
          en: 'Refuse — crossing the central reservation is illegal and extremely dangerous',
          my: 'ငြင်းပယ်ပါ — ကြားစောင်ကန် ဖြတ်ခြင်းသည် တရားမဝင်ပြီး အလွန်အန္တရာယ်ရှိသည်',
        },
      },
      {
        text: {
          en: 'Cross quickly when no police vehicle is visible',
          my: 'ရဲယာဉ် မမြင်ရလျှင် မြန်ဆန်စွာ ဖြတ်ပါ',
        },
      },
      {
        text: {
          en: 'Reverse along the emergency lane to the exit instead',
          my: 'ထွက်ပေါက်သို့ အရေးပေါ်လမ်းကြောင်းတလျှောက် နောက်ပြန်မောင်းပါ',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'Never cross a central reservation or reverse on an expressway. Continue to the next exit — both alternatives risk fatal head-on crashes.',
      my: 'ကြားစောင်ကန် ဖြတ်ခြင်း သို့မဟုတ် အမြန်လမ်းပေါ်တွင် နောက်ပြန်မောင်းခြင်း မပြုပါနှင့်။ နောက်ထွက်ပေါက်သို့ ဆက်သွားပါ — အခြားရွေးချယ်မှုများသည် တည့်တည့်တိုက်မိသော အန္တရာယ်ကြီးများ ဖြစ်စေနိုင်သည်။',
    },
  },
  sg_ftt_0188: {
    prompt: {
      en: 'You approach a busy junction with a yellow box marking. Traffic on your exit road is queueing and not moving. What must you do?',
      my: 'ဝါရောင်ဘောက်စ် မျဉ်းပြင်ဆင်ထားသော လမ်းဆုံကို ချဉ်းကပ်နေသည်။ သင် ထွက်မည့်လမ်းပေါ်တွင် ယာဉ်များ တန်းစီနေပြီး မရွေ့သေးပါ။ သင် ဘာလုပ်ရမည်လဲ။',
    },
    choices: [
      {
        text: {
          en: 'Wait behind the yellow box until your exit road is clear before entering',
          my: 'ထွက်လမ်းရှင်းသည်အထိ ဝါရောင်ဘောက်အပြင်ဘက်တွင် စောင့်ကာ ထိုမှသာ ဝင်ပါ',
        },
      },
      {
        text: {
          en: 'Enter the box and wait — it is designed for queuing',
          my: 'ဘောက်ထဲ ဝင်ပြီး စောင့်ပါ — တန်းစီရန် ဒီဇိုင်းထုတ်ထားသည်',
        },
      },
      {
        text: {
          en: 'Enter with only your front wheels inside the box',
          my: 'ရှေ့ဘီးများသာ ဘောက်ထဲ ရောက်အောင် ဝင်ပါ',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'Do not enter a yellow box junction unless your exit is clear. Blocking the box causes gridlock and blocks emergency vehicles.',
      my: 'ထွက်လမ်း မရှင်းလျှင် ဝါရောင်ဘောက်လမ်းဆုံသို့ မဝင်ပါနှင့်။ ဘောက်ပိတ်ဆို့ခြင်းသည် ယာဉ်ကြောင်း ပိတ်ဆို့စေပြီး အရေးပေါ်ယာဉ်များကို အနှောင့်အယှက် ဖြစ်စေသည်။',
    },
  },
  sg_ftt_0362: {
    prompt: {
      en: 'On a rainy afternoon on the PIE you keep the same two-second following distance you use in dry weather. Why is this unsafe?',
      my: 'မိုးရွာသော နေ့တွင် PIE ပေါ်တွင် မိုးမရွာသည့်ရာသီဥတုတွင် သုံးသော စက္ကန့်နှစ်စက္ကန့် လိုက်နာအကွာအဝေးကို ဆက်ထားသည်။ ဤအရာ မည်သို့ ဘေးကင်းမှုမရှိစေသလဲ။',
    },
    choices: [
      {
        text: {
          en: 'Wet roads reduce tyre grip and can double your stopping distance',
          my: 'ရွှံ့လမ်းများသည် တာယာဆုပ်ကိုင်မှု လျှော့ချပြီး ရပ်တပ်အကွာအဝေး နှစ်ဆအထိ တိုးစေနိုင်သည်',
        },
      },
      {
        text: {
          en: 'Rain improves tyre grip on smooth asphalt',
          my: 'မိုးရွာခြင်းသည် ချောသော အက်စဖält်ပေါ်တွင် တာယာဆုပ်ကိုင်မှု တိုးစေသည်',
        },
      },
      {
        text: {
          en: 'Stopping distance is unchanged regardless of road surface',
          my: 'လမ်းမျက်နှာပြင် မည်သို့ပင်ဖြစ်စေ ရပ်တပ်အကွာအဝေး မပြောင်းပါ',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'In wet weather, increase your following distance to at least four seconds. Reduced grip means you need much more distance to stop safely.',
      my: 'မိုးရာသီတွင် လိုက်နာအကွာအဝေးကို အနည်းဆုံး စက္ကန့်လေးစက္ကန့်အထိ တိုးပါ။ ဆုပ်ကိုင်မှု လျှော့ချခြင်းကြောင့် ဘေးကင်းစွာ ရပ်ရန် ပိုမိုအကွာအဝေး လိုအပ်သည်။',
    },
  },
  sg_ftt_0367: {
    prompt: {
      en: 'During light traffic on the CTE, a new driver travels at 45 km/h in lane 1 while other vehicles are at 80–90 km/h. Why is this hazardous?',
      my: 'CTE ပေါ်တွင် ယာဉ်ကြောင်း ပေါ့ပါးစဉ် မောင်းသင်ယူသူတစ်ဦး လမ်းကြောင်း ၁ တွင် နာရီကီလိုမီတာ ၄၅ ဖြင့် မောင်းနေပြီး အခြားယာဉ်များမှာ ၈၀–၉၀ ဖြစ်သည်။ ဤအရာ မည်သို့ အန္တရာယ်ရှိစေသလဲ။',
    },
    choices: [
      {
        text: {
          en: 'Large speed differences increase the risk of rear-end collisions',
          my: 'အမြန်နှုန်းကွာခြားမှု ကြီးမားလျှင် နောက်မှတိုက်မိမှု အန္တရာယ် တိုးလာသည်',
        },
      },
      {
        text: {
          en: 'There is no minimum speed on expressways so any speed is acceptable',
          my: 'အမြန်လမ်းများတွင် အနိမ့်ဆုံးအမြန်နှုန်း မရှိသောကြောင့် မည်သည့်အမြန်နှုန်းမဆို လက်ခံနိုင်သည်',
        },
      },
      {
        text: {
          en: 'Only heavy goods vehicles must maintain higher speeds',
          my: 'လေးလံသော ကုန်တင်ယာဉ်များသာ အမြန်နှုန်းမြင့်ထိန်းရမည်',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'Expressways have a minimum speed of 50 km/h where conditions allow. Driving much slower than the traffic flow forces others to brake or swerve suddenly.',
      my: 'အခြေအနေခွင့်ပြုလျှင် အမြန်လမ်းများတွင် အနိမ့်ဆုံး အမြန်နှုန်း နာရီကီလိုမီတာ ၅၀ ရှိသည်။ ယာဉ်ကြောင်းထက် အလွန်နှေးစွာ မောင်းခြင်းသည် အခြားယာဉ်များကို ရုတ်တရက် ဘရိတ်နင်း သို့မဟုတ် ရှောင်ရှား စေနိုင်သည်။',
    },
  },
  sg_ftt_0492: {
    prompt: {
      en: 'You are descending a long steep slope on South Buona Vista Road. After repeated braking your footbrake feels soft. What technique should you use?',
      my: 'South Buona Vista လမ်းပေါ်ရှိ ရှည်လျားသော စောင်းဆင်းလမ်းကို ဆင်းနေသည်။ ဘရိတ်ထပ်ခါတလဲလဲ နင်းပြီးနောက် ခြေဘရိတ် ပျော့နေသကဲ့သို့ ခံစားရသည်။ မည်သည့် နည်းလမ်း သုံးသင့်သလဲ။',
    },
    choices: [
      {
        text: {
          en: 'Downshift to a lower gear to use engine braking and ease load on the footbrake',
          my: 'အင်ဂျင်ဘရိတ်သုံး၍ ခြေဘရိတ်ပေါ်ဝန်လျှော့ရန် အောက်ဂီယာသို့ ဆင်းပါ',
        },
      },
      {
        text: {
          en: 'Apply the handbrake while the car is still moving',
          my: 'ကားရွေ့နေစဉ် လက်ဘရိတ် ဆွဲပါ',
        },
      },
      {
        text: {
          en: 'Shift to neutral and coast faster to reach the bottom sooner',
          my: 'ဂီယာလွတ်ထားပြီး အောက်ခြေရောက်မြန်စေရန် ပိုမိုစောင်းဆင်းပါ',
        },
      },
    ],
    answer: 0,
    explanation: {
      en: 'Engine braking by downshifting reduces reliance on the footbrake and helps prevent brake fade on long descents. Pull over safely if brakes feel seriously weakened.',
      my: 'အောက်ဂီယာဆင်းခြင်းဖြင့် အင်ဂျင်ဘရိတ်သုံးခြင်းသည် ခြေဘရိတ်ပေါ် မှီခိုမှုကို လျှော့ချပြီး ရှည်လျားသော စောင်းဆင်းလမ်းများတွင် ဘရိတ်အားနည်းခြင်းကို ကာကွယ်ပေးသည်။ ဘရိတ်များ အလွန်အားနည်းနက်သက်ခံစားရလျှင် ဘေးကင်းစွာ ရပ်ပါ။',
    },
  },
};

const TOPIC_MEDIA = {
  road_signs: 'warning-sign.png',
  traffic_rules_lights: 'traffic-light.png',
  traffic_rules_parking: 'parking-lot.png',
  traffic_rules_right_of_way: 'junction.png',
  safe_practices: 'car-interior.png',
  special_situations: 'ambulance.png',
  advanced_road_signs: 'warning-sign.png',
  advanced_parking: 'parking-lot.png',
  expressway_driving: 'expressway.png',
  vehicle_maintenance: 'car-engine.png',
  wet_weather: 'wet-road.png',
};

const KEYWORD_RULES = [
  { pattern: /\b(PIE|CTE|BKE|AYE|NSC|expressway|hard shoulder|emergency lane|exit ramp)\b/i, file: 'expressway.png' },
  { pattern: /\b(roundabout)\b/i, file: 'roundabout.png' },
  { pattern: /\b(wet|rain|slippery|aquaplan|flood)\b/i, file: 'wet-road.png' },
  { pattern: /\b(park|parking|hydrant|bus stop|kerb)\b/i, file: 'parking-lot.png' },
  { pattern: /\b(stop sign|stop completely|come to a stop)\b/i, file: 'stop.png' },
  { pattern: /\b(give way|give-way|yield)\b/i, file: 'give-way.png' },
  { pattern: /\b(speed limit|km\/h|50 km|60 km|80 km|90 km)\b/i, file: 'speed-50.png' },
  { pattern: /\b(engine|oil|coolant|brake fluid|steering fluid|tyre|tire|maintenance|engine braking)\b/i, file: 'car-engine.png' },
  { pattern: /\b(tyre pressure|tread depth|wheel)\b/i, file: 'tyre-check.png' },
  { pattern: /\b(traffic light|red light|amber|green light|amber light)\b/i, file: 'traffic-light.png' },
  { pattern: /\b(school|pupil|student|children)\b/i, file: 'school-zone.png' },
  { pattern: /\b(pedestrian|zebra crossing|crosswalk|pelican)\b/i, file: 'pedestrian-crossing.png' },
  { pattern: /\b(ERP|road pricing|toll gantry)\b/i, file: 'erp-road.png' },
  { pattern: /\b(ambulance|emergency vehicle|fire engine|police car)\b/i, file: 'ambulance.png' },
  { pattern: /\b(seat belt|mirror|blind spot|headlight|fog light|interior|dashboard)\b/i, file: 'car-interior.png' },
  { pattern: /\b(night|headlight|dim light|dazzle)\b/i, file: 'night-driving.png' },
  { pattern: /\b(fog|mist|visibility)\b/i, file: 'fog-road.png' },
  { pattern: /\b(child|playground|young pedestrian)\b/i, file: 'children-road.png' },
  { pattern: /\b(no entry|do not enter|wrong way)\b/i, file: 'no-entry.png' },
  { pattern: /\b(overtak|no passing|dual carriageway)\b/i, file: 'no-overtaking.png' },
  { pattern: /\b(highway|merging|lane change|junction|intersection|T-junction)\b/i, file: 'junction.png' },
  { pattern: /\b(warning sign|hazard|triangular|diamond sign)\b/i, file: 'warning-sign.png' },
  { pattern: /\b(breakdown|tow|stall)\b/i, file: 'highway.png' },
];

function loadJson(file) {
  return JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, file), 'utf8'));
}

function saveJson(file, data) {
  fs.writeFileSync(path.join(QUESTIONS_DIR, file), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function validateQuestion(q) {
  const errors = [];
  if (!q.prompt?.en || !q.prompt?.my) errors.push('missing prompt i18n');
  if (!q.explanation?.en || !q.explanation?.my) errors.push('missing explanation i18n');
  if (!Array.isArray(q.choices) || q.choices.length !== 3) errors.push('choices must be exactly 3');
  else {
    for (const [i, c] of q.choices.entries()) {
      if (!c.text?.en || !c.text?.my) errors.push(`choice ${i} missing i18n`);
    }
  }
  if (typeof q.answer !== 'number' || q.answer < 0 || q.answer > 2) errors.push('answer must be 0, 1, or 2');
  if (q.media?.src && !AVAILABLE_MEDIA.has(path.basename(q.media.src))) {
    errors.push(`unknown media file: ${q.media.src}`);
  }
  return errors;
}

function inferMedia(q) {
  const text = `${q.topic} ${q.prompt?.en ?? ''}`;
  for (const rule of KEYWORD_RULES) {
    if (rule.pattern.test(text) && fs.existsSync(path.join(SIGNS_DIR, rule.file))) {
      return rule.file;
    }
  }
  const topicFile = TOPIC_MEDIA[q.topic];
  if (topicFile && fs.existsSync(path.join(SIGNS_DIR, topicFile))) {
    return topicFile;
  }
  return 'junction.png';
}

function makeMedia(q, file) {
  const base = path.basename(file, '.png').replace(/-/g, ' ');
  return {
    type: 'image',
    src: `/signs/sg/${file}`,
    alt: {
      en: q.prompt.en.slice(0, 80),
      my: (q.prompt.my ?? q.prompt.en).slice(0, 80),
    },
  };
}

function applyRewrites(questions, bankName) {
  let rewritten = 0;
  const missingIds = [];

  for (const q of questions) {
    const rewrite = REWRITES[q.id];
    if (!rewrite) continue;
    if (q.category !== bankName) {
      missingIds.push(`${q.id} (category mismatch)`);
      continue;
    }
    const { id, category, topic, difficulty, media } = q;
    Object.assign(q, rewrite);
    q.id = id;
    q.category = category;
    q.topic = topic;
    q.difficulty = difficulty;
    if (media) q.media = media;
    rewritten++;
  }

  const expected = Object.keys(REWRITES).filter((id) => id.startsWith(bankName));
  for (const id of expected) {
    if (!questions.some((q) => q.id === id)) missingIds.push(`${id} (not found)`);
  }

  return { rewritten, missingIds };
}

function backfillMedia(questions) {
  let added = 0;
  for (const q of questions) {
    if (q.media?.src) continue;
    const file = inferMedia(q);
    if (!AVAILABLE_MEDIA.has(file)) continue;
    q.media = makeMedia(q, file);
    added++;
  }
  return added;
}

function processBank(file, bankName) {
  const questions = loadJson(file);
  const { rewritten, missingIds } = applyRewrites(questions, bankName);
  const mediaAdded = backfillMedia(questions);

  const validationErrors = [];
  for (const q of questions) {
    const errs = validateQuestion(q);
    if (errs.length) validationErrors.push({ id: q.id, errors: errs });
  }

  saveJson(file, questions);
  return { file, rewritten, mediaAdded, missingIds, validationErrors };
}

console.log('Fixing SG BTT/FTT question quality...\n');

const btt = processBank('sg_btt.json', 'sg_btt');
const ftt = processBank('sg_ftt.json', 'sg_ftt');

for (const result of [btt, ftt]) {
  console.log(`${result.file}:`);
  console.log(`  rewritten: ${result.rewritten}`);
  console.log(`  media added: ${result.mediaAdded}`);
  if (result.missingIds.length) {
    console.log(`  rewrite warnings: ${result.missingIds.join(', ')}`);
  }
  if (result.validationErrors.length) {
    console.log(`  validation errors: ${result.validationErrors.length}`);
    for (const v of result.validationErrors.slice(0, 10)) {
      console.log(`    ${v.id}: ${v.errors.join('; ')}`);
    }
    if (result.validationErrors.length > 10) {
      console.log(`    ... and ${result.validationErrors.length - 10} more`);
    }
  } else {
    console.log('  validation errors: 0');
  }
  console.log('');
}

const totalRewritten = btt.rewritten + ftt.rewritten;
const totalMedia = btt.mediaAdded + ftt.mediaAdded;
const totalErrors = btt.validationErrors.length + ftt.validationErrors.length;
console.log(`Done. Total rewritten: ${totalRewritten}, media added: ${totalMedia}, validation errors: ${totalErrors}`);
