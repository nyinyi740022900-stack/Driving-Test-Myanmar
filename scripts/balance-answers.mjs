#!/usr/bin/env node
/**
 * Balance the correct-answer position across A/B/C for the 3-choice SG banks.
 *
 * The authored data was heavily skewed to "A" (e.g. sg_btt: 552 A / 11 B / 2 C),
 * which makes the correct answer guessable in Lesson mode (Test/Practice already
 * shuffle at runtime). This spreads the correct answer roughly evenly across the
 * three positions in BOTH the compiled JSON (what the app serves) and the
 * spreadsheet CSV (so a future re-import stays balanced).
 *
 * - Only SG banks (sg_btt, sg_ftt, sg_rtt) — 3-choice questions.
 * - JP banks are True/False (2-choice) and are left untouched.
 * - A shared target position per question id keeps JSON and CSV consistent.
 * - Choice text (en + my) moves together; distractor order is randomised.
 *
 * Usage: node scripts/balance-answers.mjs [--dry-run]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const QUESTIONS_DIR = path.join(ROOT, 'content', 'questions');
const SHEETS_DIR = path.join(ROOT, 'content', 'spreadsheet-workflow', 'sheets');

const BANKS = ['sg_btt', 'sg_ftt', 'sg_rtt'];
const LETTERS = ['A', 'B', 'C'];
const DRY = process.argv.includes('--dry-run');

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Balanced list of target positions (0/1/2) for n questions, randomised. */
function balancedTargets(n) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(i % 3);
  return shuffle(out);
}

/** Given the current correct index and a target position, return the new order
 *  of old indices for positions [0,1,2] plus the resulting answer index. */
function orderFor(correctIdx, target) {
  const others = shuffle([0, 1, 2].filter((i) => i !== correctIdx));
  const order = [null, null, null];
  order[target] = correctIdx;
  let k = 0;
  for (let pos = 0; pos < 3; pos++) {
    if (order[pos] === null) order[pos] = others[k++];
  }
  return { order, answer: target };
}

function dist(counts) {
  return LETTERS.map((l, i) => `${l}=${counts[i] || 0}`).join(' ');
}

// ── CSV helpers ───────────────────────────────────────────────────
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
        if (content[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && content[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((cell) => cell.length > 0)) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function csvField(v) {
  const s = v ?? '';
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function serializeCsv(rows) {
  return rows.map((r) => r.map(csvField).join(',')).join('\n') + '\n';
}

// ── Main ──────────────────────────────────────────────────────────
for (const bank of BANKS) {
  const jsonPath = path.join(QUESTIONS_DIR, `${bank}.json`);
  const questions = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  const before = {};
  const after = {};
  const targetById = new Map();

  // Assign balanced targets over 3-choice questions in JSON order.
  const threeChoice = questions.filter((q) => !q.parts && (q.choices || []).length === 3);
  const targets = balancedTargets(threeChoice.length);

  threeChoice.forEach((q, i) => {
    before[q.answer] = (before[q.answer] || 0) + 1;
    const target = targets[i];
    targetById.set(q.id, target);
    const { order, answer } = orderFor(q.answer, target);
    q.choices = order.map((idx) => q.choices[idx]);
    q.answer = answer;
    after[answer] = (after[answer] || 0) + 1;
  });

  if (!DRY) fs.writeFileSync(jsonPath, JSON.stringify(questions, null, 2) + '\n', 'utf8');
  console.log(`\n${bank}.json  (${threeChoice.length} rows)`);
  console.log(`  before: ${dist(before)}`);
  console.log(`  after:  ${dist(after)}`);

  // Apply the SAME target position to the CSV (computed from CSV's own answer).
  const csvPath = path.join(SHEETS_DIR, `${bank}.csv`);
  if (!fs.existsSync(csvPath)) { console.log('  (no csv)'); continue; }

  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  const header = rows[0];
  const col = Object.fromEntries(header.map((h, i) => [h.trim(), i]));
  const need = ['id', 'correct_answer', 'choice_a_en', 'choice_b_en', 'choice_c_en', 'choice_a_my', 'choice_b_my', 'choice_c_my'];
  if (need.some((n) => col[n] === undefined)) { console.log('  (csv missing columns, skipped)'); continue; }

  let csvChanged = 0;
  const csvAfter = {};
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const id = row[col.id];
    const target = targetById.get(id);
    if (target === undefined) continue;
    const cur = LETTERS.indexOf((row[col.correct_answer] || '').trim().toUpperCase());
    const en = [row[col.choice_a_en], row[col.choice_b_en], row[col.choice_c_en]];
    const my = [row[col.choice_a_my], row[col.choice_b_my], row[col.choice_c_my]];
    if (cur < 0 || en.some((x) => !x || !x.trim())) continue; // skip malformed
    const { order, answer } = orderFor(cur, target);
    row[col.choice_a_en] = en[order[0]]; row[col.choice_b_en] = en[order[1]]; row[col.choice_c_en] = en[order[2]];
    row[col.choice_a_my] = my[order[0]]; row[col.choice_b_my] = my[order[1]]; row[col.choice_c_my] = my[order[2]];
    row[col.correct_answer] = LETTERS[answer];
    csvAfter[answer] = (csvAfter[answer] || 0) + 1;
    csvChanged++;
  }

  if (!DRY) fs.writeFileSync(csvPath, serializeCsv(rows), 'utf8');
  console.log(`  ${bank}.csv rebalanced ${csvChanged} rows → ${dist(csvAfter)}`);
}

console.log(DRY ? '\n[dry-run] no files written' : '\nDone.');
