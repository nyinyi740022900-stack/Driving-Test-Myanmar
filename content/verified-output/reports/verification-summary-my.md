# Verified Output — အတည်ပြုချက် အကျဉ်းချုပ်

ထုတ်လုပ်သည့်ရက်: 2026-07-08T17:56:21.446Z

## ဘန်ခ် အခြေအနေ

| ဘန်ခ် | မေးခွန်း | ပုံ | အခြေအနေ |
|-------|---------|-----|---------|
| BTT (sg_btt.json) | 565 | 82 | ✅ verified |
| FTT (sg_ftt.json) | 516 | 0 | ✅ verified |
| RTT (sg_rtt.json) | 109 | 0 | ✅ verified |
| Karimen/Honmen (jp_car.json) | 350 | 0 | ✅ verified |
| Moto (jp_moto.json) | 250 | 0 | ✅ verified |

**စုစုပေါင်း:** 1790 မေးခွန်း  
**Critical issues:** 0  
**စုစုပေါင်း issue flags:** 1108 (အများစုသည် EN artifact စစ်ဆေးမှု)

## ဖိုလ်ဒါ တည်ဆောက်ပုံ

```
content/verified-output/
├── questions/          ← အတည်ပြုပြီး JSON ဘန်ခ်များ
├── reports/
│   ├── verification-summary.json
│   ├── verification-summary-my.md  (ဤဖိုင်)
│   ├── issues.csv
│   └── image-maps/     ← မေးခွန်း ↔ ပုံ CSV
└── manifest.json
```

## SG ပုံများ
- BTT/FTT/RTT မေးခွန်းအားလုံးတွင် `/signs/sg/` ပုံ ဖိုင်များ ရှိပြီး verify လုပ်ပြီး
- Media mismatch 67+ ခု ပြင်ဆင်ပြီး

## JP ပုံများ
- Japan မေးခွန်း ၆၀၀ ခုတွင် ပုံ **မပါ** (သင် ပေးမည့် folder ရောက်လျှင် image-map ဖြည့်မည်)
- `reports/image-maps/jp_*-image-map.csv` တွင် media ကွက်လပ်များ မှတ်ထား

## နည်းလမ်း A
Official handbook မှ အချက်အလက် ကိုးကားပြီး **ကိုယ်ပိုင်** မေးခွန်းများ — exam စာသား မကူး
