import fs from 'node:fs';

const csv = fs.readFileSync('content/spreadsheet-workflow/sheets/sg_btt.csv', 'utf8');

// Minimal RFC-4180 CSV parser
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
let header = rows[0];
header = header.map((h) => h.replace(/^\ufeff/, ''));
const idx = Object.fromEntries(header.map((h, i) => [h, i]));

const arg = process.argv[2] || '';

// Keywords that indicate a question is asking to identify/interpret a specific
// visual sign, marking, traffic light, or signal (image-based candidate).
const visualRe = /(this sign|a sign showing|sign shows|a blue circ|red circ|red-bordered|red border|triangular (warning )?sign|inside a triangle|inside a red|white arrow|blue rectangular|blue square|rectangular blue|circular sign|circular red|red triangular|symbol|silhouette|arrow pointing|arrows|'P'|zig-?zag|yellow line|white line|double yellow|double white|broken (white|line)|dashed|chevron|zebra crossing markings|box junction|give-way line|road marking|diamond|octagonal)/i;

const out = [];
for (let r = 1; r < rows.length; r++) {
  const row = rows[r];
  if (row.length < header.length) continue;
  const id = row[idx.id];
  const ref = row[idx.syllabus_ref];
  const img = row[idx.image_filename];
  const ver = row[idx.verified];
  const prompt = row[idx.prompt_en] || '';
  if (arg === 'signs' && !ref.startsWith('btt.signs')) continue;
  if (arg === 'unmatched' && img.trim() !== '') continue;
  if (arg === 'visual') {
    const isVisual = visualRe.test(prompt) || visualRe.test(row[idx.choice_a_en] || '');
    if (!isVisual) continue;
  }
  out.push([
    id,
    ref,
    'CA=' + row[idx.correct_answer],
    'IMG=' + img,
    'V=' + ver,
    '\n  P: ' + row[idx.prompt_en],
    '\n  A: ' + row[idx.choice_a_en],
    '\n  B: ' + row[idx.choice_b_en],
    '\n  C: ' + row[idx.choice_c_en],
  ].join(' | '));
}
console.log(out.join('\n----\n'));
console.log('\n===TOTAL===', out.length);
