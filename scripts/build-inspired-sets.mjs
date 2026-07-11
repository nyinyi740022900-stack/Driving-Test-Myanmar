#!/usr/bin/env node
/**
 * Build 12 copyright-safe exam-style sets (≤500 Q) from original sg_btt bank.
 * Topic quotas mirror Practice & Test File coverage — original questions only.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const bankPath = path.join(ROOT, 'content/questions/sg_btt.json');
const manifestPath = path.join(ROOT, 'content/past-papers/sg_btt-inspired-sets.json');

const MAX_BANK = 500;
const SET_COUNT = 12;

/** BTT exam topic importance (higher = keep when trimming). */
const TOPIC_PRIORITY = {
  road_signs: 100,
  traffic_signs_prohibitory: 98,
  traffic_rules_lights: 92,
  traffic_rules_right_of_way: 90,
  give_way: 90,
  roundabouts: 88,
  traffic_rules_speed_limits: 88,
  speed_limits: 86,
  yellow_box_junction: 85,
  traffic_rules_lane_usage: 84,
  traffic_rules_overtaking: 84,
  overtaking: 82,
  traffic_rules_parking: 82,
  traffic_rules_pedestrian: 80,
  pedestrian_safety: 80,
  school_zones: 78,
  vehicle_lights: 76,
  defensive_driving: 72,
  emergency_vehicles: 70,
  special_situations: 68,
  safe_practices: 62,
  tunnel_driving: 58,
  road_works: 58,
  u_turn: 56,
  silver_zones: 54,
  police_signals: 52,
  right_of_way: 50,
  licence_basics: 15,
};

/** Target counts in final 500 — BTT exam weight, capped by availability in bank. */
const TOPIC_TARGETS = {
  road_signs: 139,
  traffic_signs_prohibitory: 4,
  traffic_rules_right_of_way: 36,
  give_way: 3,
  roundabouts: 5,
  right_of_way: 1,
  traffic_rules_speed_limits: 22,
  speed_limits: 8,
  traffic_rules_lane_usage: 27,
  traffic_rules_overtaking: 17,
  overtaking: 1,
  u_turn: 3,
  traffic_rules_parking: 27,
  yellow_box_junction: 4,
  silver_zones: 3,
  traffic_rules_lights: 3,
  vehicle_lights: 5,
  police_signals: 2,
  traffic_rules_pedestrian: 4,
  pedestrian_safety: 5,
  school_zones: 5,
  defensive_driving: 79,
  emergency_vehicles: 4,
  tunnel_driving: 3,
  road_works: 3,
  special_situations: 34,
  safe_practices: 53,
  licence_basics: 0,
};

const DEFAULT_TOPIC_TARGET = 0;

/**
 * 12 sets ≈ Practice & Test File progression (BTT 1–6 + Driving P1–P6).
 * Conceptual topic focus only — no copied questions.
 */
const SETS = [
  {
    id: 'inspired-01',
    refPaper: 'btt-test-1',
    title: 'Inspired Set 1 · Mandatory & prohibitory signs',
    titleMy: 'Inspired Set 1 · မဖြစ်မနေနှင့် တားမြစ်ဆိုင်းဘုတ်',
    topics: ['road_signs', 'traffic_signs_prohibitory'],
    syllabusHints: ['btt.signs.mandatory', 'btt.signs.prohibitory'],
  },
  {
    id: 'inspired-02',
    refPaper: 'btt-test-2',
    title: 'Inspired Set 2 · Warning & information signs',
    titleMy: 'Inspired Set 2 · သတိပေးနှင့် အချက်အလက်ဆိုင်းဘုတ်',
    topics: ['road_signs', 'school_zones', 'road_works'],
    syllabusHints: ['btt.signs.warning', 'btt.signs.information'],
  },
  {
    id: 'inspired-03',
    refPaper: 'btt-test-3',
    title: 'Inspired Set 3 · Signs & road markings',
    titleMy: 'Inspired Set 3 · ဆိုင်းဘုတ်နှင့် လမ်းအမှတ်',
    topics: ['road_signs', 'yellow_box_junction', 'traffic_signs_prohibitory'],
    syllabusHints: ['btt.signs', 'btt.markings'],
  },
  {
    id: 'inspired-04',
    refPaper: 'btt-test-4',
    title: 'Inspired Set 4 · Traffic lights & signals',
    titleMy: 'Inspired Set 4 · မီးပွိုင့်နှင့် လက်ဟန်များ',
    topics: ['traffic_rules_lights', 'vehicle_lights', 'police_signals'],
    syllabusHints: ['btt.signals', 'btt.lights'],
  },
  {
    id: 'inspired-05',
    refPaper: 'btt-test-5',
    title: 'Inspired Set 5 · Right of way & junctions',
    titleMy: 'Inspired Set 5 · လမ်းပေးခွင့်နှင့် junction',
    topics: ['traffic_rules_right_of_way', 'give_way', 'roundabouts', 'right_of_way'],
    syllabusHints: ['btt.right_of_way', 'btt.junction'],
  },
  {
    id: 'inspired-06',
    refPaper: 'btt-test-6',
    title: 'Inspired Set 6 · Speed limits & stopping',
    titleMy: 'Inspired Set 6 · အမြန်နှုန်းနှင့် ရပ်တန့်အကွာအဝေး',
    topics: ['traffic_rules_speed_limits', 'speed_limits', 'defensive_driving'],
    syllabusHints: ['btt.speed', 'btt.stopping'],
  },
  {
    id: 'inspired-07',
    refPaper: 'driving-test-p1',
    title: 'Inspired Set 7 · Lanes & overtaking',
    titleMy: 'Inspired Set 7 · လမ်းကြောင်းနှင့် ကျော်ဖြတ်',
    topics: ['traffic_rules_lane_usage', 'traffic_rules_overtaking', 'overtaking', 'u_turn'],
    syllabusHints: ['btt.lane', 'btt.overtaking'],
  },
  {
    id: 'inspired-08',
    refPaper: 'driving-test-p2',
    title: 'Inspired Set 8 · Parking & stopping rules',
    titleMy: 'Inspired Set 8 · ရပ်နားခြင်းစည်းမျဉ်း',
    topics: ['traffic_rules_parking', 'yellow_box_junction', 'silver_zones'],
    syllabusHints: ['btt.parking'],
  },
  {
    id: 'inspired-09',
    refPaper: 'driving-test-p3',
    title: 'Inspired Set 9 · Pedestrians & school zones',
    titleMy: 'Inspired Set 9 · လမ်းလျှောက်နှင့် ကျောင်းဧက',
    topics: ['traffic_rules_pedestrian', 'pedestrian_safety', 'school_zones'],
    syllabusHints: ['btt.pedestrian', 'btt.school'],
  },
  {
    id: 'inspired-10',
    refPaper: 'driving-test-p4',
    title: 'Inspired Set 10 · Defensive & emergency',
    titleMy: 'Inspired Set 10 · ကာကွယ်မောင်းနှင်နှင့် emergency',
    topics: ['defensive_driving', 'emergency_vehicles', 'tunnel_driving', 'road_works'],
    syllabusHints: ['btt.defensive', 'btt.emergency'],
  },
  {
    id: 'inspired-11',
    refPaper: 'driving-test-p5',
    title: 'Inspired Set 11 · Special situations',
    titleMy: 'Inspired Set 11 · အခြေအနေအထူး',
    topics: ['special_situations', 'safe_practices', 'defensive_driving'],
    syllabusHints: ['btt.special'],
  },
  {
    id: 'inspired-12',
    refPaper: 'driving-test-p6',
    title: 'Inspired Set 12 · Full mock review',
    titleMy: 'Inspired Set 12 · mock review',
    topics: [
      'road_signs',
      'traffic_rules_right_of_way',
      'traffic_rules_speed_limits',
      'traffic_rules_parking',
      'safe_practices',
    ],
    syllabusHints: ['btt'],
  },
];

function stripInspired(q) {
  const { inspiredSet, pastPaper, ...rest } = q;
  return rest;
}

function scoreQuestion(q) {
  let score = TOPIC_PRIORITY[q.topic] ?? 40;
  const src = q.media?.src ?? '';
  if (src.includes('/signs/')) score += 18;
  else if (src) score += 8;
  const ref = q.syllabusRef ?? '';
  if (ref.includes('btt.signs')) score += 10;
  if (ref.includes('btt.right') || ref.includes('btt.junction')) score += 8;
  if (ref.includes('btt.speed') || ref.includes('btt.parking')) score += 6;
  if (q.difficulty === 'hard') score += 4;
  else if (q.difficulty === 'medium') score += 2;
  if (q.topic === 'licence_basics') score -= 25;
  return score;
}

function topicMatchesSet(q, set) {
  if (set.topics.includes(q.topic)) return true;
  const ref = q.syllabusRef ?? '';
  if (set.syllabusHints?.some(h => ref.includes(h))) return true;
  return set.topics.some(t => ref.includes(t.replace(/_/g, '.')) || ref.includes(t));
}

function setQuota(index) {
  const base = Math.floor(MAX_BANK / SET_COUNT);
  const extra = MAX_BANK % SET_COUNT;
  return base + (index < extra ? 1 : 0);
}

function topicTarget(q) {
  return TOPIC_TARGETS[q.topic] ?? DEFAULT_TOPIC_TARGET;
}

function selectBank(clean) {
  const ranked = [...clean]
    .map(q => ({ q, score: scoreQuestion(q) }))
    .sort((a, b) => b.score - a.score);

  const picked = new Set();
  const selected = [];
  const topicCount = {};

  const canTake = (q) => {
    if (picked.has(q.id)) return false;
    const cap = topicTarget(q);
    if ((topicCount[q.topic] ?? 0) >= cap) return false;
    return true;
  };

  const add = (q) => {
    if (!canTake(q)) return false;
    picked.add(q.id);
    selected.push(q);
    topicCount[q.topic] = (topicCount[q.topic] || 0) + 1;
    return true;
  };

  for (const { q } of ranked) {
    if (!add(q)) continue;
    if (selected.length >= MAX_BANK) break;
  }

  return selected.slice(0, MAX_BANK);
}

function assignSets(pool) {
  const used = new Set();
  const byScore = [...pool]
    .map(q => ({ q, score: scoreQuestion(q) }))
    .sort((a, b) => b.score - a.score);

  const tagById = new Map();

  const pickForSet = (set, quota) => {
    const picked = [];
    const scored = byScore
      .filter(({ q }) => !used.has(q.id))
      .map(({ q, score }) => ({
        q,
        score: score + (topicMatchesSet(q, set) ? 1000 : 0),
      }))
      .sort((a, b) => b.score - a.score);

    for (const { q } of scored) {
      if (picked.length >= quota) break;
      picked.push(q);
    }
    return picked;
  };

  for (let setIndex = 0; setIndex < SETS.length; setIndex++) {
    const set = SETS[setIndex];
    const quota = setQuota(setIndex);
    const picked = pickForSet(set, quota);

    let num = 1;
    for (const q of picked) {
      used.add(q.id);
      tagById.set(q.id, {
        id: set.id,
        number: num++,
        title: set.title,
        titleMy: set.titleMy,
        refPaper: set.refPaper,
      });
    }
  }

  // Fill any remaining into sets under quota (in order)
  for (let setIndex = 0; setIndex < SETS.length && used.size < pool.length; setIndex++) {
    const set = SETS[setIndex];
    const quota = setQuota(setIndex);
    const current = [...tagById.values()].filter(t => t.id === set.id).length;
    const need = quota - current;
    if (need <= 0) continue;

    let num = current + 1;
    for (const { q } of byScore) {
      if (used.has(q.id)) continue;
      used.add(q.id);
      tagById.set(q.id, {
        id: set.id,
        number: num++,
        title: set.title,
        titleMy: set.titleMy,
        refPaper: set.refPaper,
      });
      if (num > quota) break;
    }
  }

  if (tagById.size !== pool.length) {
    throw new Error(`Assign failed: ${tagById.size}/${pool.length} tagged`);
  }

  const manifestSets = SETS.map((set, setIndex) => {
    const ids = pool.filter(q => tagById.get(q.id)?.id === set.id).map(q => q.id);
    ids.sort((a, b) => (tagById.get(a)?.number ?? 0) - (tagById.get(b)?.number ?? 0));
    return {
      id: set.id,
      refPaper: set.refPaper,
      title: set.title,
      titleMy: set.titleMy,
      questionCount: ids.length,
      questionIds: ids,
    };
  });

  return {
    manifest: { category: 'sg_btt', maxQuestions: MAX_BANK, sets: manifestSets, questionIds: [] },
    tagById,
  };
}

function main() {
const raw = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
const clean = raw.filter(q => !q.id.startsWith('sg_btt_past_')).map(stripInspired);
const selected = selectBank(clean);
const { manifest, tagById } = assignSets(selected);

const merged = selected.map(q => {
  const tag = tagById.get(q.id);
  return tag ? { ...q, inspiredSet: tag } : q;
});

const order = new Map(SETS.map((s, i) => [s.id, i]));
merged.sort((a, b) => {
  const ai = a.inspiredSet ? order.get(a.inspiredSet.id) ?? 99 : 100;
  const bi = b.inspiredSet ? order.get(b.inspiredSet.id) ?? 99 : 100;
  if (ai !== bi) return ai - bi;
  if (a.inspiredSet && b.inspiredSet) return a.inspiredSet.number - b.inspiredSet.number;
  return 0;
});

manifest.questionIds = merged.map(q => q.id);

const topicCounts = {};
for (const q of merged) topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1;

fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
fs.writeFileSync(manifestPath, `${JSON.stringify({ ...manifest, topicCounts }, null, 2)}\n`, 'utf8');
fs.writeFileSync(bankPath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');

console.log(`Bank: ${merged.length} questions (max ${MAX_BANK})`);
console.log(`Inspired sets: ${manifest.sets.length}, per-set: ${manifest.sets.map(s => s.questionCount).join(', ')}`);
console.log('Top topics:', Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${v} ${k}`).join(', '));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
