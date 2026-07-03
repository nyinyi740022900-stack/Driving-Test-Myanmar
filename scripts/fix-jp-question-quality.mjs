#!/usr/bin/env node
/**
 * Fix JP question bank quality issues found by audit-jp-questions.mjs.
 *
 * Usage: node scripts/fix-jp-question-quality.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUESTIONS_DIR = path.join(__dirname, '..', 'content', 'questions');
const FILES = ['jp_car.json', 'jp_moto.json'];

const SYLLABUS_REF = {
  karimen_road_signs: 'jp.car.karimen.ch1-signs',
  karimen_right_of_way: 'jp.car.karimen.ch2-priority',
  karimen_speed_limits_parking: 'jp.car.karimen.ch3-speed-parking',
  honmen_expressway: 'jp.car.honmen.ch1-expressway',
  honmen_right_of_way_intersections: 'jp.car.honmen.ch2-intersections',
  honmen_road_signs_signals: 'jp.car.honmen.ch3-signs-signals',
  honmen_hazard_prediction_illustration: 'jp.car.honmen.ch4-hazard-illustration',
  honmen_safe_driving_practices: 'jp.car.honmen.ch5-safe-driving',
  honmen_parking_rules: 'jp.car.honmen.ch6-parking',
  honmen_weather_night_driving: 'jp.car.honmen.ch7-weather-night',
  road_signs_signals: 'jp.moto.ch1-signs-signals',
  right_of_way_traffic_rules: 'jp.moto.ch2-right-of-way',
  balance_cornering_techniques: 'jp.moto.ch3-cornering',
  blind_spots_visibility: 'jp.moto.ch4-visibility',
  lane_position_road_surface: 'jp.moto.ch5-lane-surface',
  weather_hazards: 'jp.moto.ch6-weather',
  protective_gear_rules: 'jp.moto.ch7-protective-gear',
  pillion_passenger_rules: 'jp.moto.ch8-pillion',
  hazard_prediction_illustration: 'jp.moto.ch9-hazard-illustration',
};

const HAZARD_PREFIX_EN =
  'Look at the following scene and answer whether each statement A through C is correct or incorrect.';

/** Scene text (JA) → EN for hazard prompts with broken partial translation. */
const HAZARD_SCENE_EN = {
  '片側2車線の道路で、左車線に大型トラックが走行中、右車線への進路変更を検討している。注意すべき点は何か。':
    'On a road with two lanes in each direction, a large truck is traveling in the left lane and you are considering changing to the right lane. What should you watch for?',
  '前方の交差点で、対向車線の車が右折のウインカーを出しているが、まだ停止していない。考えられる危険は何か。':
    'At the intersection ahead, a vehicle in the oncoming lane has its right-turn signal on but has not yet stopped. What hazard might occur?',
  '高速道路の出口付近で、前方の車が急に速度を落としている。最も考えられる危険な状況は何か。':
    'Near an expressway exit, the vehicle ahead suddenly slows down. What is the most likely hazardous situation?',
  '住宅街の交差点に近づいている。左側の電柱の陰になっていて見通しが悪い。最も注意すべき危険は何か。':
    'You are approaching an intersection in a residential area. A utility pole on the left creates a blind spot with poor visibility. What danger should you watch for most?',
  '前方の路線バスが停留所に停車し、乗客が乗り降りしている。バスの前方は死角になっている。最も注意すべき危険は何か。':
    'A route bus ahead has stopped at a bus stop and passengers are boarding or alighting. The area in front of the bus is a blind spot. What danger should you watch for most?',
  '住宅街の細い道路で、ボールが道路に転がり出てきた。ボールを追いかけて子供が飛び出してくる可能性がある。最も注意すべき危険は何か。':
    'On a narrow residential street, a ball rolls into the road. A child may run out after it. What danger should you watch for most?',
  '霧が発生している山道のカーブに差し掛かっている。視界が非常に悪く、前方がほとんど見えない。最も注意すべき危険は何か。':
    'You are entering a curve on a mountain road in fog. Visibility is very poor and you can barely see ahead. What danger should you watch for most?',
  '雪の積もった道路を走行中、前方の車がブレーキをかけてスリップしそうな様子を見せている。最も注意すべき危険は何か。':
    'While driving on a snow-covered road, the vehicle ahead appears to be braking and may slip. What danger should you watch for most?',
  '交差点の信号が青に変わった直後、横断歩道をまだ渡りきれていない高齢の歩行者がいる。最も注意すべき危険は何か。':
    'Just after the light turns green, an elderly pedestrian is still crossing the crosswalk. What danger should you watch for most?',
  '追い越し禁止区間の直線道路で、速度の遅い農耕用トラクターの後ろを走行している。最も注意すべき危険は何か。':
    'On a straight road in a no-overtaking zone, you are following a slow farm tractor. What danger should you watch for most?',
  '駅前のロータリーで、タクシーが客待ちのために急な停車と発進を繰り返している。最も注意すべき危険は何か。':
    'At a rotary in front of a station, taxis repeatedly stop and start abruptly while waiting for passengers. What danger should you watch for most?',
};

/** Replace near-duplicate questions with distinct facts (keeps bank size). */
const REWRITES = {
  jp_car_0121: {
    prompt: {
      ja: '一般乗合自動車の停留所の10メートル手前以内の道路上では、駐車が禁止されている。',
      my: 'အများသုံး ဘတ်စ်ကားရပ်နားရာနေရာ၏ ၁၀ မီတာရှေ့အတွင်း လမ်းပေါ်တွင် ကားရပ်နားခြင်းကို တားမြစ်ထားသည်။',
      en: 'Parking is prohibited on the road within 10 meters in front of a scheduled bus stop.',
    },
    answer: 0,
    explanation: {
      ja: '停留所付近での駐車はバスの出入りを妨げるため、一般乗合自動車の停留所の10メートル手前以内は駐車禁止とされている。',
      my: 'ဘတ်စ်ကားရပ်နားရာနီးတွင် ကားရပ်ခြင်းသည် ဘတ်စ်ကား ဝင်/ထွက်ခြင်းကို နှောင့်ယှက်သောကြောင့် အများသုံးဘတ်စ်ကား ရပ်နားရာနေရာ၏ ၁၀ မီတာရှေ့အတွင်းကို ရပ်နားခွင့်မရှိဟု သတ်မှတ်ထားသည်။',
      en: 'Parking near bus stops obstructs boarding and alighting, so parking is prohibited within 10 meters in front of a scheduled bus stop.',
    },
  },
  jp_car_0317: {
    prompt: {
      ja: '踏切の手前10メートル以内の道路上では、駐車が禁止されている。',
      my: 'မီးရထားလမ်းဖြတ်မတိုင်မီ ၁၀ မီတာအတွင်း လမ်းပေါ်တွင် ကားရပ်နားခြင်းကို တားမြစ်ထားသည်။',
      en: 'Parking is prohibited on the road within 10 meters in front of a railroad crossing.',
    },
    answer: 0,
    explanation: {
      ja: '踏切付近での駐車は列車の見通しや通行を妨げる危険があるため、踏切の手前10メートル以内は駐車禁止とされている。',
      my: 'မီးရထားလမ်းဖြတ်အနီးတွင် ကားရပ်ခြင်းသည် ရထားမြင်ရခြင်းနှင့် သွားလာမှုကို နှောင့်ယှက်နိုင်သောကြောင့် မီးရထားလမ်းဖြတ်မတိုင်မီ ၁၀ မီတာအတွင်းကို ရပ်နားခွင့်မရှိဟု သတ်မှတ်ထားသည်။',
      en: 'Parking near railroad crossings can obstruct sight lines and train traffic, so parking is prohibited within 10 meters in front of a crossing.',
    },
  },
  jp_car_0333: {
    prompt: {
      ja: '豪雨時にタイヤの溝が浅いと、水たまりでハイドロプレーニング現象が起こりやすく、操縦が不安定になる。',
      my: 'မိုးကြီးချိန်တွင် တာယာကြွင်းမရှိမှ ပိုက်ကျန်းရေထဲတွင် ရေပေါ်ပေါ်စီးမှုဖြစ်ပြီး ကားထိန်းချုပ်မှု မတည်မငြိမ်ဖြစ်လွယ်သည်။',
      en: 'In heavy rain, shallow tire tread makes hydroplaning on standing water more likely and steering becomes unstable.',
    },
    answer: 0,
    explanation: {
      ja: 'タイヤの排水性能が低下すると水膜の上を走行しやすくなるため、豪雨時は速度を落とし、十分な溝のあるタイヤを使用することが重要である。',
      my: 'တာယာရေဖယ်ဆောင်ရည်ကျလျှင် ရေအလွှာပေါ်တွင် မောင်းနှင်လွယ်သောကြောင့် မိုးကြီးချိန်တွင် အရှိန်လျှော့ပြီး လုံလောက်သော ကြွင်းရှိသော တာယာကို အသုံးပြုရန် အရေးကြီးသည်။',
      en: 'When tires cannot drain water effectively, the vehicle rides on a film of water. In heavy rain, slow down and use tires with adequate tread depth.',
    },
  },
  jp_car_0316: {
    prompt: {
      ja: '路側帯が設けられている道路では、追い越しのために路側帯を通行してはならない。',
      my: 'လမ်းဘေးလမ်းကြောင်းရှိသော လမ်းများတွင် ကျော်တက်ရန် လမ်းဘေးလမ်းကြောင်းကို အသုံးပြုခွင့်မရှိ။',
      en: 'On roads with a road-side lane for pedestrians and bicycles, you must not use it to overtake other vehicles.',
    },
    answer: 0,
    explanation: {
      ja: '路側帯は歩行者や自転車の通行を確保するための部分であり、追い越しなどのために車両が通行することは禁止されている。',
      my: 'လမ်းဘေးလမ်းကြောင်းသည် လမ်းသွားလမ်းလာနှင့် စက်ဘီးများ သွားလာနိုင်ရန် ထားရှိသော နေရာဖြစ်ပြီး ကျော်တက်ရန်စသည့် အကြောင်းပြချက်ဖြင့် ယာဉ်များ သွားလာခွင့်မရှိ။',
      en: 'Road-side lanes are reserved for pedestrians and bicycles; vehicles may not use them for overtaking or similar purposes.',
    },
  },
};

const FACTUAL_PATCHES = {
  jp_car_0027: {
    prompt: {
      ja: '消火栓から5メートル以内の場所は、駐車だけでなく停車も禁止されている。',
      my: 'မီးသတ်ရေပိုက်ခေါင်းမှ ၅ မီတာအတွင်းနေရာများတွင် ကားရပ်နားခြင်းအပြင် ခေတ္တရပ်ခြင်းကိုလည်း တားမြစ်ထားသည်။',
      en: 'Within 5 meters of a fire hydrant, both parking and stopping are prohibited.',
    },
    explanation: {
      ja: '消火栓や消防用防火水槽から5メートル以内は、緊急時の使用を妨げないよう駐停車が禁止されている。',
      my: 'မီးသတ်ရေပိုက်ခေါင်း သို့မဟုတ် မီးသတ်ရေကန်မှ ၅ မီတာအတွင်းတွင် အရေးပေါ်အသုံးပြုမှုကို မနှောင့်ယှက်ရန် ကားရပ်နား/ခေတ္တရပ်ခြင်းကို တားမြစ်ထားသည်။',
      en: 'Parking and stopping within 5 meters of a fire hydrant or fire water tank is prohibited so emergency equipment can be used.',
    },
  },
  jp_car_0037: {
    explanation: {
      en: 'Minimum speeds are set on expressway main lanes to keep traffic flowing; where no sign applies, the minimum speed is 50 km/h.',
    },
  },
  jp_car_0012: {
    prompt: {
      en: 'Mopeds and light vehicles may also use roads marked with motor-vehicle-only signs.',
    },
  },
  jp_car_0001: {
    prompt: {
      en: 'When a round sign shows "30," it indicates the maximum speed for that section.',
    },
  },
  jp_car_0010: {
    prompt: {
      en: 'If a "no entry except in the direction shown" sign displays only a right-turn arrow, you may not proceed in any direction other than right at that location.',
    },
  },
  jp_car_0011: {
    prompt: {
      en: '"Railroad crossing ahead" warning signs are placed before crossings without signals to remind drivers to slow down and stay alert.',
    },
  },
  jp_car_0015: {
    prompt: {
      en: 'On roads with a maximum-width sign, vehicles wider than the indicated width may not pass.',
    },
  },
};

const stats = {
  enPolished: 0,
  hazardEnFixed: 0,
  rewrites: 0,
  factualPatches: 0,
  syllabusRefAdded: 0,
};

function polishEnglish(text) {
  if (typeof text !== 'string' || !text) return text;
  let out = text
    .replace(/``/g, '"')
    .replace(/''/g, "'")
    .replace(/"([^"]*?)'/g, '"$1"')
    .replace(/"([^"]*?)\.'(\s|$)/g, '"$1."$2')
    .replace(/,\s*,/g, ',')
    .replace(/\s+/g, ' ')
    .replace(/motorized bicycles/gi, 'mopeds')
    .replace(/motorized bicycle/gi, 'moped')
    .replace(/prohibited not only to park but also to park/gi, 'prohibited; both parking and stopping are not allowed')
    .trim();
  if (/^[a-z]/.test(out)) out = out.charAt(0).toUpperCase() + out.slice(1);
  return out;
}

function polishLocalized(obj) {
  if (!obj || typeof obj !== 'object') return;
  if (typeof obj.en === 'string') {
    const next = polishEnglish(obj.en);
    if (next !== obj.en) {
      obj.en = next;
      stats.enPolished++;
    }
  }
  for (const value of Object.values(obj)) {
    if (value && typeof value === 'object') polishLocalized(value);
  }
}

function fixHazardPromptEn(q) {
  if (!q.parts?.length || !q.prompt?.ja) return;
  const blocks = q.prompt.ja.split('\n\n');
  if (!blocks[0]?.includes('次の場面')) return;
  const sceneJa = blocks.slice(1).join('\n\n').trim();
  const sceneEn = HAZARD_SCENE_EN[sceneJa];
  if (!sceneEn) return;
  const next = `${HAZARD_PREFIX_EN}\n\n${sceneEn}`;
  if (q.prompt.en !== next) {
    q.prompt.en = next;
    stats.hazardEnFixed++;
  }
}

function applyPatch(q, patch) {
  for (const [key, value] of Object.entries(patch)) {
    if (key === 'prompt' || key === 'explanation') {
      q[key] = { ...q[key], ...value };
    } else {
      q[key] = value;
    }
  }
}

function fixFile(filename) {
  const filePath = path.join(QUESTIONS_DIR, filename);
  const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  for (const q of questions) {
    if (REWRITES[q.id]) {
      applyPatch(q, REWRITES[q.id]);
      stats.rewrites++;
    }
    if (FACTUAL_PATCHES[q.id]) {
      applyPatch(q, FACTUAL_PATCHES[q.id]);
      stats.factualPatches++;
    }
    fixHazardPromptEn(q);
    polishLocalized(q);

    const ref = SYLLABUS_REF[q.topic];
    if (ref && q.syllabusRef !== ref) {
      q.syllabusRef = ref;
      stats.syllabusRefAdded++;
    }

    delete q.media;
  }

  fs.writeFileSync(filePath, JSON.stringify(questions, null, 2) + '\n', 'utf8');
  return questions.length;
}

function main() {
  for (const file of FILES) {
    const count = fixFile(file);
    console.log(`Fixed ${file} (${count} questions)`);
  }
  console.log('\nFix summary:', stats);
}

main();
