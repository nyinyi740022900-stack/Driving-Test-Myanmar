#!/usr/bin/env node
/**
 * Import edited spreadsheet CSV back into question JSON banks.
 *
 * Only rows with verified = OK or FIX are applied.
 * Copies new images from content/spreadsheet-workflow/images/{sg|jp}/ to public/signs/.
 *
 * Images are located by BASENAME anywhere under images/{country}/ (so a row may
 * reference either "Stop.png" or "BTT/Stop.png"), then COMPRESSED with sharp
 * (resized to a max width, re-encoded) before being written to public/signs/.
 * This keeps the large source PNGs out of the deployed bundle.
 *
 * Usage:
 *   node scripts/spreadsheet-import.mjs
 *   node scripts/spreadsheet-import.mjs --bank sg_btt
 *   node scripts/spreadsheet-import.mjs --dry-run
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const QUESTIONS_DIR = path.join(ROOT, 'content', 'questions');
const WORKFLOW_DIR = path.join(ROOT, 'content', 'spreadsheet-workflow');
const SHEETS_DIR = path.join(WORKFLOW_DIR, 'sheets');
const IMAGES_DIR = path.join(WORKFLOW_DIR, 'images');
const PUBLIC_SIGNS = path.join(ROOT, 'public', 'signs');

// Compress imported images so the deployed bundle stays small.
const MAX_IMAGE_WIDTH = 1200;

/**
 * Index every image under images/<country>/ (recursively) by its lowercased
 * basename, so a CSV row can reference a file that lives in any subfolder.
 */
function buildImageIndex(country) {
  const root = path.join(IMAGES_DIR, country);
  const index = new Map();
  if (!fs.existsSync(root)) return index;

  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (/\.(png|jpe?g|webp)$/i.test(entry.name)) {
        const key = entry.name.toLowerCase();
        // First match wins; warn on duplicate basenames across subfolders.
        if (!index.has(key)) index.set(key, full);
      }
    }
  };
  walk(root);
  return index;
}

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

async function copyImageIfNeeded(filename, country, dryRun, imageIndex, log) {
  if (!filename?.trim()) return null;
  const base = path.basename(filename.trim());
  const destDir = path.join(PUBLIC_SIGNS, country);
  const dest = path.join(destDir, base);

  // Resolve the source by basename anywhere under images/<country>/.
  const src = imageIndex.get(base.toLowerCase());

  if (src && fs.existsSync(src)) {
    if (!dryRun) {
      fs.mkdirSync(destDir, { recursive: true });
      try {
        await compressImage(src, dest);
      } catch (err) {
        // Fall back to a plain copy if sharp can't process the file.
        log?.push(`compress failed for ${base}: ${err instanceof Error ? err.message : err} — copied as-is`);
        fs.copyFileSync(src, dest);
      }
    }
    return `/signs/${country}/${base}`;
  }
  // Already present in public/signs (e.g. imported earlier).
  if (fs.existsSync(dest)) return `/signs/${country}/${base}`;
  return null;
}

/**
 * Resize (only if wider than MAX_IMAGE_WIDTH) and re-encode to shrink file size.
 * Output format follows the destination extension.
 */
async function compressImage(src, dest) {
  const ext = path.extname(dest).toLowerCase();
  let pipeline = sharp(src).rotate().resize({
    width: MAX_IMAGE_WIDTH,
    withoutEnlargement: true,
  });

  if (ext === '.png') {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true, quality: 80, effort: 8 });
  } else if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: 80 });
  }

  await pipeline.toFile(dest);
}

async function applySgRow(q, row, country, dryRun, log, imageIndex) {
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
    const copied = await copyImageIfNeeded(row.image_filename, country, dryRun, imageIndex, log);
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

async function applyJpRow(q, row, country, dryRun, log, imageIndex) {
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
    const copied = await copyImageIfNeeded(row.image_filename, country, dryRun, imageIndex, log);
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

async function importBank(key, dryRun, imageIndexCache) {
  const meta = BANKS[key];
  const csvPath = path.join(SHEETS_DIR, `${key}.csv`);
  if (!fs.existsSync(csvPath)) {
    console.warn(`Skip ${key}: no ${csvPath}`);
    return { key, applied: 0, skipped: 0, log: [] };
  }

  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  const jsonPath = path.join(QUESTIONS_DIR, meta.file);
  const questions = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const byId = new Map(questions.map((q) => [q.id, q]));
  const log = [];
  let applied = 0;
  let skipped = 0;

  // Build (and cache) the image index for this country once.
  if (!imageIndexCache.has(meta.type)) {
    imageIndexCache.set(meta.type, buildImageIndex(meta.type));
  }
  const imageIndex = imageIndexCache.get(meta.type);

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
    if (meta.type === 'sg') await applySgRow(q, row, 'sg', dryRun, log, imageIndex);
    else await applyJpRow(q, row, 'jp', dryRun, log, imageIndex);
    applied++;
  }

  if (!dryRun && applied > 0) {
    fs.writeFileSync(jsonPath, JSON.stringify(questions, null, 2) + '\n', 'utf8');
  }

  return { key, applied, skipped, log };
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const only = process.argv.indexOf('--bank');
  const bankFilter = only >= 0 ? process.argv[only + 1] : null;
  const keys = bankFilter ? [bankFilter] : Object.keys(BANKS);

  console.log(dryRun ? '[dry-run]' : '[import]');
  const imageIndexCache = new Map();
  for (const key of keys) {
    const r = await importBank(key, dryRun, imageIndexCache);
    console.log(`${r.key}: applied ${r.applied}, skipped ${r.skipped} (PENDING)`);
    for (const line of r.log.slice(0, 5)) console.log(`  ${line}`);
  }
  if (!dryRun) {
    console.log('\nDone. Run: node scripts/verify-and-export.mjs');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
