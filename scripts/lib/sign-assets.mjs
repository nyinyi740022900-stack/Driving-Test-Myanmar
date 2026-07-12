import fs from 'fs';
import path from 'path';

/** Map script-friendly names → files that exist under public/signs/sg/. */
export const SG_IMAGE_ALIASES = {
  'wet-road.png': 'slippery-road.png',
  'traffic-light.png': 'amber.png',
  'warning-sign.png': 'caution.png',
  'mandatory-sign.png': 'ahead-only.png',
  'motorcycle-city.png': 'no-entry-for-motorcycles.png',
  'motorcycle-cornering.png': 'no-entry-for-motorcycles.png',
  'motorcycle-rain.png': 'slippery-road.png',
  'motorcycle-gear.png': 'no-entry-for-motorcycles.png',
  'highway.png': 'expressway-ahead.png',
  'expressway.png': 'expressway-ahead.png',
  'erp-road.png': 'gantry-sign.png',
  'bus-road.png': 'bus-lane.png',
  'junction.png': 'cross-junction.png',
  'pedestrian-crossing.png': 'pedestrian-crossing-ahead.png',
  'parking-sign.png': 'parking-signboard.png',
  'parking-lot.png': 'parking-signboard.png',
  'road-markings.png': 'merging-arrow-markings.png',
  'road-construction.png': 'caution-road-users.png',
  'car-engine.png': 'accident.png',
  'car-interior.png': 'accident.png',
  'tyre-check.png': 'accident.png',
  'night-driving.png': 'amber.png',
  'fog-road.png': 'caution.png',
  'speed-50.png': 'drive-within-the-speed-limit.png',
  'children-road.png': 'school-zone.png',
  'stop.png': 'ready-to-stop.png',
  'no-overtaking.png': 'no-entry.png',
};

export function loadAvailableSgSigns(signsDir) {
  return new Set(fs.readdirSync(signsDir).filter(f => f.endsWith('.png')));
}

export function resolveSgImage(name, available) {
  if (available.has(name)) return name;
  const alias = SG_IMAGE_ALIASES[name];
  if (alias && available.has(alias)) return alias;
  if (available.has('caution.png')) return 'caution.png';
  const first = [...available][0];
  return first ?? name;
}

export function sgMediaSrc(signsDir, filename, available) {
  const resolved = resolveSgImage(filename, available);
  return `/signs/sg/${resolved}`;
}

export function fileExistsForSrc(signsDir, src) {
  if (!src?.startsWith('/signs/sg/')) return false;
  return fs.existsSync(path.join(signsDir, path.basename(src)));
}
