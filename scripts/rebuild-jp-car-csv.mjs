#!/usr/bin/env node
/**
 * Rebuild jp_car.csv from JSON (fixes multi-line field corruption).
 * Preserves verified + reviewer_notes from the existing CSV when IDs match.
 *
 * Usage: node scripts/rebuild-jp-car-csv.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const QUESTIONS_DIR = path.join(ROOT, 'content', 'questions');
const CSV_PATH = path.join(ROOT, 'content', 'spreadsheet-workflow', 'sheets', 'jp_car.csv');

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

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  const content = text.replace(/^\uFEFF/, '');

  for (let i = 0; i < content.length; i++) {
    const c = content[i];
    if (inQuotes) {
      if (c === '"') {
        if (content[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && content[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  const headers = rows.shift()?.map((h) => h.trim()) ?? [];
  return rows.map((cells) => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = cells[i] ?? '';
    });
    return obj;
  });
}

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
  return String.fromCharCode(65 + (i ?? 0));
}

function imageFilename(src) {
  if (!src) return '';
  return path.basename(src);
}

function questionToJpRow(q, meta) {
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
    verified: meta?.verified ?? 'PENDING',
    reviewer_notes: meta?.reviewer_notes ?? '',
  };
}

function main() {
  const oldMeta = new Map();
  if (fs.existsSync(CSV_PATH)) {
    for (const row of parseCsv(fs.readFileSync(CSV_PATH, 'utf8'))) {
      if (row.id?.match(/^jp_car_/)) {
        oldMeta.set(row.id, {
          verified: row.verified || 'PENDING',
          reviewer_notes: row.reviewer_notes || '',
        });
      }
    }
  }

  const questions = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, 'jp_car.json'), 'utf8'));
  const rows = questions.map((q) => questionToJpRow(q, oldMeta.get(q.id)));

  fs.writeFileSync(CSV_PATH, toCsv(JP_COLUMNS, rows), 'utf8');

  const withMy = rows.filter((r) => r.prompt_my?.trim()).length;
  const hazard = rows.filter((r) => r.is_hazard === 'Y').length;
  const preserved = rows.filter((r) => oldMeta.has(r.id) && oldMeta.get(r.id).verified !== 'PENDING').length;

  console.log(`Rebuilt ${CSV_PATH}`);
  console.log(`  rows: ${rows.length}`);
  console.log(`  hazard: ${hazard}`);
  console.log(`  prompt_my filled: ${withMy}/${rows.length}`);
  console.log(`  preserved verified status: ${preserved}`);
}

main();
