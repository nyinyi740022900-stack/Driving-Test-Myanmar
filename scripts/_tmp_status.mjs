import fs from 'node:fs';

const csv = fs.readFileSync('content/spreadsheet-workflow/sheets/sg_btt.csv', 'utf8');

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c === '\r') { /* skip */ }
      else field += c;
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

const rows = parseCSV(csv);
let header = rows[0].map((h) => h.replace(/^\ufeff/, ''));
const idx = Object.fromEntries(header.map((h, i) => [h, i]));

const arg = process.argv[2] || 'summary';

const visualRe = /(this sign|the sign|following sign|sign (below|shown|above)|sign indicate|sign mean|what does this|a red circle|a blue circle|a red triangle|red-bordered|red border|triangular sign|inside a triangle|white arrow|blue rectangular|circular sign|zig-?zag|yellow line|white line|double yellow|double white|broken line|broken white|road marking|zebra crossing|box junction|give-way line|these lines|this marking|this light|this signal|this road marking)/i;

let counts = { PENDING: 0, OK: 0, FIX: 0, REMOVE: 0, other: 0 };
const pendingVisual = [];
const usedImages = new Set();
const allRows = [];

for (let r = 1; r < rows.length; r++) {
  const row = rows[r];
  if (row.length < header.length) continue;
  const id = row[idx.id];
  const ref = row[idx.syllabus_ref];
  const img = (row[idx.image_filename] || '').trim();
  const ver = (row[idx.verified] || '').trim();
  const prompt = row[idx.prompt_en] || '';
  if (ver in counts) counts[ver]++; else counts.other++;
  if (img) usedImages.add(img.replace(/^BTT\//, ''));

  const rec = {
    id, ref, ver, img,
    ca: row[idx.correct_answer], p: prompt,
    a: row[idx.choice_a_en], b: row[idx.choice_b_en], c: row[idx.choice_c_en],
    exp: row[idx.explanation_en],
  };
  allRows.push(rec);

  const isVisual = visualRe.test(prompt);
  if (ver === 'PENDING' && isVisual && !img) pendingVisual.push(rec);
}

if (arg === 'summary') {
  console.log('COUNTS', JSON.stringify(counts));
  console.log('rows with image:', usedImages.size);
  console.log('tight pending visual:', pendingVisual.length);
} else if (arg === 'pending') {
  for (const q of pendingVisual) {
    console.log(`\n${q.id} | ${q.ref} | CA=${q.ca}`);
    console.log('  P:', q.p);
    console.log('  A:', q.a, '| B:', q.b, '| C:', q.c);
    console.log('  EXP:', q.exp);
  }
  console.log('\n===TOTAL===', pendingVisual.length);
} else if (arg === 'done') {
  for (const q of allRows) {
    if (q.ver !== 'PENDING') console.log(`${q.id} | ${q.ver} | img=${q.img} | CA=${q.ca} | ${q.p.slice(0,60)}`);
  }
} else if (arg === 'images') {
  // report used images
  console.log([...usedImages].sort().join('\n'));
} else if (arg === 'allpending') {
  // Every PENDING row (visual or not) with full bilingual detail.
  let n = 0;
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (row.length < header.length) continue;
    if ((row[idx.verified] || '').trim() !== 'PENDING') continue;
    n++;
    console.log(`\n${row[idx.id]} | ${row[idx.syllabus_ref]} | CA=${row[idx.correct_answer]} | img=${(row[idx.image_filename]||'').trim()}`);
    console.log('  P_en:', row[idx.prompt_en]);
    console.log('  P_my:', row[idx.prompt_my]);
    console.log('  A_en:', row[idx.choice_a_en], '| B_en:', row[idx.choice_b_en], '| C_en:', row[idx.choice_c_en]);
    console.log('  A_my:', row[idx.choice_a_my], '| B_my:', row[idx.choice_b_my], '| C_my:', row[idx.choice_c_my]);
    console.log('  EXP_en:', row[idx.explanation_en]);
    console.log('  EXP_my:', row[idx.explanation_my]);
  }
  console.log('\n===TOTAL PENDING===', n);
}
