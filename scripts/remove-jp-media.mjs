#!/usr/bin/env node
/**
 * Remove media from all JP question banks (jp_car, jp_moto).
 *
 * Usage: node scripts/remove-jp-media.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUESTIONS_DIR = path.join(__dirname, '..', 'content', 'questions');

for (const bank of ['jp_car', 'jp_moto']) {
  const filePath = path.join(QUESTIONS_DIR, `${bank}.json`);
  const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let removed = 0;
  for (const q of questions) {
    if (q.media) {
      delete q.media;
      removed++;
    }
  }
  fs.writeFileSync(filePath, `${JSON.stringify(questions, null, 2)}\n`);
  console.log(`${bank}.json: removed media from ${removed}/${questions.length} questions`);
}
