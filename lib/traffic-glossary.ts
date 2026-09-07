export interface GlossaryTerm {
  en: string;
  my: string;
  ja: string;
  /**
   * An original, exam-oriented note on how the term is actually used in test
   * papers — the distinction candidates get wrong, not a dictionary gloss.
   *
   * Deliberately free of figures. Speed limits, alcohol limits, demerit
   * thresholds and fine amounts differ between Singapore and Japan and change
   * over time, so every note routes the reader to the official handbook for
   * the number rather than asserting one here.
   */
  note: string;
}

export interface GlossaryCategory {
  id: 'signs' | 'rules' | 'vehicle' | 'licence' | 'penalties' | 'expressway';
  terms: GlossaryTerm[];
}

export const TRAFFIC_GLOSSARY: GlossaryCategory[] = [
  {
    id: 'signs',
    terms: [
      {
        en: 'Stop sign',
        my: 'ရပ်ဆိုင်းဆိုင်းဘုတ်',
        ja: '一時停止（いちじていし）',
        note: 'Requires the wheels to actually stop turning at the line, whether or not anything is coming. Papers test this by describing an empty junction — "slow down and look" is still the wrong answer.',
      },
      {
        en: 'Give way / Yield sign',
        my: 'လမ်းပေးဆိုင်းဘုတ်',
        ja: '譲れ（ゆずれ）',
        note: 'You may roll through if the way is genuinely clear. The exam distinction from Stop is exactly this: give way is conditional, stop is unconditional.',
      },
      {
        en: 'No entry',
        my: 'ဝင်ခွင့်မရှိ',
        ja: '進入禁止（しんにゅうきんし）',
        note: 'Applies to the road you are about to turn into, not the one you are on. Questions often show it at the far side of a junction to see whether you notice which road it governs.',
      },
      {
        en: 'One-way street',
        my: 'တစ်လမ်းသွားလမ်း',
        ja: '一方通行（いっぽうつうこう）',
        note: 'Overtaking on either side is permitted here, which is the one place that is normally true. That exception is a favourite question.',
      },
      {
        en: 'Warning sign (triangle)',
        my: 'သတိပေးဆိုင်းဘုတ် (တြိဂံ)',
        ja: '警戒標識（けいかいひょうしき）',
        note: 'Tells you what is ahead; it does not by itself impose a rule. If a question asks what you "must" do at a warning sign, the answer is about adjusting your driving, not about a legal obligation.',
      },
      {
        en: 'Mandatory sign (blue circle)',
        my: 'လိုက်နာရမည့် ဆိုင်းဘုတ် (အပြာဝိုင်း)',
        ja: '規制標識（きせいひょうしき）',
        note: 'Blue circle tells you what you must do. Learn the shape-and-colour system rather than memorising pictures — papers include signs you have never seen and expect you to reason from the shape.',
      },
      {
        en: 'Prohibitory sign (red circle)',
        my: 'တားမြစ်ဆိုင်းဘုတ် (အနီဝိုင်း)',
        ja: '禁止標識（きんしひょうしき）',
        note: 'Red circle tells you what you must not do. Paired with the blue circle above, this one distinction answers a large share of the sign questions on any paper.',
      },
      {
        en: 'Zebra crossing',
        my: 'ကြက်ဆောင်လမ်းဖြတ်',
        ja: '横断歩道（おうだんほどう）',
        note: 'The obligation usually begins when a pedestrian steps on or clearly intends to step on, not when they finish crossing. Watch for questions about waiting until the crossing is completely clear.',
      },
      {
        en: 'Zig-zag lines',
        my: 'ဇစ်ဇက်လိုင်း (zig-zag)',
        ja: 'ゼブラゾーン / 斜線',
        note: 'Marks the approach to a crossing. The point is that stopping, parking and overtaking are restricted here so that sightlines to the crossing stay open.',
      },
      {
        en: 'Yellow box junction',
        my: 'အဝါရောင် box junction',
        ja: '黄色ボックス',
        note: 'You may only enter if your exit is already clear. Questions test the case where the light is green but traffic ahead is stationary — green does not license you to enter.',
      },
      {
        en: 'Double yellow lines',
        my: 'အဝါနှစ်ကြောင်း',
        ja: '二重黄線（にじゅうおうせん）',
        note: 'A parking and waiting restriction along the kerb, not a lane divider. Candidates confuse it with the centre-line markings below; check the handbook for the hours it applies.',
      },
      {
        en: 'Bus lane',
        my: 'ဘတ်စ်ကားလမ်း',
        ja: 'バスレーン',
        note: 'Restricted only during its posted operating hours, and the restriction differs between normal and full-day bus lanes. Read the operating hours on the sign before answering.',
      },
      {
        en: 'Centre line',
        my: 'လမ်းအလယ်မျဉ်း',
        ja: '中央線（ちゅうおうせん）',
        note: 'Separates opposing flows. Whether you may cross it depends on whether it is broken or solid — see the two entries below.',
      },
      {
        en: 'Broken white line',
        my: 'အဖြတ်ဖြတ်ဖြူရောင်မျဉ်း',
        ja: '破線（はせん）',
        note: 'May be crossed when it is safe to do so. "Safe" is doing real work in that sentence: the marking permits the manoeuvre, it does not make it correct.',
      },
      {
        en: 'Solid white line',
        my: 'ဆက်တိုက် ဖြူရောင်မျဉ်း',
        ja: '実線（じっせん）',
        note: 'Must not be crossed except in the narrow cases the handbook lists. If a question offers "cross it to overtake a slow vehicle", that is the trap.',
      },
    ],
  },
  {
    id: 'rules',
    terms: [
      {
        en: 'Traffic light',
        my: 'မီးပွိုင့်',
        ja: '信号機（しんごうき）',
        note: 'Amber means stop unless stopping would be dangerous — it is not "hurry through". A large number of failed questions turn on that single word.',
      },
      {
        en: 'Roundabout',
        my: 'လည်ပတ်လမ်းဆုံ',
        ja: 'ロータリー / 環状交差点',
        note: 'Priority normally goes to traffic already circulating. Because Singapore and Japan both drive on the left, you give way to your right — do not reason from left-hand-drive videos.',
      },
      {
        en: 'Intersection',
        my: 'လမ်းဆုံ',
        ja: '交差点（こうさてん）',
        note: 'The generic exam word for any junction. Questions describe one in words rather than showing it, so practise converting the sentence into a picture before you look at the options.',
      },
      {
        en: 'Right of way',
        my: 'ဦးစားပေး ဖြတ်သန်းခွင့်',
        ja: '優先権（ゆうせんけん）',
        note: 'Something you are given, never something you take. The examinable point is that having priority does not entitle you to proceed into a hazard.',
      },
      {
        en: 'Give way / Yield',
        my: 'လမ်းပေးရမည်',
        ja: '譲れ / 徐行（じょこう）',
        note: 'Means letting others go first without necessarily stopping. Contrast with the Stop sign, where stopping is required regardless.',
      },
      {
        en: 'Pedestrian',
        my: 'လမ်းသွားပြည်သူ',
        ja: '歩行者（ほこうしゃ）',
        note: 'Both syllabuses treat children, elderly pedestrians and people with disabilities as requiring extra margin. Where an option mentions that group, it is usually the intended answer.',
      },
      {
        en: 'Speed limit',
        my: 'အမြန်နှုန်း ကန့်သတ်ချက်',
        ja: '速度制限（そくどせいげん）',
        note: 'A maximum in good conditions, not a target. The recurring question is that the correct speed in rain or poor visibility is below the posted figure. Confirm the figures themselves in the handbook.',
      },
      {
        en: 'Following distance',
        my: 'နောက်လိုက်အကွာအဝေး',
        ja: '車間距離（しゃかんきょり）',
        note: 'Examined as a time gap rather than a fixed number of metres, because the safe distance scales with speed. Expect it to increase in rain, at night and behind large vehicles.',
      },
      {
        en: 'Overtake',
        my: 'ကျော်ဖြတ်',
        ja: '追い越し（おいこし）',
        note: 'Normally done on the right where traffic drives on the left. Questions list places where it is prohibited outright — crests, bends, crossings, junctions — and expect you to recognise them from a description.',
      },
      {
        en: 'U-turn',
        my: 'U ကွေ့',
        ja: 'Uターン',
        note: 'Permitted only where signed or not prohibited, and never where it would obstruct traffic. Read the question for the sign before deciding.',
      },
      {
        en: 'Lane',
        my: 'လမ်းကြောင်း',
        ja: '車線（しゃせん）',
        note: 'Discipline questions almost always reward keeping left unless overtaking or turning right. Sitting in the right-hand lane is a common wrong option.',
      },
      {
        en: 'Full stop',
        my: 'လုံးဝရပ်ခြင်း',
        ja: '完全停止（かんぜんていし）',
        note: 'Wheels stationary. Distinguish it from slowing to a crawl, which papers describe in language deliberately close to stopping.',
      },
      {
        en: 'Joko (slow driving)',
        my: '徐行 (joko) — ချက်ချင်း ရပ်နိုင်သည့် အမြန်နှုန်း',
        ja: '徐行（じょこう）',
        note: 'A Japan-specific term: slow enough to stop immediately. It is defined by stopping ability, not by a speedometer reading, which is exactly what the written test checks.',
      },
      {
        en: 'Blind spot',
        my: 'မမြင်ရသောနေရာ',
        ja: '死角（しかく）',
        note: 'The area mirrors do not cover, which is why a shoulder check is a separate step from a mirror check. Questions that list only mirrors are incomplete on purpose.',
      },
    ],
  },
  {
    id: 'vehicle',
    terms: [
      {
        en: 'Seat belt',
        my: 'ကိုယ်ဘေးကာ',
        ja: 'シートベルト',
        note: 'Responsibility for who must be belted, and who is liable for an unbelted passenger, is examinable and differs by passenger age. Check the handbook for your country.',
      },
      {
        en: 'Headlights',
        my: 'ရှေ့မီး',
        ja: 'ヘッドライト',
        note: 'The examinable idea is being seen, not only seeing — headlights are required in poor visibility even in daylight. Dipping for oncoming traffic is a separate recurring question.',
      },
      {
        en: 'Hazard lights',
        my: 'အဆင့်ဆင့်မီးများ',
        ja: 'ハザードランプ',
        note: 'For warning others that your vehicle is a hazard. Using them to excuse illegal parking is a standard wrong option.',
      },
      {
        en: 'Horn',
        my: 'ဟွန်း',
        ja: 'クラクション / 警音器',
        note: 'A warning device, not a way to express irritation or to claim priority. Both syllabuses restrict its use near hospitals and at night.',
      },
      {
        en: 'Tyre',
        my: 'တာယာ',
        ja: 'タイヤ',
        note: 'Tread depth and pressure appear in maintenance questions, usually linked to braking distance and aquaplaning in the wet. The legal minimum depth is in the handbook.',
      },
      {
        en: 'Brakes',
        my: 'ဘရိတ်',
        ja: 'ブレーキ',
        note: 'Braking distance rises with the square of speed, so doubling speed more than doubles the distance. That relationship, not a memorised table, is what questions test.',
      },
      {
        en: 'Mirrors',
        my: 'နောက်ကြည့်မှန်',
        ja: 'ミラー',
        note: 'Examined as a sequence — mirror, signal, manoeuvre — and the order matters. An option that signals first is wrong even if everything else in it is right.',
      },
      {
        en: 'Indicator / Turn signal',
        my: 'လမ်းကြောင်းပြ မီး',
        ja: '方向指示器（ほうこうしじき）',
        note: 'Signals intention; it does not create priority. The trap option is one where the driver signals and then moves without checking.',
      },
      {
        en: 'Child restraint',
        my: 'ကလေးထိုင်ခုံ',
        ja: 'チャイルドシート',
        note: 'Requirements depend on the child’s height or age and on which seat they occupy. Look the thresholds up rather than guessing — they differ between Singapore and Japan.',
      },
      {
        en: 'Helmet (motorcycle)',
        my: 'ဟယ်လ်မက်',
        ja: 'ヘルメット',
        note: 'Riding-theory papers ask about proper fastening and approved standards, not merely about wearing one. An unfastened helmet counts as not wearing one.',
      },
    ],
  },
  {
    id: 'licence',
    terms: [
      {
        en: 'Driving licence',
        my: 'ကားမောင်းလိုင်စင်',
        ja: '運転免許証（うんてんめんきょしょう）',
        note: 'Class matters: a licence authorises specific vehicle classes, and driving outside your class is an offence even though you hold a licence.',
      },
      {
        en: 'Probationary licence',
        my: 'ယာယီ / probationary လိုင်စင်',
        ja: '仮免許（かりめんきょ）',
        note: 'The period after you first qualify, during which stricter demerit rules apply and display plates may be required. The duration is in the handbook.',
      },
      {
        en: 'BTT (Basic Theory Test)',
        my: 'BTT — အခြေခံ သီအိုရီ',
        ja: 'BTT（基礎学科）',
        note: 'The Singapore entry test, covering signs, markings and basic rules. It is the prerequisite for practical training, so it comes first in the sequence.',
      },
      {
        en: 'FTT (Final Theory Test)',
        my: 'FTT — နောက်ဆုံး သီအိုရီ',
        ja: 'FTT（最終学科）',
        note: 'Deeper than BTT: defensive driving, expressway use, vehicle handling. Passing BTT does not prepare you for it — the emphasis shifts from recognition to judgement.',
      },
      {
        en: 'RTT (Riding Theory Test)',
        my: 'RTT — ဆိုင်ကယ် သီအိုရီ',
        ja: 'RTT（二輪学科）',
        note: 'The motorcycle equivalent, with rider-specific content on filtering, road surface and protective gear. Do not revise for it using car material alone.',
      },
      {
        en: 'Provisional licence (仮免)',
        my: '仮免 — ယာယီလိုင်စင် (ဂျပန်)',
        ja: '仮免許（かりめんきょ）',
        note: 'The Japanese stage that permits supervised practice on public roads before the final test. It has its own written examination.',
      },
      {
        en: 'Full licence (本免)',
        my: '本免 — တရားဝင်လိုင်စင် (ဂျပန်)',
        ja: '本免許（ほんめんきょ）',
        note: 'The final Japanese licence, taken after the provisional stage. Its written paper is substantially longer than the provisional one.',
      },
      {
        en: 'Hazard perception',
        my: 'အန္တရာယ်ခန့်မှန်းခြင်း',
        ja: '危険予測（きけんよそく）',
        note: 'Spotting a developing risk before it becomes one. Questions describe a scene and ask what you should anticipate — the answer is usually the possibility you cannot yet see.',
      },
    ],
  },
  {
    id: 'penalties',
    terms: [
      {
        en: 'Demerit points',
        my: 'အမှတ်နုတ်',
        ja: '違反点数（いはんてんすう）',
        note: 'Points accumulate against your record and trigger suspension at a threshold that is lower during the probationary period. Thresholds are in the handbook.',
      },
      {
        en: 'Suspension (licence)',
        my: 'လိုင်စင် ရပ်ဆိုင်းခြင်း',
        ja: '免許停止（めんきょていし）',
        note: 'Temporary loss of driving privileges; the licence is returned after the period. Contrast with revocation below — papers test the difference.',
      },
      {
        en: 'Revocation',
        my: 'လိုင်စင် ပယ်ဖျက်ခြင်း',
        ja: '取消し（とりけし）',
        note: 'The licence is cancelled outright and must be re-earned, usually including retaking the tests. It is the more serious of the two outcomes.',
      },
      {
        en: 'Composition fine',
        my: 'ပြစ်ဒဏ်ငွေ (composition)',
        ja: '反則金（はんそくきん）',
        note: 'A fine paid to settle a minor offence without going to court. Accepting it is not the same as a court conviction, which is the examinable distinction.',
      },
      {
        en: 'BAC (blood alcohol)',
        my: 'သွေးတွင်းအရက်ဓာတ်',
        ja: '血中アルコール濃度',
        note: 'The measure used to define drink-driving. Limits differ between Singapore and Japan and Japan’s is notably stricter — never carry a figure across from one syllabus to the other.',
      },
      {
        en: 'Drink-driving',
        my: 'အရက်သောက်မောင်းခြင်း',
        ja: '飲酒運転（いんしゅうんてん）',
        note: 'In Japan the offence extends to supplying alcohol to a driver or riding with one, which surprises candidates revising from Singapore material.',
      },
      {
        en: 'Traffic offence',
        my: 'ယာဉ်စည်းမျဉ်းချိုးဖောက်မှု',
        ja: '交通違反（こうつういはん）',
        note: 'The umbrella term. Questions usually turn on which category an offence falls into, because the category determines the penalty.',
      },
    ],
  },
  {
    id: 'expressway',
    terms: [
      {
        en: 'Expressway',
        my: 'မြန်နှုန်းလမ်း',
        ja: '高速道路（こうそくどうろ）',
        note: 'Carries its own rule set — prohibited vehicles, no stopping, no reversing, no pedestrians. FTT weights this section heavily; BTT barely touches it.',
      },
      {
        en: 'Emergency lane',
        my: 'အရေးပေါ် လမ်းကြောင်း',
        ja: '路肩（ろかた）',
        note: 'For breakdowns and emergency vehicles only. Using it to pass congestion or to take a call is a standard wrong option.',
      },
      {
        en: 'Minimum speed',
        my: 'အနည်းဆုံး အမြန်နှုန်း',
        ja: '最低速度（さいていそくど）',
        note: 'Expressways impose a floor as well as a ceiling, because a slow vehicle in fast traffic is itself a hazard. Candidates forget the floor exists.',
      },
      {
        en: 'Tunnel',
        my: 'တန်နယ်',
        ja: 'トンネル',
        note: 'Headlights on, no lane changing, and keep your distance — the eye needs time to adapt at both ends. Breakdown procedure inside a tunnel is separately examinable.',
      },
      {
        en: 'School zone',
        my: 'ကျောင်းဇုန်',
        ja: 'スクールゾーン',
        note: 'Reduced limits during posted hours, with children liable to behave unpredictably. Answers that assume adult pedestrian behaviour are wrong here.',
      },
      {
        en: 'Silver zone',
        my: 'Silver zone (သက်ကြီးရွယ်အို)',
        ja: 'シルバーゾーン',
        note: 'A Singapore scheme for areas with many elderly residents, using narrowed lanes and traffic-calming features. Expect longer crossing times as the examinable consequence.',
      },
      {
        en: 'Kerb',
        my: 'လမ်းနောင်',
        ja: '縁石（えんせき）',
        note: 'Kerb markings carry parking rules, so the colour of the kerb is part of the question, not decoration.',
      },
      {
        en: 'Median',
        my: 'လမ်းအလယ်ပိုင်း',
        ja: '中央分離帯（ちゅうおうぶんりたい）',
        note: 'A physical divider between opposing flows. Where one exists, U-turns and right turns are only possible at designated openings.',
      },
      {
        en: 'Turning radius',
        my: 'ကွေ့ကောက်အချင်းဝက်',
        ja: '旋回半径（せんかいはんけい）',
        note: 'Long vehicles swing wide and cut in at the rear, which is why you must not sit alongside a turning lorry or bus. That is the reason behind the rule questions ask about.',
      },
    ],
  },
];

export const GLOSSARY_TERM_COUNT = TRAFFIC_GLOSSARY.reduce((n, c) => n + c.terms.length, 0);
