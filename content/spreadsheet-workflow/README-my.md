# Spreadsheet Workflow — Excel / Google Sheets လုပ်ငန်းစဉ်

မေးခွန်း၊ အဖြေ၊ ပုံကို **လက်ဖြင့် စစ်ဆေးပြီး** Excel သို့မဟုတ် Google Sheets တွင် ပြင်ဆင်ကာ project ထဲ ပြန်သိမ်းရန် workflow ဖြစ်သည်။

---

## အဆင့်လိုက် လုပ်ပါ

### အဆင့် ၁ — CSV ထုတ်မည်

```bash
cd web
node scripts/spreadsheet-export.mjs
```

ထုံထားသည့်နေရာ: `content/spreadsheet-workflow/sheets/`

| ဖိုင် | မေးခွန်း |
|------|---------|
| `sg_btt.csv` | BTT ၅၆၅ |
| `sg_ftt.csv` | FTT ၅၁၆ |
| `sg_rtt.csv` | RTT ၁၀၉ |
| `jp_car.csv` | Japan car ၃၅၀ |
| `jp_moto.csv` | Japan moto ၂၅၀ |

---

### အဆင့် ၂ — Excel / Google Sheets တွင် ပြင်မည်

**Google Sheets**
1. Sheets အသစ် → File → Import → Upload CSV
2. စာကြောင်း၊ အဖြေ၊ `image_filename` စသည်ကို စစ်ဆားပြင်
3. အဆုံးတွင် Download → CSV UTF-8
4. `sheets/` အောက်သို့ အမည်မပြောင်း save

**Excel (Mac/Windows)**
1. `.csv` ဖိုင်ကို နှစ်ချက်နှိပ်ပြီး ဖွင့်ပါ
2. Myanmar စာသား မြင်ရသင့်သည် (UTF-8 BOM ပါသည်)
3. Save As → **CSV UTF-8**

---

### အဆင့် ၃ — `verified` ကော်လံ

| တန်ဖိုး | အဓိပ္ပာယ် |
|--------|----------|
| `PENDING` | မစစ်ဆေးရသေး — import မှာ **မသွင်းပါ** |
| `OK` | မှန်ကန်ပြီ — JSON ထဲ **သွင်းမည်** |
| `FIX` | ပြင်ဆင်ပြီး — JSON ထဲ **သွ်းမည်** |

စစ်ဆေးပြီးမှသာ `OK` သို့မဟုတ် `FIX` ထားပါ။

---

### အဆင့် ၄ — ပုံထည့်ခြင်း

1. PNG ဖိုင်ကို ဒီဖိုလ်ဒါထဲ ထည့်ပါ:
   - Singapore → `images/sg/` (ဥပမာ `stop.png`)
   - Japan → `images/jp/` (ဥပမာ `jp-stop.png`)
2. Sheet တွင် `image_filename` ကော်လံတွင် ဖိုင်အမည် ရိုက်ပါ (`stop.png`)
3. Import လုပ်သောအခါ script သည် ပုံကို `public/signs/sg/` သို့ **အလိုအလျောက် copy** လုပ်ပြီး `media_src` ချိတ်ပေးသည်

---

### အဆင့် ၅ — JSON ထဲ ပြန်သွင်းမည်

```bash
node scripts/spreadsheet-import.mjs
```

နမူနာ — BTT သာ:
```bash
node scripts/spreadsheet-import.mjs --bank sg_btt
```

စမ်းကြည့်ရန် (JSON မပြင်သေး):
```bash
node scripts/spreadsheet-import.mjs --dry-run
```

---

## SG Sheet ကော်လံများ (အရေးကြီး)

| ကော်လံ | မှတ်ချက် |
|-------|----------|
| `correct_answer` | `A` / `B` / `C` |
| `image_filename` | `stop.png` စသည်ဖြင့်သာ |
| `prompt_en` / `prompt_my` | မေးခွန်းစာသား |
| `reviewer_notes` | Developer မှတ်ချက် (import မလုပ်၊ မှတ်သားရုံသာ) |

## JP Sheet ကော်လံများ

| ကော်လံ | မှတ်ချက် |
|-------|----------|
| `is_hazard` | `Y` = အန္တရာယ်ခန့်မှန်းမေးခွန်း (၃ ပိုင်း) |
| `correct_answer` | `A` = 正しい, `B` = 誤り |
| `hazard_p1_answer` … | `T` သို့မဟုတ် `F` |

---

## ဖိုလ်ဒါ ပုံမြင်

```
spreadsheet-workflow/
├── INDEX.csv
├── sheets/          ← Excel/Sheets မှ ပြန်သိမ်းရမည့်နေရာ
├── images/
│   ├── sg/          ← SG ပုံအသစ် ထည့်ရန်
│   └── jp/          ← Japan ပုံအသစ် ထည့်ရန်
├── README.md
└── README-my.md     ← ဤဖိုင်
```

---

## သတိပေးချက်

- Official exam မေးခွန်း **စာသားကို မကူးပါ** — စာသားပြင်ဆင်သည်ဖြင့် Method A (ကိုယ်ပိုင် paraphrase) ကို လိုက်နာပါ
- Import ပြီးနောက် `npm run build` သို့မဟုတ် `node scripts/verify-and-export.mjs` ဖြင့် စစ်ဆေးနိုင်သည်
