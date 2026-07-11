import fs from 'node:fs';

// Applies review decisions to sg_btt.csv IN PLACE, editing ONLY targeted rows.
// Untouched rows are preserved byte-for-byte (raw source span).
// Decisions JSON shape: { "<id>": { verified?: "OK"|"FIX"|"REMOVE", notes?: string, set?: { <col>: <value> } }, ... }

const CSV_PATH = 'content/spreadsheet-workflow/sheets/sg_btt.csv';
const decPath = process.argv[2];
if (!decPath) { console.error('usage: node scripts/_tmp_apply.mjs <decisions.json>'); process.exit(1); }
const decisions = JSON.parse(fs.readFileSync(decPath, 'utf8'));

const text = fs.readFileSync(CSV_PATH, 'utf8');

// Parse CSV into records, tracking raw start/end offsets of each record (row incl. trailing newline).
function parseWithSpans(t) {
  const records = [];
  let fields = [];
  let field = '';
  let inQuotes = false;
  let recStart = 0;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (inQuotes) {
      if (c === '"') {
        if (t[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { fields.push(field); field = ''; }
      else if (c === '\n') {
        fields.push(field);
        records.push({ fields, start: recStart, end: i + 1 });
        fields = []; field = '';
        recStart = i + 1;
      } else if (c === '\r') { /* skip, keep in raw */ }
      else field += c;
    }
  }
  if (field.length > 0 || fields.length > 0) {
    fields.push(field);
    records.push({ fields, start: recStart, end: t.length });
  }
  return records;
}

function quote(v) {
  v = v == null ? '' : String(v);
  if (/[",\n\r]/.test(v)) return '"' + v.replace(/"/g, '""') + '"';
  return v;
}

const records = parseWithSpans(text);
const header = records[0].fields.map((h) => h.replace(/^\ufeff/, ''));
const idx = Object.fromEntries(header.map((h, i) => [h, i]));

let changed = 0;
const out = [];
// header raw preserved
out.push(text.slice(records[0].start, records[0].end));

for (let r = 1; r < records.length; r++) {
  const rec = records[r];
  const raw = text.slice(rec.start, rec.end);
  const id = rec.fields[idx.id];
  const d = decisions[id];
  if (!d) { out.push(raw); continue; }
  const f = rec.fields.slice();
  if (d.set) {
    for (const [col, val] of Object.entries(d.set)) {
      if (!(col in idx)) { console.error('unknown col', col); process.exit(1); }
      f[idx[col]] = val;
    }
  }
  if (d.verified) f[idx.verified] = d.verified;
  if (d.notes != null) f[idx.reviewer_notes] = d.notes;
  const hasCRLF = raw.includes('\r\n');
  const eol = raw.endsWith('\n') ? (hasCRLF ? '\r\n' : '\n') : '';
  out.push(f.map(quote).join(',') + eol);
  changed++;
}

fs.writeFileSync(CSV_PATH, out.join(''));
console.log('applied changes to', changed, 'rows');
