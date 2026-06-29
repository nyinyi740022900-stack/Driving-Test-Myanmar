#!/usr/bin/env python3
"""
Downloads appropriate images for all jp_car (140) and jp_moto (100) quiz questions.
Sources: Wikimedia Commons (Japanese road signs) + Pexels (scenario photos).
Reuses generic scenario PNGs already in public/signs/sg/ where applicable.
"""

import json, os, urllib.request, subprocess, time, shutil

JP_DIR  = os.path.join(os.path.dirname(__file__), '../public/signs/jp')
SG_DIR  = os.path.join(os.path.dirname(__file__), '../public/signs/sg')
SVG_TMP = os.path.join(JP_DIR, 'svg_tmp')
os.makedirs(JP_DIR, exist_ok=True)
os.makedirs(SVG_TMP, exist_ok=True)

WIKI = 'https://upload.wikimedia.org/wikipedia/commons'

# ── Wikimedia Japanese road sign SVGs ─────────────────────────────────────────
JP_SVGS = {
    'jp-speed-limit.svg':   f'{WIKI}/f/f7/Japan_road_sign_322.svg',
    'jp-no-entry.svg':      f'{WIKI}/5/5b/Japan_road_sign_305.svg',
    'jp-stop.svg':          f'{WIKI}/b/b5/Japan_road_sign_330.svg',
    'jp-give-way.svg':      f'{WIKI}/2/23/Japan_road_sign_327.svg',
    'jp-no-overtaking.svg': f'{WIKI}/5/5a/Japan_road_sign_314.svg',
    'jp-one-way.svg':       f'{WIKI}/9/96/Japan_road_sign_327-A.svg',
    'jp-warning.svg':       f'{WIKI}/d/d5/Japan_road_sign_201-A.svg',
    'jp-pedestrian-cross.svg': f'{WIKI}/2/27/Japan_road_sign_224.svg',
    'jp-school-zone.svg':   f'{WIKI}/6/6b/Japan_road_sign_325.svg',
}

# ── Pexels scenario photos (Japan-relevant, free license) ────────────────────
PEXELS = {
    'jp-expressway.png': 'https://images.pexels.com/photos/16482320/pexels-photo-16482320.jpeg?auto=compress&cs=tinysrgb&w=600',
    'jp-intersection.png': 'https://images.pexels.com/photos/21792870/pexels-photo-21792870.jpeg?auto=compress&cs=tinysrgb&w=600',
    'jp-night-road.png': 'https://images.pexels.com/photos/11914217/pexels-photo-11914217.jpeg?auto=compress&cs=tinysrgb&w=600',
    'jp-wet-road.png': 'https://images.pexels.com/photos/37828192/pexels-photo-37828192.jpeg?auto=compress&cs=tinysrgb&w=600',
    'jp-motorcycle.png': 'https://images.pexels.com/photos/32087029/pexels-photo-32087029.jpeg?auto=compress&cs=tinysrgb&w=600',
    'jp-motorcycle-corner.png': 'https://images.pexels.com/photos/27100161/pexels-photo-27100161.jpeg?auto=compress&cs=tinysrgb&w=600',
    'jp-motorcycle-gear.png': 'https://images.pexels.com/photos/35712915/pexels-photo-35712915.jpeg?auto=compress&cs=tinysrgb&w=600',
    'jp-car-interior.png': 'https://images.pexels.com/photos/18089878/pexels-photo-18089878.jpeg?auto=compress&cs=tinysrgb&w=600',
    'jp-car-engine.png': 'https://images.pexels.com/photos/8478259/pexels-photo-8478259.jpeg?auto=compress&cs=tinysrgb&w=600',
    'jp-tyre-check.png': 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=600',
    'jp-parking.png': 'https://images.pexels.com/photos/5231181/pexels-photo-5231181.jpeg?auto=compress&cs=tinysrgb&w=600',
    'jp-pedestrian.png': 'https://images.pexels.com/photos/16474185/pexels-photo-16474185.jpeg?auto=compress&cs=tinysrgb&w=600',
    'jp-fog-road.png': 'https://images.pexels.com/photos/1253050/pexels-photo-1253050.jpeg?auto=compress&cs=tinysrgb&w=600',
    'jp-roundabout.png': 'https://images.pexels.com/photos/7691757/pexels-photo-7691757.jpeg?auto=compress&cs=tinysrgb&w=600',
    'jp-road-markings.png': 'https://images.pexels.com/photos/16482320/pexels-photo-16482320.jpeg?auto=compress&cs=tinysrgb&w=600',
    'jp-hazard.png': 'https://images.pexels.com/photos/34338597/pexels-photo-34338597.jpeg?auto=compress&cs=tinysrgb&w=600',
    'jp-ambulance.png': 'https://images.pexels.com/photos/9965658/pexels-photo-9965658.jpeg?auto=compress&cs=tinysrgb&w=600',
}

# ── jp_car question → image mapping (140 questions) ──────────────────────────
# Topic breakdown: karimen_road_signs(15), karimen_speed_limits_parking(10),
# honmen_parking_rules(10), honmen_weather_night_driving(15),
# honmen_safe_driving_practices(15), honmen_expressway(20),
# honmen_road_signs_signals(15), karimen_right_of_way(10),
# honmen_right_of_way_intersections(15), honmen_hazard_prediction_illustration(15)

CAR_MAP = {
    # karimen_road_signs (Q1–15) — Japanese road sign identification
    'jp_car_0001': 'jp-speed-limit.png',
    'jp_car_0002': 'jp-no-entry.png',
    'jp_car_0003': 'jp-warning.png',
    'jp_car_0004': 'jp-stop.png',
    'jp_car_0005': 'jp-give-way.png',
    'jp_car_0006': 'jp-no-overtaking.png',
    'jp_car_0007': 'jp-one-way.png',
    'jp_car_0008': 'jp-speed-limit.png',
    'jp_car_0009': 'jp-no-entry.png',
    'jp_car_0010': 'jp-pedestrian-cross.png',
    'jp_car_0011': 'jp-warning.png',
    'jp_car_0012': 'jp-stop.png',
    'jp_car_0013': 'jp-school-zone.png',
    'jp_car_0014': 'jp-one-way.png',
    'jp_car_0015': 'jp-give-way.png',
    # karimen_speed_limits_parking (Q16–25)
    'jp_car_0016': 'jp-speed-limit.png',
    'jp_car_0017': 'jp-speed-limit.png',
    'jp_car_0018': 'jp-parking.png',
    'jp_car_0019': 'jp-parking.png',
    'jp_car_0020': 'jp-speed-limit.png',
    'jp_car_0021': 'jp-parking.png',
    'jp_car_0022': 'jp-speed-limit.png',
    'jp_car_0023': 'jp-parking.png',
    'jp_car_0024': 'jp-speed-limit.png',
    'jp_car_0025': 'jp-parking.png',
    # honmen_parking_rules (Q26–35)
    'jp_car_0026': 'jp-parking.png',
    'jp_car_0027': 'jp-parking.png',
    'jp_car_0028': 'jp-parking.png',
    'jp_car_0029': 'jp-road-markings.png',
    'jp_car_0030': 'jp-parking.png',
    'jp_car_0031': 'jp-parking.png',
    'jp_car_0032': 'jp-road-markings.png',
    'jp_car_0033': 'jp-parking.png',
    'jp_car_0034': 'jp-parking.png',
    'jp_car_0035': 'jp-road-markings.png',
    # honmen_weather_night_driving (Q36–50)
    'jp_car_0036': 'jp-wet-road.png',
    'jp_car_0037': 'jp-night-road.png',
    'jp_car_0038': 'jp-fog-road.png',
    'jp_car_0039': 'jp-wet-road.png',
    'jp_car_0040': 'jp-night-road.png',
    'jp_car_0041': 'jp-wet-road.png',
    'jp_car_0042': 'jp-fog-road.png',
    'jp_car_0043': 'jp-wet-road.png',
    'jp_car_0044': 'jp-night-road.png',
    'jp_car_0045': 'jp-wet-road.png',
    'jp_car_0046': 'jp-fog-road.png',
    'jp_car_0047': 'jp-night-road.png',
    'jp_car_0048': 'jp-wet-road.png',
    'jp_car_0049': 'jp-night-road.png',
    'jp_car_0050': 'jp-fog-road.png',
    # honmen_safe_driving_practices (Q51–65)
    'jp_car_0051': 'jp-car-interior.png',
    'jp_car_0052': 'jp-tyre-check.png',
    'jp_car_0053': 'jp-car-engine.png',
    'jp_car_0054': 'jp-car-interior.png',
    'jp_car_0055': 'jp-tyre-check.png',
    'jp_car_0056': 'jp-expressway.png',
    'jp_car_0057': 'jp-car-engine.png',
    'jp_car_0058': 'jp-car-interior.png',
    'jp_car_0059': 'jp-tyre-check.png',
    'jp_car_0060': 'jp-car-interior.png',
    'jp_car_0061': 'jp-car-engine.png',
    'jp_car_0062': 'jp-expressway.png',
    'jp_car_0063': 'jp-car-interior.png',
    'jp_car_0064': 'jp-tyre-check.png',
    'jp_car_0065': 'jp-car-engine.png',
    # honmen_expressway (Q66–85)
    'jp_car_0066': 'jp-expressway.png',
    'jp_car_0067': 'jp-expressway.png',
    'jp_car_0068': 'jp-expressway.png',
    'jp_car_0069': 'jp-expressway.png',
    'jp_car_0070': 'jp-expressway.png',
    'jp_car_0071': 'jp-expressway.png',
    'jp_car_0072': 'jp-expressway.png',
    'jp_car_0073': 'jp-expressway.png',
    'jp_car_0074': 'jp-expressway.png',
    'jp_car_0075': 'jp-expressway.png',
    'jp_car_0076': 'jp-expressway.png',
    'jp_car_0077': 'jp-expressway.png',
    'jp_car_0078': 'jp-wet-road.png',
    'jp_car_0079': 'jp-night-road.png',
    'jp_car_0080': 'jp-expressway.png',
    'jp_car_0081': 'jp-expressway.png',
    'jp_car_0082': 'jp-expressway.png',
    'jp_car_0083': 'jp-expressway.png',
    'jp_car_0084': 'jp-expressway.png',
    'jp_car_0085': 'jp-expressway.png',
    # honmen_road_signs_signals (Q86–100)
    'jp_car_0086': 'jp-no-entry.png',
    'jp_car_0087': 'jp-speed-limit.png',
    'jp_car_0088': 'jp-warning.png',
    'jp_car_0089': 'jp-stop.png',
    'jp_car_0090': 'jp-give-way.png',
    'jp_car_0091': 'jp-no-overtaking.png',
    'jp_car_0092': 'jp-pedestrian-cross.png',
    'jp_car_0093': 'jp-school-zone.png',
    'jp_car_0094': 'jp-one-way.png',
    'jp_car_0095': 'jp-warning.png',
    'jp_car_0096': 'jp-speed-limit.png',
    'jp_car_0097': 'jp-no-entry.png',
    'jp_car_0098': 'jp-stop.png',
    'jp_car_0099': 'jp-warning.png',
    'jp_car_0100': 'jp-speed-limit.png',
    # karimen_right_of_way (Q101–110)
    'jp_car_0101': 'jp-intersection.png',
    'jp_car_0102': 'jp-roundabout.png',
    'jp_car_0103': 'jp-intersection.png',
    'jp_car_0104': 'jp-give-way.png',
    'jp_car_0105': 'jp-intersection.png',
    'jp_car_0106': 'jp-stop.png',
    'jp_car_0107': 'jp-intersection.png',
    'jp_car_0108': 'jp-roundabout.png',
    'jp_car_0109': 'jp-intersection.png',
    'jp_car_0110': 'jp-give-way.png',
    # honmen_right_of_way_intersections (Q111–125)
    'jp_car_0111': 'jp-intersection.png',
    'jp_car_0112': 'jp-intersection.png',
    'jp_car_0113': 'jp-roundabout.png',
    'jp_car_0114': 'jp-pedestrian.png',
    'jp_car_0115': 'jp-intersection.png',
    'jp_car_0116': 'jp-ambulance.png',
    'jp_car_0117': 'jp-intersection.png',
    'jp_car_0118': 'jp-roundabout.png',
    'jp_car_0119': 'jp-intersection.png',
    'jp_car_0120': 'jp-pedestrian.png',
    'jp_car_0121': 'jp-intersection.png',
    'jp_car_0122': 'jp-ambulance.png',
    'jp_car_0123': 'jp-intersection.png',
    'jp_car_0124': 'jp-roundabout.png',
    'jp_car_0125': 'jp-intersection.png',
    # honmen_hazard_prediction_illustration (Q126–140)
    'jp_car_0126': 'jp-pedestrian.png',
    'jp_car_0127': 'jp-intersection.png',
    'jp_car_0128': 'jp-expressway.png',
    'jp_car_0129': 'jp-hazard.png',
    'jp_car_0130': 'jp-pedestrian.png',
    'jp_car_0131': 'jp-intersection.png',
    'jp_car_0132': 'jp-wet-road.png',
    'jp_car_0133': 'jp-hazard.png',
    'jp_car_0134': 'jp-pedestrian.png',
    'jp_car_0135': 'jp-expressway.png',
    'jp_car_0136': 'jp-hazard.png',
    'jp_car_0137': 'jp-intersection.png',
    'jp_car_0138': 'jp-wet-road.png',
    'jp_car_0139': 'jp-pedestrian.png',
    'jp_car_0140': 'jp-hazard.png',
}

# ── jp_moto question → image mapping (100 questions) ─────────────────────────
# Topics: road_signs_signals(15), right_of_way_traffic_rules(15),
# balance_cornering_techniques(15), blind_spots_visibility(10),
# pillion_passenger_rules(5), protective_gear_rules(10),
# lane_position_road_surface(10), weather_hazards(10), hazard_prediction_illustration(10)

MOTO_MAP = {
    # road_signs_signals (Q1–15)
    'jp_moto_0001': 'jp-no-entry.png',
    'jp_moto_0002': 'jp-speed-limit.png',
    'jp_moto_0003': 'jp-warning.png',
    'jp_moto_0004': 'jp-stop.png',
    'jp_moto_0005': 'jp-give-way.png',
    'jp_moto_0006': 'jp-no-overtaking.png',
    'jp_moto_0007': 'jp-one-way.png',
    'jp_moto_0008': 'jp-speed-limit.png',
    'jp_moto_0009': 'jp-no-entry.png',
    'jp_moto_0010': 'jp-pedestrian-cross.png',
    'jp_moto_0011': 'jp-warning.png',
    'jp_moto_0012': 'jp-school-zone.png',
    'jp_moto_0013': 'jp-stop.png',
    'jp_moto_0014': 'jp-give-way.png',
    'jp_moto_0015': 'jp-speed-limit.png',
    # right_of_way_traffic_rules (Q16–30)
    'jp_moto_0016': 'jp-intersection.png',
    'jp_moto_0017': 'jp-roundabout.png',
    'jp_moto_0018': 'jp-intersection.png',
    'jp_moto_0019': 'jp-give-way.png',
    'jp_moto_0020': 'jp-intersection.png',
    'jp_moto_0021': 'jp-stop.png',
    'jp_moto_0022': 'jp-roundabout.png',
    'jp_moto_0023': 'jp-intersection.png',
    'jp_moto_0024': 'jp-ambulance.png',
    'jp_moto_0025': 'jp-intersection.png',
    'jp_moto_0026': 'jp-pedestrian.png',
    'jp_moto_0027': 'jp-roundabout.png',
    'jp_moto_0028': 'jp-intersection.png',
    'jp_moto_0029': 'jp-give-way.png',
    'jp_moto_0030': 'jp-intersection.png',
    # balance_cornering_techniques (Q31–45)
    'jp_moto_0031': 'jp-motorcycle-corner.png',
    'jp_moto_0032': 'jp-motorcycle-corner.png',
    'jp_moto_0033': 'jp-motorcycle-corner.png',
    'jp_moto_0034': 'jp-motorcycle-corner.png',
    'jp_moto_0035': 'jp-motorcycle-corner.png',
    'jp_moto_0036': 'jp-motorcycle-corner.png',
    'jp_moto_0037': 'jp-motorcycle-corner.png',
    'jp_moto_0038': 'jp-motorcycle-corner.png',
    'jp_moto_0039': 'jp-wet-road.png',
    'jp_moto_0040': 'jp-motorcycle-corner.png',
    'jp_moto_0041': 'jp-motorcycle-corner.png',
    'jp_moto_0042': 'jp-motorcycle-corner.png',
    'jp_moto_0043': 'jp-road-markings.png',
    'jp_moto_0044': 'jp-motorcycle-corner.png',
    'jp_moto_0045': 'jp-motorcycle-corner.png',
    # blind_spots_visibility (Q46–55)
    'jp_moto_0046': 'jp-motorcycle.png',
    'jp_moto_0047': 'jp-motorcycle.png',
    'jp_moto_0048': 'jp-motorcycle.png',
    'jp_moto_0049': 'jp-night-road.png',
    'jp_moto_0050': 'jp-motorcycle.png',
    'jp_moto_0051': 'jp-motorcycle.png',
    'jp_moto_0052': 'jp-motorcycle.png',
    'jp_moto_0053': 'jp-night-road.png',
    'jp_moto_0054': 'jp-motorcycle.png',
    'jp_moto_0055': 'jp-motorcycle.png',
    # pillion_passenger_rules (Q56–60)
    'jp_moto_0056': 'jp-motorcycle-corner.png',
    'jp_moto_0057': 'jp-motorcycle-gear.png',
    'jp_moto_0058': 'jp-motorcycle-corner.png',
    'jp_moto_0059': 'jp-motorcycle.png',
    'jp_moto_0060': 'jp-motorcycle-corner.png',
    # protective_gear_rules (Q61–70)
    'jp_moto_0061': 'jp-motorcycle-gear.png',
    'jp_moto_0062': 'jp-motorcycle-gear.png',
    'jp_moto_0063': 'jp-motorcycle-gear.png',
    'jp_moto_0064': 'jp-motorcycle-gear.png',
    'jp_moto_0065': 'jp-motorcycle-gear.png',
    'jp_moto_0066': 'jp-motorcycle-gear.png',
    'jp_moto_0067': 'jp-motorcycle-gear.png',
    'jp_moto_0068': 'jp-motorcycle-gear.png',
    'jp_moto_0069': 'jp-night-road.png',
    'jp_moto_0070': 'jp-motorcycle-gear.png',
    # lane_position_road_surface (Q71–80)
    'jp_moto_0071': 'jp-motorcycle.png',
    'jp_moto_0072': 'jp-road-markings.png',
    'jp_moto_0073': 'jp-motorcycle.png',
    'jp_moto_0074': 'jp-road-markings.png',
    'jp_moto_0075': 'jp-motorcycle.png',
    'jp_moto_0076': 'jp-wet-road.png',
    'jp_moto_0077': 'jp-motorcycle.png',
    'jp_moto_0078': 'jp-road-markings.png',
    'jp_moto_0079': 'jp-motorcycle.png',
    'jp_moto_0080': 'jp-road-markings.png',
    # weather_hazards (Q81–90)
    'jp_moto_0081': 'jp-wet-road.png',
    'jp_moto_0082': 'jp-wet-road.png',
    'jp_moto_0083': 'jp-fog-road.png',
    'jp_moto_0084': 'jp-wet-road.png',
    'jp_moto_0085': 'jp-wet-road.png',
    'jp_moto_0086': 'jp-fog-road.png',
    'jp_moto_0087': 'jp-wet-road.png',
    'jp_moto_0088': 'jp-hazard.png',
    'jp_moto_0089': 'jp-wet-road.png',
    'jp_moto_0090': 'jp-fog-road.png',
    # hazard_prediction_illustration (Q91–100)
    'jp_moto_0091': 'jp-hazard.png',
    'jp_moto_0092': 'jp-pedestrian.png',
    'jp_moto_0093': 'jp-intersection.png',
    'jp_moto_0094': 'jp-hazard.png',
    'jp_moto_0095': 'jp-wet-road.png',
    'jp_moto_0096': 'jp-pedestrian.png',
    'jp_moto_0097': 'jp-hazard.png',
    'jp_moto_0098': 'jp-intersection.png',
    'jp_moto_0099': 'jp-wet-road.png',
    'jp_moto_0100': 'jp-hazard.png',
}


def download(url, dest):
    if os.path.exists(dest) and os.path.getsize(dest) > 500:
        print(f'  [skip] {os.path.basename(dest)}')
        return True
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (educational app)'})
        with urllib.request.urlopen(req, timeout=15) as r:
            data = r.read()
        if len(data) < 200:
            print(f'  [WARN] {os.path.basename(dest)} too small ({len(data)} bytes)')
            return False
        with open(dest, 'wb') as f:
            f.write(data)
        print(f'  [OK] {os.path.basename(dest)} ({len(data)//1024}KB)')
        return True
    except Exception as e:
        print(f'  [FAIL] {os.path.basename(dest)}: {e}')
        return False


def main():
    # 1. Download JP road sign SVGs
    print('Downloading JP road sign SVGs...')
    failed_svgs = []
    for name, url in JP_SVGS.items():
        dest = os.path.join(SVG_TMP, name)
        if not download(url, dest):
            failed_svgs.append(name)
        time.sleep(0.3)

    # 2. Convert SVGs to PNG using qlmanage
    svg_files = [os.path.join(SVG_TMP, n) for n in JP_SVGS if n not in failed_svgs
                 and os.path.exists(os.path.join(SVG_TMP, n))]
    if svg_files:
        print(f'\nConverting {len(svg_files)} SVGs to PNG...')
        subprocess.run(['qlmanage', '-t', '-s', '400', '-o', SVG_TMP] + svg_files,
                       capture_output=True)
        # Move SVG.png → final PNG name
        for svg_name in JP_SVGS:
            if svg_name in failed_svgs:
                continue
            svg_path = os.path.join(SVG_TMP, svg_name)
            png_src  = svg_path + '.png'
            png_dest = os.path.join(JP_DIR, svg_name.replace('.svg', '.png'))
            if os.path.exists(png_src):
                shutil.copy(png_src, png_dest)
                print(f'  [OK] {os.path.basename(png_dest)}')
            else:
                print(f'  [MISS] {svg_name} conversion produced no PNG')

    # 3. Download Pexels scenario photos
    print('\nDownloading Pexels scenario photos...')
    for name, url in PEXELS.items():
        download(url, os.path.join(JP_DIR, name))
        time.sleep(0.3)

    # 4. Clean up temp SVGs
    shutil.rmtree(SVG_TMP, ignore_errors=True)

    # 5. Update jp_car.json and jp_moto.json
    print('\nUpdating question JSON files...')
    questions_dir = os.path.join(os.path.dirname(__file__), '../content/questions')
    combined_map  = {**CAR_MAP, **MOTO_MAP}

    for fname in ['jp_car', 'jp_moto']:
        path = os.path.join(questions_dir, f'{fname}.json')
        with open(path) as f:
            questions = json.load(f)
        updated = 0
        for q in questions:
            img = combined_map.get(q['id'])
            if img:
                img_path = os.path.join(JP_DIR, img)
                if os.path.exists(img_path) and os.path.getsize(img_path) > 500:
                    q['media'] = {
                        'type': 'image',
                        'src': f'/signs/jp/{img}',
                        'alt': {'ja': q['prompt'].get('ja', '')[:60],
                                'my': q['prompt'].get('my', '')[:60]},
                    }
                    updated += 1
                else:
                    print(f'  MISSING image for {q["id"]}: {img}')
        with open(path, 'w') as f:
            json.dump(questions, f, ensure_ascii=False, indent=2)
        print(f'  {fname}.json: {updated} questions updated')

    print('\nDone!')


if __name__ == '__main__':
    main()
