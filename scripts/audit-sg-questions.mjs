#!/usr/bin/env node
/**
 * Audit Singapore BTT/FTT question banks.
 * Usage: node scripts/audit-sg-questions.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'content', 'questions');

const LOW_VALUE = [
  /triangular sign with a red border and white background usually indicates what/i,
  /yellow diamond-shaped sign generally (indicate|warn)/i,
  /what does a triangular red-bordered sign indicate\?$/i,
  /what does a circular sign with a red border indicate\?$/i,
  /what does a triangular warning sign with an exclamation mark mean\?$/i,
  /what does a yellow diamond-shaped sign with a black border mean\?$/i,
  /what does a yellow diamond-shaped sign indicate in singapore\?$/i,
];

function tokens(s) {
  return new Set(s.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(w => w.length > 3));
}

function jaccard(a, b) {
  const inter = [...a].filter(x => b.has(x)).length;
  return inter / new Set([...a, ...b]).size;
}

function audit(file) {
  const qs = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  const issues = { badAnswer: [], missingI18n: [], noMedia: [], lowValue: [], exactDup: [] };
  const prompts = new Map();

  for (const q of qs) {
    if (!q.prompt?.en || !q.prompt?.my) issues.missingI18n.push(q.id);
    if (q.answer < 0 || q.answer >= q.choices.length) issues.badAnswer.push(q.id);
    if (!q.media?.src) issues.noMedia.push(q.id);
    if (LOW_VALUE.some(p => p.test(q.prompt.en))) issues.lowValue.push(q.id);

    const norm = q.prompt.en.toLowerCase().trim();
    if (prompts.has(norm)) issues.exactDup.push({ id: q.id, dupOf: prompts.get(norm) });
    else prompts.set(norm, q.id);
  }

  const nearDup = [];
  for (let i = 0; i < qs.length; i++) {
    for (let j = i + 1; j < qs.length; j++) {
      const s = jaccard(tokens(qs[i].prompt.en), tokens(qs[j].prompt.en));
      if (s >= 1) nearDup.push([qs[i].id, qs[j].id]);
    }
  }

  return { file, count: qs.length, issues, nearDupPairs: nearDup.length };
}

for (const f of ['sg_btt.json', 'sg_ftt.json']) {
  const r = audit(f);
  console.log(`\n${r.file} (${r.count})`);
  for (const [k, v] of Object.entries(r.issues)) {
    if (v.length) console.log(`  ${k}: ${Array.isArray(v) ? v.length : v}`);
  }
  if (r.issues.lowValue.length) console.log('   lowValue ids:', r.issues.lowValue.join(', '));
  if (r.issues.exactDup.length) console.log('   exactDup:', r.issues.exactDup.map(d => `${d.id}=${d.dupOf}`).join(', '));
  console.log(`  exact duplicate pairs: ${r.nearDupPairs}`);
}
