#!/usr/bin/env node
/**
 * Copy sign images from spreadsheet workflow folder to public/signs/sg.
 * Skips files that already exist with the same size; writes slugified names for new files.
 *
 * Usage: node scripts/sync-workflow-sign-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'content', 'spreadsheet-workflow', 'images', 'sg');
const DEST_DIR = path.join(ROOT, 'public', 'signs', 'sg');

function slugify(name) {
  return name
    .replace(/\.png$/i, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .concat('.png');
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

function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error('No workflow images at', SRC_DIR);
    process.exit(1);
  }
  fs.mkdirSync(DEST_DIR, { recursive: true });

  const files = walkPng(SRC_DIR);
  let copied = 0;
  let skipped = 0;

  for (const src of files) {
    const file = path.basename(src);
    const destName = slugify(file);
    const dest = path.join(DEST_DIR, destName);
    const srcStat = fs.statSync(src);

    if (fs.existsSync(dest)) {
      const destStat = fs.statSync(dest);
      if (destStat.size === srcStat.size) {
        skipped++;
        continue;
      }
    }

    fs.copyFileSync(src, dest);
    copied++;
    if (file !== destName) {
      console.log(`  ${file} → ${destName}`);
    }
  }

  console.log(`Synced ${copied} new/updated, ${skipped} unchanged (${files.length} workflow PNGs)`);
}

main();
