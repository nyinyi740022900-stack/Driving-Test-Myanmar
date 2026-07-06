#!/usr/bin/env node
/**
 * Audit Myanmar (_my) fields in spreadsheet CSV sheets.
 * Usage: node scripts/audit-my-csv-translations.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHEETS_DIR = path.join(__dirname, '../content/spreadsheet-workflow/sheets');

const HANGUL = /[\uac00-\ud7af]/;
const CJK = /[\u3040-\u30ff\u4e00-\u9fff]/;
const ENGLISH_WORD = /\b(AND|one thousand and|the |should |must )\b/i;

function readCsv(filePath) {
  const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
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
      if (c === '\r' && text[i + 1] === '\n') i++;
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
  return rows.map((cells, index) => {
    const obj = Object.fromEntries(headers.map((h, i) => [h, cells[i] ?? '']));
    obj.__line = index + 2;
    return obj;
  });
}

function auditFile(filePath) {
  const rows = readCsv(filePath);
  const issues = [];
  const pairs = (row) => {
    const keys = Object.keys(row).filter((k) => k.endsWith('_my'));
    return keys.map((myKey) => {
      const enKey = myKey.replace(/_my$/, '_en');
      return [myKey, enKey];
    });
  };

  for (const row of rows) {
    for (const [myKey, enKey] of pairs(row)) {
      const myVal = (row[myKey] ?? '').trim();
      const enVal = (row[enKey] ?? '').trim();
      if (!myVal) {
        issues.push({ id: row.id, field: myKey, type: 'missing' });
        continue;
      }
      if (enVal && myVal === enVal && enVal.length > 3 && !/^\d|RPM|km\/h/i.test(enVal)) {
        issues.push({ id: row.id, field: myKey, type: 'same_as_en', sample: myVal.slice(0, 60) });
      }
      if (HANGUL.test(myVal)) issues.push({ id: row.id, field: myKey, type: 'hangul', sample: myVal.slice(0, 80) });
      if (CJK.test(myVal) && !myVal.includes('「')) {
        issues.push({ id: row.id, field: myKey, type: 'cjk', sample: myVal.slice(0, 80) });
      }
      if (['prompt_my', 'explanation_my'].includes(myKey) && ENGLISH_WORD.test(myVal)) {
        issues.push({ id: row.id, field: myKey, type: 'english_leak', sample: myVal.slice(0, 100) });
      }
    }
  }
  return { file: path.basename(filePath), count: rows.length, issues };
}

const reports = fs
  .readdirSync(SHEETS_DIR)
  .filter((f) => f.endsWith('.csv') && f !== 'all_questions.csv')
  .map((f) => auditFile(path.join(SHEETS_DIR, f)));

let total = 0;
for (const r of reports) {
  console.log(`\n${r.file} (${r.count}) — ${r.issues.length} issues`);
  const byType = {};
  for (const i of r.issues) byType[i.type] = (byType[i.type] ?? 0) + 1;
  console.log(byType);
  for (const i of r.issues.slice(0, 8)) console.log(' ', i);
  total += r.issues.length;
}
console.log(`\nTotal issues: ${total}`);
process.exit(total > 0 ? 1 : 0);
