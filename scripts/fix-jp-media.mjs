#!/usr/bin/env node
/**
 * Reassign JP question images using topic defaults + Japanese keyword rules.
 * Fixes mismatches (e.g. crosswalk rule shown with speed-limit sign).
 *
 * Usage: node scripts/fix-jp-media.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUESTIONS_DIR = path.join(__dirname, '..', 'content', 'questions');
const SIGNS_DIR = path.join(__dirname, '..', 'public', 'signs', 'jp');

const AVAILABLE = new Set(
  fs.readdirSync(SIGNS_DIR).filter((f) => f.endsWith('.png'))
);

/** Topic fallback when no keyword matches. */
const TOPIC_DEFAULT = {
  karimen_road_signs: 'jp-warning.png',
  karimen_right_of_way: 'jp-intersection.png',
  karimen_speed_limits_parking: 'jp-speed-limit.png',
  honmen_parking_rules: 'jp-parking.png',
  honmen_weather_night_driving: 'jp-wet-road.png',
  honmen_safe_driving_practices: 'jp-car-interior.png',
  honmen_expressway: 'jp-expressway.png',
  honmen_road_signs_signals: 'jp-warning.png',
  honmen_right_of_way_intersections: 'jp-intersection.png',
  honmen_hazard_prediction_illustration: 'jp-hazard.png',
  road_signs_signals: 'jp-warning.png',
  right_of_way_traffic_rules: 'jp-intersection.png',
  balance_cornering_techniques: 'jp-motorcycle-corner.png',
  blind_spots_visibility: 'jp-motorcycle.png',
  pillion_passenger_rules: 'jp-motorcycle.png',
  protective_gear_rules: 'jp-motorcycle-gear.png',
  lane_position_road_surface: 'jp-road-markings.png',
  weather_hazards: 'jp-wet-road.png',
  hazard_prediction_illustration: 'jp-hazard.png',
};

/** Higher priority first — first match wins. */
const KEYWORD_RULES = [
  { re: /横断歩道|歩行者|人形|子供|学校|スクール/, img: 'jp-pedestrian-cross.png' },
  { re: /止まれ|一時停止|停止線/, img: 'jp-stop.png' },
  { re: /進入禁止|車両進入禁止|通行止め/, img: 'jp-no-entry.png' },
  { re: /追い越し禁止|追越し禁止|はみ出し/, img: 'jp-no-overtaking.png' },
  { re: /一方通行/, img: 'jp-one-way.png' },
  { re: /譲れ|優先道路|道路優先/, img: 'jp-give-way.png' },
  { re: /最高速度|速度制限|制限速度|最低速度/, img: 'jp-speed-limit.png' },
  { re: /駐車禁止|駐車|停車|路側帯/, img: 'jp-parking.png' },
  { re: /警戒標識|三角形|危険|踏切|カーブ|見通し/, img: 'jp-warning.png' },
  { re: /高速道路|自動車専用|本線|合流|減速車線|加速車線|ETC|SA |PA /, img: 'jp-expressway.png' },
  { re: /ラウンドアボ|環状交差点|ロータリー/, img: 'jp-roundabout.png' },
  { re: /救急|消防|緊急自動車|サイレン/, img: 'jp-ambulance.png' },
  { re: /霧|視界|煙/, img: 'jp-fog-road.png' },
  { re: /雨|濡れ|滑|豪雨|水たまり/, img: 'jp-wet-road.png' },
  { re: /夜|暗|ライト|ヘッドランプ|前照灯/, img: 'jp-night-road.png' },
  { re: /タイヤ|空気圧|エンジン|点検|メンテナンス|車検/, img: 'jp-tyre-check.png' },
  { re: /シートベルト|運転席|助手席|車内|ハンドル|ブレーキ/, img: 'jp-car-interior.png' },
  { re: /エンジンルーム|冷却水|オイル/, img: 'jp-car-engine.png' },
  { re: /道路標示|標示|白線|黄線|中央線|車線/, img: 'jp-road-markings.png' },
  { re: /交差点|右折|左折|信号|青信号|赤信号|黄信号/, img: 'jp-intersection.png' },
  { re: /ハザード|危険予測|飛び出し|急に/, img: 'jp-hazard.png' },
  { re: /ヘルメット|保護具|ゴーグル|グローブ|ジャケット|装備/, img: 'jp-motorcycle-gear.png' },
  { re: /同乗|二人乗り|タンデム|後部座席/, img: 'jp-motorcycle.png' },
  { re: /バンク|傾け|コーナー|カーブイン|旋回/, img: 'jp-motorcycle-corner.png' },
  { re: /原付|二輪|オートバイ|バイク/, img: 'jp-motorcycle.png' },
  { re: /丸い標識.*数字|赤い円|円形.*標識/, img: 'jp-speed-limit.png' },
];

function pickImage(q) {
  const promptJa = q.prompt?.ja ?? '';
  const fullJa = [
    promptJa,
    q.explanation?.ja ?? '',
    ...(q.parts ?? []).map((p) => p.prompt?.ja ?? ''),
  ].join(' ');

  // Match on prompt first so explanation keywords don't override the question topic.
  for (const { re, img } of KEYWORD_RULES) {
    if (re.test(promptJa) && AVAILABLE.has(img)) return img;
  }
  for (const { re, img } of KEYWORD_RULES) {
    if (re.test(fullJa) && AVAILABLE.has(img)) return img;
  }

  const fallback = TOPIC_DEFAULT[q.topic];
  if (fallback && AVAILABLE.has(fallback)) return fallback;
  return 'jp-intersection.png';
}

function applyMedia(q, img) {
  const src = `/signs/jp/${img}`;
  const altJa = (q.prompt?.ja ?? '').slice(0, 80);
  const altMy = (q.prompt?.my ?? '').slice(0, 60);
  const altEn = (q.prompt?.en ?? '').slice(0, 80);
  q.media = {
    type: 'image',
    src,
    alt: { ja: altJa, my: altMy, ...(altEn ? { en: altEn } : {}) },
  };
}

function processFile(filename) {
  const filePath = path.join(QUESTIONS_DIR, filename);
  const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = 0;
  const changes = [];

  for (const q of questions) {
    const img = pickImage(q);
    const src = `/signs/jp/${img}`;
    if (q.media?.src !== src) {
      changes.push({ id: q.id, from: q.media?.src ?? '(none)', to: src });
      applyMedia(q, img);
      changed++;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(questions, null, 2) + '\n', 'utf8');
  return { total: questions.length, changed, changes };
}

function main() {
  const car = processFile('jp_car.json');
  const moto = processFile('jp_moto.json');

  console.log(`jp_car.json: ${car.changed}/${car.total} images updated`);
  console.log(`jp_moto.json: ${moto.changed}/${moto.total} images updated`);

  const sample = [...car.changes, ...moto.changes]
    .filter((c) => c.id === 'jp_car_0020' || c.id.startsWith('jp_car_014'))
    .slice(0, 8);
  if (sample.length) {
    console.log('\nSample changes:');
    for (const c of sample) console.log(`  ${c.id}: ${c.from} → ${c.to}`);
  }

  const carData = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, 'jp_car.json'), 'utf8'));
  const q20 = carData.find((q) => q.id === 'jp_car_0020');
  console.log(`\njp_car_0020 media: ${q20?.media?.src}`);
}

main();
