#!/usr/bin/env node
/**
 * Build 12 copyright-safe "inspired-by" practice sets from the original sg_btt bank.
 * Uses only original TheoryLane questions — no verbatim PDF/OCR content.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const bankPath = path.join(ROOT, 'content/questions/sg_btt.json');
const manifestPath = path.join(ROOT, 'content/past-papers/sg_btt-inspired-sets.json');

const TARGET_PER_SET = 47;

/** Exam-style progression — topics only, not copied exam papers. */
const SETS = [
  {
    id: 'inspired-01',
    title: 'Inspired Set 1 · Regulatory signs',
    titleMy: 'Inspired Set 1 · စည်းမျဉ်းဆိုင်းဘုတ်',
    topics: ['road_signs', 'traffic_signs_prohibitory', 'give_way'],
  },
  {
    id: 'inspired-02',
    title: 'Inspired Set 2 · Warning signs',
    titleMy: 'Inspired Set 2 · သတိပေးဆိုင်းဘုတ်',
    topics: ['road_signs', 'school_zones', 'road_works', 'roundabouts'],
  },
  {
    id: 'inspired-03',
    title: 'Inspired Set 3 · Signals & markings',
    titleMy: 'Inspired Set 3 · မီးပွိုင့်နှင့် လမ်းအမှတ်',
    topics: ['traffic_rules_lights', 'vehicle_lights', 'yellow_box_junction', 'road_signs'],
  },
  {
    id: 'inspired-04',
    title: 'Inspired Set 4 · Right of way',
    titleMy: 'Inspired Set 4 · လမ်းပေးခွင့်',
    topics: ['traffic_rules_right_of_way', 'roundabouts', 'give_way', 'pedestrian_safety'],
  },
  {
    id: 'inspired-05',
    title: 'Inspired Set 5 · Speed & distance',
    titleMy: 'Inspired Set 5 · အမြန်နှုန်းနှင့် အကွာအဝေး',
    topics: ['traffic_rules_speed_limits', 'speed_limits', 'defensive_driving'],
  },
  {
    id: 'inspired-06',
    title: 'Inspired Set 6 · Lanes & overtaking',
    titleMy: 'Inspired Set 6 · လမ်းကြောင်းနှင့် ကျော်ဖြတ်',
    topics: ['traffic_rules_lane_usage', 'traffic_rules_overtaking', 'u_turn'],
  },
  {
    id: 'inspired-07',
    title: 'Inspired Set 7 · Parking & stopping',
    titleMy: 'Inspired Set 7 · ရပ်နားခြင်း',
    topics: ['traffic_rules_parking', 'yellow_box_junction', 'silver_zones'],
  },
  {
    id: 'inspired-08',
    title: 'Inspired Set 8 · Defensive driving',
    titleMy: 'Inspired Set 8 · ကာကွယ်မောင်းနှင်ခြင်း',
    topics: ['defensive_driving', 'emergency_vehicles', 'tunnel_driving'],
  },
  {
    id: 'inspired-09',
    title: 'Inspired Set 9 · Pedestrians & crossings',
    titleMy: 'Inspired Set 9 · လမ်းဖြတ်ကူးနှင့် လမ်းလျှောက်',
    topics: ['traffic_rules_pedestrian', 'pedestrian_safety', 'special_situations', 'school_zones'],
  },
  {
    id: 'inspired-10',
    title: 'Inspired Set 10 · Safe practices',
    titleMy: 'Inspired Set 10 · ဘေးကင်းရေးအခြေခံ',
    topics: ['safe_practices', 'defensive_driving'],
  },
  {
    id: 'inspired-11',
    title: 'Inspired Set 11 · Mixed review A',
    titleMy: 'Inspired Set 11 · mixed review A',
    topics: ['road_signs', 'defensive_driving', 'traffic_rules_right_of_way', 'safe_practices'],
  },
  {
    id: 'inspired-12',
    title: 'Inspired Set 12 · Mixed review B',
    titleMy: 'Inspired Set 12 · mixed review B',
    topics: ['traffic_signs_prohibitory', 'traffic_rules_overtaking', 'special_situations', 'traffic_rules_speed_limits'],
  },
];

function topicMatches(q, topics) {
  if (topics.includes(q.topic)) return true;
  const ref = q.syllabusRef ?? '';
  return topics.some(t => ref.includes(t.replace(/_/g, '.')) || ref.includes(t));
}

function stripInspired(q) {
  const { inspiredSet, pastPaper, ...rest } = q;
  return rest;
}

const raw = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
const clean = raw
  .filter(q => !q.id.startsWith('sg_btt_past_'))
  .map(stripInspired);

const used = new Set();
const manifest = { category: 'sg_btt', sets: [], questionIds: [] };

for (const set of SETS) {
  const picked = [];
  for (const q of clean) {
    if (used.has(q.id)) continue;
    if (!topicMatches(q, set.topics)) continue;
    picked.push(q);
    if (picked.length >= TARGET_PER_SET) break;
  }
  // Fill short sets from any remaining questions
  if (picked.length < TARGET_PER_SET) {
    for (const q of clean) {
      if (used.has(q.id)) continue;
      picked.push(q);
      if (picked.length >= TARGET_PER_SET) break;
    }
  }
  for (const q of picked) used.add(q.id);
  manifest.sets.push({
    id: set.id,
    title: set.title,
    titleMy: set.titleMy,
    questionCount: picked.length,
    questionIds: picked.map(q => q.id),
  });
}

// Tag questions
const tagById = new Map();
let num = 1;
for (const set of SETS) {
  const entry = manifest.sets.find(s => s.id === set.id);
  num = 1;
  for (const id of entry.questionIds) {
    tagById.set(id, {
      id: set.id,
      number: num++,
      title: set.title,
      titleMy: set.titleMy,
    });
  }
}

const merged = clean.map(q => {
  const tag = tagById.get(q.id);
  if (!tag) return q;
  return { ...q, inspiredSet: tag };
});

// Sort: inspired sets first (canonical order), then untagged
const order = new Map(SETS.map((s, i) => [s.id, i]));
merged.sort((a, b) => {
  const ai = a.inspiredSet ? order.get(a.inspiredSet.id) ?? 99 : 100;
  const bi = b.inspiredSet ? order.get(b.inspiredSet.id) ?? 99 : 100;
  if (ai !== bi) return ai - bi;
  if (a.inspiredSet && b.inspiredSet) return a.inspiredSet.number - b.inspiredSet.number;
  return 0;
});

manifest.questionIds = merged.filter(q => q.inspiredSet).map(q => q.id);

fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
fs.writeFileSync(bankPath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');

const inspiredCount = merged.filter(q => q.inspiredSet).length;
const extraCount = merged.length - inspiredCount;
console.log(`Inspired sets: ${manifest.sets.length}, tagged: ${inspiredCount}, supplementary: ${extraCount}, total: ${merged.length}`);
