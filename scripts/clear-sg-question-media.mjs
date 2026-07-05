#!/usr/bin/env node
/**
 * Remove media references from Singapore question banks and spreadsheet CSVs.
 * Does NOT touch content/spreadsheet-workflow/images/sg/
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const JSON_FILES = [
  'content/questions/sg_btt.json',
  'content/questions/sg_ftt.json',
  'content/questions/sg_rtt.json',
  'content/verified-output/questions/sg_btt.json',
  'content/verified-output/questions/sg_ftt.json',
  'content/verified-output/questions/sg_rtt.json',
];

const CSV_FILES = [
  'content/spreadsheet-workflow/sheets/sg_btt.csv',
  'content/spreadsheet-workflow/sheets/sg_ftt.csv',
  'content/spreadsheet-workflow/sheets/sg_rtt.csv',
];

function stripJsonMedia(filePath) {
  if (!fs.existsSync(filePath)) return { file: filePath, removed: 0, skipped: true };
  const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let removed = 0;
  for (const q of questions) {
    if (q.media) {
      delete q.media;
      removed++;
    }
  }
  fs.writeFileSync(filePath, JSON.stringify(questions, null, 2) + '\n', 'utf8');
  return { file: filePath, removed, skipped: false };
}

function clearCsvMedia(filePath) {
  const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/);
  if (lines.length < 2) return { file: filePath, rows: 0 };

  const headers = parseCsvLine(lines[0]);
  const imgIdx = headers.indexOf('image_filename');
  const srcIdx = headers.indexOf('media_src');
  let rows = 0;

  const out = [lines[0]];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cells = parseCsvLine(lines[i]);
    if (imgIdx >= 0) cells[imgIdx] = '';
    if (srcIdx >= 0) cells[srcIdx] = '';
    out.push(serializeCsvLine(cells));
    rows++;
  }

  fs.writeFileSync(filePath, out.join('\n') + '\n', 'utf8');
  return { file: filePath, rows };
}

function parseCsvLine(line) {
  const cells = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cell += '"';
          i++;
        } else inQuotes = false;
      } else cell += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      cells.push(cell);
      cell = '';
    } else cell += c;
  }
  cells.push(cell);
  return cells;
}

function serializeCsvLine(cells) {
  return cells
    .map((v) => {
      const s = v ?? '';
      if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    })
    .join(',');
}

console.log('Stripping media from SG question JSON…');
for (const rel of JSON_FILES) {
  const r = stripJsonMedia(path.join(ROOT, rel));
  if (!r.skipped) console.log(`  ${rel}: removed media from ${r.removed} questions`);
}

console.log('Clearing image columns in SG spreadsheet CSVs…');
for (const rel of CSV_FILES) {
  const r = clearCsvMedia(path.join(ROOT, rel));
  console.log(`  ${rel}: cleared ${r.rows} rows`);
}
