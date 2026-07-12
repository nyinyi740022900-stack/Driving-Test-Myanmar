#!/usr/bin/env node
/**
 * Print content QA metrics for Phase B tracking.
 * Usage: node scripts/content-status.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const QUESTIONS_DIR = path.join(ROOT, 'content', 'questions');
const SHEETS_DIR = path.join(ROOT, 'content', 'spreadsheet-workflow', 'sheets');

const BANKS = ['sg_btt', 'sg_ftt', 'sg_rtt', 'jp_car', 'jp_moto'];

function countVerified(csvPath) {
  const text = fs.readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, '');
  const lines = text.trim().split(/\r?\n/).slice(1);
  const counts = { PENDING: 0, OK: 0, FIX: 0, other: 0 };
  for (const line of lines) {
    const cols = line.split(',');
    const verified = cols[cols.length - 2] ?? '';
    if (verified in counts) counts[verified]++;
    else counts.other++;
  }
  return counts;
}

console.log('Category       Total  Media   %    i18n-complete');
console.log('─'.repeat(52));

for (const bank of BANKS) {
  const qs = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, `${bank}.json`), 'utf8'));
  const media = qs.filter(q => q.media?.src).length;
  const isJp = bank.startsWith('jp_');
  const i18n = qs.filter(q =>
    isJp
      ? q.prompt?.ja && q.prompt?.my && q.explanation?.ja && q.explanation?.my
      : q.prompt?.en && q.prompt?.my && q.explanation?.en && q.explanation?.my,
  ).length;
  const pct = Math.round((100 * media) / qs.length);
  console.log(
    `${bank.padEnd(14)} ${String(qs.length).padStart(5)}  ${String(media).padStart(5)}  ${String(pct).padStart(3)}%  ${i18n}/${qs.length}`,
  );
}

console.log('\nSpreadsheet verified column:');
for (const bank of BANKS) {
  const csv = path.join(SHEETS_DIR, `${bank}.csv`);
  if (!fs.existsSync(csv)) continue;
  const c = countVerified(csv);
  console.log(`  ${bank}: OK=${c.OK} PENDING=${c.PENDING} FIX=${c.FIX}`);
}
