#!/usr/bin/env node
/**
 * Audit Japan (jp_car / jp_moto) question banks for format, i18n, and quality.
 *
 * Usage:
 *   node scripts/audit-jp-questions.mjs
 *   node scripts/audit-jp-questions.mjs --json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUESTIONS_DIR = path.join(__dirname, '..', 'content', 'questions');
const FILES = ['jp_car.json', 'jp_moto.json'];
const LOCALES = ['ja', 'my', 'en'];
const HAZARD_LABELS = ['ア', 'イ', 'ウ'];
const TF_JA = ['正しい', '誤り'];

const EN_ARTIFACT_RE =
  /``|,,|\s{2,}|motorized bicycle|motorized bicycles|"[^"]*?'|"[^"]*?\.'(\s|$)|[\u3040-\u30ff\u4e00-\u9faf]/;

const LOW_VALUE_EN = [
  /^a triangular sign with a red border is a warning sign and warns of danger ahead\.?$/i,
];

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

function tokens(s) {
  return new Set(
    (s ?? '')
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3),
  );
}

function jaccard(a, b) {
  const inter = [...a].filter((x) => b.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : inter / union;
}

function normJa(s) {
  return (s ?? '').replace(/\s+/g, '').trim();
}

function collectLocalizedFields(q) {
  const fields = [];
  const add = (obj, label) => {
    if (obj && typeof obj === 'object') {
      for (const loc of LOCALES) {
        if (obj[loc] !== undefined) fields.push({ label: `${label}.${loc}`, text: obj[loc] });
      }
    }
  };
  add(q.prompt, 'prompt');
  add(q.explanation, 'explanation');
  for (let i = 0; i < (q.choices ?? []).length; i++) add(q.choices[i].text, `choices[${i}].text`);
  for (let i = 0; i < (q.parts ?? []).length; i++) add(q.parts[i].prompt, `parts[${i}].prompt`);
  return fields;
}

function auditQuestion(q, allPromptsJa) {
  const issues = [];

  for (const loc of LOCALES) {
    if (!q.prompt?.[loc]?.trim()) issues.push({ type: 'missingLocale', field: `prompt.${loc}` });
    if (!q.explanation?.[loc]?.trim()) issues.push({ type: 'missingLocale', field: `explanation.${loc}` });
    for (let i = 0; i < (q.choices ?? []).length; i++) {
      if (!q.choices[i]?.text?.[loc]?.trim()) {
        issues.push({ type: 'missingLocale', field: `choices[${i}].text.${loc}` });
      }
    }
  }

  if (q.answer < 0 || q.answer >= (q.choices?.length ?? 0)) {
    issues.push({ type: 'badAnswer', answer: q.answer, choices: q.choices?.length ?? 0 });
  }

  if ((q.choices?.length ?? 0) !== 2) {
    issues.push({ type: 'notTwoChoices', count: q.choices?.length ?? 0 });
  } else {
    const ja0 = q.choices[0]?.text?.ja;
    const ja1 = q.choices[1]?.text?.ja;
    if (ja0 !== TF_JA[0] || ja1 !== TF_JA[1]) {
      issues.push({ type: 'notTrueFalse', ja0, ja1 });
    }
  }

  if (q.media?.src) {
    issues.push({ type: 'unexpectedMedia', src: q.media.src });
  }

  if (q.parts?.length) {
    if (q.parts.length !== 3) issues.push({ type: 'hazardPartsCount', count: q.parts.length });
    if (q.points !== 2) issues.push({ type: 'hazardPoints', points: q.points });
    for (const part of q.parts) {
      if (!HAZARD_LABELS.includes(part.label)) {
        issues.push({ type: 'hazardLabel', label: part.label });
      }
      if (part.answer !== 0 && part.answer !== 1) {
        issues.push({ type: 'hazardPartAnswer', label: part.label, answer: part.answer });
      }
      for (const loc of LOCALES) {
        if (!part.prompt?.[loc]?.trim()) {
          issues.push({ type: 'missingLocale', field: `parts.${part.label}.prompt.${loc}` });
        }
      }
    }
  }

  const jaNorm = normJa(q.prompt?.ja);
  if (jaNorm && allPromptsJa.has(jaNorm)) {
    issues.push({ type: 'duplicatePromptJa', dupOf: allPromptsJa.get(jaNorm) });
  } else if (jaNorm) {
    allPromptsJa.set(jaNorm, q.id);
  }

  for (const { label, text } of collectLocalizedFields(q)) {
    if (label.endsWith('.en') && text && EN_ARTIFACT_RE.test(text)) {
      issues.push({ type: 'enArtifact', field: label, sample: text.slice(0, 80) });
    }
  }

  const enPrompt = (q.prompt?.en ?? '').trim();
  if (LOW_VALUE_EN.some((re) => re.test(enPrompt))) {
    issues.push({ type: 'lowValue', en: enPrompt.slice(0, 100) });
  }

  if (!q.syllabusRef) {
    issues.push({ type: 'missingSyllabusRef', topic: q.topic });
  } else if (SYLLABUS_REF[q.topic] && q.syllabusRef !== SYLLABUS_REF[q.topic]) {
    issues.push({ type: 'syllabusMismatch', expected: SYLLABUS_REF[q.topic], actual: q.syllabusRef });
  }

  return issues;
}

function auditFile(filename) {
  const questions = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, filename), 'utf8'));
  const allPromptsJa = new Map();
  const byType = {};
  const byId = {};

  for (const q of questions) {
    const issues = auditQuestion(q, allPromptsJa);
    if (issues.length) {
      byId[q.id] = issues;
      for (const issue of issues) {
        byType[issue.type] = (byType[issue.type] ?? 0) + 1;
      }
    }
  }

  const nearDupEn = [];
  const nearDupJa = [];
  for (let i = 0; i < questions.length; i++) {
    for (let j = i + 1; j < questions.length; j++) {
      const enSim = jaccard(tokens(questions[i].prompt?.en), tokens(questions[j].prompt?.en));
      if (enSim >= 0.85 && !questions[i].parts?.length && !questions[j].parts?.length) {
        nearDupEn.push({ a: questions[i].id, b: questions[j].id, score: enSim });
      }
      const jaA = normJa(questions[i].prompt?.ja);
      const jaB = normJa(questions[j].prompt?.ja);
      if (
        jaA &&
        jaB &&
        jaA === jaB &&
        !questions[i].parts?.length &&
        !questions[j].parts?.length
      ) {
        nearDupJa.push({ a: questions[i].id, b: questions[j].id, score: 1 });
      }
    }
  }

  const hazardCount = questions.filter((q) => q.parts?.length).length;
  const topics = Object.fromEntries(
    [...new Set(questions.map((q) => q.topic))].map((t) => [
      t,
      questions.filter((q) => q.topic === t).length,
    ]),
  );

  return {
    filename,
    count: questions.length,
    hazardCount,
    topics,
    byType,
    byId,
    nearDupEn,
    nearDupJa,
  };
}

function main() {
  const jsonOut = process.argv.includes('--json');
  const reports = FILES.map(auditFile);

  if (jsonOut) {
    console.log(JSON.stringify(reports, null, 2));
    return;
  }

  let critical = 0;
  for (const r of reports) {
    console.log(`\n=== ${r.filename} (${r.count} questions, ${r.hazardCount} hazard) ===`);
    console.log('Topics:', Object.entries(r.topics).map(([k, v]) => `${k}(${v})`).join(', '));

    if (Object.keys(r.byType).length === 0) {
      console.log('  No per-question issues.');
    } else {
      for (const [type, count] of Object.entries(r.byType).sort((a, b) => b[1] - a[1])) {
        console.log(`  ${type}: ${count}`);
        if (!['missingSyllabusRef', 'enArtifact', 'lowValue', 'duplicatePromptJa'].includes(type)) {
          critical += count;
        }
      }
    }

    const dupJa = Object.entries(r.byId).filter(([, issues]) =>
      issues.some((i) => i.type === 'duplicatePromptJa'),
    );
    if (dupJa.length) {
      console.log('  duplicatePromptJa pairs:', dupJa.map(([id, iss]) => `${id}=${iss.find((i) => i.type === 'duplicatePromptJa').dupOf}`).join(', '));
    }

    const artifacts = Object.entries(r.byId).filter(([, issues]) =>
      issues.some((i) => i.type === 'enArtifact'),
    );
    if (artifacts.length) {
      console.log(`  enArtifact ids (${artifacts.length}):`, artifacts.slice(0, 12).map(([id]) => id).join(', '), artifacts.length > 12 ? '…' : '');
    }

    if (r.nearDupJa.length) {
      console.log(`  nearDupJa (>=0.85, excl. hazard): ${r.nearDupJa.length}`);
      for (const d of r.nearDupJa.slice(0, 8)) console.log(`    ${d.a} ~ ${d.b} (${d.score.toFixed(2)})`);
    }
  }

  console.log(`\nAudit complete. Critical issues (format/i18n/hazard): ${critical}`);
  if (critical > 0) process.exitCode = 1;
}

main();
