#!/usr/bin/env node
/**
 * Audit JP question → image pairings and export CSV for review.
 * Usage: node scripts/audit-jp-media.mjs [--csv docs/jp-question-media-map.csv]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUESTIONS_DIR = path.join(__dirname, '..', 'content', 'questions');
const OUT_DEFAULT = path.join(__dirname, '..', 'docs', 'jp-question-media-map.csv');

const KEYWORD_RULES = [
  { tag: 'pedestrian_crosswalk', re: /横断歩道|歩行者|人形|子供|学校|スクール/, img: 'jp-pedestrian-cross.png' },
  { tag: 'stop', re: /止まれ|一時停止|停止線/, img: 'jp-stop.png' },
  { tag: 'no_entry', re: /進入禁止|車両進入禁止|通行止め/, img: 'jp-no-entry.png' },
  { tag: 'no_overtaking', re: /追い越し禁止|追越し禁止|はみ出し/, img: 'jp-no-overtaking.png' },
  { tag: 'one_way', re: /一方通行/, img: 'jp-one-way.png' },
  { tag: 'give_way', re: /譲れ|優先道路|道路優先/, img: 'jp-give-way.png' },
  { tag: 'speed_limit', re: /最高速度|速度制限|制限速度|最低速度|丸い標識.*数字/, img: 'jp-speed-limit.png' },
  { tag: 'parking', re: /駐車禁止|駐車|停車|路側帯/, img: 'jp-parking.png' },
  { tag: 'warning', re: /警戒標識|三角形|危険|踏切|カーブ|見通し/, img: 'jp-warning.png' },
  { tag: 'expressway', re: /高速道路|自動車専用|本線|合流|減速車線|加速車線|ETC/, img: 'jp-expressway.png' },
  { tag: 'roundabout', re: /ラウンドアボ|環状交差点|ロータリー/, img: 'jp-roundabout.png' },
  { tag: 'emergency', re: /救急|消防|緊急自動車|サイレン/, img: 'jp-ambulance.png' },
  { tag: 'fog', re: /霧|視界|煙/, img: 'jp-fog-road.png' },
  { tag: 'wet_road', re: /雨|濡れ|滑|豪雨|水たまり/, img: 'jp-wet-road.png' },
  { tag: 'night', re: /夜|暗|ライト|ヘッドランプ|前照灯/, img: 'jp-night-road.png' },
  { tag: 'tyre', re: /タイヤ|空気圧|エンジン|点検|メンテナンス|車検/, img: 'jp-tyre-check.png' },
  { tag: 'car_interior', re: /シートベルト|運転席|助手席|車内|ハンドル|ブレーキ/, img: 'jp-car-interior.png' },
  { tag: 'road_markings', re: /道路標示|標示|白線|黄線|中央線|車線/, img: 'jp-road-markings.png' },
  { tag: 'intersection', re: /交差点|右折|左折|信号|青信号|赤信号|黄信号/, img: 'jp-intersection.png' },
  { tag: 'hazard', re: /ハザード|危険予測|飛び出し|急に/, img: 'jp-hazard.png' },
  { tag: 'moto_gear', re: /ヘルメット|保護具|ゴーグル|グローブ|ジャケット|装備/, img: 'jp-motorcycle-gear.png' },
  { tag: 'motorcycle', re: /原付|二輪|オートバイ|バイク|同乗|二人乗り|タンデム/, img: 'jp-motorcycle.png' },
  { tag: 'moto_corner', re: /バンク|傾け|コーナー|カーブイン|旋回/, img: 'jp-motorcycle-corner.png' },
];

function expectedImage(q) {
  const promptJa = q.prompt?.ja ?? '';
  const fullJa = [promptJa, q.explanation?.ja ?? '', ...(q.parts ?? []).map((p) => p.prompt?.ja ?? '')].join(' ');
  for (const rule of KEYWORD_RULES) {
    if (rule.re.test(promptJa)) return rule;
  }
  for (const rule of KEYWORD_RULES) {
    if (rule.re.test(fullJa)) return rule;
  }
  return { tag: 'topic_default', img: path.basename(q.media?.src ?? '') };
}

function auditFile(filename) {
  const questions = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, filename), 'utf8'));
  const rows = [];
  let mismatches = 0;
  for (const q of questions) {
    const exp = expectedImage(q);
    const actual = path.basename(q.media?.src ?? '');
    const ok = actual === exp.img;
    if (!ok) mismatches++;
    rows.push({
      id: q.id,
      topic: q.topic,
      expected_tag: exp.tag,
      expected_image: exp.img,
      actual_image: actual,
      match: ok ? 'yes' : 'no',
      prompt_ja: (q.prompt?.ja ?? '').replace(/"/g, '""').slice(0, 120),
    });
  }
  return { rows, mismatches, total: questions.length };
}

function main() {
  const csvArg = process.argv.indexOf('--csv');
  const outPath = csvArg >= 0 ? process.argv[csvArg + 1] : OUT_DEFAULT;
  const car = auditFile('jp_car.json');
  const moto = auditFile('jp_moto.json');
  const all = [...car.rows, ...moto.rows];

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const header = 'id,topic,expected_tag,expected_image,actual_image,match,prompt_ja\n';
  const body = all.map((r) =>
    `"${r.id}","${r.topic}","${r.expected_tag}","${r.expected_image}","${r.actual_image}","${r.match}","${r.prompt_ja}"`
  ).join('\n');
  fs.writeFileSync(outPath, header + body + '\n', 'utf8');

  console.log(`jp_car: ${car.mismatches}/${car.total} keyword mismatches`);
  console.log(`jp_moto: ${moto.mismatches}/${moto.total} keyword mismatches`);
  console.log(`Wrote ${outPath}`);
}

main();
