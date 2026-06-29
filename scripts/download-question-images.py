#!/usr/bin/env python3
"""
Downloads appropriate images for all BTT/FTT/RTT quiz questions.
Sources: Wikimedia Commons (road signs, CC-BY-SA) and Pexels (scenarios, free).
"""

import json
import os
import urllib.request
import time

SIGNS_DIR = os.path.join(os.path.dirname(__file__), '../public/signs/sg')
os.makedirs(SIGNS_DIR, exist_ok=True)

# ─── Image sources ────────────────────────────────────────────────────────────
# Wikimedia Commons Singapore road signs (CC-BY-SA 4.0)
WIKI = 'https://upload.wikimedia.org/wikipedia/commons/thumb'

IMAGES = {
    # Singapore road signs from Wikimedia Commons
    'no-entry.png':          f'{WIKI}/2/2a/Singapore_road_sign_-_Prohibitory_-_No_entry.svg/400px-Singapore_road_sign_-_Prohibitory_-_No_entry.svg.png',
    'warning-sign.png':      f'{WIKI}/1/16/Singapore_road_sign_-_Warning_-_Danger.svg/400px-Singapore_road_sign_-_Warning_-_Danger.svg.png',
    'mandatory-sign.png':    f'{WIKI}/4/46/Singapore_road_sign_-_Mandatory_-_Keep_left.svg/400px-Singapore_road_sign_-_Mandatory_-_Keep_left.svg.png',
    'speed-50.png':          f'{WIKI}/6/69/Singapore_road_sign_-_Prohibitory_-_Speed_limit_50.svg/400px-Singapore_road_sign_-_Prohibitory_-_Speed_limit_50.svg.png',
    'traffic-signals-sign.png': f'{WIKI}/d/da/Singapore_road_sign_-_Warning_-_Traffic_signals.svg/400px-Singapore_road_sign_-_Warning_-_Traffic_signals.svg.png',
    'parking-sign.png':      f'{WIKI}/9/98/Singapore_Road_Signs_-_Information_Sign_-_Coupon_Parking_HDB.svg/400px-Singapore_Road_Signs_-_Information_Sign_-_Coupon_Parking_HDB.svg.png',
    'no-overtaking.png':     f'{WIKI}/5/51/Singapore_road_sign_-_Prohibitory_-_No_overtaking.svg/400px-Singapore_road_sign_-_Prohibitory_-_No_overtaking.svg.png',
    'give-way.png':          f'{WIKI}/b/b4/Singapore_road_sign_-_Mandatory_-_Give_way.svg/400px-Singapore_road_sign_-_Mandatory_-_Give_way.svg.png',
    'stop.png':              f'{WIKI}/9/92/Singapore_road_sign_-_Mandatory_-_Stop.svg/400px-Singapore_road_sign_-_Mandatory_-_Stop.svg.png',

    # Pexels scenario photos (Pexels License - free commercial use)
    'traffic-light.png':        'https://images.pexels.com/photos/29148460/pexels-photo-29148460.jpeg?auto=compress&cs=tinysrgb&w=600',
    'junction.png':             'https://images.pexels.com/photos/21792870/pexels-photo-21792870.jpeg?auto=compress&cs=tinysrgb&w=600',
    'expressway.png':           'https://images.pexels.com/photos/18069540/pexels-photo-18069540.jpeg?auto=compress&cs=tinysrgb&w=600',
    'erp-road.png':             'https://images.pexels.com/photos/35008124/pexels-photo-35008124.jpeg?auto=compress&cs=tinysrgb&w=600',
    'wet-road.png':             'https://images.pexels.com/photos/37828192/pexels-photo-37828192.jpeg?auto=compress&cs=tinysrgb&w=600',
    'night-driving.png':        'https://images.pexels.com/photos/11914217/pexels-photo-11914217.jpeg?auto=compress&cs=tinysrgb&w=600',
    'car-engine.png':           'https://images.pexels.com/photos/8478259/pexels-photo-8478259.jpeg?auto=compress&cs=tinysrgb&w=600',
    'tyre-check.png':           'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg?auto=compress&cs=tinysrgb&w=600',
    'school-zone.png':          'https://images.pexels.com/photos/9917005/pexels-photo-9917005.jpeg?auto=compress&cs=tinysrgb&w=600',
    'pedestrian-crossing.png':  'https://images.pexels.com/photos/16474185/pexels-photo-16474185.jpeg?auto=compress&cs=tinysrgb&w=600',
    'ambulance.png':            'https://images.pexels.com/photos/9965658/pexels-photo-9965658.jpeg?auto=compress&cs=tinysrgb&w=600',
    'parking-lot.png':          'https://images.pexels.com/photos/5231181/pexels-photo-5231181.jpeg?auto=compress&cs=tinysrgb&w=600',
    'motorcycle-cornering.png': 'https://images.pexels.com/photos/27100161/pexels-photo-27100161.jpeg?auto=compress&cs=tinysrgb&w=600',
    'motorcycle-gear.png':      'https://images.pexels.com/photos/35712915/pexels-photo-35712915.jpeg?auto=compress&cs=tinysrgb&w=600',
    'motorcycle-city.png':      'https://images.pexels.com/photos/32087029/pexels-photo-32087029.jpeg?auto=compress&cs=tinysrgb&w=600',
    'road-construction.png':    'https://images.pexels.com/photos/34338597/pexels-photo-34338597.jpeg?auto=compress&cs=tinysrgb&w=600',
    'fog-road.png':             'https://images.pexels.com/photos/1253050/pexels-photo-1253050.jpeg?auto=compress&cs=tinysrgb&w=600',
    'children-road.png':        'https://images.pexels.com/photos/37098586/pexels-photo-37098586.jpeg?auto=compress&cs=tinysrgb&w=600',
    'highway.png':              'https://images.pexels.com/photos/16482320/pexels-photo-16482320.jpeg?auto=compress&cs=tinysrgb&w=600',
    'car-interior.png':         'https://images.pexels.com/photos/18089878/pexels-photo-18089878.jpeg?auto=compress&cs=tinysrgb&w=600',
    'roundabout.png':           'https://images.pexels.com/photos/7691757/pexels-photo-7691757.jpeg?auto=compress&cs=tinysrgb&w=600',
    'motorcycle-rain.png':      'https://images.pexels.com/photos/36813309/pexels-photo-36813309.jpeg?auto=compress&cs=tinysrgb&w=600',
    'road-markings.png':        'https://images.pexels.com/photos/16482320/pexels-photo-16482320.jpeg?auto=compress&cs=tinysrgb&w=600',
    'bus-road.png':             'https://images.pexels.com/photos/21792870/pexels-photo-21792870.jpeg?auto=compress&cs=tinysrgb&w=600',
}

# ─── Question → image mapping ─────────────────────────────────────────────────
QUESTION_IMAGE = {
    # ── BTT Road Signs ──────────────────────────────────────────
    'sg_btt_0001': 'no-entry.png',           # What does this sign mean? (no entry)
    'sg_btt_0002': 'speed-50.png',           # Default speed limit on road
    'sg_btt_0003': 'junction.png',           # Unmarked junction give way
    'sg_btt_0004': 'warning-sign.png',       # Triangular red border = warning
    'sg_btt_0005': 'mandatory-sign.png',     # Mandatory instruction sign shape
    'sg_btt_0006': 'no-overtaking.png',      # No overtaking sign
    'sg_btt_0007': 'parking-sign.png',       # Blue P sign = parking
    'sg_btt_0008': 'warning-sign.png',       # Yellow diamond sign (priority)
    'sg_btt_0009': 'mandatory-sign.png',     # White circle diagonal = end restriction
    'sg_btt_0010': 'traffic-light.png',      # Traffic light sequence
    'sg_btt_0011': 'traffic-light.png',      # Flashing amber
    'sg_btt_0012': 'traffic-light.png',      # Green arrow + red light
    'sg_btt_0013': 'highway.png',            # Hand signal - right arm out
    'sg_btt_0014': 'highway.png',            # Hand signal - arm up
    'sg_btt_0015': 'junction.png',           # Police officer signal
    'sg_btt_0016': 'erp-road.png',           # Fuel pump sign
    'sg_btt_0017': 'highway.png',            # Merging arrow sign
    'sg_btt_0018': 'speed-50.png',           # Weight limit 3.5t sign (red circle)
    'sg_btt_0019': 'warning-sign.png',       # Animal crossing sign
    'sg_btt_0020': 'no-entry.png',           # M5 route restriction sign
    'sg_btt_0021': 'give-way.png',           # Stop vs give way difference
    'sg_btt_0022': 'no-overtaking.png',      # No bicycle sign (prohibition)
    'sg_btt_0023': 'warning-sign.png',       # Narrowing road sign
    'sg_btt_0024': 'pedestrian-crossing.png',# Pedestrian + child blue sign
    'sg_btt_0025': 'warning-sign.png',       # S-curve sign
    'sg_btt_0026': 'traffic-signals-sign.png',# Traffic lights graphic sign
    'sg_btt_0027': 'mandatory-sign.png',     # Two arrows in blue square
    'sg_btt_0028': 'warning-sign.png',       # Steep slope sign
    'sg_btt_0029': 'road-construction.png',  # Roadworks orange diamond
    'sg_btt_0030': 'wet-road.png',           # Car on wavy lines (slippery)
    # ── BTT Traffic Rules ────────────────────────────────────────
    'sg_btt_0031': 'roundabout.png',         # Roundabout right of way
    'sg_btt_0032': 'expressway.png',         # Expressway speed limit
    'sg_btt_0033': 'highway.png',            # Single yellow line kerb
    'sg_btt_0034': 'highway.png',            # When unsafe to overtake
    'sg_btt_0035': 'expressway.png',         # Multi-lane expressway lanes
    'sg_btt_0036': 'junction.png',           # T-junction right of way
    'sg_btt_0037': 'parking-lot.png',        # Parking on footpath
    'sg_btt_0038': 'school-zone.png',        # School zone speed limit
    'sg_btt_0039': 'highway.png',            # Overtaking on left
    'sg_btt_0040': 'road-markings.png',      # Continuous white centre line
    'sg_btt_0041': 'ambulance.png',          # Ambulance approaching
    'sg_btt_0042': 'parking-lot.png',        # Distance from fire hydrant
    'sg_btt_0043': 'children-road.png',      # Speed limits residential
    'sg_btt_0044': 'bus-road.png',           # Bus lane operating hours
    'sg_btt_0045': 'junction.png',           # Turning right at green light
    'sg_btt_0046': 'parking-lot.png',        # Double vs single yellow line
    'sg_btt_0047': 'highway.png',            # Before overtaking checks
    'sg_btt_0048': 'erp-road.png',           # ERP gantry charge
    'sg_btt_0049': 'junction.png',           # Exiting private driveway
    'sg_btt_0050': 'speed-50.png',           # Lower speed limit sign
    'sg_btt_0051': 'road-markings.png',      # Diamond road marking
    'sg_btt_0052': 'junction.png',           # Unmarked junction rule
    'sg_btt_0053': 'parking-lot.png',        # Timed parking sign
    'sg_btt_0054': 'pedestrian-crossing.png',# Overtaking at pedestrian crossing
    'sg_btt_0055': 'road-construction.png',  # Lane closure merge
    'sg_btt_0056': 'expressway.png',         # Heavy vehicle expressway limit
    'sg_btt_0057': 'pedestrian-crossing.png',# Zebra crossing pedestrian
    'sg_btt_0058': 'parking-lot.png',        # Parking opposite vehicle
    'sg_btt_0059': 'highway.png',            # Vehicle behind signals to overtake
    'sg_btt_0060': 'road-markings.png',      # Dashed white line
    'sg_btt_0061': 'expressway.png',         # Speeding consequences
    # ── BTT Defensive Driving ────────────────────────────────────
    'sg_btt_0062': 'highway.png',            # Following distance dry
    'sg_btt_0063': 'wet-road.png',           # Following distance rainy
    'sg_btt_0064': 'highway.png',            # Hazard perception
    'sg_btt_0065': 'wet-road.png',           # Skid on wet road
    'sg_btt_0066': 'expressway.png',         # Scan far ahead
    'sg_btt_0067': 'fog-road.png',           # Heavy fog driving
    'sg_btt_0068': 'highway.png',            # Blind spot
    'sg_btt_0069': 'highway.png',            # Lane change checks
    'sg_btt_0070': 'expressway.png',         # Tailgating
    'sg_btt_0071': 'car-interior.png',       # Mobile phone while driving
    'sg_btt_0072': 'night-driving.png',      # High beam at night
    'sg_btt_0073': 'highway.png',            # Target fixation
    'sg_btt_0074': 'bus-road.png',           # Distance from large vehicles
    'sg_btt_0075': 'highway.png',            # Drowsy driving
    'sg_btt_0076': 'motorcycle-city.png',    # Brake risk near motorcycle
    'sg_btt_0077': 'highway.png',            # Tyre blowout at speed
    'sg_btt_0078': 'expressway.png',         # Following distance heavy load
    'sg_btt_0079': 'children-road.png',      # Child runs to road
    'sg_btt_0080': 'highway.png',            # Sun glare driving
    'sg_btt_0081': 'highway.png',            # Defensive driving predict others
    'sg_btt_0082': 'traffic-light.png',      # Green light been green long
    'sg_btt_0083': 'tyre-check.png',         # Worn bald tyres
    'sg_btt_0084': 'wet-road.png',           # Aquaplaning hydroplaning
    'sg_btt_0085': 'wet-road.png',           # After driving through water
    'sg_btt_0086': 'highway.png',            # Passing cyclists
    'sg_btt_0087': 'highway.png',            # Space cushion margin
    # ── BTT More Road Signs ──────────────────────────────────────
    'sg_btt_0088': 'no-entry.png',           # No U-turn sign (prohibition)
    'sg_btt_0089': 'warning-sign.png',       # Height restriction sign
    'sg_btt_0090': 'erp-road.png',           # ERP gantry overhead
    'sg_btt_0091': 'road-markings.png',      # Chevron arrow sign
    'sg_btt_0092': 'road-markings.png',      # Double white lines centre
    'sg_btt_0093': 'traffic-signals-sign.png',# Railway track sign
    'sg_btt_0094': 'bus-road.png',           # Bus lane sign with hours
    'sg_btt_0095': 'parking-lot.png',        # No Parking vs No Stopping
    'sg_btt_0096': 'warning-sign.png',       # Truck weight restriction
    # ── BTT Safe Practices ──────────────────────────────────────
    'sg_btt_0097': 'car-engine.png',         # Pre-journey check
    'sg_btt_0098': 'tyre-check.png',         # Check tyre pressure
    'sg_btt_0099': 'car-interior.png',       # Warning light exclamation
    'sg_btt_0100': 'car-interior.png',       # Seatbelt all passengers
    'sg_btt_0101': 'tyre-check.png',         # Tyre tread depth
    'sg_btt_0102': 'car-interior.png',       # Mobile phone driving
    'sg_btt_0103': 'car-engine.png',         # Engine oil warning light
    'sg_btt_0104': 'car-interior.png',       # Soft brakes
    'sg_btt_0105': 'car-interior.png',       # Headrest adjustment
    'sg_btt_0106': 'wet-road.png',           # Wiper check rainy season
    'sg_btt_0107': 'car-interior.png',       # Objects on dashboard
    'sg_btt_0108': 'junction.png',           # After minor accident
    'sg_btt_0109': 'car-engine.png',         # Coolant level check
    'sg_btt_0110': 'parking-lot.png',        # Before reversing from parking
    'sg_btt_0111': 'highway.png',            # Driving drowsy short trip
    'sg_btt_0112': 'highway.png',            # Tyre burst while driving
    # ── BTT Special Situations ──────────────────────────────────
    'sg_btt_0113': 'school-zone.png',        # School zone speed limit
    'sg_btt_0114': 'pedestrian-crossing.png',# Zebra crossing pedestrian waiting
    'sg_btt_0115': 'roundabout.png',         # Mini-roundabout priority
    'sg_btt_0116': 'ambulance.png',          # Ambulance approaching siren
    'sg_btt_0117': 'children-road.png',      # School bus hazard lights
    'sg_btt_0118': 'junction.png',           # Unmarked residential junction
    'sg_btt_0119': 'wet-road.png',           # Heavy rain driving
    'sg_btt_0120': 'highway.png',            # Single-lane bridge opposite

    # ── FTT Expressway ──────────────────────────────────────────
    'sg_ftt_0001': 'expressway.png',         # Which lane not overtaking
    'sg_ftt_0002': 'expressway.png',         # Minimum speed expressway
    'sg_ftt_0003': 'expressway.png',         # Merging from slip road
    'sg_ftt_0004': 'erp-road.png',           # ERP gantry function
    'sg_ftt_0005': 'expressway.png',         # Breakdown on expressway
    'sg_ftt_0006': 'expressway.png',         # Maximum speed cars expressway
    'sg_ftt_0007': 'expressway.png',         # Exit 500m away leftmost lane
    'sg_ftt_0008': 'expressway.png',         # Vehicle slows ahead expressway
    # ── FTT Defensive Driving 1 ──────────────────────────────────
    'sg_ftt_0009': 'highway.png',            # Purpose defensive driving
    'sg_ftt_0010': 'highway.png',            # Following distance rule
    'sg_ftt_0011': 'wet-road.png',           # Heavy rain night driving
    'sg_ftt_0012': 'children-road.png',      # Ball rolls onto road
    # ── FTT Eco/Maintenance 1 ────────────────────────────────────
    'sg_ftt_0013': 'tyre-check.png',         # Under-inflated tyre
    'sg_ftt_0014': 'car-engine.png',         # Engine oil purpose
    'sg_ftt_0015': 'car-engine.png',         # Engine temperature warning
    'sg_ftt_0016': 'car-interior.png',       # Brake fluid warning light
    'sg_ftt_0017': 'car-engine.png',         # Coolant purpose
    'sg_ftt_0018': 'highway.png',            # Eco-driving example
    # ── FTT Hazard/Speed 1 ───────────────────────────────────────
    'sg_ftt_0019': 'expressway.png',         # Speed doubles braking distance
    'sg_ftt_0020': 'highway.png',            # Stopping distance components
    'sg_ftt_0021': 'fog-road.png',           # Sharp bend rural road night
    'sg_ftt_0022': 'wet-road.png',           # Light rain expressway speed
    # ── FTT Advanced Traffic 1 ───────────────────────────────────
    'sg_ftt_0023': 'highway.png',            # Towing broken-down vehicle
    'sg_ftt_0024': 'bus-road.png',           # Distance heavy vehicle junction
    'sg_ftt_0025': 'junction.png',           # Complex multi-lane junction
    # ── FTT Expressway (continued) ───────────────────────────────
    'sg_ftt_0026': 'expressway.png',         # Expressway name sign blue
    'sg_ftt_0027': 'expressway.png',         # Change lanes expressway
    'sg_ftt_0028': 'erp-road.png',           # ERP high rate peak hour
    'sg_ftt_0029': 'expressway.png',         # Brake suddenly for sign
    'sg_ftt_0030': 'expressway.png',         # Missed expressway exit
    'sg_ftt_0031': 'expressway.png',         # Vehicles prohibited expressway
    'sg_ftt_0032': 'expressway.png',         # Smoke from bonnet expressway
    'sg_ftt_0033': 'expressway.png',         # Road shoulder emergency lane
    'sg_ftt_0034': 'expressway.png',         # Flashing arrow overhead gantry
    'sg_ftt_0035': 'expressway.png',         # Lane ending merge expressway
    'sg_ftt_0036': 'expressway.png',         # Avoid sudden lane changes
    'sg_ftt_0037': 'expressway.png',         # Slower than surrounding traffic
    'sg_ftt_0038': 'expressway.png',         # Brake lights far ahead
    'sg_ftt_0039': 'expressway.png',         # Rightmost lane exit 200m
    'sg_ftt_0040': 'night-driving.png',      # Tunnel expressway rules
    'sg_ftt_0041': 'expressway.png',         # Before entering on-ramp
    'sg_ftt_0042': 'car-interior.png',       # Mobile phone expressway
    # ── FTT Defensive Driving 2 ──────────────────────────────────
    'sg_ftt_0043': 'highway.png',            # Blind spot
    'sg_ftt_0044': 'pedestrian-crossing.png',# Pedestrian on phone at crossing
    'sg_ftt_0045': 'highway.png',            # Drowsy driving short trip
    'sg_ftt_0046': 'highway.png',            # Car weaving erratically ahead
    'sg_ftt_0047': 'school-zone.png',        # School zone during school hours
    'sg_ftt_0048': 'bus-road.png',           # Larger gap behind bus lorry
    'sg_ftt_0049': 'junction.png',           # Driver waves you to go
    'sg_ftt_0050': 'highway.png',            # Tunnel vision hazard perception
    'sg_ftt_0051': 'expressway.png',         # Scanning far ahead
    'sg_ftt_0052': 'road-construction.png',  # Two merging at roadworks
    'sg_ftt_0053': 'parking-lot.png',        # Parked car engine running
    'sg_ftt_0054': 'car-interior.png',       # Mirror check habit
    'sg_ftt_0055': 'highway.png',            # Sun glare
    'sg_ftt_0056': 'wet-road.png',           # Drive to conditions
    'sg_ftt_0057': 'traffic-light.png',      # Stopped at red, fast vehicle behind
    'sg_ftt_0058': 'night-driving.png',      # Overdriving headlights
    'sg_ftt_0059': 'junction.png',           # Vehicle signalling may not turn
    'sg_ftt_0060': 'motorcycle-city.png',    # Driving near cyclists
    # ── FTT Expressway 3 ─────────────────────────────────────────
    'sg_ftt_0061': 'expressway.png',         # Minimum speed expressway
    'sg_ftt_0062': 'expressway.png',         # Merging from slip road
    'sg_ftt_0063': 'expressway.png',         # Rightmost lane overtaking
    'sg_ftt_0064': 'erp-road.png',           # ERP flashing amber
    'sg_ftt_0065': 'expressway.png',         # Breakdown cannot move
    'sg_ftt_0066': 'expressway.png',         # Tailgating expressway speeds
    'sg_ftt_0067': 'road-construction.png',  # Lane closed ahead sign
    'sg_ftt_0068': 'road-markings.png',      # Chevron markings approaching exit
    'sg_ftt_0069': 'wet-road.png',           # Heavy traffic night rain
    'sg_ftt_0070': 'expressway.png',         # Missed exit
    'sg_ftt_0071': 'erp-road.png',           # Fuel pump sign with distance
    'sg_ftt_0072': 'wet-road.png',           # Heavy downpour hazard lights
    'sg_ftt_0073': 'expressway.png',         # Keep left unless overtaking
    'sg_ftt_0074': 'expressway.png',         # Pedestrians cyclists on expressway
    'sg_ftt_0075': 'expressway.png',         # Avoid sudden braking right lane
    'sg_ftt_0076': 'road-construction.png',  # Lane narrows roadworks
    'sg_ftt_0077': 'car-interior.png',       # Mobile phone handheld expressway
    # ── FTT Defensive Driving 3 ──────────────────────────────────
    'sg_ftt_0078': 'highway.png',            # Core idea defensive driving
    'sg_ftt_0079': 'highway.png',            # Following distance rule of thumb
    # ── FTT Eco/Maintenance 2 ────────────────────────────────────
    'sg_ftt_0080': 'highway.png',            # Improve fuel efficiency
    'sg_ftt_0081': 'tyre-check.png',         # Tyre pressure regularly
    'sg_ftt_0082': 'car-interior.png',       # Engine warning light dashboard
    'sg_ftt_0083': 'car-engine.png',         # Engine oil level routine
    'sg_ftt_0084': 'car-engine.png',         # Excessive idling fuel economy
    'sg_ftt_0085': 'car-interior.png',       # Brake fluid check
    'sg_ftt_0086': 'car-engine.png',         # Coolant level long drives
    'sg_ftt_0087': 'highway.png',            # Steady moderate speed fuel
    'sg_ftt_0088': 'car-engine.png',         # Excess weight fuel consumption
    'sg_ftt_0089': 'tyre-check.png',         # Brake pad inspection
    'sg_ftt_0090': 'highway.png',            # Anticipating traffic eco
    'sg_ftt_0091': 'car-engine.png',         # Correct engine oil grade
    # ── FTT Hazard/Speed 2 ───────────────────────────────────────
    'sg_ftt_0092': 'highway.png',            # Hazard perception definition
    'sg_ftt_0093': 'school-zone.png',        # School zone reduce speed
    'sg_ftt_0094': 'bus-road.png',           # Bus stop pedestrians hazard
    'sg_ftt_0095': 'expressway.png',         # Mirror blind spots multi-lane
    'sg_ftt_0096': 'fog-road.png',           # Sharp bend limited visibility
    'sg_ftt_0097': 'highway.png',            # Slow vehicle hazard lights roadside
    'sg_ftt_0098': 'junction.png',           # Residential to busier road
    'sg_ftt_0099': 'ambulance.png',          # Emergency vehicle flashing behind
    'sg_ftt_0100': 'pedestrian-crossing.png',# Pedestrian at crossing
    'sg_ftt_0101': 'highway.png',            # Drowsy long journey
    'sg_ftt_0102': 'motorcycle-city.png',    # Following motorcycle space
    'sg_ftt_0103': 'highway.png',            # Target fixation hazard
    'sg_ftt_0104': 'road-construction.png',  # Construction zone speed
    'sg_ftt_0105': 'pedestrian-crossing.png',# Pedestrian-heavy market street
    # ── FTT Advanced Traffic Rules ───────────────────────────────
    'sg_ftt_0106': 'junction.png',           # Horn in residential night
    'sg_ftt_0107': 'junction.png',           # Four-way junction right of way
    'sg_ftt_0108': 'road-markings.png',      # Double white line centre
    'sg_ftt_0109': 'junction.png',           # Yellow box junction
    'sg_ftt_0110': 'highway.png',            # Reversing on public road
    'sg_ftt_0111': 'traffic-light.png',      # Traffic light turns amber
    'sg_ftt_0112': 'traffic-light.png',      # Flashing green traffic light
    'sg_ftt_0113': 'ambulance.png',          # Ambulance at junction green light
    'sg_ftt_0114': 'speed-50.png',           # Speed limit sign with slash
    'sg_ftt_0115': 'car-interior.png',       # Seatbelt all occupants
    'sg_ftt_0116': 'roundabout.png',         # Roundabout priority
    'sg_ftt_0117': 'night-driving.png',      # High beam oncoming vehicle
    'sg_ftt_0118': 'highway.png',            # Turn signal lane change
    'sg_ftt_0119': 'bus-road.png',           # Bus lane restricted hours
    'sg_ftt_0120': 'car-interior.png',       # Child restraints car seats

    # ── RTT Road Signs & Signals ─────────────────────────────────
    'sg_rtt_0001': 'no-overtaking.png',      # Circular red border motorcycle = prohibition
    'sg_rtt_0002': 'warning-sign.png',       # Triangular red border = warning
    'sg_rtt_0003': 'mandatory-sign.png',     # Round blue sign = mandatory
    'sg_rtt_0004': 'wet-road.png',           # Motorcycle skidding sign
    'sg_rtt_0005': 'warning-sign.png',       # Yellow diamond T-junction
    'sg_rtt_0006': 'traffic-light.png',      # Steady amber after green
    'sg_rtt_0007': 'junction.png',           # Police arm raised
    'sg_rtt_0008': 'highway.png',            # Rider right arm horizontal signal
    'sg_rtt_0009': 'parking-lot.png',        # Blue P with red bar = no parking
    'sg_rtt_0010': 'warning-sign.png',       # Steep upward 10% sign
    'sg_rtt_0011': 'traffic-light.png',      # Flashing red lights junction
    'sg_rtt_0012': 'no-entry.png',           # Round motorcycle red border
    'sg_rtt_0013': 'highway.png',            # Two opposing arrows sign
    'sg_rtt_0014': 'expressway.png',         # Green direction sign
    'sg_rtt_0015': 'warning-sign.png',       # Exclamation mark yellow triangle
    'sg_rtt_0016': 'pedestrian-crossing.png',# Pedestrian waiting at crossing
    'sg_rtt_0017': 'stop.png',               # Octagonal STOP sign
    'sg_rtt_0018': 'highway.png',            # Motorcycle + car merge lane
    'sg_rtt_0019': 'no-overtaking.png',      # Bicycle in red circle = prohibition
    'sg_rtt_0020': 'motorcycle-city.png',    # Rider left arm signal
    'sg_rtt_0021': 'traffic-light.png',      # Flashing amber arrow
    'sg_rtt_0022': 'speed-50.png',           # Circular 70 red border = speed limit
    'sg_rtt_0023': 'erp-road.png',           # ERP warning sign for motorcycles
    'sg_rtt_0024': 'junction.png',           # Two riders right turn junction
    'sg_rtt_0025': 'mandatory-sign.png',     # White H blue square = hospital
    # ── RTT Right of Way & Traffic Rules ─────────────────────────
    'sg_rtt_0026': 'roundabout.png',         # Roundabout right of way
    'sg_rtt_0027': 'expressway.png',         # Expressway speed limit
    'sg_rtt_0028': 'parking-lot.png',        # Motorcycle parking prohibited
    'sg_rtt_0029': 'ambulance.png',          # Ambulance approaching
    'sg_rtt_0030': 'bus-road.png',           # Motorcycle in bus lane
    'sg_rtt_0031': 'pedestrian-crossing.png',# Motorcycles at zebra crossing
    'sg_rtt_0032': 'highway.png',            # Single-lane bridge opposite vehicle
    'sg_rtt_0033': 'motorcycle-city.png',    # Age requirement Class 2B
    'sg_rtt_0034': 'junction.png',           # Give-way junction entering main road
    'sg_rtt_0035': 'highway.png',            # Motorcycle towing legal
    'sg_rtt_0036': 'junction.png',           # Traffic police only junction
    'sg_rtt_0037': 'motorcycle-city.png',    # Motorcycles abreast rule
    'sg_rtt_0038': 'traffic-light.png',      # Wrong lane at red light
    'sg_rtt_0039': 'school-zone.png',        # School zone sign rider
    'sg_rtt_0040': 'give-way.png',           # Give way sign main road empty
    'sg_rtt_0041': 'motorcycle-city.png',    # Headlight daytime requirement
    'sg_rtt_0042': 'road-markings.png',      # Continuous white line lanes
    'sg_rtt_0043': 'motorcycle-city.png',    # Wrong licence motorcycle
    'sg_rtt_0044': 'junction.png',           # No U-Turn sign
    'sg_rtt_0045': 'highway.png',            # Before changing lanes
    # ── RTT Lane Filtering & Positioning ─────────────────────────
    'sg_rtt_0046': 'motorcycle-city.png',    # Road position centre lane
    'sg_rtt_0047': 'motorcycle-city.png',    # Lane filtering definition
    'sg_rtt_0048': 'junction.png',           # Filtering near junction turning
    'sg_rtt_0049': 'wet-road.png',           # Riding in heavy rain lane
    'sg_rtt_0050': 'motorcycle-city.png',    # Before filtering stopped vehicles
    'sg_rtt_0051': 'motorcycle-city.png',    # Car activates turn signal filtering
    'sg_rtt_0052': 'highway.png',            # Following distance motorcyclist
    'sg_rtt_0053': 'parking-lot.png',        # Parked vehicles door zone
    'sg_rtt_0054': 'bus-road.png',           # Heavy vehicle blind spot
    'sg_rtt_0055': 'motorcycle-city.png',    # Gutter extreme lane edge
    'sg_rtt_0056': 'motorcycle-city.png',    # Wind gust from bus filtering
    'sg_rtt_0057': 'motorcycle-city.png',    # Multi-lane road position visibility
    'sg_rtt_0058': 'expressway.png',         # Filtering on expressways
    'sg_rtt_0059': 'traffic-light.png',      # Position behind car at red
    'sg_rtt_0060': 'pedestrian-crossing.png',# Pedestrian between stopped cars
    # ── RTT Blind Spots & Visibility ─────────────────────────────
    'sg_rtt_0061': 'motorcycle-city.png',    # Motorcycles vulnerable blind spots
    'sg_rtt_0062': 'motorcycle-gear.png',    # Wear to improve visibility
    'sg_rtt_0063': 'bus-road.png',           # Beside large vehicle junction
    'sg_rtt_0064': 'motorcycle-city.png',    # Before changing lanes
    'sg_rtt_0065': 'highway.png',            # Car right signal in left lane
    'sg_rtt_0066': 'motorcycle-city.png',    # Tail light flashing braking
    'sg_rtt_0067': 'bus-road.png',           # Bus departing bus stop
    'sg_rtt_0068': 'junction.png',           # Junction visibility parked vehicles
    'sg_rtt_0069': 'night-driving.png',      # Dark helmet no reflective night
    'sg_rtt_0070': 'bus-road.png',           # Overtaking lorry blind spot
    # ── RTT Balance, Cornering & Hazards ─────────────────────────
    'sg_rtt_0071': 'motorcycle-cornering.png',# Braking while leaning corner
    'sg_rtt_0072': 'motorcycle-cornering.png',# Eyes through corner
    'sg_rtt_0073': 'motorcycle-cornering.png',# Loose gravel cornering
    'sg_rtt_0074': 'motorcycle-cornering.png',# Technique cornering stability
    'sg_rtt_0075': 'motorcycle-cornering.png',# Running wide in corner
    'sg_rtt_0076': 'highway.png',            # Railway tracks metal plates
    'sg_rtt_0077': 'motorcycle-cornering.png',# Body position cornering
    'sg_rtt_0078': 'motorcycle-cornering.png',# Downhill corner decreasing radius
    'sg_rtt_0079': 'wet-road.png',           # Painted road markings slippery
    'sg_rtt_0080': 'motorcycle-cornering.png',# Two-up pillion cornering
    # ── RTT Weather & Road Surface Hazards ───────────────────────
    'sg_rtt_0081': 'wet-road.png',           # Painted marking manhole rain
    'sg_rtt_0082': 'wet-road.png',           # Puddle unknown depth
    'sg_rtt_0083': 'road-construction.png',  # Loose gravel sand patch
    'sg_rtt_0084': 'highway.png',            # Gusty crosswinds gap buildings
    'sg_rtt_0085': 'wet-road.png',           # First 10-15 min rainfall slippery
    'sg_rtt_0086': 'wet-road.png',           # Heavy downpour visibility
    'sg_rtt_0087': 'bus-road.png',           # Following heavy vehicle rain
    'sg_rtt_0088': 'highway.png',            # Hot day road tar
    'sg_rtt_0089': 'wet-road.png',           # Fallen leaves wet leaf litter
    'sg_rtt_0090': 'wet-road.png',           # Oil centre lane accumulate
    # ── RTT Protective Gear & Pillion Rules ──────────────────────
    'sg_rtt_0091': 'motorcycle-gear.png',    # Minimum gear legally required
    'sg_rtt_0092': 'motorcycle-gear.png',    # Helmet chin strap unfastened
    'sg_rtt_0093': 'motorcycle-city.png',    # Pillion passenger ensure
    'sg_rtt_0094': 'motorcycle-cornering.png',# Pillion effect handling
    'sg_rtt_0095': 'motorcycle-gear.png',    # Gloves jacket footwear short rides
    'sg_rtt_0096': 'motorcycle-gear.png',    # Helmet visor night ride
    'sg_rtt_0097': 'motorcycle-city.png',    # More than one pillion legal
    'sg_rtt_0098': 'motorcycle-cornering.png',# Pillion hold grab handles
    'sg_rtt_0099': 'motorcycle-rain.png',    # Dark non-reflective clothing night
    'sg_rtt_0100': 'motorcycle-cornering.png',# Pillion lean independently turning
}


def download(url, dest):
    """Download a file with retry."""
    if os.path.exists(dest) and os.path.getsize(dest) > 1000:
        print(f'  [skip] {os.path.basename(dest)} already exists')
        return True
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (compatible; educational quiz app)'
        })
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        if len(data) < 500:
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
    print(f'Downloading {len(IMAGES)} unique images...')
    failed = []
    for fname, url in IMAGES.items():
        dest = os.path.join(SIGNS_DIR, fname)
        ok = download(url, dest)
        if not ok:
            failed.append(fname)
        time.sleep(0.3)  # polite delay

    print(f'\nDownload complete. Failed: {len(failed)}')
    if failed:
        for f in failed:
            print(f'  FAILED: {f}')

    # Update question JSON files
    print('\nUpdating question JSON files...')
    questions_dir = os.path.join(os.path.dirname(__file__), '../content/questions')
    for fname in ['sg_btt', 'sg_ftt', 'sg_rtt']:
        path = os.path.join(questions_dir, f'{fname}.json')
        with open(path) as f:
            questions = json.load(f)

        updated = 0
        for q in questions:
            qid = q['id']
            if qid in QUESTION_IMAGE:
                img = QUESTION_IMAGE[qid]
                img_path = os.path.join(SIGNS_DIR, img)
                if os.path.exists(img_path) and os.path.getsize(img_path) > 1000:
                    q['media'] = {
                        'type': 'image',
                        'src': f'/signs/sg/{img}',
                        'alt': {'en': q['prompt']['en'][:60], 'my': q['prompt'].get('my', '')[:60]}
                    }
                    updated += 1

        with open(path, 'w') as f:
            json.dump(questions, f, ensure_ascii=False, indent=2)
        print(f'  {fname}.json: updated {updated} questions')

    print('\nDone!')


if __name__ == '__main__':
    main()
