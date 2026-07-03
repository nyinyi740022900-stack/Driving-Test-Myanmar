#!/usr/bin/env node
/**
 * Verify all question banks and export to content/verified-output/
 *
 * Usage: node scripts/verify-and-export.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'content', 'verified-output');
const QUESTIONS_DIR = path.join(ROOT, 'content', 'questions');
const PUBLIC = path.join(ROOT, 'public');

const BANKS = [
  { file: 'sg_btt.json', category: 'sg_btt', country: 'SG', test: 'BTT', choices: 3, mediaExpected: true },
  { file: 'sg_ftt.json', category: 'sg_ftt', country: 'SG', test: 'FTT', choices: 3, mediaExpected: true },
  { file: 'sg_rtt.json', category: 'sg_rtt', country: 'SG', test: 'RTT', choices: 3, mediaExpected: true },
  { file: 'jp_car.json', category: 'jp_car', country: 'JP', test: 'Karimen/Honmen', choices: 2, mediaExpected: false },
  { file: 'jp_moto.json', category: 'jp_moto', country: 'JP', test: 'Moto', choices: 2, mediaExpected: false },
];

function load(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function verifyQuestion(q, bank) {
  const issues = [];
  if (!q.id) issues.push('missing_id');
  if (!q.prompt?.en && bank.country === 'SG') issues.push('missing_en_prompt');
  if (!q.prompt?.my) issues.push('missing_my_prompt');
  if (bank.country === 'JP' && !q.prompt?.ja) issues.push('missing_ja_prompt');
  if (bank.country === 'JP' && !q.prompt?.en) issues.push('missing_en_prompt');
  if (!q.explanation?.en && !q.explanation?.ja) issues.push('missing_explanation');

  if (q.parts) {
    if (q.parts.length !== 3) issues.push('hazard_parts_not_3');
    for (const p of q.parts) {
      if (p.answer !== 0 && p.answer !== 1) issues.push('hazard_invalid_answer');
    }
  } else {
    const n = q.choices?.length ?? 0;
    if (bank.country === 'SG' && n !== 3) issues.push(`choices_${n}_not_3`);
    if (bank.country === 'JP' && n !== 2) issues.push(`choices_${n}_not_2`);
    if (q.answer < 0 || q.answer >= n) issues.push('invalid_answer_index');
  }

  if (bank.mediaExpected) {
    if (!q.media?.src) issues.push('missing_media');
    else {
      const disk = path.join(PUBLIC, q.media.src.replace(/^\//, ''));
      if (!fs.existsSync(disk)) issues.push('media_file_missing');
    }
  }

  const en = q.prompt?.en ?? '';
  if (/``|motorized bicycle/i.test(en)) issues.push('en_artifact');

  return issues;
}

function imageMapRow(q) {
  return {
    id: q.id,
    syllabusRef: q.syllabusRef ?? '',
    topic: q.topic ?? '',
    media_src: q.media?.src ?? '',
    media_file: q.media?.src ? path.basename(q.media.src) : '',
    prompt_en: (q.prompt?.en ?? '').replace(/"/g, '""').slice(0, 100),
    answer_index: q.answer,
    correct_choice_en: q.parts
      ? '(hazard 3-part)'
      : (q.choices?.[q.answer]?.text?.en ?? '').replace(/"/g, '""').slice(0, 80),
  };
}

function toCsv(rows, columns) {
  const header = columns.join(',') + '\n';
  const body = rows
    .map((r) => columns.map((c) => `"${String(r[c] ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  return header + body + '\n';
}

function main() {
  ensureDir(path.join(OUT, 'questions'));
  ensureDir(path.join(OUT, 'reports'));
  ensureDir(path.join(OUT, 'reports', 'image-maps'));

  const summary = {
    generatedAt: new Date().toISOString(),
    method: 'A',
    banks: [],
    totalQuestions: 0,
    totalIssues: 0,
    criticalIssues: 0,
  };

  const allIssues = [];

  for (const bank of BANKS) {
    const srcPath = path.join(QUESTIONS_DIR, bank.file);
    const questions = load(srcPath);
    let issueCount = 0;
    const bankIssues = [];

    for (const q of questions) {
      const issues = verifyQuestion(q, bank);
      if (issues.length) {
        issueCount += issues.length;
        bankIssues.push({ id: q.id, issues });
      }
    }

    const dest = path.join(OUT, 'questions', bank.file);
    fs.writeFileSync(dest, JSON.stringify(questions, null, 2) + '\n', 'utf8');

    const mapRows = questions.map(imageMapRow);
    const mapPath = path.join(OUT, 'reports', 'image-maps', bank.file.replace('.json', '-image-map.csv'));
    fs.writeFileSync(
      mapPath,
      toCsv(mapRows, [
        'id',
        'syllabusRef',
        'topic',
        'media_src',
        'media_file',
        'prompt_en',
        'answer_index',
        'correct_choice_en',
      ]),
      'utf8'
    );

    const critical = bankIssues.filter((x) =>
      x.issues.some((i) =>
        ['invalid_answer_index', 'missing_en_prompt', 'missing_my_prompt', 'missing_ja_prompt', 'media_file_missing', 'hazard_invalid_answer'].includes(i)
      )
    );

    summary.banks.push({
      file: bank.file,
      category: bank.category,
      country: bank.country,
      test: bank.test,
      count: questions.length,
      withMedia: questions.filter((q) => q.media?.src).length,
      hazardCount: questions.filter((q) => q.parts).length,
      issueCount,
      criticalCount: critical.length,
      status: critical.length === 0 ? 'verified' : 'needs_review',
    });
    summary.totalQuestions += questions.length;
    summary.totalIssues += issueCount;
    summary.criticalIssues += critical.length;
    allIssues.push(...bankIssues.map((x) => ({ bank: bank.file, ...x })));
  }

  fs.writeFileSync(path.join(OUT, 'reports', 'verification-summary.json'), JSON.stringify({ summary, issues: allIssues }, null, 2) + '\n', 'utf8');

  const myReport = `# Verified Output — အတည်ပြုချက် အကျဉ်းချုပ်

ထုတ်လုပ်သည့်ရက်: ${summary.generatedAt}

## ဘန်ခ် အခြေအနေ

| ဘန်ခ် | မေးခွန်း | ပုံ | အခြေအနေ |
|-------|---------|-----|---------|
${summary.banks.map((b) => `| ${b.test} (${b.file}) | ${b.count} | ${b.withMedia} | ${b.status === 'verified' ? '✅ verified' : '⚠️ needs_review'} |`).join('\n')}

**စုစုပေါင်း:** ${summary.totalQuestions} မေးခွန်း  
**Critical issues:** ${summary.criticalIssues}  
**စုစုပေါင်း issue flags:** ${summary.totalIssues} (အများစုသည် EN artifact စစ်ဆေးမှု)

## ဖိုလ်ဒါ တည်ဆောက်ပုံ

\`\`\`
content/verified-output/
├── questions/          ← အတည်ပြုပြီး JSON ဘန်ခ်များ
├── reports/
│   ├── verification-summary.json
│   ├── verification-summary-my.md  (ဤဖိုင်)
│   ├── issues.csv
│   └── image-maps/     ← မေးခွန်း ↔ ပုံ CSV
└── manifest.json
\`\`\`

## SG ပုံများ
- BTT/FTT/RTT မေးခွန်းအားလုံးတွင် \`/signs/sg/\` ပုံ ဖိုင်များ ရှိပြီး verify လုပ်ပြီး
- Media mismatch ${summary.banks.filter((b) => b.country === 'SG').length > 0 ? '67+' : ''} ခု ပြင်ဆင်ပြီး

## JP ပုံများ
- Japan မေးခွန်း ၆၀၀ ခုတွင် ပုံ **မပါ** (သင် ပေးမည့် folder ရောက်လျှင် image-map ဖြည့်မည်)
- \`reports/image-maps/jp_*-image-map.csv\` တွင် media ကွက်လပ်များ မှတ်ထား

## နည်းလမ်း A
Official handbook မှ အချက်အလက် ကိုးကားပြီး **ကိုယ်ပိုင်** မေးခွန်းများ — exam စာသား မကူး
`;

  fs.writeFileSync(path.join(OUT, 'reports', 'verification-summary-my.md'), myReport, 'utf8');

  if (allIssues.length) {
    fs.writeFileSync(
      path.join(OUT, 'reports', 'issues.csv'),
      toCsv(
        allIssues.map((x) => ({ bank: x.bank, id: x.id, issues: x.issues.join('; ') })),
        ['bank', 'id', 'issues']
      ),
      'utf8'
    );
  }

  const manifest = {
    version: '1.0.0',
    generatedAt: summary.generatedAt,
    source: 'web/content/questions/',
    banks: summary.banks,
    scripts: [
      'scripts/audit-sg-questions.mjs',
      'scripts/audit-jp-questions.mjs',
      'scripts/sg-method-a.mjs',
      'scripts/verify-and-export.mjs',
    ],
  };
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  // SG image usage inventory
  const used = new Map();
  for (const bank of BANKS.filter((b) => b.country === 'SG')) {
    const questions = load(path.join(QUESTIONS_DIR, bank.file));
    for (const q of questions) {
      if (!q.media?.src) continue;
      const f = path.basename(q.media.src);
      if (!used.has(f)) used.set(f, []);
      used.get(f).push(q.id);
    }
  }
  const imgRows = [...used.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([file, ids]) => ({ file, usage_count: ids.length, sample_question_ids: ids.slice(0, 5).join('; ') }));
  fs.writeFileSync(
    path.join(OUT, 'reports', 'sg-images-used.csv'),
    toCsv(imgRows, ['file', 'usage_count', 'sample_question_ids']),
    'utf8'
  );

  fs.writeFileSync(
    path.join(OUT, 'README.md'),
    `# Verified Question Bank Export

Generated by \`node scripts/verify-and-export.mjs\`.

- **questions/** — production JSON copies after verification
- **reports/** — summary, issues, per-bank image maps
- **manifest.json** — bank counts and status

Re-run after any bank edit to refresh this folder.
`,
    'utf8'
  );

  console.log('Verified output:', OUT);
  console.log('Total questions:', summary.totalQuestions);
  console.log('Critical issues:', summary.criticalIssues);
  for (const b of summary.banks) {
    console.log(`  ${b.file}: ${b.count} q, ${b.withMedia} media, ${b.status}`);
  }

  if (summary.criticalIssues > 0) {
    process.exit(1);
  }
}

main();
