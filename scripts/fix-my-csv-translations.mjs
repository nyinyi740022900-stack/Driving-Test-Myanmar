#!/usr/bin/env node
/**
 * Fix verified Myanmar translation errors in spreadsheet CSV sheets.
 * Usage: node scripts/fix-my-csv-translations.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHEETS_DIR = path.join(__dirname, '../content/spreadsheet-workflow/sheets');

/** file -> id -> field -> corrected Myanmar text */
const FIXES = {
  'sg_btt.csv': {
    sg_btt_0289: { choice_c_my: 'နက်ထရယ်' },
    sg_btt_0290: { choice_c_my: 'နက်ထရယ်' },
    sg_btt_0346: {
      choice_a_my:
        'ဘီးနှင့် လမ်းကြားတွင် ရေအလွှာပါးလွှာတစ်ထပ် ဖြစ်ပေါ်ကာ ကိုင်တွယ်မှု/ဘရိတ်မှု ဆုံးခြင်း — စိုရွှဲသော လမ်းတွင် အရှိန်မြင့်မားစဉ် ဖြစ်ပွားသည်',
    },
    sg_btt_0377: {
      prompt_my:
        'မည်သည့် နေရာ တွင် မည်သည့် အချိန်မျှ ရပ်နားခြင်း နှင့် ရပ်ခြင်း နှစ်မျိုးလုံး မရသလဲ?',
    },
  },
  'sg_ftt.csv': {
    sg_ftt_0164: {
      choice_b_my: 'ညွှန်ပြခြင်း၊ ဆွဲထားခြင်း၊ မောင်းနှင်ခြင်း၊ ထွက်ခြင်း',
    },
    sg_ftt_0167: {
      choice_c_my: 'အီလက်ထရွန်နစ် တည်ငြိမ်မှု ထိန်းချုပ်မှု (ESC)',
    },
    sg_ftt_0177: {
      explanation_my:
        'Aquaplaning: ဘီး အောက် ရေ ပေ့ ဆောက်တည်ပြီး ၎င်းတို့ကို မျက်နှာပြင်မှ မြှောက်သည်။ သတိပေးချက်: ပေါ့ပါးသော၊ မျောဝဲသော ကားလမ်းညွှန်ခြင်း။ ဖြစ်ပါက: အရှိန် ဖိနပ်ဖြည်းချင်း ဖယ်ရှား၊ ကားလမ်းညွှန်ကို တည့်တည့် ကိုင်ထား၊ ဘရိတ် မကြမ်းကြမ်း ဆွဲမပါနှင့်။',
    },
    sg_ftt_0203: {
      choice_c_my: 'ဒဏ်ရာ ရသော သူ ကို ထောင်လိုက်ရပ်ထားခြင်း',
    },
    sg_ftt_0244: {
      choice_b_my: 'အရေးပေါ် တုံ့ပြန်မှု လုပ်ငန်းစဉ်',
    },
    sg_ftt_0316: {
      explanation_my:
        "၂ စက္ကန့် စည်းမျဉ်း: ရှေ့ ယာဉ် သတ်မှတ် နေရာ (တံတား၊ ဆိုင်းဘုတ်) ဖြတ်ကျော်သောအခါ 'တစ်နှစ် နင် တစ်၊ တစ်နှစ် နင် နှစ်ခု' လို ရေပါ — သင် ထို နေရာ ၌ ကျန် သင့်သည် သို့မဟုတ် ပိုဝေးသင့်သည်။ မိုးရာသီ: ၄ စက္ကန့်။",
    },
    sg_ftt_0418: {
      prompt_my:
        'သင့်ကား၏ အခိုးထွက်ပေါက်မှ အပြာ သို့မဟုတ် အဖြူ ငွေ့ကြောင်း အကြာကြာ ထွက်နေသောအခါ မည်သည်ကို ဆိုလိုသလဲ?',
    },
    sg_ftt_0480: {
      explanation_my:
        "တစ်ဦးဦး ဒဏ်ရာရသော မတော်တဆမှုနေရာမှ အချက်အလက်မပေးဘဲ ထွက်ခွာခြင်းသည် ('ထွက်ပြေးမှု') စင်္ကာပူတွင် ပြင်းထန်သြစ်မှုဖြစ်ပြီး ထောင်ဒဏ်အပါအဝင် ပြင်းထန်သောဒဏ် ချမှတ်ခြင်းခံရနိုင်သည်။",
    },
  },
  'jp_car.csv': {
    jp_car_0157: {
      explanation_my:
        'အရှိန်လျှော့ (徐行) ဆိုသည်မှာ ချက်ချင်းရပ်နိုင်သော အရှိန်ဖြင့် မောင်းနှင်ခြင်းကို ဆိုလိုပြီး ဆိုင်းဘုတ်ရှိသောနေရာတွင် ထိုအရှိန်အထိ လျှော့ချရန် တာဝန်ရှိသည်။',
    },
  },
};

function readRaw(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeRaw(filePath, text) {
  fs.writeFileSync(filePath, text, 'utf8');
}

function escapeCsv(value) {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function updateCsv(filePath, fixesById) {
  const raw = readRaw(filePath).replace(/^\uFEFF/, '');
  const lines = raw.split(/\r?\n/);
  if (!lines.length) return 0;

  const headers = lines[0].split(',');
  const idIndex = headers.indexOf('id');
  if (idIndex === -1) throw new Error(`No id column in ${filePath}`);

  let changed = 0;
  const out = [lines[0]];

  for (let li = 1; li < lines.length; li++) {
    const line = lines[li];
    if (!line.trim()) continue;

    const row = parseRow(line);
    const id = row[idIndex];
    const patch = fixesById[id];
    if (patch) {
      for (const [field, value] of Object.entries(patch)) {
        const idx = headers.indexOf(field);
        if (idx === -1) throw new Error(`Missing ${field} in ${filePath}`);
        if (row[idx] !== value) {
          row[idx] = value;
          changed++;
        }
      }
      const verifiedIdx = headers.indexOf('verified');
      if (verifiedIdx !== -1 && row[verifiedIdx] !== 'FIX') {
        row[verifiedIdx] = 'FIX';
        changed++;
      }
    }
    out.push(row.map(escapeCsv).join(','));
  }

  const bom = '\uFEFF';
  writeRaw(filePath, bom + out.join('\n') + (out.length > 1 ? '\n' : ''));
  return changed;
}

function parseRow(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

let total = 0;
for (const [file, fixes] of Object.entries(FIXES)) {
  const filePath = path.join(SHEETS_DIR, file);
  const n = updateCsv(filePath, fixes);
  console.log(`${file}: ${n} field(s) updated`);
  total += n;
}
console.log(`Done. ${total} corrections applied.`);
