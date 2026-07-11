#!/usr/bin/env node
/**
 * Merge OCR-extracted past papers into sg_btt.json — past papers first, then supplementary bank.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const PAPER_ORDER = [
  'btt-test-1', 'btt-test-2', 'btt-test-3', 'btt-test-4', 'btt-test-5', 'btt-test-6',
  'driving-test-p1', 'driving-test-p2', 'driving-test-p3', 'driving-test-p4', 'driving-test-p5', 'driving-test-p6',
];

const manifestPath = path.join(ROOT, 'content/past-papers/sg_btt-past-papers.json');
const bankPath = path.join(ROOT, 'content/questions/sg_btt.json');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8')).filter(q => !q.id.startsWith('sg_btt_past_'));

const paperMeta = Object.fromEntries(manifest.papers.map(p => [p.id, p]));

function normalize(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function scoreMatch(extracted, q) {
  const ep = normalize(extracted.prompt);
  const bp = normalize(q.prompt?.en);
  if (!ep || !bp) return 0;
  if (ep === bp) return 1;
  if (bp.includes(ep) || ep.includes(bp)) return 0.88;

  const ec = extracted.choices.map(normalize).join('|');
  const bc = (q.choices || []).map(c => normalize(c.text?.en)).join('|');
  if (ec && bc && ec === bc) return 0.92;

  const et = new Set(ep.split(' ').filter(Boolean));
  const bt = new Set(bp.split(' ').filter(Boolean));
  if (!et.size || !bt.size) return 0;
  let inter = 0;
  for (const w of et) if (bt.has(w)) inter++;
  return inter / Math.max(et.size, bt.size);
}

function findBestMatch(extracted, questions) {
  let best = null;
  let bestScore = 0;
  for (const q of questions) {
    const s = scoreMatch(extracted, q);
    if (s > bestScore) {
      bestScore = s;
      best = q;
    }
  }
  return bestScore >= 0.5 ? best : null;
}

const pastQuestions = [];

for (const extracted of manifest.questions) {
  const meta = paperMeta[extracted.paperId];
  const match = findBestMatch(extracted, bank);
  const id = `sg_btt_past_${extracted.paperId.replace(/-/g, '_')}_${String(extracted.number).padStart(3, '0')}`;

  const choices = extracted.choices.map((c, i) => ({
    text: {
      en: c,
      my: match?.choices?.[i]?.text?.my ?? c,
    },
  }));

  const correct = extracted.choices[extracted.answer] ?? '';

  pastQuestions.push({
    id,
    category: 'sg_btt',
    topic: match?.topic ?? 'past_paper',
    difficulty: match?.difficulty ?? 'medium',
    prompt: {
      en: extracted.prompt,
      my: match?.prompt?.my ?? extracted.prompt,
    },
    choices,
    answer: extracted.answer,
    explanation: match?.explanation ?? {
      en: `The correct answer is: ${correct}`,
      my: `မှန်ကြောင်း: ${correct}`,
    },
    ...(match?.syllabusRef ? { syllabusRef: match.syllabusRef } : {}),
    pastPaper: {
      id: extracted.paperId,
      number: extracted.number,
      title: meta?.title,
      titleMy: meta?.titleMy,
    },
    ...(extracted.imageSrc
      ? {
          media: {
            type: 'image',
            src: extracted.imageSrc,
            alt: {
              en: extracted.prompt,
              my: match?.prompt?.my ?? extracted.prompt,
            },
          },
        }
      : match?.media
        ? { media: match.media }
        : {}),
  });
}

pastQuestions.sort((a, b) => {
  const ai = PAPER_ORDER.indexOf(a.pastPaper.id);
  const bi = PAPER_ORDER.indexOf(b.pastPaper.id);
  if (ai !== bi) return ai - bi;
  return a.pastPaper.number - b.pastPaper.number;
});

const merged = [...pastQuestions, ...bank];

fs.writeFileSync(bankPath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');

console.log(`Past paper questions: ${pastQuestions.length}`);
console.log(`Supplementary bank: ${bank.length}`);
console.log(`Total sg_btt: ${merged.length}`);
console.log(`Papers: ${manifest.papers.map(p => `${p.id}(${p.questionCount})`).join(', ')}`);
