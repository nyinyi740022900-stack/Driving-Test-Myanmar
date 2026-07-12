#!/usr/bin/env node
/**
 * Assign /signs/sg/*.png media to SG questions missing media (topic + keyword rules).
 * Preserves existing media unless --all is passed.
 *
 * Usage:
 *   node scripts/attach-sg-media.mjs
 *   node scripts/attach-sg-media.mjs sg_ftt
 *   node scripts/attach-sg-media.mjs --all sg_btt
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadAvailableSgSigns, resolveSgImage } from './lib/sign-assets.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const QUESTIONS_DIR = path.join(__dirname, '..', 'content', 'questions');
const SIGNS_DIR = path.join(__dirname, '..', 'public', 'signs', 'sg');

const AVAILABLE = loadAvailableSgSigns(SIGNS_DIR);

const KEYWORD_RULES = [
  { re: /\b(no entry|do not enter|white horizontal bar)\b/i, img: 'no-entry.png' },
  { re: /\b(no overtaking|overtaking is not)\b/i, img: 'no-overtaking.png' },
  { re: /\b(give way to bus|give-way to bus)\b/i, img: 'bus-road.png' },
  { re: /\b(give way|give-way)\b/i, img: 'give-way.png' },
  { re: /\b(stop sign|come to a stop)\b/i, img: 'stop.png' },
  { re: /\b(school|children|child figure|pupil)\b/i, img: 'children-road.png' },
  { re: /\b(pedestrian|zebra crossing|crosswalk|cyclist)\b/i, img: 'pedestrian-crossing.png' },
  { re: /\b(roundabout)\b/i, img: 'roundabout.png' },
  { re: /\b(traffic light|red light|amber|green arrow)\b/i, img: 'traffic-light.png' },
  { re: /\b(expressway|PIE|CTE|BKE|AYE|on-ramp|slip road)\b/i, img: 'expressway.png' },
  { re: /\b(ERP|road pricing|gantry)\b/i, img: 'erp-road.png' },
  { re: /\b(wet|rain|slippery|skidding|downpour)\b/i, img: 'wet-road.png' },
  { re: /\b(fog|mist|visibility)\b/i, img: 'fog-road.png' },
  { re: /\b(ambulance|emergency vehicle|siren|fire engine)\b/i, img: 'ambulance.png' },
  { re: /\b(mandatory|blue circle|must turn)\b/i, img: 'mandatory-sign.png' },
  { re: /\b(triangular warning|warning sign|hazard ahead)\b/i, img: 'warning-sign.png' },
  { re: /\b(parking|parked|no waiting)\b/i, img: 'parking-sign.png' },
  { re: /\b(roadworks|road works|construction)\b/i, img: 'road-construction.png' },
  { re: /\b(tyre|tire|brake fluid|engine oil|coolant|dashboard warning)\b/i, img: 'car-engine.png' },
  { re: /\b(seatbelt|mirror|mobile phone|handheld)\b/i, img: 'car-interior.png' },
  { re: /\b(motorcycle|motorbike|filtering|pillion|helmet|protective gear)\b/i, img: 'motorcycle-city.png' },
  { re: /\b(tunnel|night|headlight|overdriving)\b/i, img: 'night-driving.png' },
  { re: /\b(accident|collision|crash)\b/i, img: 'accident.png' },
  { re: /\b(bus|lorry|heavy vehicle)\b/i, img: 'bus-road.png' },
  { re: /\b(tow|towing|trailer)\b/i, img: 'highway.png' },
  { re: /\b(lane|marking|chevron|white line)\b/i, img: 'road-markings.png' },
  { re: /\b(junction|intersection|merge|u-turn)\b/i, img: 'junction.png' },
  { re: /\b(speed limit|50 km|80 km|90 km)\b/i, img: 'speed-50.png' },
];

const TOPIC_DEFAULT = {
  sg_btt: {
    road_signs: 'warning-sign.png',
    traffic_signs_prohibitory: 'no-entry.png',
    traffic_rules_right_of_way: 'junction.png',
    give_way: 'give-way.png',
    roundabouts: 'roundabout.png',
    traffic_rules_speed_limits: 'speed-50.png',
    speed_limits: 'speed-50.png',
    traffic_rules_lane_usage: 'road-markings.png',
    traffic_rules_overtaking: 'no-overtaking.png',
    overtaking: 'no-overtaking.png',
    traffic_rules_parking: 'parking-sign.png',
    traffic_rules_pedestrian: 'pedestrian-crossing.png',
    pedestrian_safety: 'pedestrian-crossing.png',
    school_zones: 'school-zone.png',
    vehicle_lights: 'traffic-light.png',
    traffic_rules_lights: 'traffic-light.png',
    defensive_driving: 'highway.png',
    emergency_vehicles: 'ambulance.png',
    special_situations: 'warning-sign.png',
    safe_practices: 'car-interior.png',
    tunnel_driving: 'night-driving.png',
    road_works: 'road-construction.png',
    u_turn: 'junction.png',
    yellow_box_junction: 'junction.png',
    silver_zones: 'parking-sign.png',
    police_signals: 'junction.png',
    right_of_way: 'give-way.png',
    licence_basics: 'car-interior.png',
  },
  sg_ftt: {
    expressway_driving: 'expressway.png',
    advanced_traffic_rules: 'junction.png',
    vehicle_maintenance: 'car-engine.png',
    hazard_speed_management: 'highway.png',
    driver_behaviour: 'highway.png',
    defensive_driving: 'highway.png',
    advanced_road_signs: 'warning-sign.png',
    eco_driving: 'highway.png',
    eco_driving_vehicle_maintenance: 'car-engine.png',
    vulnerable_road_users: 'pedestrian-crossing.png',
    accident_procedures: 'accident.png',
    wet_weather: 'wet-road.png',
    special_vehicles: 'bus-road.png',
    singapore_specific: 'erp-road.png',
    night_driving: 'night-driving.png',
    fog_driving: 'fog-road.png',
    motorcycle_rules: 'motorcycle-city.png',
    advanced_parking: 'parking-lot.png',
    towing: 'highway.png',
    roundabouts: 'roundabout.png',
    motorcycle_safety_gear: 'motorcycle-gear.png',
    load_securing: 'highway.png',
    motorcycle_safety_techniques: 'motorcycle-cornering.png',
    emergency_stop: 'highway.png',
    alcohol_drug_driving: 'highway.png',
    alcohol: 'highway.png',
    courteous_driving: 'highway.png',
  },
  sg_rtt: {
    road_signs_signals: 'warning-sign.png',
    right_of_way_traffic_rules: 'junction.png',
    lane_filtering_positioning: 'motorcycle-city.png',
    blind_spots_visibility: 'motorcycle-city.png',
    balance_cornering_hazards: 'motorcycle-cornering.png',
    weather_road_surface_hazards: 'wet-road.png',
    protective_gear_pillion_rules: 'motorcycle-gear.png',
  },
};

function pickImage(q, bank) {
  const promptEn = q.prompt?.en ?? '';
  const fullEn = [promptEn, q.explanation?.en ?? ''].join(' ');

  for (const { re, img } of KEYWORD_RULES) {
    if (re.test(promptEn)) return resolveSgImage(img, AVAILABLE);
  }
  for (const { re, img } of KEYWORD_RULES) {
    if (re.test(fullEn)) return resolveSgImage(img, AVAILABLE);
  }

  const fallback = TOPIC_DEFAULT[bank]?.[q.topic] ?? 'highway.png';
  return resolveSgImage(fallback, AVAILABLE);
}

function altFromPrompt(q) {
  return {
    en: (q.prompt?.en ?? q.id).slice(0, 80),
    my: (q.prompt?.my ?? q.id).slice(0, 80),
  };
}

function processBank(bank, forceAll) {
  const filePath = path.join(QUESTIONS_DIR, `${bank}.json`);
  const questions = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let updated = 0;
  let skipped = 0;

  for (const q of questions) {
    if (q.media?.src && !forceAll) {
      skipped++;
      continue;
    }
    const img = pickImage(q, bank);
    const src = `/signs/sg/${img}`;
    if (q.media?.src !== src) {
      q.media = { type: 'image', src, alt: altFromPrompt(q) };
      updated++;
    }
  }

  fs.writeFileSync(filePath, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
  const withMedia = questions.filter(q => q.media?.src).length;
  return { total: questions.length, updated, skipped, withMedia };
}

function main() {
  const args = process.argv.slice(2);
  const forceAll = args.includes('--all');
  const banks = args.filter(a => !a.startsWith('--'));
  const targets = banks.length ? banks : ['sg_btt', 'sg_ftt', 'sg_rtt'];

  for (const bank of targets) {
    if (!TOPIC_DEFAULT[bank]) {
      console.error(`Unknown bank: ${bank}`);
      process.exit(1);
    }
    const r = processBank(bank, forceAll);
    const pct = Math.round((100 * r.withMedia) / r.total);
    console.log(
      `[${bank}] attached ${r.updated}, kept ${r.skipped} existing → ${r.withMedia}/${r.total} (${pct}%)`,
    );
  }
}

main();
