#!/usr/bin/env node
/**
 * Export EN/MY (and JA for JP) translation pairs to review-friendly CSVs —
 * separate from the image-workflow sheets, focused only on translation text
 * so a reviewer can compare English vs Myanmar side by side.
 *
 * Usage:
 *   node scripts/translation-review-export.mjs
 *   node scripts/translation-review-export.mjs --bank sg_btt
 *
 * Output: content/spreadsheet-workflow/sheets/translation_review_<bank>.csv
 *
 * Column `reviewed`:
 *   PENDING  — not checked yet (default)
 *   OK       — checked, translation is correct as-is
 *   FIX      — checked, translation was wrong; the *_my cell(s) in this row
 *              were edited in place with the corrected Myanmar text
 * Run translation-review-import.mjs afterwards to apply any FIX rows back
 * into content/questions/<bank>.json.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const QUESTIONS_DIR = path.join(ROOT, 'content', 'questions');
const SHEETS_DIR = path.join(ROOT, 'content', 'spreadsheet-workflow', 'sheets');

const BANKS = {
  sg_btt: { file: 'sg_btt.json', type: 'sg' },
  sg_ftt: { file: 'sg_ftt.json', type: 'sg' },
  sg_rtt: { file: 'sg_rtt.json', type: 'sg' },
  jp_car: { file: 'jp_car.json', type: 'jp' },
  jp_moto: { file: 'jp_moto.json', type: 'jp' },
};

const SG_COLUMNS = [
  'id', 'topic',
  'prompt_en', 'prompt_my',
  'choice_a_en', 'choice_a_my',
  'choice_b_en', 'choice_b_my',
  'choice_c_en', 'choice_c_my',
  'explanation_en', 'explanation_my',
  'reviewed', 'reviewer_notes',
];

const JP_COLUMNS = [
  'id', 'topic', 'is_hazard',
  'prompt_ja', 'prompt_en', 'prompt_my',
  'choice_a_en', 'choice_a_my',
  'choice_b_en', 'choice_b_my',
  'hazard_p1_ja', 'hazard_p1_en', 'hazard_p1_my',
  'hazard_p2_ja', 'hazard_p2_en', 'hazard_p2_my',
  'hazard_p3_ja', 'hazard_p3_en', 'hazard_p3_my',
  'explanation_ja', 'explanation_en', 'explanation_my',
  'reviewed', 'reviewer_notes',
];

function csvEscape(val) {
  const s = val == null ? '' : String(val);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(columns, rows) {
  const header = columns.map(csvEscape).join(',');
  const body = rows.map((row) => columns.map((c) => csvEscape(row[c] ?? '')).join(',')).join('\n');
  return '﻿' + header + '\n' + body + '\n';
}

function questionToSgRow(q) {
  return {
    id: q.id,
    topic: q.topic ?? '',
    prompt_en: q.prompt?.en ?? '',
    prompt_my: q.prompt?.my ?? '',
    choice_a_en: q.choices?.[0]?.text?.en ?? '',
    choice_a_my: q.choices?.[0]?.text?.my ?? '',
    choice_b_en: q.choices?.[1]?.text?.en ?? '',
    choice_b_my: q.choices?.[1]?.text?.my ?? '',
    choice_c_en: q.choices?.[2]?.text?.en ?? '',
    choice_c_my: q.choices?.[2]?.text?.my ?? '',
    explanation_en: q.explanation?.en ?? '',
    explanation_my: q.explanation?.my ?? '',
    reviewed: 'PENDING',
    reviewer_notes: '',
  };
}

function questionToJpRow(q) {
  const parts = q.parts ?? [];
  return {
    id: q.id,
    topic: q.topic ?? '',
    is_hazard: q.parts ? 'Y' : 'N',
    prompt_ja: q.prompt?.ja ?? '',
    prompt_en: q.prompt?.en ?? '',
    prompt_my: q.prompt?.my ?? '',
    choice_a_en: q.choices?.[0]?.text?.en ?? '',
    choice_a_my: q.choices?.[0]?.text?.my ?? '',
    choice_b_en: q.choices?.[1]?.text?.en ?? '',
    choice_b_my: q.choices?.[1]?.text?.my ?? '',
    hazard_p1_ja: parts[0]?.prompt?.ja ?? '',
    hazard_p1_en: parts[0]?.prompt?.en ?? '',
    hazard_p1_my: parts[0]?.prompt?.my ?? '',
    hazard_p2_ja: parts[1]?.prompt?.ja ?? '',
    hazard_p2_en: parts[1]?.prompt?.en ?? '',
    hazard_p2_my: parts[1]?.prompt?.my ?? '',
    hazard_p3_ja: parts[2]?.prompt?.ja ?? '',
    hazard_p3_en: parts[2]?.prompt?.en ?? '',
    hazard_p3_my: parts[2]?.prompt?.my ?? '',
    explanation_ja: q.explanation?.ja ?? '',
    explanation_en: q.explanation?.en ?? '',
    explanation_my: q.explanation?.my ?? '',
    reviewed: 'PENDING',
    reviewer_notes: '',
  };
}

function exportBank(key) {
  const meta = BANKS[key];
  const questions = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, meta.file), 'utf8'));
  const isSg = meta.type === 'sg';
  const columns = isSg ? SG_COLUMNS : JP_COLUMNS;
  const rows = questions.map(isSg ? questionToSgRow : questionToJpRow);
  const outPath = path.join(SHEETS_DIR, `translation_review_${key}.csv`);
  fs.writeFileSync(outPath, toCsv(columns, rows), 'utf8');
  return { key, count: rows.length, path: outPath };
}

function main() {
  const only = process.argv.indexOf('--bank');
  const bankFilter = only >= 0 ? process.argv[only + 1] : null;

  fs.mkdirSync(SHEETS_DIR, { recursive: true });

  const keys = bankFilter ? [bankFilter] : Object.keys(BANKS);
  const results = [];
  for (const key of keys) {
    if (!BANKS[key]) {
      console.error(`Unknown bank: ${key}`);
      process.exit(1);
    }
    results.push(exportBank(key));
  }

  console.log('Exported translation review sheets:');
  for (const r of results) {
    console.log(`  ${r.key}: ${r.count} rows -> ${path.relative(ROOT, r.path)}`);
  }
}

main();
