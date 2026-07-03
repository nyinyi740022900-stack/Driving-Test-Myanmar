# နည်းလမ်း A — လုပ်ဆောင်ချက် အခြေအနေ

## ဘာလုပ်ထားပြီးလဲ

1. **Syllabus mapping** — Traffic Police handbook အပိုင်းများကို paraphrase ခေါင်းစဉ်များဖြင့် `content/syllabus/sg-btt.json` နှင့် `sg-ftt.json` တွင် မှတ်တမ်းတင်ထားသည်။
2. **Tagging** — BTT ၅၅၅ + FTT ၅၀၄ မေးခွန်းအားလုံးကို `syllabusRef` ဖြင့် handbook section နှင့် ချိတ်ဆက်ထားသည်။
3. **Gap analysis** — `node scripts/sg-method-a.mjs gap` ဖြင့် လိုအပ်သော အပိုင်း စာရင်းထုတ်နိုင်သည်။
4. **ကိုယ်ပိုင်မေးခွန်း ၅၉ ခု** — official စာသား မကူးဘဲ scenario-based မေးခွန်းများ ထပ်ထည့်ပြီး (`sg_btt_0501`–`0555`, `sg_ftt_0501`–`0504`)။
   - ယခင် မေးခွန်း **၀ ခု** ရှိသော section များ (roundabout, lights, school zone, yellow box, emergency vehicles, tunnel, u-turn, silver zone, work zone, fog) ကို ဦးစားပေး ဖြည့်ထားသည်။

## ဥပဒေလိုက်နာမှု (နည်းလမ်း A)

| ✅ လုပ်ထားသည် | ❌ မလုပ်ပါ |
|-------------|----------|
| Handbook မှ **အချက်အလက်** ကိုးကားပြီး ကိုယ်ပိုင် စာကြောင်း ရေးခြင်း | form.gov.sg / PDF မေးခွန်း **အတိအကျ copy** |
| Syllabus coverage စစ်ဆေးခြင်း | TP/LTA ပုံ screenshot တိုက်ရိုက်သုံးခြင်း |
| App footer တွင် independent tool ဟု ဖော်ပြခြင်း | Official exam ဟု အမည်တပ်ခြင်း |

## ကျန်ရှိသော gap (အဆင့် ၂)

**BTT** — section ၅ ခု အနည်းငယ် လိုနေသေးသည် (give way, licence basics, police signals, overtaking, defensive driving)။

**FTT** — section ၆ ခု လိုနေသေးသည် (roundabout advanced, emergency stop, behaviour, alcohol, slopes, motorcyclists)။

## ပုံများ

- လက်ရှိ `/signs/sg/` ရှိ generic illustration များကို သုံးထားသည်။
- သင် ပေးမည့် **image folder** ရောက်လျှင် question ID နှင့် sign ပုံကို တစ်ချက်တည်း map လုပ်မည်။

## အသုံးပြုနည်း

```bash
cd web
node scripts/sg-method-a.mjs tag      # syllabusRef ပြန် tag
node scripts/sg-method-a.mjs gap      # gap report
node scripts/sg-method-a-merge-gap-fill.mjs  # gap-fill JSON ကို bank ထဲ merge
node scripts/audit-sg-questions.mjs   # quality audit
```

## နောက်တစ်ဆင့်

သင် confirm ပေးပါက —
- အဆင့် ၂ gap-fill (FTT + BTT ကျန်အပိုင်း)
- သင် ပေးသော sign image folder နှင့် mapping
- deploy to live site
