#!/usr/bin/env node
/**
 * Export question banks to Excel/Google Sheets-friendly CSV files.
 *
 * Usage:
 *   node scripts/spreadsheet-export.mjs
 *   node scripts/spreadsheet-export.mjs --bank sg_btt
 *
 * Output: content/spreadsheet-workflow/sheets/*.csv
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const QUESTIONS_DIR = path.join(ROOT, 'content', 'questions');
const OUT_DIR = path.join(ROOT, 'content', 'spreadsheet-workflow');
const SHEETS_DIR = path.join(OUT_DIR, 'sheets');
const IMAGES_DIR = path.join(OUT_DIR, 'images');

const BANKS = {
  sg_btt: { file: 'sg_btt.json', type: 'sg' },
  sg_ftt: { file: 'sg_ftt.json', type: 'sg' },
  sg_rtt: { file: 'sg_rtt.json', type: 'sg' },
  jp_car: { file: 'jp_car.json', type: 'jp' },
  jp_moto: { file: 'jp_moto.json', type: 'jp' },
};

const SG_COLUMNS = [
  'id',
  'topic',
  'syllabus_ref',
  'difficulty',
  'prompt_en',
  'prompt_my',
  'choice_a_en',
  'choice_b_en',
  'choice_c_en',
  'choice_a_my',
  'choice_b_my',
  'choice_c_my',
  'correct_answer',
  'explanation_en',
  'explanation_my',
  'image_filename',
  'media_src',
  'verified',
  'reviewer_notes',
];

const JP_COLUMNS = [
  'id',
  'topic',
  'syllabus_ref',
  'difficulty',
  'is_hazard',
  'prompt_ja',
  'prompt_en',
  'prompt_my',
  'choice_a_ja',
  'choice_b_ja',
  'choice_a_en',
  'choice_b_en',
  'correct_answer',
  'explanation_ja',
  'explanation_en',
  'explanation_my',
  'hazard_p1_en',
  'hazard_p1_answer',
  'hazard_p2_en',
  'hazard_p2_answer',
  'hazard_p3_en',
  'hazard_p3_answer',
  'image_filename',
  'media_src',
  'verified',
  'reviewer_notes',
];

function csvEscape(val) {
  const s = val == null ? '' : String(val);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(columns, rows) {
  const header = columns.map(csvEscape).join(',');
  const body = rows.map((row) => columns.map((c) => csvEscape(row[c] ?? '')).join(',')).join('\n');
  return '\uFEFF' + header + '\n' + body + '\n';
}

function indexToLetter(i) {
  return String.fromCharCode(65 + i);
}

function letterToIndex(letter) {
  const u = (letter ?? '').trim().toUpperCase();
  if (u === 'A') return 0;
  if (u === 'B') return 1;
  if (u === 'C') return 2;
  return -1;
}

function imageFilename(src) {
  if (!src) return '';
  return path.basename(src);
}

function questionToSgRow(q) {
  return {
    id: q.id,
    topic: q.topic ?? '',
    syllabus_ref: q.syllabusRef ?? '',
    difficulty: q.difficulty ?? 'medium',
    prompt_en: q.prompt?.en ?? '',
    prompt_my: q.prompt?.my ?? '',
    choice_a_en: q.choices?.[0]?.text?.en ?? '',
    choice_b_en: q.choices?.[1]?.text?.en ?? '',
    choice_c_en: q.choices?.[2]?.text?.en ?? '',
    choice_a_my: q.choices?.[0]?.text?.my ?? '',
    choice_b_my: q.choices?.[1]?.text?.my ?? '',
    choice_c_my: q.choices?.[2]?.text?.my ?? '',
    correct_answer: indexToLetter(q.answer ?? 0),
    explanation_en: q.explanation?.en ?? '',
    explanation_my: q.explanation?.my ?? '',
    image_filename: imageFilename(q.media?.src),
    media_src: q.media?.src ?? '',
    verified: 'PENDING',
    reviewer_notes: '',
  };
}

function questionToJpRow(q) {
  const parts = q.parts ?? [];
  return {
    id: q.id,
    topic: q.topic ?? '',
    syllabus_ref: q.syllabusRef ?? '',
    difficulty: q.difficulty ?? 'medium',
    is_hazard: q.parts ? 'Y' : 'N',
    prompt_ja: q.prompt?.ja ?? '',
    prompt_en: q.prompt?.en ?? '',
    prompt_my: q.prompt?.my ?? '',
    choice_a_ja: q.choices?.[0]?.text?.ja ?? '正しい',
    choice_b_ja: q.choices?.[1]?.text?.ja ?? '誤り',
    choice_a_en: q.choices?.[0]?.text?.en ?? 'True',
    choice_b_en: q.choices?.[1]?.text?.en ?? 'False',
    correct_answer: indexToLetter(q.answer ?? 0),
    explanation_ja: q.explanation?.ja ?? '',
    explanation_en: q.explanation?.en ?? '',
    explanation_my: q.explanation?.my ?? '',
    hazard_p1_en: parts[0]?.prompt?.en ?? '',
    hazard_p1_answer: parts[0] ? (parts[0].answer === 0 ? 'T' : 'F') : '',
    hazard_p2_en: parts[1]?.prompt?.en ?? '',
    hazard_p2_answer: parts[1] ? (parts[1].answer === 0 ? 'T' : 'F') : '',
    hazard_p3_en: parts[2]?.prompt?.en ?? '',
    hazard_p3_answer: parts[2] ? (parts[2].answer === 0 ? 'T' : 'F') : '',
    image_filename: imageFilename(q.media?.src),
    media_src: q.media?.src ?? '',
    verified: 'PENDING',
    reviewer_notes: '',
  };
}

function exportBank(key) {
  const meta = BANKS[key];
  const questions = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, meta.file), 'utf8'));
  const isSg = meta.type === 'sg';
  const columns = isSg ? SG_COLUMNS : JP_COLUMNS;
  const rows = questions.map(isSg ? questionToSgRow : questionToJpRow);
  const outPath = path.join(SHEETS_DIR, `${key}.csv`);
  fs.writeFileSync(outPath, toCsv(columns, rows), 'utf8');
  return { key, count: rows.length, path: outPath };
}

function main() {
  const only = process.argv.indexOf('--bank');
  const bankFilter = only >= 0 ? process.argv[only + 1] : null;

  fs.mkdirSync(SHEETS_DIR, { recursive: true });
  fs.mkdirSync(path.join(IMAGES_DIR, 'sg'), { recursive: true });
  fs.mkdirSync(path.join(IMAGES_DIR, 'jp'), { recursive: true });

  const keys = bankFilter ? [bankFilter] : Object.keys(BANKS);
  const results = [];
  for (const key of keys) {
    if (!BANKS[key]) {
      console.error(`Unknown bank: ${key}`);
      process.exit(1);
    }
    results.push(exportBank(key));
  }

  const indexRows = results.map((r) => ({
    bank: r.key,
    file: `sheets/${r.key}.csv`,
    question_count: r.count,
    type: BANKS[r.key].type,
  }));
  fs.writeFileSync(
    path.join(OUT_DIR, 'INDEX.csv'),
    toCsv(['bank', 'file', 'question_count', 'type'], indexRows),
    'utf8'
  );

  console.log(`Exported to ${OUT_DIR}`);
  for (const r of results) console.log(`  ${r.key}: ${r.count} rows → sheets/${r.key}.csv`);
  console.log('\nNext: open CSV in Excel/Google Sheets, edit verified column, then run:');
  console.log('  node scripts/spreadsheet-import.mjs');
}

main();
