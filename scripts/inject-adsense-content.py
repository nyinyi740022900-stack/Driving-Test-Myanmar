#!/usr/bin/env python3
"""Inject AdSense content keys into en/my/ja message files without dropping existing strings."""
import json
from pathlib import Path

ROOT = Path("/Users/nyinyi/Desktop/Driving Test Webapp/web/messages")

ARTICLES = {
    "resourcesSigns": {
        "en": {
            "meta_title": "Singapore & Japan Road Signs Library — Meanings and What To Do",
            "meta_description": "Free illustrated road signs library for Singapore BTT/FTT/RTT and Japan written tests. Each sign shows the picture, the meaning, and the action you must take — in English, Myanmar, and Japanese.",
            "article": {
                "title": "How to study signs so they stick on test day",
                "paragraphs": [
                    "Most theory-test mistakes are not about obscure rules. They are about mixing up two signs that look similar when you are tired. A red circle with a slash is a prohibition. A blue circle is a mandatory instruction. A red inverted triangle means give way. If you only remember those three families, you already avoid a large share of wrong answers.",
                    "Singapore learners sitting BTT should treat signs as actions, not names. When you see a school-zone sign, the exam is asking whether you slow to 40 km/h on school days, not whether you can spell the sign. Japan written tests do the same: 止まれ means a complete stop at the line, not a rolling pause.",
                    "Use this library with lesson mode. Look at the picture first, say the action out loud in your own language, then answer the practice question. Myanmar workers who study this way usually remember the rule in the test room even if the English wording feels unfamiliar.",
                    "TheoryLane drawings are original study illustrations. They are not copied from official exam papers. Always confirm the latest rules with Singapore Traffic Police or Japan’s National Police Agency before you book.",
                ],
            },
        },
        "my": {
            "meta_title": "စင်္ကာပူ နှင့် ဂျပန် လမ်းဆိုင်းဘုတ် စာကြည့်တိုက် — အဓိပ္ပာယ်နှင့် လုပ်ရမည့်အရာ",
            "meta_description": "Singapore BTT/FTT/RTT နှင့် ဂျပန် စာမေးပွဲအတွက် ပုံပါ လမ်းဆိုင်းဘုတ် စာကြည့်တိုက်။ ဆိုင်းတိုင်းတွင် ပုံ၊ အဓိပ္ပာယ်နှင့် သင်လုပ်ရမည့်အရာ ပါသည်။",
            "article": {
                "title": "စာမေးပွဲနေ့တွင် မမေ့အောင် ဆိုင်းဘုတ် လေ့လာနည်း",
                "paragraphs": [
                    "Theory test မှားတဲ့ အချက်အများစုက ရှုပ်ထွေးတဲ့ စည်းမျဉ်း မဟုတ်ပါ။ ပင်ပန်းနေချိန်မှာ ဆင်တူဆိုင်း နှစ်ခုကို ရောပြီး မှားတာပါ။ အနီရောင် စက်ဝိုင်း မျဉ်းဖြတ်က တားမြစ်ချက်။ အပြာရောင် စက်ဝိုင်းက လုပ်ရမည့် ညွှန်ကြားချက်။ ပြောင်းပြန် တြိဂံက လမ်းပေးရမည်။ ဒီမိသားစု သုံးခုကို မှတ်ထားရင် မှားနိုင်တဲ့ မေးခွန်း အများကြီးကို ရှောင်နိုင်ပါတယ်။",
                    "စင်္ကာပူ BTT အတွက် ဆိုင်းကို နာမည်မဟုတ်ဘဲ လုပ်ရမည့်အရာအဖြစ် မှတ်ပါ။ ကျောင်းဇုန်ဆိုင်းမြင်ရင် ကျောင်းနေ့တွင် ၄၀ km/h ထိ နှေးရမလားဆိုတာကို မေးတာပါ။ ဂျပန် စာမေးပွဲတွင် 止まれ ဆိုသည်မှာ မျဉ်းတွင် လုံးဝရပ်ရမည် — ဖြည်းဖြည်းသွားရုံ မဟုတ်ပါ။",
                    "ဤစာကြည့်တိုက်ကို သင်ခန်းစာ မုဒ်နှင့် တွဲသုံးပါ။ ပုံကို အရင်ကြည့်ပါ။ ကိုယ့်ဘာသာစကားဖြင့် လုပ်ရမည့်အရာကို ကျယ်ကျယ်ပြောပါ။ ပြီးမှ လေ့ကျင့်မေးခွန်း ဖြေပါ။ မြန်မာအလုပ်သမားများ ဒီနည်းဖြင့် လေ့လာသောအခါ စာမေးပွဲခန်းတွင် အင်္ဂလိပ်စာလုံး မရင်းနှီးသည့်တိုင် စည်းမျဉ်းကို သတိရတတ်ပါတယ်။",
                    "TheoryLane ပုံများသည် မူရင်း လေ့လာရေး ပုံများဖြစ်သည်။ တရားဝင် စာမေးပွဲမှ ကူးယူထားခြင်း မဟုတ်ပါ။ ဘွတ်ကင်မလုပ်မီ စင်္ကာပူ Traffic Police သို့မဟုတ် ဂျပန် ရဲတပ်ဖွဲ့ စည်းမျဉ်း နောက်ဆုံးအချက်ကို အတည်ပြုပါ။",
                ],
            },
        },
        "ja": {
            "meta_title": "シンガポール・日本の道路標識ライブラリ — 意味と取るべき行動",
            "meta_description": "シンガポールBTT/FTT/RTTと日本の学科試験向けの図解標識ライブラリ。各標識に絵・意味・取るべき行動を掲載。",
            "article": {
                "title": "試験当日に忘れない標識の覚え方",
                "paragraphs": [
                    "学科試験のミスの多くは珍しい規則ではなく、似た標識の取り違えです。赤丸に斜線は禁止、青丸は指示、逆三角形は譲れです。この3系統を覚えれば、かなりの失点を防げます。",
                    "シンガポールのBTTでは、標識の名前より「何をするか」が問われます。スクールゾーンなら、登校日に40km/hまで落とすかどうかです。日本の止まれは、停止線の手前で完全停止であり、徐行ではありません。",
                    "このライブラリをレッスンモードと一緒に使ってください。先に絵を見て、自分の言葉で行動を言い、それから問題に答える。英語の表現が慣れなくても、試験室で規則を思い出せます。",
                    "TheoryLaneの図はオリジナルの学習用イラストです。公式問題の複製ではありません。予約前に、シンガポール交通警察または日本の警察庁の最新ルールを確認してください。",
                ],
            },
        },
    },
    "resourcesGuide": {
        "en": {
            "meta_title": "Driving Theory Study Guide — Speed Limits, Demerit Points, Stopping Distances",
            "meta_description": "Key facts for Singapore BTT/FTT/RTT and Japan written tests: speed limits, alcohol limits, demerit points, stopping distances and right-of-way, written for Myanmar learners.",
            "article": {
                "title": "What this guide is for",
                "paragraphs": [
                    "This page is a revision sheet, not a replacement for the official handbook. We gathered the numbers that come up again and again in practice: urban speed limits, school zones, drink-drive limits, and how many demerit points suspend a new licence.",
                    "If you are a Myanmar worker in Singapore, start with the Singapore block. Built-up roads default to 50 km/h unless a sign says otherwise. Expressways are typically 90 km/h. School zones drop to 40 km/h on school days. Mixing these three is one of the most common BTT errors we see in lesson mode.",
                    "If you are preparing for Japan’s written test, the Japan block lists 法定速度 and 点数 in the same layout so you can compare. Do not memorise Singapore numbers for a Japan exam — the systems are different.",
                    "After you read a section, open the matching lesson set and answer ten questions immediately. Reading without answering does not stick. TheoryLane explanations are original wording for learners; confirm fees and legal limits with the authority before you book.",
                ],
            },
        },
        "my": {
            "meta_title": "ယာဉ်မောင်း သီအိုရီ လေ့လာလမ်းညွှန် — အမြန်နှုန်း၊ ဒီမရစ်ပွိုင့်၊ ရပ်တန့်အကွာအဝေး",
            "meta_description": "Singapore BTT/FTT/RTT နှင့် ဂျပန် စာမေးပွဲအတွက် အဓိက အချက်များ — အမြန်နှုန်း၊ အရက်ကန့်သတ်၊ ဒီမရစ်ပွိုင့်နှင့် လမ်းပေးစည်းမျဉ်း။ မြန်မာ သင်ယူသူများအတွက် ရေးထားသည်။",
            "article": {
                "title": "ဤလမ်းညွှန်ကို ဘယ်လိုသုံးမလဲ",
                "paragraphs": [
                    "ဤစာမျက်နှာသည် ပြန်လည်ကျက်မှတ်ရန် စာရွက်ဖြစ်သည်။ တရားဝင် handbook ကို အစားထိုးခြင်း မဟုတ်ပါ။ လေ့ကျင့်မေးခွန်းတွင် မကြာခဏ ပေါ်တဲ့ ဂဏန်းများကို စုထားသည် — မြို့တွင်း အမြန်နှုန်း၊ ကျောင်းဇုန်၊ အရက်ကန့်သတ်၊ လိုင်စင် ရပ်ဆိုင်းမည့် ပွိုင့်။",
                    "စင်္ကာပူတွင် အလုပ်လုပ်နေသော မြန်မာများ စင်္ကာပူ အပိုင်းမှ စပါ။ ဆိုင်းမရှိလျှင် မြို့တွင်း ၅၀ km/h။ အမြန်လမ်း များသောအားဖြင့် ၉၀ km/h။ ကျောင်းဇုန် ကျောင်းနေ့တွင် ၄၀ km/h။ ဒီသုံးခု ရောမှားခြင်းက BTT တွင် အများဆုံး တွေ့ရသော အမှားပါ။",
                    "ဂျပန် စာမေးပွဲ ပြင်ဆင်နေလျှင် ဂျပန် အပိုင်းတွင် 法定速度 နှင့် 点数 ကို တူညီသော ပုံစံဖြင့် ပြထားသည်။ စင်္ကာပူ ဂဏန်းကို ဂျပန် စာမေးပွဲအတွက် မမှတ်ပါနှင့် — စနစ် မတူပါ။",
                    "အပိုင်းတစ်ခု ဖတ်ပြီးသည်နှင့် သက်ဆိုင်ရာ သင်ခန်းစာဖွင့်ပြီး မေးခွန်း ဆယ်ခု ချက်ချင်း ဖြေပါ။ ဖတ်ရုံဖြင့် မမှတ်မိပါ။ TheoryLane ရှင်းလင်းချက်များသည် သင်ယူသူအတွက် မူရင်း စာသားဖြစ်သည်။ ဘွတ်ကင်မလုပ်မီ တရားဝင် ကုန်ကျစရိတ်နှင့် ကန့်သတ်ချက်ကို အတည်ပြုပါ။",
                ],
            },
        },
        "ja": {
            "meta_title": "学科試験スタディガイド — 速度、点数、停止距離",
            "meta_description": "シンガポールBTT/FTT/RTTと日本の学科試験の要点。制限速度、酒気帯び、点数、停止距離、優先関係を学習者向けに整理。",
            "article": {
                "title": "このガイドの使い方",
                "paragraphs": [
                    "このページは復習シートです。公式ハンドブックの代わりではありません。練習で繰り返し出る数字 — 市街地の制限速度、スクールゾーン、酒気帯び基準、新規免許の停止点数 — をまとめています。",
                    "シンガポールで働く学習者は、まずシンガポール欄から。標識がなければ市街地は原則50km/h、高速道路はおおむね90km/h、登校日のスクールゾーンは40km/h。この3つを混ぜるのがBTTでよく見るミスです。",
                    "日本の学科試験なら、日本欄の法定速度と点数を同じレイアウトで比較できます。シンガポールの数字を日本試験用に覚え込まないでください。制度が違います。",
                    "読んだらすぐ対応するレッスンで10問解いてください。読むだけでは定着しません。TheoryLaneの説明は学習者向けのオリジナル文です。予約前に公式の料金と上限を確認してください。",
                ],
            },
        },
    },
    "experiences": {
        "en": {
            "meta_title": "How Myanmar Learners Pass Singapore & Japan Theory Tests",
            "meta_description": "Study habits that help Myanmar workers pass BTT, FTT, RTT and Japan written tests. Moderated member tips plus a practical revision plan from TheoryLane.",
            "back_home": "← Back to home",
            "article": {
                "title": "A revision plan that works on a night-shift schedule",
                "paragraphs": [
                    "Most of our learners are not full-time students. They finish a shift, eat, and have 25–40 minutes before sleep. That is enough if the session is specific. Do not open a random mock test when you are exhausted. Open one topic — mandatory signs, or school zones, or expressway rules — and finish a short lesson set.",
                    "A pattern that keeps showing up in passing stories: three short sessions a week in lesson mode, one timed practice on the rest day, and a mock test only when recent practice scores stay above 90%. Sitting a mock test every day without reviewing wrong answers trains you to repeat the same mistake.",
                    "Language matters. If English question wording feels heavy, switch the app to Myanmar, answer, then switch back to English for the last week before the booking. The official Singapore paper is in English. Japan’s paper is in Japanese. You need the idea in your language and the exam language in your eyes.",
                    "Member reviews below are checked by a person before they go public. They are not a substitute for official rules. Use them as morale and scheduling tips, then confirm booking steps with your driving centre or licence office.",
                ],
            },
        },
        "my": {
            "meta_title": "မြန်မာ သင်ယူသူများ Singapore နှင့် Japan Theory Test အောင်မြင်ပုံ",
            "meta_description": "BTT, FTT, RTT နှင့် ဂျပန် စာမေးပွဲ အောင်ရန် လေ့လာနည်း။ အဖွဲ့ဝင် အကြံပြုချက်များနှင့် TheoryLane ၏ လက်တွေ့ ပြန်လည်ကျက်မှတ် အစီအစဉ်။",
            "back_home": "← ပင်မသို့ ပြန်ရန်",
            "article": {
                "title": "ညဆိုင်း အချိန်ဇယားနှင့် ကိုက်သော ကျက်မှတ်နည်း",
                "paragraphs": [
                    "ကျွန်တော်တို့ သင်ယူသူ အများစုက ကျောင်းသား အချိန်ပြည့် မဟုတ်ပါ။ အလုပ်ဆင်း၊ ထမင်းစား၊ အိပ်ရန် ၂၅–၄၀ မိနစ်သာ ကျန်သည်။ အဲဒီအချိန်လည်း လုံလောက်ပါတယ် — တိကျစွာ သုံးရင်။ ပင်ပန်းနေချိန်တွင် mock test ကျပန်း မဖွင့်ပါနှင့်။ ဆိုင်းဘုတ်၊ ကျောင်းဇုန်၊ သို့မဟုတ် အမြန်လမ်း စည်းမျဉ်း စသည့် ခေါင်းစဉ် တစ်ခုသာ ယူပြီး သင်ခန်းစာ အတို ပြီးအောင် လုပ်ပါ။",
                    "အောင်မြင်သူများတွင် မကြာခဏ တွေ့ရသော ပုံစံ — တစ်ပတ်လျှင် သင်ခန်းစာ မုဒ် ၃ ကြိမ်၊ အနားယူနေ့တွင် အချိန်တွက် လေ့ကျင့် ၁ ကြိမ်၊ လတ်တလော ရမှတ် ၉၀% အထက် တည်ငြိမ်မှသာ mock test။ မှားသော မေးခွန်းကို ပြန်မကြည့်ဘဲ နေ့တိုင်း mock test ဖြေခြင်းက အမှားကို ထပ်လုပ်ရန် လေ့ကျင့်သလို ဖြစ်ပါတယ်။",
                    "ဘာသာစကား အရေးကြီးသည်။ အင်္ဂလိပ် မေးခွန်း ခက်နေလျှင် အက်ပ်ကို မြန်မာသို့ ပြောင်းပြီး ဖြေပါ။ ဘွတ်ကင်မတိုင်မီ နောက်ဆုံးတစ်ပတ်တွင် အင်္ဂလိပ်သို့ ပြန်ပြောင်းပါ။ စင်္ကာပူ တရားဝင် စာရွက်သည် အင်္ဂလိပ်။ ဂျပန် စာရွက်သည် ဂျပန်။ အဓိပ္ပာယ်ကို ကိုယ့်ဘာသာဖြင့် သိပြီး စာမေးပွဲဘာသာကို မျက်စိတွင် ရင်းနှီးအောင် လုပ်ရပါမယ်။",
                    "အောက်က အဖွဲ့ဝင် သုံးသပ်ချက်များကို လူက စစ်ဆေးပြီးမှ တင်သည်။ တရားဝင် စည်းမျဉ်း အစားထိုး မဟုတ်ပါ။ စိတ်ဓာတ်နှင့် အချိန်ဇယား အကြံအဖြစ် သုံးပြီး ဘွတ်ကင် အဆင့်များကို ယာဉ်မောင်းသင်တန်း သို့မဟုတ် လိုင်စင်ရုံးတွင် အတည်ပြုပါ။",
                ],
            },
        },
        "ja": {
            "meta_title": "ミャンマー人学習者がシンガポール・日本の学科試験に合格する勉強法",
            "meta_description": "BTT・FTT・RTTと日本の学科試験に合格するための勉強習慣。モデレーション済みの体験談とTheoryLaneの復習プラン。",
            "back_home": "← ホームへ戻る",
            "article": {
                "title": "夜勤でも続く復習プラン",
                "paragraphs": [
                    "学習者の多くは全日制の学生ではありません。シフト後、食事、就寝前に25〜40分。それで足ります。疲れたときにランダムな模試を開かないでください。規制標識、スクールゾーン、高速道路など、テーマを一つ決めて短いレッスンを終わらせる。",
                    "合格談に繰り返される型は、週3回のレッスン、休みの日に1回の時間制限練習、直近スコアが90%超で安定してから模試、です。間違えた問題を見直さずに毎日模試をすると、同じミスを練習することになります。",
                    "言語が重要です。英語が重い週はミャンマー語に切り、予約前の最終週は英語に戻す。シンガポール公式は英語、日本は日本語です。意味は自分の言語で、試験言語は目で慣らす。",
                    "下の体験談は公開前に人が確認します。公式ルールの代わりではありません。気持ちとスケジュールの参考にし、予約手順は教習所や免許センターで確認してください。",
                ],
            },
        },
    },
    "resourcesGlossary": {
        "en": {
            "meta_title": "Bilingual Traffic Glossary — English, Myanmar, Japanese",
            "meta_description": "Human-checked traffic terms in English, Myanmar and Japanese so a mistranslation does not cost a mark on BTT, FTT, RTT or Japan written tests.",
            "article": {
                "title": "Why a three-language glossary belongs next to the question bank",
                "paragraphs": [
                    "Exam questions often fail people on vocabulary, not on driving skill. “Give way”, “carriageway”, “diverge”, and “provisional licence” are everyday English in Singapore test papers. If you only know the Myanmar street word, you can still pick the wrong option.",
                    "We keep English, Myanmar and Japanese in one row so you can check a term in the language you think in, then look at the exam language. The translations are reviewed by a person. They are study aids, not a legal dictionary.",
                    "Use this page when a lesson explanation uses a word you do not know. Search with your eyes down the English column, read the Myanmar or Japanese cell, then go back to the question. That loop is faster than translating the whole paper with a phone camera in the test centre — which you cannot do anyway.",
                ],
            },
        },
        "my": {
            "meta_title": "သုံးဘာသာ ယာဉ်အသုံးအနှုန်း စာရင်း — အင်္ဂလိပ်၊ မြန်မာ၊ ဂျပန်",
            "meta_description": "BTT, FTT, RTT နှင့် ဂျပန် စာမေးပွဲတွင် ဘာသာပြန်မှား၍ အမှတ်မဆုံးရှုံးစေရန် လူက စစ်ထားသော ယာဉ်အသုံးအနှုန်းများ။",
            "article": {
                "title": "မေးခွန်းဘဏ်ဘေးတွင် ဘာသာစကား သုံးမျိုး လိုအပ်သော အကြောင်း",
                "paragraphs": [
                    "စာမေးပွဲတွင် မအောင်တာက ယာဉ်မောင်းကျွမ်းကျင်မှုမဟုတ်ဘဲ စကားလုံးကြောင့် ဖြစ်တတ်သည်။ Give way, carriageway, diverge, provisional licence တို့သည် စင်္ကာပူ စာရွက်တွင် ပုံမှန် အင်္ဂလိပ်ဖြစ်သည်။ လမ်းပေါ်သုံး မြန်မာစကားသာ သိလျှင် မှားသော ရွေးချယ်မှု ယူနိုင်သည်။",
                    "အင်္ဂလိပ်၊ မြန်မာ၊ ဂျပန်ကို တစ်တန်းတည်း ထားသောကြောင့် ကိုယ်တွေးသော ဘာသာဖြင့် စစ်ပြီး စာမေးပွဲဘာသာကို ကြည့်နိုင်သည်။ ဘာသာပြန်များကို လူက စစ်သည်။ ဥပဒေ အဘိဓာန် မဟုတ်ပါ။",
                    "သင်ခန်းစာ ရှင်းလင်းချက်တွင် မသိသော စကားလုံး ပေါ်လျှင် ဤစာမျက်နှာကို ဖွင့်ပါ။ အင်္ဂလိပ် ကော်လံမှ ရှာပါ။ မြန်မာ သို့မဟုတ် ဂျပန် အကွက်ကို ဖတ်ပါ။ ပြီးမှ မေးခွန်းသို့ ပြန်ပါ။ စာမေးပွဲခန်းတွင် ဖုန်းကင်မရာနှင့် စာရွက်တစ်ခုလုံး ဘာသာပြန်၍ မရပါ။",
                ],
            },
        },
        "ja": {
            "meta_title": "三言語の交通用語集 — 英語・ミャンマー語・日本語",
            "meta_description": "BTT/FTT/RTTと日本の学科試験で誤訳による失点を防ぐ、人が確認した交通用語。",
            "article": {
                "title": "問題集の横に三言語用語集が必要な理由",
                "paragraphs": [
                    "不合格の原因は運転技能ではなく語彙であることが多いです。Give way、carriageway、diverge、provisional licence はシンガポールの問題では日常語です。路上のミャンマー語だけ知っていると、誤選択肢を選ぶことがあります。",
                    "英語・ミャンマー語・日本語を一行に並べているので、考える言語で確認してから試験言語を見られます。訳は人が確認しています。法令辞書ではありません。",
                    "レッスン解説に知らない語が出たらこのページを開いてください。英語列を目で探し、ミャンマー語または日本語を読み、問題に戻る。試験会場で紙全体をカメラ翻訳することはできません。",
                ],
            },
        },
    },
}

SEO_EXTRA = {
    "en": {
        "btt": {
            "study_paragraphs": [
                "BTT is the gate to practical lessons at BBDC, CDC or SSDC. You cannot start those lessons until you pass. That is why we recommend finishing signs and markings first, then rules of the road, then a timed mock only when untimed practice is already above 90%.",
                "A practical week before booking: two evenings of lesson mode on signs, one evening on traffic rules, one short timed practice, then rest the night before the test. Cramming 200 questions at 1 a.m. after a shift raises panic more than scores.",
            ],
            "mistakes_title": "Mistakes we see most in BTT practice",
            "mistakes": [
                "Treating a Give Way triangle like a Stop sign — or the reverse",
                "Forgetting school-zone 40 km/h applies on school days, not every calendar day",
                "Assuming every expressway is 90 km/h even when a lower sign is shown",
                "Reading only the English option and skipping the picture",
            ],
            "featured_title": "Signs that appear early in BTT study",
            "featured_signs": [
                {"src": "/signs/sg/stop.png", "alt": "Singapore Stop sign", "caption": "Stop — full halt"},
                {"src": "/signs/sg/give-way.png", "alt": "Singapore Give Way sign", "caption": "Give way"},
                {"src": "/signs/sg/no-entry.png", "alt": "Singapore No Entry sign", "caption": "No entry"},
                {"src": "/signs/sg/school-zone.png", "alt": "Singapore School Zone sign", "caption": "School zone 40"},
            ],
        },
        "ftt": {
            "study_paragraphs": [
                "FTT is not a harder BTT. It assumes you have already been on the road in lessons. Questions lean into hazards, expressways, night driving and what a competent driver should notice before a situation becomes a crash.",
                "If you passed BTT months ago and then paused lessons, revise BTT signs for two sessions before FTT mocks. Centres still expect the 90% pass mark. Five practical lessons is the usual booking gate — confirm with your centre.",
            ],
            "mistakes_title": "Mistakes we see most in FTT practice",
            "mistakes": [
                "Answering from BTT memory without reading the hazard picture",
                "Missing expressway-specific rules such as lane discipline and breakdown procedures",
                "Booking FTT before five practical lessons and losing a test fee",
                "Ignoring night-driving and weather questions because they feel rare",
            ],
            "featured_title": "Visual cues used in advanced theory",
            "featured_signs": [
                {"src": "/signs/sg/traffic-signals-sign.png", "alt": "Traffic signals ahead sign", "caption": "Signals ahead"},
                {"src": "/signs/sg/pedestrian-crossing.png", "alt": "Pedestrian crossing sign", "caption": "Crossing ahead"},
                {"src": "/signs/sg/warning-sign.png", "alt": "General warning sign", "caption": "Hazard warning"},
                {"src": "/signs/sg/no-overtaking.png", "alt": "No overtaking sign", "caption": "No overtaking"},
            ],
        },
        "rtt": {
            "study_paragraphs": [
                "Motorcycle riders take RTT instead of FTT. You still pass BTT first. RTT keeps the same 50-question, 90% format but the situations are two-wheel: filtering, group riding, and being less visible to cars.",
                "If you already drive a car, do not skip RTT practice. Car habits (such as assuming other drivers see you) are a common source of wrong motorcycle answers. Sit a timed mock in RTT, not FTT, before you book.",
            ],
            "mistakes_title": "Mistakes we see most in RTT practice",
            "mistakes": [
                "Using FTT car logic for motorcycle visibility and braking distance",
                "Forgetting protective gear and passenger rules unique to Class 2B",
                "Treating filtering as always legal without reading the scenario",
                "Skipping BTT revision and losing easy sign marks on RTT day",
            ],
            "featured_title": "Signs and habits that matter on two wheels",
            "featured_signs": [
                {"src": "/signs/sg/stop.png", "alt": "Stop sign", "caption": "Stop — complete halt"},
                {"src": "/signs/sg/give-way.png", "alt": "Give Way sign", "caption": "Give way"},
                {"src": "/signs/sg/no-entry.png", "alt": "No Entry sign", "caption": "No entry"},
                {"src": "/signs/sg/mandatory-sign.png", "alt": "Mandatory direction sign", "caption": "Must follow arrow"},
            ],
        },
    },
    "my": {
        "btt": {
            "study_paragraphs": [
                "BTT သည် BBDC, CDC သို့မဟုတ် SSDC တွင် လက်တွေ့ သင်ခန်းစာ စရန် တံခါးဖြစ်သည်။ မအောင်မချင်း လက်တွေ့ မစနိုင်ပါ။ ထို့ကြောင့် ဆိုင်းနှင့် လမ်းမှတ်များကို အရင် ပြီးအောင် လုပ်ပါ။ လမ်းစည်းမျဉ်း ပြီးမှ၊ အချိန်မဲ့ လေ့ကျင့် ၉၀% အထက် ရမှသာ အချိန်တွက် mock test ဖြေပါ။",
                "ဘွတ်ကင်မတိုင်မီ တစ်ပတ် — ဆိုင်း သင်ခန်းစာ နှစ်ည၊ လမ်းစည်းမျဉ်း တစ်ည၊ အချိန်တွက် လေ့ကျင့် တိုတောင်း၊ စာမေးပွဲအကြိုည အနားယူ။ အလုပ်ဆင်းပြီး ည ၁ နာရီတွင် မေးခွန်း ၂၀၀ ကျက်ခြင်းက ရမှတ်ထက် စိုးရိမ်မှုကို တိုးစေသည်။",
            ],
            "mistakes_title": "BTT လေ့ကျင့်တွင် အများဆုံး တွေ့ရသော အမှားများ",
            "mistakes": [
                "Give Way တြိဂံကို Stop ကဲ့သို့ သတ်မှတ်ခြင်း — သို့မဟုတ် ပြောင်းပြန်",
                "ကျောင်းဇုန် ၄၀ km/h သည် ကျောင်းနေ့တွင် သက်ရောက်သည်ကို မေ့ခြင်း",
                "ဆိုင်းနိမ့်နေသည့်တိုင် အမြန်လမ်းကို ၉၀ km/h ဟု ယူဆခြင်း",
                "ပုံကို မကြည့်ဘဲ အင်္ဂလိပ် ရွေးချယ်မှုသာ ဖတ်ခြင်း",
            ],
            "featured_title": "BTT အစောပိုင်းတွင် ပေါ်တတ်သော ဆိုင်းများ",
            "featured_signs": [
                {"src": "/signs/sg/stop.png", "alt": "ရပ်ရန် ဆိုင်း", "caption": "Stop — လုံးဝရပ်"},
                {"src": "/signs/sg/give-way.png", "alt": "လမ်းပေးရန် ဆိုင်း", "caption": "လမ်းပေးရန်"},
                {"src": "/signs/sg/no-entry.png", "alt": "ဝင်ခွင့်မရှိ ဆိုင်း", "caption": "ဝင်ခွင့်မရှိ"},
                {"src": "/signs/sg/school-zone.png", "alt": "ကျောင်းဇုန် ဆိုင်း", "caption": "ကျောင်းဇုန် ၄၀"},
            ],
        },
        "ftt": {
            "study_paragraphs": [
                "FTT သည် ပိုခက်သော BTT မဟုတ်ပါ။ လက်တွေ့ သင်ခန်းစာ တက်ပြီးသူဟု ယူဆသည်။ အန္တရာယ်၊ အမြန်လမ်း၊ ညမောင်းနှင့် မတော်တဆမှု မဖြစ်မီ သတိထားရမည့်အရာများကို ပိုမေးသည်။",
                "BTT အောင်ပြီး လပေါင်းများစွာ နားထားလျှင် FTT mock မတိုင်မီ BTT ဆိုင်း နှစ်ကြိမ် ပြန်ကျက်ပါ။ ၉၀% မှတ်ထားဆဲဖြစ်သည်။ လက်တွေ့ သင်ခန်းစာ ၅ ကြိမ်သည် ဘွတ်ကင် တံခါး — သင်တန်းတွင် အတည်ပြုပါ။",
            ],
            "mistakes_title": "FTT လေ့ကျင့်တွင် အများဆုံး တွေ့ရသော အမှားများ",
            "mistakes": [
                "အန္တရာယ်ပုံကို မဖတ်ဘဲ BTT မှတ်ဉာဏ်ဖြင့် ဖြေခြင်း",
                "အမြန်လမ်း လမ်းကြော စည်းကမ်းနှင့် ပျက်စီးကား လုပ်ထုံးကို လွဲခြင်း",
                "လက်တွေ့ ၅ ကြိမ်မပြည့်မီ FTT ဘွတ်ကင်၍ အခကြေးဆုံးခြင်း",
                "ညမောင်းနှင့် မိုးလေ မေးခွန်းကို ရှားသည်ဟု ထားခြင်း",
            ],
            "featured_title": "အဆင့်မြင့် သီအိုရီတွင် သုံးသော ပုံများ",
            "featured_signs": [
                {"src": "/signs/sg/traffic-signals-sign.png", "alt": "မီးပွိုင့်ရှိ ဆိုင်း", "caption": "မီးပွိုင့် ရှေ့တွင်"},
                {"src": "/signs/sg/pedestrian-crossing.png", "alt": "လမ်းဖြတ်ကူး ဆိုင်း", "caption": "လမ်းဖြတ်ကူး"},
                {"src": "/signs/sg/warning-sign.png", "alt": "သတိပေး ဆိုင်း", "caption": "အန္တရာယ် သတိ"},
                {"src": "/signs/sg/no-overtaking.png", "alt": "ကျော်ဖြတ်မရ ဆိုင်း", "caption": "ကျော်ဖြတ်မရ"},
            ],
        },
        "rtt": {
            "study_paragraphs": [
                "ဆိုင်ကယ်စီးသူများ FTT အစား RTT ဖြေသည်။ BTT ကို အရင်အောင်ရပါမယ်။ RTT သည် မေးခွန်း ၅၀၊ ၉၀% ပုံစံတူသော်လည်း ဇာတ်လမ်းက ဘီးနှစ်လုံး — ကားကြားဝင်ခြင်း၊ အဖွဲ့လိုက်စီးခြင်း၊ ကားများက မမြင်လွယ်ခြင်း။",
                "ကားမောင်းပြီးသားဖြစ်လျှင် RTT လေ့ကျင့်ကို မကျော်ပါနှင့်။ ကားအလေ့အထ (သူများက ငါ့ကို မြင်လိမ့်မည်) သည် ဆိုင်ကယ် မေးခွန်းမှားတတ်သည်။ ဘွတ်ကင်မတိုင်မီ FTT မဟုတ်ဘဲ RTT mock ဖြေပါ။",
            ],
            "mistakes_title": "RTT လေ့ကျင့်တွင် အများဆုံး တွေ့ရသော အမှားများ",
            "mistakes": [
                "ဆိုင်ကယ် မြင်ကွင်းနှင့် ဘရိတ်အကွာအဝေးကို ကား FTT ယုတ္တိဖြင့် ဖြေခြင်း",
                "Class 2B ၏ အကာအကွယ်ပစ္စည်းနှင့် ခရီးသည် စည်းမျဉ်းကို မေ့ခြင်း",
                "ဇာတ်လမ်းမဖတ်ဘဲ filtering ကို အမြဲတရားဝင်ဟု ယူဆခြင်း",
                "BTT ဆိုင်း ပြန်မကျက်ဘဲ RTT နေ့တွင် လွယ်သော အမှတ်များ ဆုံးခြင်း",
            ],
            "featured_title": "ဘီးနှစ်လုံးအတွက် အရေးပါသော ဆိုင်းများ",
            "featured_signs": [
                {"src": "/signs/sg/stop.png", "alt": "ရပ်ရန် ဆိုင်း", "caption": "လုံးဝရပ်"},
                {"src": "/signs/sg/give-way.png", "alt": "လမ်းပေးရန် ဆိုင်း", "caption": "လမ်းပေးရန်"},
                {"src": "/signs/sg/no-entry.png", "alt": "ဝင်ခွင့်မရှိ ဆိုင်း", "caption": "ဝင်ခွင့်မရှိ"},
                {"src": "/signs/sg/mandatory-sign.png", "alt": "ညွှန်ကြားသည့်ဘက် ဆိုင်း", "caption": "မြှားအတိုင်း သွားရမည်"},
            ],
        },
    },
    "ja": {
        "btt": {
            "study_paragraphs": [
                "BTTはBBDC・CDC・SSDCで実技教習を始める門です。合格するまで教習は始まりません。標識と標示を先に終え、道路規則のあと、制限なし練習が90%を超えてから模試にしてください。",
                "予約前の一週間は、標識レッスン2晩、規則1晩、短い時間制限練習、前日は休む。シフト後の午前1時に200問詰め込むと、得点より焦りが増えます。",
            ],
            "mistakes_title": "BTT練習でよく見るミス",
            "mistakes": [
                "徐行の三角を一時停止と取り違える（または逆）",
                "スクールゾーン40km/hが登校日に適用されることを忘れる",
                "低い速度標識があっても高速道路は常に90km/hだと思う",
                "絵を見ずに英語の選択肢だけ読む",
            ],
            "featured_title": "BTT学習の序盤で出る標識",
            "featured_signs": [
                {"src": "/signs/sg/stop.png", "alt": "一時停止", "caption": "Stop — 完全停止"},
                {"src": "/signs/sg/give-way.png", "alt": "譲れ", "caption": "Give way"},
                {"src": "/signs/sg/no-entry.png", "alt": "進入禁止", "caption": "No entry"},
                {"src": "/signs/sg/school-zone.png", "alt": "スクールゾーン", "caption": "School zone 40"},
            ],
        },
        "ftt": {
            "study_paragraphs": [
                "FTTは難しいBTTではありません。すでに路上教習を受けた前提です。危険予測、高速道路、夜間、事故になる前に何を見るべきかが問われます。",
                "BTT合格から教習を空けた人は、FTT模試の前にBTT標識を2回分復習してください。合格点は90%のままです。実技5回が予約の目安 — 教習所で確認を。",
            ],
            "mistakes_title": "FTT練習でよく見るミス",
            "mistakes": [
                "危険の絵を読まずBTTの記憶で答える",
                "車線規律や故障時の手順など高速固有ルールを落とす",
                "実技5回前にFTTを予約して受験料を失う",
                "夜間・天候の問題を珍しいと思って飛ばす",
            ],
            "featured_title": "上級理論で使う視覚手がかり",
            "featured_signs": [
                {"src": "/signs/sg/traffic-signals-sign.png", "alt": "信号機あり", "caption": "Signals ahead"},
                {"src": "/signs/sg/pedestrian-crossing.png", "alt": "横断歩道", "caption": "Crossing ahead"},
                {"src": "/signs/sg/warning-sign.png", "alt": "警告", "caption": "Hazard warning"},
                {"src": "/signs/sg/no-overtaking.png", "alt": "追越し禁止", "caption": "No overtaking"},
            ],
        },
        "rtt": {
            "study_paragraphs": [
                "二輪はFTTではなくRTTです。先にBTTに合格します。50問・90%は同じですが、場面は二輪 — すり抜け、集団走行、四輪から見えにくいこと。",
                "四輪経験があってもRTT練習を飛ばさないでください。車の癖（相手は自分を見ているはず）が二輪の誤答になります。予約前はFTTではなくRTTの模試を。",
            ],
            "mistakes_title": "RTT練習でよく見るミス",
            "mistakes": [
                "二輪の被視認性と制動距離に四輪FTTの論理を使う",
                "Class 2B特有の装備・同乗者ルールを忘れる",
                "場面を読まずにfilteringを常に合法だと思う",
                "BTT標識の復習を飛ばし、RTT当日に簡単な標識点を落とす",
            ],
            "featured_title": "二輪で効く標識",
            "featured_signs": [
                {"src": "/signs/sg/stop.png", "alt": "一時停止", "caption": "完全停止"},
                {"src": "/signs/sg/give-way.png", "alt": "譲れ", "caption": "Give way"},
                {"src": "/signs/sg/no-entry.png", "alt": "進入禁止", "caption": "No entry"},
                {"src": "/signs/sg/mandatory-sign.png", "alt": "指定方向", "caption": "矢印に従う"},
            ],
        },
    },
}

ABOUT_EXTRA = {
    "en": [
        {
            "title": "Who we built this for",
            "paragraphs": [
                "TheoryLane started because Myanmar workers in Singapore and Japan were studying from screenshots, group-chat PDFs, and English papers they could not parse after a long shift. We wanted a phone-first practice tool with pictures on every question and explanations in Myanmar Unicode — not Zawgyi — plus English and Japanese.",
                "The site is a study aid. It does not issue licences, book test slots, or represent any government. Booking still happens on OneMotoring in Singapore or at a designated driving school / licence centre in Japan.",
            ],
        },
        {
            "title": "How the practice content is made",
            "paragraphs": [
                "Questions are written as original study items. We do not copy official exam papers. Illustrations are original or licensed study art. When a number such as a speed limit or fee appears, we treat it as publicly known information and tell you to confirm with the authority because fees change.",
                "A person reviews Myanmar and Japanese wording before it goes live. If you spot a translation that would confuse a learner, use the Report issue form. We read those reports.",
            ],
        },
        {
            "title": "Contact",
            "paragraphs": [
                "Email theorylanemm@gmail.com for payment checks, account help, or content mistakes. Include the question ID if you can. Do not send copies of official exam papers.",
            ],
        },
    ],
    "my": [
        {
            "title": "ဘယ်သူအတွက် တည်ဆောက်ထားသလဲ",
            "paragraphs": [
                "စင်္ကာပူနှင့် ဂျပန်ရှိ မြန်မာအလုပ်သမားများ အလုပ်ဆင်းပြီး စခရင်ရှော့၊ အဖွဲ့ချတ် PDF၊ နားမလည်သော အင်္ဂလိပ် စာရွက်များဖြင့် ကျက်နေရသောကြောင့် TheoryLane ကို စခဲ့သည်။ ဖုန်းတွင် မေးခွန်းတိုင်း ပုံပါရန်၊ မြန်မာ ယူနီကုဒ် (ဇော်ဂျီ မဟုတ်)၊ အင်္ဂလိပ်နှင့် ဂျပန် ရှင်းလင်းချက်ပါရန် ရည်ရွယ်သည်။",
                "ဤဆိုက်သည် လေ့လာရေး အထောက်အကူဖြစ်သည်။ လိုင်စင် မထုတ်ပါ။ စာမေးပွဲ ခုံ မဘွတ်ကင်ပါ။ အစိုးရကို ကိုယ်စားမပြုပါ။ ဘွတ်ကင်သည် စင်္ကာပူတွင် OneMotoring၊ ဂျပန်တွင် သတ်မှတ် ယာဉ်မောင်းသင်တန်း သို့မဟုတ် လိုင်စင်စင်တာတွင်သာ ဖြစ်သည်။",
            ],
        },
        {
            "title": "လေ့ကျင့် အကြောင်းအရာကို ဘယ်လို ပြုလုပ်သလဲ",
            "paragraphs": [
                "မေးခွန်းများသည် မူရင်း လေ့လာရေး မေးခွန်းများဖြစ်သည်။ တရားဝင် စာမေးပွဲကို မကူးပါ။ ပုံများသည် မူရင်း သို့မဟုတ် လိုင်စင်ရ လေ့လာရေး ပုံများဖြစ်သည်။ အမြန်နှုန်း သို့မဟုတ် အခကြေးငွေ ကဲ့သို့ ဂဏန်းများသည် အများသိ အချက်အလက်အဖြစ် သုံးပြီး အခကြေးငွေ ပြောင်းနိုင်သောကြောင့် တရားဝင် အဖွဲ့တွင် အတည်ပြုရန် ပြောသည်။",
                "မြန်မာနှင့် ဂျပန် စာသားကို လူက စစ်ပြီးမှ တင်သည်။ သင်ယူသူ ရှုပ်စေမည့် ဘာသာပြန် တွေ့လျှင် ပြဿနာ တင်ပြရန် ဖောင်ကို သုံးပါ။ ကျွန်တော်တို့ ဖတ်ပါသည်။",
            ],
        },
        {
            "title": "ဆက်သွယ်ရန်",
            "paragraphs": [
                "ငွေပေးချေမှု၊ အကောင့်၊ သို့မဟုတ် အကြောင်းအရာ အမှားအတွက် theorylanemm@gmail.com သို့ ပို့ပါ။ မေးခွန်း ID ပါနိုင်လျှင် ထည့်ပါ။ တရားဝင် စာမေးပွဲ စာရွက် မပို့ပါနှင့်။",
            ],
        },
    ],
    "ja": [
        {
            "title": "誰のために作ったか",
            "paragraphs": [
                "シンガポールと日本のミャンマー人労働者が、シフト後にスクリーンショットやグループのPDF、読み解けない英語の問題で勉強していたことからTheoryLaneを始めました。スマホ向け、全問に絵、ミャンマー語はUnicode（Zawgyiではない）、英語と日本語の解説を付けたかった。",
                "本サイトは学習補助です。免許は発行せず、予約も代行せず、政府の代理でもありません。予約はシンガポールではOneMotoring、日本では指定教習所または免許センターです。",
            ],
        },
        {
            "title": "練習コンテンツの作り方",
            "paragraphs": [
                "問題はオリジナルの学習用です。公式問題は複製しません。図はオリジナルまたは学習用ライセンスです。制限速度や料金などの数字は公開情報として扱い、料金は変わるので当局で確認するよう案内します。",
                "ミャンマー語と日本語は公開前に人が確認します。学習者を迷わせる訳を見つけたら「問題を報告」フォームを使ってください。読みます。",
            ],
        },
        {
            "title": "連絡先",
            "paragraphs": [
                "支払い確認、アカウント、内容の誤りは theorylanemm@gmail.com へ。可能なら問題IDを付けてください。公式試験問題のコピーは送らないでください。",
            ],
        },
    ],
}

def deep_merge(dst, src):
    for k, v in src.items():
        if isinstance(v, dict) and isinstance(dst.get(k), dict):
            deep_merge(dst[k], v)
        else:
            dst[k] = v

for loc in ("en", "my", "ja"):
    path = ROOT / f"{loc}.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    for ns, by_loc in ARTICLES.items():
        deep_merge(data[ns], by_loc[loc])
    for slug, extra in SEO_EXTRA[loc].items():
        deep_merge(data["seo"][slug], extra)
    existing_titles = {s["title"] for s in data["about"]["sections"]}
    for section in ABOUT_EXTRA[loc]:
        if section["title"] not in existing_titles:
            data["about"]["sections"].append(section)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"updated {path.name}")
