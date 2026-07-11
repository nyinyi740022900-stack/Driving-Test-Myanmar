#!/usr/bin/env node
/**
 * Build Singapore road signs library JSON for TheoryLane.
 * Images: public/signs/sg/{slug}.png
 *
 * Usage: node scripts/build-signs-library.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SIGNS_DIR = path.join(ROOT, 'public', 'signs', 'sg');
const OUT_FILE = path.join(ROOT, 'content', 'signs-library', 'sg.json');

/** @param {string} file @param {string} en @param {string} my @param {string} ja @param {string} dEn @param {string} dMy @param {string} dJa */
function sign(file, en, my, ja, dEn, dMy, dJa) {
  return {
    file,
    title: { en, my, ja },
    desc: { en: dEn, my: dMy, ja: dJa },
  };
}

const SECTIONS = [
  {
    category: {
      en: 'Regulatory — Must Obey',
      my: 'စည်းမျဉ်း — လိုက်နာရမည်',
      ja: '規制標識 — 必ず守る',
    },
    signs: [
      sign('stop.png', 'Stop', 'ရပ်', '一時停止', 'Come to a complete stop. Give way to all traffic before moving.', 'လုံးဝရပ်ပါ။ မသွားမီ လမ်းပေါ်က ယာဉ်အားလုံးကို ဦးစားပေးပါ။', '完全に停止し、安全を確認してから進む。'),
      sign('give-way.png', 'Give Way', 'လမ်းပေးရန်', '徐行', 'Slow down and give way to traffic on the main road.', 'ဖြည်းချပြီး အဓိကလမ်းပေါ်က ယာဉ်များကို လမ်းပေးပါ။', '減速し、優先道路の車両に道を譲る。'),
      sign('no-entry.png', 'No Entry', 'ဝင်ခွင့်မရှိ', '進入禁止', 'Do not enter this road or area.', 'ဤလမ်း သို့မဟုတ် ဧရိယာသို့ မဝင်ရ။', 'この道路・区域に進入してはいけない。'),
      sign('no-stopping.png', 'No Stopping', 'ရပ်နားခွင့်မရှိ', '駐停車禁止', 'Do not stop your vehicle here, even briefly.', 'ယာဉ်ကို ဤနေရာတွင် ခဏမျှမဟုတ် ရပ်နားခွင့်မရှိ။', '一時的でもここで停車してはいけない。'),
      sign('no-waiting.png', 'No Waiting', 'စောင့်ဆိုင်းခွင့်မရှိ', '駐車禁止', 'Do not wait or park here beyond the allowed time.', 'ခွင့်ပြုထားသော အချိန်ထက် ပိုပြီး ဤနေရာတွင် စောင့်ဆိုး သို့မဟုတ် ရပ်နားခွင့်မရှိ။', '許可時間を超えて待機・駐車してはいけない。'),
      sign('no-overtaking.png', 'No Overtaking', 'ကျော်တက်ခွင့်မရှိ', '追い越し禁止', 'Do not overtake other vehicles on this stretch.', 'ဤလမ်းအပိုင်းတွင် အခြားယာဉ်များကို ကျော်တက်ခွင့်မရှိ။', 'この区間では他車を追い越してはいけない。'),
      sign('speed-limit-40.png', 'Speed Limit 40', 'အမြန်နှုန်း ၄၀', '制限速度40', 'Maximum speed is 40 km/h.', 'အမြင့်ဆုံးအမြန်နှုန်း ၄၀ km/h ဖြစ်သည်။', '最高速度は時速40km。'),
      sign('speed-limit-50.png', 'Speed Limit 50', 'အမြန်နှုန်း ၅၀', '制限速度50', 'Maximum speed is 50 km/h.', 'အမြင့်ဆုံးအမြန်နှုန်း ၅၀ km/h ဖြစ်သည်။', '最高速度は時速50km。'),
      sign('speed-limit-60.png', 'Speed Limit 60', 'အမြန်နှုန်း ၆၀', '制限速度60', 'Maximum speed is 60 km/h.', 'အမြင့်ဆုံးအမြန်နှုန်း ၆၀ km/h ဖြစ်သည်။', '最高速度は時速60km。'),
      sign('speed-limit-70.png', 'Speed Limit 70', 'အမြန်နှုန်း ၇၀', '制限速度70', 'Maximum speed is 70 km/h.', 'အမြင့်ဆုံးအမြန်နှုန်း ၇၀ km/h ဖြစ်သည်။', '最高速度は時速70km。'),
      sign('speed-limit-80.png', 'Speed Limit 80', 'အမြန်နှုန်း ၈၀', '制限速度80', 'Maximum speed is 80 km/h.', 'အမြင့်ဆုံးအမြန်နှုန်း ၈၀ km/h ဖြစ်သည်။', '最高速度は時速80km。'),
      sign('speed-limit-90.png', 'Speed Limit 90', 'အမြန်နှုန်း ၉၀', '制限速度90', 'Maximum speed is 90 km/h.', 'အမြင့်ဆုံးအမြန်နှုန်း ၉၀ km/h ဖြစ်သည်။', '最高速度は時速90km。'),
      sign('no-entry-for-motorcycles.png', 'No Entry for Motorcycles', 'မော်တော်ဆိုင်ကယ်ဝင်ခွင့်မရှိ', '二輪車進入禁止', 'Motorcycles must not enter.', 'မော်တော်ဆိုင်ကယ်များ ဝင်ခွင့်မရှိ။', '二輪車は進入禁止。'),
      sign('no-entry-for-bicycles.png', 'No Entry for Bicycles', 'စက်ဘီးဝင်ခွင့်မရှိ', '自転車進入禁止', 'Bicycles must not enter.', 'စက်ဘီးများ ဝင်ခွင့်မရှိ။', '自転車は進入禁止。'),
      sign('no-entry-for-pedestrians.png', 'No Entry for Pedestrians', 'လမ်းလျှောက်ဝင်ခွင့်မရှိ', '歩行者進入禁止', 'Pedestrians must not enter.', 'လမ်းလျှောက်များ ဝင်ခွင့်မရှိ။', '歩行者は進入禁止。'),
      sign('no-left-turn.png', 'No Left Turn', 'ဘယ်ဘက်မကွေ့ရ', '左折禁止', 'Left turns are not allowed.', 'ဘယ်ဘက်သို့ မကွေ့ရ။', '左折してはいけない。'),
      sign('no-right-turn.png', 'No Right Turn', 'ညာဘက်မကွေ့ရ', '右折禁止', 'Right turns are not allowed.', 'ညာဘက်သို့ မကွေ့ရ။', '右折してはいけない。'),
      sign('no-through-road.png', 'No Through Road', 'ဆက်မသွားရ', '行き止まり', 'Road ends ahead; no through route.', 'ရှေ့တွင် လမ်းဆုံးသည်။ ဆက်မသွားရ။', '前方は行き止まり。通過できない。'),
      sign('no-sounding-of-horn.png', 'No Horn', 'ဟွန်းမတီးရ', '警音器使用禁止', 'Do not sound your horn in this area.', 'ဤနေရာတွင် ဟွန်းမတီးရ။', 'この区域ではクラクションを鳴らしてはいけない。'),
      sign('height-limit.png', 'Height Limit', 'အမြင့်ကန့်သတ်ချက်', '高さ制限', 'Vehicles taller than the limit must not pass.', 'ကန့်သတ်ထားသော အမြင့်ထက် ကျော်လွန်သော ယာဉ်များ မဖြတ်သန်းရ။', '制限高さを超える車両は通過禁止。'),
      sign('weight-limit.png', 'Weight Limit', 'အလေးချိန်ကန့်သတ်ချက်', '重量制限', 'Vehicles heavier than the limit must not use this route.', 'ကန့်သတ်ထားသော အလေးချိန်ထက် ကျော်လွန်သော ယာဉ်များ ဤလမ်းကို မသုံးရ။', '制限重量を超える車両は通行禁止。'),
    ],
  },
  {
    category: {
      en: 'Mandatory Direction',
      my: 'လမ်းညွှန်မှု — လိုက်နာရမည်',
      ja: '指示標識 — 進路指定',
    },
    signs: [
      sign('keep-left.png', 'Keep Left', 'ဘယ်ဘက်သို့စီးရန်', '左側通行', 'Keep to the left side of the road or divider.', 'လမ်း သို့မဟုတ် ခွဲထားသော ဘယ်ဘက်သို့ စီးရန်။', '道路の左側を通行する。'),
      sign('ahead-only.png', 'Ahead Only', 'ရှေ့သို့သာ', '直進', 'You must proceed straight ahead only.', 'ရှေ့သို့သာ တိုက်ရိုက်သွားရမည်။', '直進のみ可能。'),
      sign('turn-left-only.png', 'Turn Left Only', 'ဘယ်ဘက်သာကွေ့ရ', '左折のみ', 'You must turn left at this junction.', 'ဤလမ်းဆုံမှ ဘယ်ဘက်သာ ကွေ့ရမည်။', 'この交差点では左折のみ。'),
      sign('turn-right-only.png', 'Turn Right Only', 'ညာဘက်သာကွေ့ရ', '右折のみ', 'You must turn right at this junction.', 'ဤလမ်းဆုံမှ ညာဘက်သာ ကွေ့ရမည်။', 'この交差点では右折のみ。'),
      sign('one-way-street.png', 'One-Way Street', 'တစ်လမ်းသွားလမ်း', '一方通行', 'Traffic flows in one direction only.', 'ယာဉ်များ တစ်လမ်းသွားအတိုင်း သာစီးသည်။', '一方通行道路。逆走禁止。'),
      sign('exclusive-left-turn.png', 'Exclusive Left Turn Lane', 'ဘယ်ကွေ့လီးသန့်', '左折専用レーン', 'Use this lane only to turn left.', 'ဘယ်ဘက်သို့ ကွေ့ရန်အတွက်သာ ဤလမ်းကို သုံးပါ။', '左折専用レーン。左折以外は進入禁止。'),
    ],
  },
  {
    category: {
      en: 'Warning — Hazard Ahead',
      my: 'သတိပေး — အန္တရာယ်ရှေ့တွင်',
      ja: '警戒標識 — 危険注意',
    },
    signs: [
      sign('left-bend.png', 'Left Bend Ahead', 'ဘယ်ဘက်ကွေ့လမ်းရှေ့တွင်', '左カーブ', 'Sharp bend to the left ahead; reduce speed.', 'ရှေ့တွင် ဘယ်ဘက်သို့ ကွေ့လမ်းရှိသည်။ အမြန်နှုန်းလျှော့ပါ။', '前方左カーブ。減速する。'),
      sign('right-bend.png', 'Right Bend Ahead', 'ညာဘက်ကွေ့လမ်းရှေ့တွင်', '右カーブ', 'Sharp bend to the right ahead; reduce speed.', 'ရှေ့တွင် ညာဘက်သို့ ကွေ့လမ်းရှိသည်။ အမြန်နှုန်းလျှော့ပါ။', '前方右カーブ。減速する。'),
      sign('series-of-bends.png', 'Series of Bends', 'ကွေ့လမ်းဆက်တိုက်', '連続カーブ', 'Multiple bends ahead; drive carefully.', 'ရှေ့တွင် ကွေ့လမ်းများဆက်တိုက် ရှိသည်။ သတိထားမောင်းပါ။', '連続カーブあり。慎重に運転。'),
      sign('slippery-road.png', 'Slippery Road', 'လမ်းချောသည်', '滑りやすい道路', 'Road may be slippery; slow down and avoid sudden braking.', 'လမ်းချောနိုင်သည်။ဖြည်းချပြီး ရုတ်တရက် ဘရိတ်မနင်းပါနှင့်။', '路面が滑りやすい。減速し急ブレーキを避ける。'),
      sign('road-hump-ahead.png', 'Road Hump Ahead', 'လမ်းမြင့်ရှေ့တွင်', 'ハンプあり', 'Speed bump ahead; slow down.', 'ရှေ့တွင် လမ်းမြင့်ရှိသည်။ အမြန်နှုန်းလျှော့ပါ။', '前方にハンプ。減速する。'),
      sign('steep-upward-slope.png', 'Steep Upward Slope', 'စောင်းတက်လမ်းပြင်းထန်', '急上り', 'Steep uphill ahead; use lower gear if needed.', 'ရှေ့တွင် စောင်းတက်လမ်းပြင်းထန်သည်။ လိုအပ်ပါက ဂီယာနိမ့်သုံးပါ။', '急な上り坂。必要なら低いギアを使う。'),
      sign('steep-downward-slope.png', 'Steep Downward Slope', 'စောင်းဆင်းလမ်းပြင်းထန်', '急下り', 'Steep downhill ahead; control speed with engine braking.', 'ရှေ့တွင် စောင်းဆင်းလမ်းပြင်းထန်သည်။ အင်ဂျင်ဘရိတ်ဖြင့် အမြန်နှုန်းထိန်းပါ။', '急な下り坂。エンジンブレーキで速度を制御。'),
      sign('children.png', 'Children Ahead', 'ကလေးများရှေ့တွင်', '児童注意', 'Children may be on or near the road; drive slowly.', 'ကလေးများ လမ်းပေါ် သို့မဟုတ် အနီးတွင် ရှိနိုင်သည်။ဖြည်းချ မောင်းပါ။', '子どもが道路付近にいる可能性。徐行する。'),
      sign('animals.png', 'Animals Ahead', 'တိရစ္ဆာန်များရှေ့တွင်', '動物注意', 'Animals may cross the road; be prepared to stop.', 'တိရစ္ဆာန်များ လမ်းဖြတ်သန်းနိုင်သည်။ ရပ်နိုင်ရန် ပြင်ဆင်ထားပါ။', '動物が横断する可能性。停止に備える。'),
      sign('elderly-or-handicapped-pedestrians.png', 'Elderly or Disabled Pedestrians', 'သက်ကြီးရွယ်အို/မသန်စွမ်း လမ်းလျှောက်များ', '高齢者・障がい者注意', 'Vulnerable pedestrians may cross; give them extra time.', 'အန္တရာယ်ရှိသော လမ်းလျှောက်များ ဖြတ်သန်းနိုင်သည်။ အချိန်ပိုပေးပါ။', '高齢者・障がい者が横断する可能性。ゆっくり譲る。'),
      sign('school-zone.png', 'School Zone', 'ကျောင်းဧရိယာ', '学校区域', 'School area; reduce speed and watch for children.', 'ကျောင်းဧရိယာ။ အမြန်နှုန်းလျှော့ပြီး ကလေးများကို စောင့်ကြည့်ပါ။', '学校区域。減速し子どもに注意。'),
      sign('start-of-school-zone.png', 'Start of School Zone', 'ကျောင်းဧရိယာ စတင်ရာ', '学校区域開始', 'You are entering a school zone; obey the lower speed limit.', 'ကျောင်းဧရိယာသို့ ဝင်လာသည်။ အမြန်နှုန်းကန့်သတ်ချက်ကို လိုက်နာပါ။', '学校区域に入る。制限速度を守る。'),
      sign('pedestrian-crossing-ahead.png', 'Pedestrian Crossing Ahead', 'လမ်းလျှောက်ဖြတ်သန်းရာ ရှေ့တွင်', '横断歩道あり', 'Pedestrian crossing ahead; be ready to stop.', 'ရှေ့တွင် လမ်းလျှောက်ဖြတ်သန်းရာ ရှိသည်။ ရပ်နိုင်ရန် ပြင်ဆင်ထားပါ။', '前方に横断歩道。歩行者に道を譲る。'),
      sign('light-signals-ahead.png', 'Traffic Lights Ahead', 'မီးပွိုင့် ရှေ့တွင်', '信号機あり', 'Traffic signals ahead; prepare to stop if needed.', 'ရှေ့တွင် မီးပွိုင့် ရှိသည်။ လိုအပ်ပါက ရပ်ရန် ပြင်ဆင်ပါ။', '前方に信号機。停止に備える。'),
      sign('merging-traffic.png', 'Merging Traffic', 'ယာဉ်ပေါင်းစီးမှု', '車線合流', 'Traffic merges from the side; adjust speed and give way.', 'ဘေးမှ ယာဉ်များ ပေါင်းစီးသည်။ အမြန်နှုန်းညှိပြီး လမ်းပေးပါ။', '側方から車線合流。速度を調整し譲る。'),
      sign('lanes-merging.png', 'Lanes Merging', 'လမ်းကြောင်းပေါင်းစည်းမှု', '車線減少', 'Lanes merge ahead; merge early and safely.', 'ရှေ့တွင် လမ်းကြောင်းများ ပေါင်းစည်းသည်။ စောစောလုံခြုံစွာ ပေါင်းပါ။', '前方で車線が合流。早めに安全に合流。'),
      sign('roundabout.png', 'Roundabout Ahead', 'လမ်းဝိုင်း ရှေ့တွင်', 'ラウンドアバウト', 'Roundabout ahead; give way to traffic already in the circle.', 'ရှေ့တွင် လမ်းဝိုင်း ရှိသည်။ လမ်းဝိုင်းထဲရှိ ယာဉ်များကို လမ်းပေးပါ။', '前方にラウンドアバウト。円内の車両に譲る。'),
      sign('t-junction.png', 'T-Junction Ahead', 'T ပုံလမ်းဆုံ ရှေ့တွင်', 'T字路', 'T-junction ahead; check both directions.', 'ရှေ့တွင် T ပုံလမ်းဆုံ ရှိသည်။ နှစ်ဘက်လမ်းကို စစ်ဆေးပါ။', '前方T字路。左右を確認。'),
      sign('cross-junction.png', 'Cross Junction Ahead', 'လမ်းဆုံကြား ရှေ့တွင်', '十字路', 'Cross junction ahead; check all approaches.', 'ရှေ့တွင် လမ်းဆုံကြား ရှိသည်။ လမ်းဝင်ပေါက်အားလုံးကို စစ်ဆေးပါ။', '前方十字路。全方向を確認。'),
      sign('road-narrows-on-pne-side.png', 'Road Narrows on One Side', 'လမ်းတစ်ဘက်ကျဉ်း', '道路幅員減少', 'Road narrows on one side; adjust position and speed.', 'လမ်းတစ်ဘက်ကျဉ်းသည်။ နေရာနှင့် အမြန်နှုန်းညှိပါ။', '片側が狭くなる。走行位置と速度を調整。'),
      sign('ungated-level-crossing.png', 'Ungated Level Crossing', 'တံခါးမပါ ချိန်ကျော်ရာ', '無遮断踏切', 'Railway crossing without gates; stop and look both ways.', 'တံခါးမပါ ချိန်ကျော်ရာ။ ရပ်ပြီး နှစ်ဘက်ကြည့်ပါ။', '遮断機のない踏切。一時停止し左右確認。'),
      sign('gated-level-crossing.png', 'Gated Level Crossing', 'တံခါးပါ ချိန်ကျော်ရာ', '遮断踏切', 'Railway crossing with gates; never cross when barriers are down.', 'တံခါးပါ ချိန်ကျော်ရာ။ တံခါးချထားချိန် ဘယ်တော့မှ မဖြတ်ပါနှင့်။', '遮断機あり踏切。バーが下がっている時は渡らない。'),
      sign('roadworks.png', 'Roadworks Ahead', 'လမ်းဆောက်လုပ်ရေး ရှေ့တွင်', '道路工事中', 'Roadworks ahead; slow down and follow temporary signs.', 'ရှေ့တွင် လမ်းဆောက်လုပ်ရေး ရှိသည်။ဖြည်းချပြီး ယာယီဆိုင်းဘုတ်များကို လိုက်နာပါ။', '前方道路工事中。減速し仮標識に従う。'),
      sign('tunnel-ahead.png', 'Tunnel Ahead', 'ဥမင်လိုဏ်ခေါင်း ရှေ့တွင်', 'トンネルあり', 'Tunnel ahead; switch on headlights and maintain safe distance.', 'ရှေ့တွင် ဥမင်လိုဏ်ခေါင်း ရှိသည်။ မီးဖွင့်ပြီး လုံခြုံသော အကွာအဝေးထိန်းပါ။', '前方トンネル。ヘッドライトを点灯し車間距離を保つ。'),
      sign('expressway-ahead.png', 'Expressway Ahead', 'အမြန်လမ်း ရှေ့တွင်', '高速道路入口', 'Expressway entrance ahead; match merging speed and give way.', 'ရှေ့တွင် အမြန်လမ်းဝင်ပေါက် ရှိသည်။ ပေါင်းစီးအမြန်နှုန်းညှိပြီး လမ်းပေးပါ။', '高速道路入口。合流速度に合わせ譲る。'),
    ],
  },
  {
    category: {
      en: 'Informational',
      my: 'အချက်အလက်',
      ja: '案内標識',
    },
    signs: [
      sign('zebra-crossing.png', 'Zebra Crossing', 'ဇီဘရာဖြတ်သန်းရာ', '横断歩道', 'Pedestrians have priority at this crossing; stop if needed.', 'ဤဖြတ်သန်းရာတွင် လမ်းလျှောက်များကို ဦးစားပေးပါ။ လိုအပ်ပါက ရပ်ပါ။', '横断歩道。歩行者優先。必要なら停止。'),
      sign('raised-zebra-crossing.png', 'Raised Zebra Crossing', 'မြင့်ထားသော ဇီဘရာဖြတ်သန်းရာ', '盛り上がり横断歩道', 'Raised crossing ahead; slow down for pedestrians.', 'မြင့်ထားသော ဖြတ်သန်းရာ ရှေ့တွင်။ လမ်းလျှောက်များအတွက် အမြန်နှုန်းလျှော့ပါ။', '盛り上がり横断歩道。歩行者のため減速。'),
      sign('bus-lane.png', 'Bus Lane', 'ဘတ်စ်ကားလမ်း', 'バスレーン', 'Lane reserved for buses during shown hours.', 'ြထားသော အချိန်တွင် ဘတ်စ်ကားများအတွက် သီးသန့်လမ်း။', '表示時間はバス専用レーン。'),
      sign('full-day-bus-lane.png', 'Full-Day Bus Lane', 'တစ်နေ့လုံး ဘတ်စ်ကားလမ်း', '終日バスレーン', 'Bus lane active all day; other vehicles must not use it.', 'တစ်နေ့လုံး ဘတ်စ်ကားလမ်း။ အခြားယာဉ်များ မသုံးရ။', '終日バス専用。他車両は進入禁止。'),
      sign('gantry-sign.png', 'ERP Gantry', 'ERP တံခါန်း', 'ERPゲート', 'Electronic road pricing gantry; ensure In-Vehicle Unit is working.', 'အီလက်ထရွန်နစ် လမ်းကြေးတံခါန်း။ ယာဉ်တွင်း ယူနစ်အလုပ်လုပ်ကြောင်း သေချာပါစေ။', 'ERPゲート。車載機器が作動しているか確認。'),
      sign('parking-signboard.png', 'Parking Area', 'ကားရပ်နားရာ', '駐車場', 'Parking allowed as shown on the sign or time plate.', 'ဆိုင်းဘုတ် သို့မဟုတ် အချိန်ပြားအတိုင်း ကားရပ်နားခွင့်ရှိသည်။', '標識・時間板の条件で駐車可。'),
      sign('yellow-box.png', 'Yellow Box Junction', 'အဝါရောင် ဘောက်စ် လမ်းဆုံ', '黄色ボックス', 'Do not enter the yellow box unless your exit is clear.', 'ထွက်ပေါက် ရှင်းလင်းမှသာ အဝါရောင် ဘောက်စ်သို့ ဝင်ပါ။', '出口が空いている時だけ黄色ボックスに進入。'),
      sign('start-of-silver-zone.png', 'Silver Zone', 'Silver Zone ဧရိယာ', 'シルバーゾーン', 'Senior-friendly zone; extra care for elderly pedestrians.', 'သက်ကြီးရွယ်အိုများအတွက် ဧရိယာ။ လမ်းလျှောက်များကို အထူးဂရုစိုက်ပါ။', '高齢者配慮区域。歩行者に特に注意。'),
      sign('pricing-zone-ahead.png', 'Pricing Zone Ahead', 'ကြေးကောက်ခံ ဧရိယာ ရှေ့တွင်', '料金区域', 'Paid parking or pricing zone ahead; check rates.', 'ရှေ့တွင် ကြေးကောက်ခံ ဧရိယာ ရှိသည်။ နှုန်းထားကို စစ်ဆေးပါ။', '前方料金区域。料金を確認。'),
      sign('u-turn-ahead.png', 'U-Turn Ahead', 'U ပုံကွေ့ရာ ရှေ့တွင်', 'Uターン可', 'U-turn facility ahead; use only if safe and permitted.', 'ရှေ့တွင် U ပုံကွေ့ရာ ရှိသည်။ လုံခြုံပြီး ခွင့်ပြုထားမှသာ သုံးပါ။', '前方Uターン可。安全かつ許可時のみ。'),
      sign('detour-ahead.png', 'Detour Ahead', 'လမ်းလွှဲ ရှေ့တွင်', '迂回路', 'Follow the detour route; do not use closed roads.', 'လမ်းလွှဲလမ်းကို လိုက်နာပါ။ ပိတ်ထားသော လမ်းများကို မသုံးပါနှင့်။', '迂回路に従う。通行止め道路は使わない。'),
    ],
  },
  {
    category: {
      en: 'Road Markings',
      my: 'လမ်းအမှတ်အသားများ',
      ja: '道路標示',
    },
    signs: [
      sign('unbroken-double-yellow-lines.png', 'Double Yellow Lines', 'အဝါရောင်နှစ်ကြောင်း', '二重黄色実線', 'No parking on either side at all times.', 'နှစ်ဘက်လမ်းတွင် အချိန်မရွေး ကားရပ်နားခွင့်မရှိ။', '両側常時駐車禁止。'),
      sign('unbroken-yellow-line.png', 'Single Yellow Line', 'အဝါရောင်တစ်ကြောင်း', '黄色実線', 'No parking on that side during restricted hours.', 'ကန့်သတ်ထားသော အချိန်တွင် ထိုဘက်လမ်းတွင် ကားရပ်နားခွင့်မရှိ။', '表示時間は片側駐車禁止。'),
      sign('unbroken-double-white-lines.png', 'Double White Lines', 'အဖြူရောင်နှစ်ကြောင်း', '二重白色実線', 'Do not cross or straddle the centre lines.', 'အလယ်လမ်းကြောင်းကို မဖြတ်ရ၊ မတင်ရ။', '中央線を越えてはいけない。'),
      sign('broken-white-line.png', 'Broken White Line', 'အဖြူရောင်ပြတ်တိုက်', '白色破線', 'Lane divider; you may change lanes when safe.', 'လမ်းကြောင်းခွဲမှတ်။ လုံခြုံပါက လမ်းကြောင်းပြောင်းနိုင်သည်။', '車線境界。安全なら車線変更可。'),
      sign('continuous-white-line.png', 'Continuous White Line', 'အဖြူရောင်ဆက်တိုက်', '白色実線', 'Do not cross this line to overtake or change lanes.', 'ကျော်တက်ရန် သို့မဟုတ် လမ်းကြောင်းပြောင်းရန် ဤလိုင်းကို မဖြတ်ရ။', '追い越し・車線変更のため越えてはいけない。'),
      sign('double-yellow-zig-zag-lines.png', 'Double Yellow Zig-Zag Lines', 'အဝါရောင် ဇစ်ဇက် နှစ်ကြောင်း', '二重黄色ジグザグ', 'No stopping or parking near a pedestrian crossing.', 'လမ်းလျှောက်ဖြတ်သန်းရာ အနီးတွင် ရပ်နား သို့မဟုတ် ကားရပ်ခွင့်မရှိ။', '横断歩道付近は駐停車禁止。'),
      sign('a-single-yellow-zig-zag-line.png', 'Single Yellow Zig-Zag Line', 'အဝါရောင် ဇစ်ဇက် တစ်ကြောင်း', '黄色ジグザグ', 'No waiting on the side with zig-zag markings.', 'ဇစ်ဇက်အမှတ်အသားရှိ ဘက်တွင် စောင့်ဆိုင်းခွင့်မရှိ။', 'ジグザグ側は待機禁止。'),
      sign('zig-zag-lines-by-side-of-the-road.png', 'Zig-Zag Lines by Roadside', 'လမ်းဘေးဇစ်ဇက်အမှတ်', '路側ジグザグ', 'Marks a school or pedestrian zone; no stopping.', 'ကျောင်း သို့မဟုတ် လမ်းလျှောက်ဧရိယာ အမှတ်အသား။ ရပ်နားခွင့်မရှိ။', '学校・歩行者区域。駐停車禁止。'),
    ],
  },
  {
    category: {
      en: 'Traffic Lights & Signals',
      my: 'မီးပွိုင့်နှင့် အချက်ပြမှုများ',
      ja: '交通信号',
    },
    signs: [
      sign('amber.png', 'Amber Light', 'အဝါရောင်မီး', '黄信号', 'Prepare to stop unless you cannot stop safely.', 'လုံခြုံစွာ မရပ်နိုင်မှသာ ရပ်ရန် ပြင်ဆင်ပါ။', '安全に停止できない場合を除き停止準備。'),
      sign('green.png', 'Green Light', 'အစိမ်းရောင်မီး', '青信号', 'Proceed if the way is clear; give way to pedestrians still crossing.', 'လမ်းရှင်းလျှင် သွားပါ။ ဖြတ်သန်းနေသော လမ်းလျှောက်များကို လမ်းပေးပါ။', '安全なら進む。横断中の歩行者に譲る。'),
      sign('red.png', 'Red Light', 'အနီရောင်မီး', '赤信号', 'Stop behind the stop line and wait.', 'ရပ်တန့်လိုင်းနောက်တွင် ရပ်ပြီး စောင့်ပါ။', '停止線の手前で停止して待つ。'),
      sign('green-arrow.png', 'Green Arrow', 'အစိမ်းရောင် မြှား', '青矢印', 'You may proceed in the direction of the arrow if clear.', 'လမ်းရှင်းလျှင် မြှားညွှန်သည့်ဘက်သို့ သွားနိုင်သည်။', '安全なら矢印の方向に進行可。'),
      sign('the-green-arrow.png', 'Green Arrow (Filter)', 'အစိမ်းရောင် မြှား (စစ်ထုတ်)', '青矢印（進行可）', 'Filtered green arrow allows turning while other traffic is stopped.', 'အခြားယာဉ်ရပ်နေချိန် ကွေ့ခွင့်ပြုသော အစိမ်းရောင်မြှား။', '他方向が赤の時、矢印方向へ進行可。'),
      sign('the-red-cross.png', 'Red Cross (Lane Closed)', 'အနီရောင် မျဉ်းကြေး (လမ်းပိတ်)', '赤×（車線閉鎖）', 'Lane closed; do not enter this lane.', 'လမ်းကြောင်းပိတ်ထားသည်။ ဤလမ်းကြောင်းသို့ မဝင်ရ။', '車線閉鎖。このレーンに進入禁止。'),
      sign('pedestrian-signal-green-man.png', 'Pedestrian Green Man', 'လမ်းလျှောက် အစိမ်းရောင် လူပုံ', '歩行者青信号', 'Pedestrians may cross; drivers must give way.', 'လမ်းလျှောက်များ ဖြတ်သန်းနိုင်သည်။ ယာဉ်မောင်းများက လမ်းပေးရမည်။', '歩行者通行可。車両は譲る。'),
      sign('countdown-timer.png', 'Countdown Timer', 'နှစ်သက်ရေတွက်', 'カウントダウン', 'Shows seconds remaining; do not start crossing on low counts.', 'ကျန်ရှိသော စက္ကန့်ပြသည်။ နောက်ဆုံးစက္ကန့်များတွင် မဖြတ်သန်းပါနှင့်။', '残り秒数表示。少ない時は進入しない。'),
    ],
  },
  {
    category: {
      en: 'Police & Hand Signals',
      my: 'ရဲနှင့် လက်ဟန်ချက်များ',
      ja: '警察官の手信号',
    },
    signs: [
      sign('police-traffic.png', 'Police Traffic Control', 'ရဲယာဉ်ကြောညွှန်မှု', '警察の交通整理', 'Obey the police officer\'s directions over traffic lights.', 'မီးပွိုင့်ထက် ရဲအရာရှိ၏ ညွှန်ကြားချက်ကို လိုက်နာပါ။', '信号より警察官の指示を優先する。'),
      sign('police-traffic2.png', 'Police Directing Traffic', 'ရဲယာဉ်ကြောညွှန်နေသည်', '交通誘導中', 'Follow the officer\'s hand signals at the junction.', 'လမ်းဆုံမှ ရဲ၏ လက်ဟန်ချက်ကို လိုက်နာပါ။', '交差点で警察官の手信号に従う。'),
      sign('i-intend-to-stop.png', 'Stop Signal (Hand Raised)', 'ရပ်ရန် လက်ဟန်', '停止の手信号', 'Officer signals all traffic to stop; halt immediately.', 'ရဲက ယာဉ်အားလုံး ရပ်ရန် လက်ဟန်ပြသည်။ ချက်ချင်း ရပ်ပါ။', '全車両停止の合図。直ちに停止。'),
      sign('i-intend-to-slow-down.png', 'Slow Down Signal', 'ဖြည်းချရန် လက်ဟန်', '減速の手信号', 'Officer signals traffic to slow down.', 'ရဲက ယာဉ်များဖြည်းချရန် လက်ဟန်ပြသည်။', '減速を指示する手信号。'),
      sign('vehicles-approaching-police-officer-from-all-directions-to-stop.png', 'Stop All Directions', 'လမ်းလေးဘက်လုံး ရပ်ရန်', '全方向停止', 'All vehicles from every direction must stop.', 'လမ်းလေးဘက်လုံးမှ ယာဉ်အားလုံး ရပ်ရမည်။', '全方向からの車両は停止。'),
    ],
  },
];

function main() {
  const available = new Set(
    fs.existsSync(SIGNS_DIR)
      ? fs.readdirSync(SIGNS_DIR).filter((f) => f.endsWith('.png'))
      : [],
  );

  const output = { sections: [] };
  let total = 0;
  const missing = [];

  for (const section of SECTIONS) {
    const signs = [];
    for (const entry of section.signs) {
      if (!available.has(entry.file)) {
        missing.push(entry.file);
        continue;
      }
      signs.push(entry);
      total++;
    }
    if (signs.length > 0) {
      output.sections.push({ category: section.category, signs });
    }
  }

  if (missing.length > 0) {
    console.warn(`Warning: ${missing.length} image(s) missing in public/signs/sg/:`);
    for (const f of missing) console.warn(`  - ${f}`);
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

  console.log(`Wrote ${OUT_FILE}`);
  console.log(`Sections: ${output.sections.length}`);
  console.log(`Total signs: ${total}`);
}

main();
