#!/usr/bin/env node
/**
 * Merge sg-method-a-gap-fill.json into sg_btt.json and sg_ftt.json.
 * Appends questions; skips any id that already exists in the target bank.
 *
 * Usage: node scripts/sg-method-a-merge-gap-fill.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const questionsDir = path.join(__dirname, '..', 'content', 'questions');
const gapFillPath = path.join(__dirname, '..', 'content', 'syllabus', 'sg-method-a-gap-fill.json');

/** @param {'sg_btt'|'sg_ftt'} category */
function mergeCategory(category) {
  const mainPath = path.join(questionsDir, `${category}.json`);
  const main = JSON.parse(fs.readFileSync(mainPath, 'utf8'));
  const gapFill = JSON.parse(fs.readFileSync(gapFillPath, 'utf8'));
  const incoming = gapFill.filter((q) => q.category === category);

  const ids = new Set(main.map((q) => q.id));
  const added = [];
  const skipped = [];

  for (const question of incoming) {
    if (ids.has(question.id)) {
      skipped.push(question.id);
      continue;
    }
    main.push(question);
    ids.add(question.id);
    added.push(question.id);
  }

  if (added.length > 0) {
    fs.writeFileSync(mainPath, JSON.stringify(main, null, 2) + '\n');
  }

  return { category, added, skipped, total: main.length };
}

if (!fs.existsSync(gapFillPath)) {
  console.error(`[merge] Missing gap-fill file: ${gapFillPath}`);
  process.exit(1);
}

const results = [mergeCategory('sg_btt'), mergeCategory('sg_ftt')];

for (const { category, added, skipped, total } of results) {
  console.log(`${category}: merged ${added.length}, skipped ${skipped.length}, bank total ${total}`);
  if (added.length > 0) {
    console.log(`  added: ${added.join(', ')}`);
  }
  if (skipped.length > 0) {
    console.log(`  skipped: ${skipped.join(', ')}`);
  }
}
