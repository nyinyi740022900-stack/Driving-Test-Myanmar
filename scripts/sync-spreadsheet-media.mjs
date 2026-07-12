#!/usr/bin/env node
/**
 * Sync media_src / image_filename from production JSON into spreadsheet CSVs.
 * Sets verified=OK for rows that have media in JSON and complete i18n prompts.
 *
 * Usage: node scripts/sync-spreadsheet-media.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const QUESTIONS_DIR = path.join(ROOT, 'content', 'questions');
const SHEETS_DIR = path.join(ROOT, 'content', 'spreadsheet-workflow', 'sheets');

const BANKS = {
  sg_btt: { file: 'sg_btt.json', csv: 'sg_btt.csv', type: 'sg' },
  sg_ftt: { file: 'sg_ftt.json', csv: 'sg_ftt.csv', type: 'sg' },
  sg_rtt: { file: 'sg_rtt.json', csv: 'sg_rtt.csv', type: 'sg' },
  jp_car: { file: 'jp_car.json', csv: 'jp_car.csv', type: 'jp' },
  jp_moto: { file: 'jp_moto.json', csv: 'jp_moto.csv', type: 'jp' },
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      if (row.some(c => c.length)) rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function escapeCsv(value) {
  const s = value ?? '';
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function serializeCsv(rows) {
  return `${rows.map(r => r.map(escapeCsv).join(',')).join('\n')}\n`;
}

function isCompleteSg(q) {
  return Boolean(q.prompt?.en && q.prompt?.my && q.explanation?.en && q.explanation?.my);
}

function isCompleteJp(q) {
  return Boolean(q.prompt?.ja && q.prompt?.my && q.explanation?.ja && q.explanation?.my);
}

function syncBank({ file, csv, type }) {
  const questions = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, file), 'utf8'));
  const byId = new Map(questions.map(q => [q.id, q]));
  const csvPath = path.join(SHEETS_DIR, csv);
  const raw = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCsv(raw.replace(/^\uFEFF/, ''));
  const headers = rows[0];
  const idIdx = headers.indexOf('id');
  const imgIdx = headers.indexOf('image_filename');
  const srcIdx = headers.indexOf('media_src');
  const verifiedIdx = headers.indexOf('verified');
  let mediaUpdated = 0;
  let verifiedOk = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const q = byId.get(row[idIdx]);
    if (!q) continue;

    const src = q.media?.src ?? '';
    const filename = src ? path.basename(src) : '';
    if (src && row[srcIdx] !== src) {
      row[srcIdx] = src;
      row[imgIdx] = filename;
      mediaUpdated++;
    }

    const complete = type === 'jp' ? isCompleteJp(q) : isCompleteSg(q);
    if (src && complete && row[verifiedIdx] === 'PENDING') {
      row[verifiedIdx] = 'OK';
      verifiedOk++;
    }
  }

  fs.writeFileSync(csvPath, serializeCsv(rows), 'utf8');
  return { csv, mediaUpdated, verifiedOk, total: questions.length };
}

function main() {
  for (const cfg of Object.values(BANKS)) {
    const r = syncBank(cfg);
    console.log(
      `[${r.csv}] media sync ${r.mediaUpdated}, auto-verified ${r.verifiedOk} (bank ${r.total} Q)`,
    );
  }
}

main();
