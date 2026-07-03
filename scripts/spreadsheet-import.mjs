#!/usr/bin/env node
/**
 * Import edited spreadsheet CSV back into question JSON banks.
 *
 * Only rows with verified = OK or FIX are applied.
 * Copies new images from content/spreadsheet-workflow/images/{sg|jp}/ to public/signs/.
 *
 * Usage:
 *   node scripts/spreadsheet-import.mjs
 *   node scripts/spreadsheet-import.mjs --bank sg_btt
 *   node scripts/spreadsheet-import.mjs --dry-run
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const QUESTIONS_DIR = path.join(ROOT, 'content', 'questions');
const WORKFLOW_DIR = path.join(ROOT, 'content', 'spreadsheet-workflow');
const SHEETS_DIR = path.join(WORKFLOW_DIR, 'sheets');
const IMAGES_DIR = path.join(WORKFLOW_DIR, 'images');
const PUBLIC_SIGNS = path.join(ROOT, 'public', 'signs');

const BANKS = {
  sg_btt: { file: 'sg_btt.json', type: 'sg', category: 'sg_btt' },
  sg_ftt: { file: 'sg_ftt.json', type: 'sg', category: 'sg_ftt' },
  sg_rtt: { file: 'sg_rtt.json', type: 'sg', category: 'sg_rtt' },
  jp_car: { file: 'jp_car.json', type: 'jp', category: 'jp_car' },
  jp_moto: { file: 'jp_moto.json', type: 'jp', category: 'jp_moto' },
};

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

function letterToIndex(letter) {
  const u = (letter ?? '').trim().toUpperCase();
  if (u === 'A') return 0;
  if (u === 'B') return 1;
  if (u === 'C') return 2;
  return -1;
}

function tfToAnswer(val) {
  const v = (val ?? '').trim().toUpperCase();
  if (v === 'T' || v === 'TRUE' || v === '正しい') return 0;
  if (v === 'F' || v === 'FALSE' || v === '誤り') return 1;
  return -1;
}

function copyImageIfNeeded(filename, country, dryRun) {
  if (!filename?.trim()) return null;
  const base = path.basename(filename.trim());
  const src = path.join(IMAGES_DIR, country, base);
  const destDir = path.join(PUBLIC_SIGNS, country);
  const dest = path.join(destDir, base);
  if (fs.existsSync(src)) {
    if (!dryRun) {
      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(src, dest);
    }
    return `/signs/${country}/${base}`;
  }
  if (fs.existsSync(dest)) return `/signs/${country}/${base}`;
  return null;
}

function applySgRow(q, row, country, dryRun, log) {
  q.topic = row.topic || q.topic;
  q.syllabusRef = row.syllabus_ref || q.syllabusRef;
  q.difficulty = row.difficulty || q.difficulty;
  q.prompt = { en: row.prompt_en, my: row.prompt_my };
  q.choices = [
    { text: { en: row.choice_a_en, my: row.choice_a_my } },
    { text: { en: row.choice_b_en, my: row.choice_b_my } },
    { text: { en: row.choice_c_en, my: row.choice_c_my } },
  ];
  const ans = letterToIndex(row.correct_answer);
  if (ans >= 0) q.answer = ans;
  q.explanation = { en: row.explanation_en, my: row.explanation_my };

  let src = row.media_src?.trim();
  if (row.image_filename?.trim()) {
    const copied = copyImageIfNeeded(row.image_filename, country, dryRun);
    if (copied) src = copied;
    else if (!src) src = `/signs/${country}/${path.basename(row.image_filename.trim())}`;
    else log.push(`${row.id}: image not in workflow/images/${country}/ — using media_src`);
  }
  if (src) {
    q.media = {
      type: 'image',
      src,
      alt: { en: (row.prompt_en ?? '').slice(0, 80), my: (row.prompt_my ?? '').slice(0, 60) },
    };
  } else if (!row.image_filename?.trim()) {
    delete q.media;
  }
}

function applyJpRow(q, row, country, dryRun, log) {
  q.topic = row.topic || q.topic;
  q.syllabusRef = row.syllabus_ref || q.syllabusRef;
  q.difficulty = row.difficulty || q.difficulty;
  q.prompt = { ja: row.prompt_ja, en: row.prompt_en, my: row.prompt_my };

  if ((row.is_hazard ?? '').toUpperCase() === 'Y') {
    const existing = q.parts ?? [];
    q.parts = [0, 1, 2].map((i) => {
      const en = row[`hazard_p${i + 1}_en`];
      const ans = tfToAnswer(row[`hazard_p${i + 1}_answer`]);
      const prev = existing[i];
      return {
        label: ['ア', 'イ', 'ウ'][i],
        prompt: {
          ja: prev?.prompt?.ja ?? '',
          en: en || prev?.prompt?.en || '',
          my: prev?.prompt?.my ?? '',
        },
        answer: ans >= 0 ? ans : (prev?.answer ?? 0),
      };
    });
    q.points = 2;
    delete q.choices;
    delete q.answer;
  } else {
    delete q.parts;
    delete q.points;
    q.choices = [
      { text: { ja: row.choice_a_ja || '正しい', en: row.choice_a_en || 'True', my: 'မှန်သည်' } },
      { text: { ja: row.choice_b_ja || '誤り', en: row.choice_b_en || 'False', my: 'မှားသည်' } },
    ];
    const ans = letterToIndex(row.correct_answer);
    if (ans >= 0) q.answer = ans;
  }

  q.explanation = { ja: row.explanation_ja, en: row.explanation_en, my: row.explanation_my };

  let src = row.media_src?.trim();
  if (row.image_filename?.trim()) {
    const copied = copyImageIfNeeded(row.image_filename, country, dryRun);
    if (copied) src = copied;
    else if (!src) src = `/signs/${country}/${path.basename(row.image_filename.trim())}`;
  }
  if (src) {
    q.media = {
      type: 'image',
      src,
      alt: { ja: (row.prompt_ja ?? '').slice(0, 80), en: (row.prompt_en ?? '').slice(0, 80), my: (row.prompt_my ?? '').slice(0, 60) },
    };
  } else if (!row.image_filename?.trim()) {
    delete q.media;
  }
}

function importBank(key, dryRun) {
  const meta = BANKS[key];
  const csvPath = path.join(SHEETS_DIR, `${key}.csv`);
  if (!fs.existsSync(csvPath)) {
    console.warn(`Skip ${key}: no ${csvPath}`);
    return { key, applied: 0, skipped: 0 };
  }

  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  const jsonPath = path.join(QUESTIONS_DIR, meta.file);
  const questions = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const byId = new Map(questions.map((q) => [q.id, q]));
  const log = [];
  let applied = 0;
  let skipped = 0;

  for (const row of rows) {
    const status = (row.verified ?? '').trim().toUpperCase();
    if (status !== 'OK' && status !== 'FIX') {
      skipped++;
      continue;
    }
    const q = byId.get(row.id);
    if (!q) {
      log.push(`Unknown id: ${row.id}`);
      continue;
    }
    if (meta.type === 'sg') applySgRow(q, row, 'sg', dryRun, log);
    else applyJpRow(q, row, 'jp', dryRun, log);
    applied++;
  }

  if (!dryRun && applied > 0) {
    fs.writeFileSync(jsonPath, JSON.stringify(questions, null, 2) + '\n', 'utf8');
  }

  return { key, applied, skipped, log };
}

function main() {
  const dryRun = process.argv.includes('--dry-run');
  const only = process.argv.indexOf('--bank');
  const bankFilter = only >= 0 ? process.argv[only + 1] : null;
  const keys = bankFilter ? [bankFilter] : Object.keys(BANKS);

  console.log(dryRun ? '[dry-run]' : '[import]');
  for (const key of keys) {
    const r = importBank(key, dryRun);
    console.log(`${r.key}: applied ${r.applied}, skipped ${r.skipped} (PENDING)`);
    for (const line of r.log.slice(0, 5)) console.log(`  ${line}`);
  }
  if (!dryRun) {
    console.log('\nDone. Run: node scripts/verify-and-export.mjs');
  }
}

main();
