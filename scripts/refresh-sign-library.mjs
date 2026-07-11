#!/usr/bin/env node
/**
 * 1. Sync workflow sign PNGs → public/signs/sg (slugified names, recursive)
 * 2. Rewrite question bank media paths to slugified filenames
 * 3. Remove legacy non-slug duplicate PNGs from public/signs/sg
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SRC_ROOT = path.join(ROOT, 'content', 'spreadsheet-workflow', 'images', 'sg');
const DEST_DIR = path.join(ROOT, 'public', 'signs', 'sg');
const QUESTION_CATS = ['sg_btt', 'sg_ftt', 'sg_rtt'];
const MAX_IMAGE_WIDTH = 1200;

function slugify(name) {
  return name
    .replace(/\.png$/i, '')
    .toLowerCase()
    .replace(/[''']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .concat('.png');
}

function isSlugFile(name) {
  return /^[a-z0-9]+(-[a-z0-9]+)*\.png$/.test(name);
}

function walkPng(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkPng(full, out);
    else if (entry.name.toLowerCase().endsWith('.png')) out.push(full);
  }
  return out;
}

async function compressImage(src, dest) {
  await sharp(src)
    .rotate()
    .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 80, effort: 8 })
    .toFile(dest);
}

async function syncWorkflowImages() {
  fs.mkdirSync(DEST_DIR, { recursive: true });
  const files = walkPng(SRC_ROOT);
  let copied = 0;
  for (const src of files) {
    const destName = slugify(path.basename(src));
    const dest = path.join(DEST_DIR, destName);
    try {
      await compressImage(src, dest);
    } catch {
      fs.copyFileSync(src, dest);
    }
    copied++;
  }
  console.log(`Synced ${copied} workflow PNGs → public/signs/sg (compressed)`);
}

function migrateQuestionPaths() {
  let updated = 0;
  for (const cat of QUESTION_CATS) {
    const file = path.join(ROOT, 'content', 'questions', `${cat}.json`);
    const questions = JSON.parse(fs.readFileSync(file, 'utf8'));
    let changed = false;
    for (const q of questions) {
      const src = q.media?.src;
      if (!src || !src.startsWith('/signs/sg/')) continue;
      const base = path.basename(src);
      const slug = slugify(base);
      const next = `/signs/sg/${slug}`;
      if (src !== next) {
        q.media.src = next;
        changed = true;
        updated++;
      }
    }
    if (changed) {
      fs.writeFileSync(file, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
      console.log(`Updated paths in ${cat}.json`);
    }
  }
  console.log(`Rewrote ${updated} question media paths`);
}

function removeLegacyImages() {
  if (!fs.existsSync(DEST_DIR)) return;
  let removed = 0;
  for (const name of fs.readdirSync(DEST_DIR)) {
    if (name === '.gitkeep') continue;
    if (!name.toLowerCase().endsWith('.png')) continue;
    if (isSlugFile(name)) continue;
    fs.unlinkSync(path.join(DEST_DIR, name));
    removed++;
    console.log(`  removed legacy: ${name}`);
  }
  console.log(`Removed ${removed} legacy PNGs`);
}

function main() {
  if (!fs.existsSync(SRC_ROOT)) {
    console.error('Workflow folder missing:', SRC_ROOT);
    process.exit(1);
  }
  syncWorkflowImages()
    .then(() => {
      migrateQuestionPaths();
      removeLegacyImages();
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

main();
