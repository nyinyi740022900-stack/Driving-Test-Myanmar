#!/usr/bin/env node
/**
 * Merge all spreadsheet CSV banks into one combined file.
 *
 * Usage: node scripts/merge-all-sheets.mjs
 * Output: content/spreadsheet-workflow/sheets/all_questions.csv
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHEETS_DIR = path.join(__dirname, '../content/spreadsheet-workflow/sheets');
const OUT_PATH = path.join(SHEETS_DIR, 'all_questions.csv');

const BANKS = ['sg_btt', 'sg_ftt', 'sg_rtt', 'jp_car', 'jp_moto'];

const MERGED_COLUMNS = [
  'bank',
  'id',
  'topic',
  'syllabus_ref',
  'difficulty',
  'is_hazard',
  'prompt_en',
  'prompt_my',
  'prompt_ja',
  'choice_a_en',
  'choice_b_en',
  'choice_c_en',
  'choice_a_my',
  'choice_b_my',
  'choice_c_my',
  'choice_a_ja',
  'choice_b_ja',
  'correct_answer',
  'explanation_en',
  'explanation_my',
  'explanation_ja',
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

function normalizeRow(bank, row) {
  const isJp = bank.startsWith('jp_');
  return {
    bank,
    id: row.id ?? '',
    topic: row.topic ?? '',
    syllabus_ref: row.syllabus_ref ?? '',
    difficulty: row.difficulty ?? '',
    is_hazard: isJp ? (row.is_hazard ?? '') : '',
    prompt_en: row.prompt_en ?? '',
    prompt_my: row.prompt_my ?? '',
    prompt_ja: isJp ? (row.prompt_ja ?? '') : '',
    choice_a_en: row.choice_a_en ?? '',
    choice_b_en: row.choice_b_en ?? '',
    choice_c_en: isJp ? '' : (row.choice_c_en ?? ''),
    choice_a_my: isJp ? '' : (row.choice_a_my ?? ''),
    choice_b_my: isJp ? '' : (row.choice_b_my ?? ''),
    choice_c_my: isJp ? '' : (row.choice_c_my ?? ''),
    choice_a_ja: isJp ? (row.choice_a_ja ?? '') : '',
    choice_b_ja: isJp ? (row.choice_b_ja ?? '') : '',
    correct_answer: row.correct_answer ?? '',
    explanation_en: row.explanation_en ?? '',
    explanation_my: row.explanation_my ?? '',
    explanation_ja: isJp ? (row.explanation_ja ?? '') : '',
    hazard_p1_en: isJp ? (row.hazard_p1_en ?? '') : '',
    hazard_p1_answer: isJp ? (row.hazard_p1_answer ?? '') : '',
    hazard_p2_en: isJp ? (row.hazard_p2_en ?? '') : '',
    hazard_p2_answer: isJp ? (row.hazard_p2_answer ?? '') : '',
    hazard_p3_en: isJp ? (row.hazard_p3_en ?? '') : '',
    hazard_p3_answer: isJp ? (row.hazard_p3_answer ?? '') : '',
    image_filename: row.image_filename ?? '',
    media_src: row.media_src ?? '',
    verified: row.verified ?? 'PENDING',
    reviewer_notes: row.reviewer_notes ?? '',
  };
}

function main() {
  const merged = [];

  for (const bank of BANKS) {
    const csvPath = path.join(SHEETS_DIR, `${bank}.csv`);
    if (!fs.existsSync(csvPath)) {
      console.warn(`Skip ${bank}: file not found`);
      continue;
    }
    const rows = parseCsv(fs.readFileSync(csvPath, 'utf8')).filter((r) => r.id?.match(/^(jp|sg)_/));
    for (const row of rows) {
      merged.push(normalizeRow(bank, row));
    }
    console.log(`${bank}: ${rows.length} rows`);
  }

  fs.writeFileSync(OUT_PATH, toCsv(MERGED_COLUMNS, merged), 'utf8');
  console.log(`\nMerged ${merged.length} questions → sheets/all_questions.csv`);
}

main();
