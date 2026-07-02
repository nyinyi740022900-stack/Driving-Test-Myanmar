#!/usr/bin/env node
/**
 * Add English (`en`) fields to JP question banks by translating Japanese text.
 * Caches translations in content/translations/jp-en-cache.json for idempotency.
 *
 * Usage:
 *   node scripts/add-jp-english.mjs
 *   node scripts/add-jp-english.mjs --verify
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUESTIONS_DIR = path.join(__dirname, '..', 'content', 'questions');
const CACHE_PATH = path.join(__dirname, '..', 'content', 'translations', 'jp-en-cache.json');

const TF_EN = { 正しい: 'True', 誤り: 'False' };
const BATCH_SIZE = 12;
const BATCH_DELAY_MS = 150;
const MAX_RETRIES = 4;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return {};
  return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
}

function saveCache(cache) {
  fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n', 'utf8');
}

function collectJaStrings(questions) {
  const set = new Set();
  const add = (obj) => {
    if (obj?.ja?.trim()) set.add(obj.ja.trim());
  };
  for (const q of questions) {
    add(q.prompt);
    add(q.explanation);
    add(q.media?.alt);
    for (const c of q.choices ?? []) add(c.text);
    for (const p of q.parts ?? []) add(p.prompt);
  }
  return [...set];
}

function polishEnglish(text) {
  return text
    .replace(/``/g, '"')
    .replace(/''/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/motorized bicycle/gi, 'moped')
    .replace(/motorized bicycles/gi, 'mopeds')
    .trim();
}

async function translateGoogle(ja) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=en&dt=t&q=${encodeURIComponent(ja)}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (RoadReady educational app)' },
  });
  if (!res.ok) throw new Error(`google HTTP ${res.status}`);
  const data = await res.json();
  const en = data[0]?.map((part) => part[0]).join('').trim();
  if (!en) throw new Error('google empty result');
  return polishEnglish(en);
}

async function translateMyMemory(ja) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(ja)}&langpair=ja|en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`mymemory HTTP ${res.status}`);
  const data = await res.json();
  if (data.quotaFinished) throw new Error('mymemory quota finished');
  const en = data.responseData?.translatedText?.trim();
  if (!en) throw new Error('mymemory empty result');
  return polishEnglish(en);
}

async function translateJaToEn(ja, cache) {
  if (TF_EN[ja]) return TF_EN[ja];
  if (cache[ja]) return cache[ja];

  let lastErr;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const en = attempt % 2 === 0 ? await translateGoogle(ja) : await translateMyMemory(ja);
      cache[ja] = en;
      return en;
    } catch (err) {
      lastErr = err;
      await sleep(500 * (attempt + 1));
    }
  }
  throw lastErr ?? new Error('translation failed');
}

async function fillCache(jaStrings, cache) {
  const missing = jaStrings.filter((s) => !cache[s] && !TF_EN[s]);
  console.log(`  ${missing.length} strings to translate (${jaStrings.length - missing.length} cached)`);
  let n = 0;
  for (let i = 0; i < missing.length; i += BATCH_SIZE) {
    const batch = missing.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (ja) => {
        await translateJaToEn(ja, cache);
        n++;
      })
    );
    saveCache(cache);
    if (n % 48 === 0 || i + BATCH_SIZE >= missing.length) {
      console.log(`  …${Math.min(n, missing.length)}/${missing.length}`);
    }
    if (i + BATCH_SIZE < missing.length) await sleep(BATCH_DELAY_MS);
  }
  saveCache(cache);
  if (missing.length) console.log(`  …${missing.length}/${missing.length} done`);
}

function applyTranslations(questions, cache) {
  const en = (obj) => {
    if (!obj?.ja) return;
    const ja = obj.ja.trim();
    obj.en = TF_EN[ja] ?? cache[ja] ?? obj.en;
  };
  for (const q of questions) {
    en(q.prompt);
    en(q.explanation);
    if (q.media?.alt) en(q.media.alt);
    for (const c of q.choices ?? []) en(c.text);
    for (const p of q.parts ?? []) en(p.prompt);
  }
}

function verifyQuestions(questions) {
  let missingPrompt = 0;
  let missingOther = 0;
  for (const q of questions) {
    if (!q.prompt?.en) missingPrompt++;
    const check = (obj) => {
      if (obj?.ja && !obj.en) missingOther++;
    };
    check(q.explanation);
    if (q.media?.alt) check(q.media.alt);
    for (const c of q.choices ?? []) check(c.text);
    for (const p of q.parts ?? []) check(p.prompt);
  }
  return { missingPrompt, missingOther };
}

async function main() {
  const verifyOnly = process.argv.includes('--verify');
  const carPath = path.join(QUESTIONS_DIR, 'jp_car.json');
  const motoPath = path.join(QUESTIONS_DIR, 'jp_moto.json');
  const car = JSON.parse(fs.readFileSync(carPath, 'utf8'));
  const moto = JSON.parse(fs.readFileSync(motoPath, 'utf8'));

  if (verifyOnly) {
    const carV = verifyQuestions(car);
    const motoV = verifyQuestions(moto);
    console.log(`car: ${carV.missingPrompt} missing prompt.en, ${carV.missingOther} other`);
    console.log(`moto: ${motoV.missingPrompt} missing prompt.en, ${motoV.missingOther} other`);
    return;
  }

  const cache = loadCache();
  const allJa = collectJaStrings([...car, ...moto]);
  console.log(`Unique Japanese strings: ${allJa.length}`);
  await fillCache(allJa, cache);

  applyTranslations(car, cache);
  applyTranslations(moto, cache);
  fs.writeFileSync(carPath, JSON.stringify(car, null, 2) + '\n', 'utf8');
  fs.writeFileSync(motoPath, JSON.stringify(moto, null, 2) + '\n', 'utf8');

  const carV = verifyQuestions(car);
  const motoV = verifyQuestions(moto);
  console.log(`Missing en — car prompt: ${carV.missingPrompt}, other: ${carV.missingOther}`);
  console.log(`Missing en — moto prompt: ${motoV.missingPrompt}, other: ${motoV.missingOther}`);
}

main().catch((err) => {
  console.error('[add-jp-english]', err.message);
  process.exit(1);
});
