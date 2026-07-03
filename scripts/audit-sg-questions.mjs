#!/usr/bin/env node
/**
 * Audit Singapore BTT/FTT/RTT question banks.
 * Usage: node scripts/audit-sg-questions.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'content', 'questions');
const signsDir = path.join(__dirname, '..', 'public', 'signs', 'sg');

const LOW_VALUE = [
  /triangular sign with a red border and white background usually indicates what/i,
  /yellow diamond-shaped sign generally (indicate|warn)/i,
  /what does a triangular red-bordered sign indicate\?$/i,
  /what does a circular sign with a red border indicate\?$/i,
  /what does a triangular warning sign with an exclamation mark mean\?$/i,
  /what does a yellow diamond-shaped sign with a black border mean\?$/i,
  /what does a yellow diamond-shaped sign indicate in singapore\?$/i,
  /^what does this sign mean\?$/i,
];

const SIGN_MEDIA_HINTS = [
  { pattern: /\b(no entry|do not enter|white horizontal bar)\b/i, file: 'no-entry.png' },
  { pattern: /\b(no overtaking|overtaking is not)\b/i, file: 'no-overtaking.png' },
  { pattern: /\b(give way to bus|give-way to bus)\b/i, file: 'bus-road.png' },
  { pattern: /\b(give way|give-way)\b/i, file: 'give-way.png' },
  { pattern: /\b(stop sign|come to a stop)\b/i, file: 'stop.png' },
  { pattern: /\b(school|children|child figure|pupil)\b/i, file: 'children-road.png' },
  { pattern: /\b(pedestrian|zebra crossing|crosswalk)\b/i, file: 'pedestrian-crossing.png' },
  { pattern: /\b(roundabout)\b/i, file: 'roundabout.png' },
  { pattern: /\b(traffic light|red light|amber|green arrow)\b/i, file: 'traffic-light.png' },
  { pattern: /\b(expressway|PIE|CTE|BKE|AYE)\b/i, file: 'expressway.png' },
  { pattern: /\b(ERP|road pricing)\b/i, file: 'erp-road.png' },
  { pattern: /\b(wet|rain|slippery|skidding)\b/i, file: 'wet-road.png' },
  { pattern: /\b(fog|mist|visibility)\b/i, file: 'fog-road.png' },
  { pattern: /\b(ambulance|emergency vehicle|siren)\b/i, file: 'ambulance.png' },
  { pattern: /\b(mandatory|blue circle|must turn)\b/i, file: 'mandatory-sign.png' },
  { pattern: /\b(triangular warning|warning sign|hazard ahead)\b/i, file: 'warning-sign.png' },
];

function tokens(s) {
  return new Set(s.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter((w) => w.length > 3));
}

function jaccard(a, b) {
  const inter = [...a].filter((x) => b.has(x)).length;
  return inter / new Set([...a, ...b]).size;
}

function expectedSignMedia(promptEn) {
  for (const rule of SIGN_MEDIA_HINTS) {
    if (rule.pattern.test(promptEn)) return rule.file;
  }
  return null;
}

function audit(file) {
  const qs = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  const issues = {
    badAnswer: [],
    missingI18n: [],
    noMedia: [],
    legacyMedia: [],
    missingAsset: [],
    lowValue: [],
    exactDup: [],
    signMediaMismatch: [],
  };
  const prompts = new Map();

  for (const q of qs) {
    if (!q.prompt?.en || !q.prompt?.my) issues.missingI18n.push(q.id);
    if (q.answer < 0 || q.answer >= q.choices.length) issues.badAnswer.push(q.id);
    if (!q.media?.src) issues.noMedia.push(q.id);
    if (q.media?.src?.includes('/images/sg/')) issues.legacyMedia.push(q.id);
    if (q.media?.src?.startsWith('/signs/sg/')) {
      const asset = path.join(signsDir, path.basename(q.media.src));
      if (!fs.existsSync(asset)) issues.missingAsset.push(q.id);
    }
    if (LOW_VALUE.some((p) => p.test((q.prompt?.en ?? '').trim()))) issues.lowValue.push(q.id);

    const topic = q.topic ?? '';
    if (topic.includes('road_sign') || topic.includes('sign')) {
      const expected = expectedSignMedia(q.prompt?.en ?? '');
      if (expected && q.media?.src && !q.media.src.includes(expected)) {
        issues.signMediaMismatch.push({ id: q.id, expected, actual: path.basename(q.media.src) });
      }
    }

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

const files = ['sg_btt.json', 'sg_ftt.json', 'sg_rtt.json'];
let exitCode = 0;

for (const f of files) {
  const r = audit(f);
  console.log(`\n${r.file} (${r.count})`);
  for (const [k, v] of Object.entries(r.issues)) {
    if (v.length) console.log(`  ${k}: ${Array.isArray(v) ? v.length : v}`);
  }
  if (r.issues.lowValue.length) console.log('   lowValue ids:', r.issues.lowValue.join(', '));
  if (r.issues.legacyMedia.length) console.log('   legacyMedia ids:', r.issues.legacyMedia.join(', '));
  if (r.issues.missingAsset.length) console.log('   missingAsset ids:', r.issues.missingAsset.join(', '));
  if (r.issues.signMediaMismatch.length) {
    console.log(
      '   signMediaMismatch:',
      r.issues.signMediaMismatch
        .slice(0, 8)
        .map((d) => `${d.id}(want ${d.expected}, have ${d.actual})`)
        .join(', '),
    );
  }
  if (r.issues.exactDup.length) {
    console.log('   exactDup:', r.issues.exactDup.map((d) => `${d.id}=${d.dupOf}`).join(', '));
  }
  console.log(`  exact duplicate pairs: ${r.nearDupPairs}`);

  if (
    r.issues.badAnswer.length ||
    r.issues.missingI18n.length ||
    r.issues.noMedia.length ||
    r.issues.legacyMedia.length ||
    r.issues.missingAsset.length ||
    r.issues.lowValue.length
  ) {
    exitCode = 1;
  }
}

process.exit(exitCode);
