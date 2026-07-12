#!/usr/bin/env node
/**
 * Assign /signs/sg/*.png media to all sg_rtt questions.
 * Usage: node scripts/fix-sg-rtt-media.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadAvailableSgSigns, resolveSgImage } from './lib/sign-assets.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RTT_PATH = path.join(__dirname, '..', 'content', 'questions', 'sg_rtt.json');
const SIGNS_DIR = path.join(__dirname, '..', 'public', 'signs', 'sg');
const AVAILABLE = loadAvailableSgSigns(SIGNS_DIR);

/** Per-question overrides (from download-question-images.py RTT map). */
const RTT_MEDIA = {
  sg_rtt_0001: 'no-entry.png',
  sg_rtt_0002: 'warning-sign.png',
  sg_rtt_0003: 'mandatory-sign.png',
  sg_rtt_0004: 'wet-road.png',
  sg_rtt_0005: 'warning-sign.png',
  sg_rtt_0006: 'traffic-light.png',
  sg_rtt_0007: 'junction.png',
  sg_rtt_0008: 'motorcycle-city.png',
  sg_rtt_0009: 'parking-sign.png',
  sg_rtt_0010: 'warning-sign.png',
  sg_rtt_0011: 'traffic-light.png',
  sg_rtt_0012: 'no-entry.png',
  sg_rtt_0013: 'warning-sign.png',
  sg_rtt_0014: 'expressway.png',
  sg_rtt_0015: 'warning-sign.png',
  sg_rtt_0016: 'pedestrian-crossing.png',
  sg_rtt_0017: 'stop.png',
  sg_rtt_0018: 'highway.png',
  sg_rtt_0019: 'no-overtaking.png',
  sg_rtt_0020: 'motorcycle-city.png',
  sg_rtt_0021: 'traffic-light.png',
  sg_rtt_0022: 'speed-50.png',
  sg_rtt_0023: 'erp-road.png',
  sg_rtt_0024: 'junction.png',
  sg_rtt_0025: 'mandatory-sign.png',
  sg_rtt_0026: 'roundabout.png',
  sg_rtt_0027: 'expressway.png',
  sg_rtt_0028: 'parking-lot.png',
  sg_rtt_0029: 'ambulance.png',
  sg_rtt_0030: 'bus-road.png',
  sg_rtt_0031: 'pedestrian-crossing.png',
  sg_rtt_0032: 'highway.png',
  sg_rtt_0033: 'motorcycle-city.png',
  sg_rtt_0034: 'give-way.png',
  sg_rtt_0035: 'highway.png',
  sg_rtt_0036: 'junction.png',
  sg_rtt_0037: 'motorcycle-city.png',
  sg_rtt_0038: 'traffic-light.png',
  sg_rtt_0039: 'school-zone.png',
  sg_rtt_0040: 'give-way.png',
  sg_rtt_0041: 'motorcycle-city.png',
  sg_rtt_0042: 'road-markings.png',
  sg_rtt_0043: 'motorcycle-city.png',
  sg_rtt_0044: 'no-entry.png',
  sg_rtt_0045: 'highway.png',
  sg_rtt_0046: 'motorcycle-city.png',
  sg_rtt_0047: 'motorcycle-city.png',
  sg_rtt_0048: 'junction.png',
  sg_rtt_0049: 'motorcycle-rain.png',
  sg_rtt_0050: 'motorcycle-city.png',
  sg_rtt_0051: 'motorcycle-city.png',
  sg_rtt_0052: 'highway.png',
  sg_rtt_0053: 'parking-lot.png',
  sg_rtt_0054: 'bus-road.png',
  sg_rtt_0055: 'motorcycle-city.png',
  sg_rtt_0056: 'bus-road.png',
  sg_rtt_0057: 'motorcycle-city.png',
  sg_rtt_0058: 'expressway.png',
  sg_rtt_0059: 'traffic-light.png',
  sg_rtt_0060: 'pedestrian-crossing.png',
  sg_rtt_0061: 'motorcycle-city.png',
  sg_rtt_0062: 'motorcycle-gear.png',
  sg_rtt_0063: 'bus-road.png',
  sg_rtt_0064: 'motorcycle-city.png',
  sg_rtt_0065: 'highway.png',
  sg_rtt_0066: 'motorcycle-city.png',
  sg_rtt_0067: 'bus-road.png',
  sg_rtt_0068: 'junction.png',
  sg_rtt_0069: 'night-driving.png',
  sg_rtt_0070: 'bus-road.png',
  sg_rtt_0071: 'motorcycle-cornering.png',
  sg_rtt_0072: 'motorcycle-cornering.png',
  sg_rtt_0073: 'motorcycle-cornering.png',
  sg_rtt_0074: 'motorcycle-cornering.png',
  sg_rtt_0075: 'motorcycle-cornering.png',
  sg_rtt_0076: 'highway.png',
  sg_rtt_0077: 'motorcycle-cornering.png',
  sg_rtt_0078: 'motorcycle-cornering.png',
  sg_rtt_0079: 'wet-road.png',
  sg_rtt_0080: 'motorcycle-cornering.png',
  sg_rtt_0081: 'wet-road.png',
  sg_rtt_0082: 'wet-road.png',
  sg_rtt_0083: 'road-construction.png',
  sg_rtt_0084: 'highway.png',
  sg_rtt_0085: 'wet-road.png',
  sg_rtt_0086: 'motorcycle-rain.png',
  sg_rtt_0087: 'bus-road.png',
  sg_rtt_0088: 'highway.png',
  sg_rtt_0089: 'wet-road.png',
  sg_rtt_0090: 'wet-road.png',
  sg_rtt_0091: 'motorcycle-gear.png',
  sg_rtt_0092: 'motorcycle-gear.png',
  sg_rtt_0093: 'motorcycle-city.png',
  sg_rtt_0094: 'motorcycle-cornering.png',
  sg_rtt_0095: 'motorcycle-gear.png',
  sg_rtt_0096: 'motorcycle-gear.png',
  sg_rtt_0097: 'motorcycle-city.png',
  sg_rtt_0098: 'motorcycle-cornering.png',
  sg_rtt_0099: 'motorcycle-rain.png',
  sg_rtt_0100: 'motorcycle-cornering.png',
};

const TOPIC_DEFAULT = {
  road_signs_signals: 'warning-sign.png',
  right_of_way_traffic_rules: 'junction.png',
  lane_filtering_positioning: 'motorcycle-city.png',
  blind_spots_visibility: 'motorcycle-city.png',
  balance_cornering_hazards: 'motorcycle-cornering.png',
  weather_road_surface_hazards: 'wet-road.png',
  protective_gear_pillion_rules: 'motorcycle-gear.png',
};

function altFromPrompt(q) {
  const en = (q.prompt?.en ?? q.id).slice(0, 80);
  const my = (q.prompt?.my ?? q.id).slice(0, 80);
  return { en, my };
}

const questions = JSON.parse(fs.readFileSync(RTT_PATH, 'utf8'));
let updated = 0;

for (const q of questions) {
  const raw = RTT_MEDIA[q.id] ?? TOPIC_DEFAULT[q.topic] ?? 'motorcycle-city.png';
  const file = resolveSgImage(raw, AVAILABLE);
  const src = `/signs/sg/${file}`;
  if (q.media?.src !== src) {
    q.media = { type: 'image', src, alt: altFromPrompt(q) };
    updated++;
  }
}

fs.writeFileSync(RTT_PATH, `${JSON.stringify(questions, null, 2)}\n`, 'utf8');
console.log(`sg_rtt.json: updated media on ${updated}/${questions.length} questions`);
