#!/usr/bin/env node
/**
 * Method A — tag questions with handbook syllabus refs and report coverage gaps.
 *
 * Usage:
 *   node scripts/sg-method-a.mjs tag          # add syllabusRef to BTT/FTT banks
 *   node scripts/sg-method-a.mjs gap          # print coverage report
 *   node scripts/sg-method-a.mjs gap --csv docs/sg-method-a-gaps.csv
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const QUESTIONS_DIR = path.join(ROOT, 'content', 'questions');
const SYLLABUS_DIR = path.join(ROOT, 'content', 'syllabus');

const BANKS = [
  { file: 'sg_btt.json', syllabus: 'sg-btt.json' },
  { file: 'sg_ftt.json', syllabus: 'sg-ftt.json' },
];

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function questionText(q) {
  return [
    q.prompt?.en ?? '',
    q.explanation?.en ?? '',
    ...(q.choices ?? []).map((c) => c.text?.en ?? ''),
  ].join(' ');
}

function tagQuestion(q, sections) {
  const text = questionText(q).toLowerCase();
  for (const section of sections) {
    for (const kw of section.keywords ?? []) {
      if (text.includes(kw.toLowerCase())) return section.id;
    }
  }
  return q.topic ? `legacy.${q.topic}` : 'legacy.untagged';
}

function tagBank({ file, syllabus }) {
  const sections = loadJson(path.join(SYLLABUS_DIR, syllabus)).sections;
  const filePath = path.join(QUESTIONS_DIR, file);
  const questions = loadJson(filePath);
  let changed = 0;
  for (const q of questions) {
    const ref = tagQuestion(q, sections);
    if (q.syllabusRef !== ref) {
      q.syllabusRef = ref;
      changed++;
    }
  }
  fs.writeFileSync(filePath, JSON.stringify(questions, null, 2) + '\n', 'utf8');
  return { file, total: questions.length, changed, questions, sections };
}

function coverageReport({ file, questions, sections }) {
  const counts = new Map();
  for (const q of questions) {
    const ref = q.syllabusRef ?? 'untagged';
    counts.set(ref, (counts.get(ref) ?? 0) + 1);
  }

  const gaps = [];
  for (const section of sections) {
    const n = counts.get(section.id) ?? 0;
    if (n < section.minQuestions) {
      gaps.push({
        file,
        sectionId: section.id,
        title: section.title,
        have: n,
        need: section.minQuestions,
        shortfall: section.minQuestions - n,
      });
    }
  }

  const legacy = [...counts.entries()].filter(([k]) => k.startsWith('legacy.'));
  return { file, total: questions.length, counts, gaps, legacyCount: legacy.reduce((s, [, n]) => s + n, 0) };
}

function cmdTag() {
  for (const bank of BANKS) {
    const r = tagBank(bank);
    console.log(`${r.file}: tagged ${r.changed}/${r.total}`);
  }
}

function cmdGap() {
  const csvArg = process.argv.indexOf('--csv');
  const csvPath = csvArg >= 0 ? process.argv[csvArg + 1] : null;
  const allGaps = [];

  for (const bank of BANKS) {
    const sections = loadJson(path.join(SYLLABUS_DIR, bank.syllabus)).sections;
    const questions = loadJson(path.join(QUESTIONS_DIR, bank.file));
    const report = coverageReport({ file: bank.file, questions, sections });
    console.log(`\n${report.file} (${report.total} questions, ${report.legacyCount} legacy-tagged)`);
    console.log(`  Sections below minimum: ${report.gaps.length}`);
    for (const g of report.gaps.sort((a, b) => b.shortfall - a.shortfall).slice(0, 12)) {
      console.log(`    ${g.sectionId}: ${g.have}/${g.need} — ${g.title}`);
    }
    allGaps.push(...report.gaps);
  }

  if (csvPath) {
    const header = 'file,sectionId,title,have,need,shortfall\n';
    const body = allGaps
      .map((g) => `"${g.file}","${g.sectionId}","${g.title}",${g.have},${g.need},${g.shortfall}`)
      .join('\n');
    fs.mkdirSync(path.dirname(path.join(ROOT, csvPath)), { recursive: true });
    fs.writeFileSync(path.join(ROOT, csvPath), header + body + '\n', 'utf8');
    console.log(`\nWrote ${csvPath}`);
  }
}

const cmd = process.argv[2] ?? 'gap';
if (cmd === 'tag') cmdTag();
else if (cmd === 'gap') cmdGap();
else {
  console.error('Usage: node scripts/sg-method-a.mjs [tag|gap] [--csv path]');
  process.exit(1);
}
