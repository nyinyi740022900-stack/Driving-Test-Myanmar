#!/usr/bin/env node
/**
 * Merge jp_*_expansion.json arrays into main question banks.
 * Usage: node scripts/merge-jp-expansion.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'content', 'questions');

function merge(category) {
  const mainPath = path.join(root, `${category}.json`);
  const expPath = path.join(root, `${category}_expansion.json`);
  if (!fs.existsSync(expPath)) {
    console.warn(`skip ${category}: no expansion file`);
    return;
  }
  const main = JSON.parse(fs.readFileSync(mainPath, 'utf8'));
  const extra = JSON.parse(fs.readFileSync(expPath, 'utf8'));
  const ids = new Set(main.map(q => q.id));
  for (const q of extra) {
    if (ids.has(q.id)) throw new Error(`duplicate id ${q.id}`);
    ids.add(q.id);
  }
  const merged = [...main, ...extra];
  fs.writeFileSync(mainPath, JSON.stringify(merged, null, 2) + '\n');
  console.log(`${category}: ${main.length} + ${extra.length} = ${merged.length}`);
}

merge('jp_car');
merge('jp_moto');
