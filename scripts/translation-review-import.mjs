#!/usr/bin/env node
/**
 * Import corrected Myanmar text from translation_review_<bank>.csv back into
 * content/questions/<bank>.json.
 *
 * For each row:
 *   reviewed = PENDING -> skipped (not reviewed yet)
 *   reviewed = OK      -> skipped (reviewer confirmed no change needed)
 *   reviewed = FIX     -> every *_my cell in that row is written back onto
 *                         the matching question (prompt/choices/explanation/
 *                         hazard parts), whether or not the text actually
 *                         differs from what's already there.
 *
 * Usage:
 *   node scripts/translation-review-import.mjs
 *   node scripts/translation-review-import.mjs --bank sg_btt
 *   node scripts/translation-review-import.mjs --dry-run
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

function parseCsv(text) {
  const clean = text.replace(/^﻿/, '');
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    if (inQuotes) {
      if (c === '"') {
        if (clean[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c === '\r') { /* skip */ }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const header = rows[0];
  return rows.slice(1)
    .filter((r) => r.length > 1 || (r[0] ?? '').trim() !== '')
    .map((r) => Object.fromEntries(header.map((h, idx) => [h, r[idx] ?? ''])));
}

function applySgRow(q, row) {
  if (row.prompt_my?.trim()) q.prompt = { ...q.prompt, my: row.prompt_my };
  q.choices = q.choices ?? [];
  ['a', 'b', 'c'].forEach((letter, idx) => {
    const val = row[`choice_${letter}_my`];
    if (val?.trim() && q.choices[idx]) {
      q.choices[idx] = { ...q.choices[idx], text: { ...q.choices[idx].text, my: val } };
    }
  });
  if (row.explanation_my?.trim()) q.explanation = { ...q.explanation, my: row.explanation_my };
}

function applyJpRow(q, row) {
  if (row.prompt_my?.trim()) q.prompt = { ...q.prompt, my: row.prompt_my };
  q.choices = q.choices ?? [];
  ['a', 'b'].forEach((letter, idx) => {
    const val = row[`choice_${letter}_my`];
    if (val?.trim() && q.choices[idx]) {
      q.choices[idx] = { ...q.choices[idx], text: { ...q.choices[idx].text, my: val } };
    }
  });
  if (row.explanation_my?.trim()) q.explanation = { ...q.explanation, my: row.explanation_my };
  if (q.parts?.length) {
    [0, 1, 2].forEach((i) => {
      const val = row[`hazard_p${i + 1}_my`];
      if (val?.trim() && q.parts[i]) {
        q.parts[i] = { ...q.parts[i], prompt: { ...q.parts[i].prompt, my: val } };
      }
    });
  }
}

function importBank(key, dryRun) {
  const meta = BANKS[key];
  const csvPath = path.join(SHEETS_DIR, `translation_review_${key}.csv`);
  if (!fs.existsSync(csvPath)) {
    console.log(`${key}: no translation_review_${key}.csv found, skipping`);
    return;
  }
  const jsonPath = path.join(QUESTIONS_DIR, meta.file);
  const questions = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const byId = new Map(questions.map((q) => [q.id, q]));

  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  let fixed = 0, ok = 0, pending = 0, unknown = 0;
  for (const row of rows) {
    const status = (row.reviewed ?? '').trim().toUpperCase();
    if (status === 'FIX') {
      const q = byId.get(row.id);
      if (!q) { unknown++; continue; }
      if (meta.type === 'sg') applySgRow(q, row); else applyJpRow(q, row);
      fixed++;
    } else if (status === 'OK') ok++;
    else pending++;
  }

  if (!dryRun && fixed > 0) {
    fs.writeFileSync(jsonPath, JSON.stringify(questions, null, 2) + '\n', 'utf8');
  }
  console.log(`${key}: FIX applied to ${fixed}, OK ${ok}, PENDING ${pending}${unknown ? `, unknown id ${unknown}` : ''}${dryRun ? ' [dry-run, not written]' : ''}`);
}

function main() {
  const dryRun = process.argv.includes('--dry-run');
  const only = process.argv.indexOf('--bank');
  const bankFilter = only >= 0 ? process.argv[only + 1] : null;
  const keys = bankFilter ? [bankFilter] : Object.keys(BANKS);

  console.log(dryRun ? '[dry-run]' : '[import]');
  for (const key of keys) {
    if (!BANKS[key]) { console.error(`Unknown bank: ${key}`); process.exit(1); }
    importBank(key, dryRun);
  }
  if (!dryRun) console.log('\nDone. Restart the dev server / redeploy to pick up changes.');
}

main();
