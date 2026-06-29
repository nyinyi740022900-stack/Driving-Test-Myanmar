'use client';

import { useEffect, useRef, useState } from 'react';

// ── Road geometry (px) ────────────────────────────────────────────
const RH = 124;           // total strip height
const CURB = 12;          // sidewalk / curb band
const EDGE = 3;           // yellow edge line
const CENTER = 7;         // center-dash band
const LANE = Math.floor((RH - 2 * CURB - 2 * EDGE - CENTER) / 2); // 43 px per lane

const ROAD_TOP = CURB + EDGE;                            // 15
const TOP_MID  = ROAD_TOP + LANE / 2;                   // 36  (center of rightward lane)
const BOT_MID  = ROAD_TOP + LANE + CENTER + LANE / 2;   // 86  (center of leftward lane)
const CENTER_TOP = ROAD_TOP + LANE;                      // top of center dashes

const CAR_W = 46; const CAR_H = 20;
const BUS_W = 72; const BUS_H = 22;

// ── Scene map ─────────────────────────────────────────────────────
type Scene = 'crossing' | 'traffic-light' | 'bus-stop' | 'parking' | 'normal';

const SCENE: Scene[] = [
  'crossing',       // 0  Hero → TestCards
  'traffic-light',  // 1  TestCards → QuizDemo
  'bus-stop',       // 2  QuizDemo → HowItWorks
  'normal',         // 3  HowItWorks → Centres
  'parking',        // 4  Centres → Resources
  'traffic-light',  // 5  Resources → FAQ
  'normal',         // 6  FAQ → Pricing
];

// ── Car configs ───────────────────────────────────────────────────
type CarCfg = { color: string; dur: number; delay: number; lane: 'R' | 'L'; bus?: boolean; anim?: string };

const CARS: CarCfg[][] = [
  // 0 crossing
  [
    { color:'#E63946', dur:10, delay:0,   lane:'R' },
    { color:'#457B9D', dur:12, delay:-4,  lane:'R' },
    { color:'#F4A261', dur:9,  delay:-7,  lane:'R', bus:true },
    { color:'#6A4C93', dur:11, delay:-1,  lane:'L' },
    { color:'#1B9C56', dur:9,  delay:-5,  lane:'L' },
    { color:'#E9C46A', dur:13, delay:-8,  lane:'L' },
  ],
  // 1 traffic-light
  [
    { color:'#264653', dur:10, delay:-1,  lane:'R' },
    { color:'#E76F51', dur:12, delay:-5,  lane:'R', bus:true },
    { color:'#2A9D8F', dur:9,  delay:-8,  lane:'R' },
    { color:'#F4D03F', dur:11, delay:0,   lane:'L' },
    { color:'#C0392B', dur:9,  delay:-4,  lane:'L' },
    { color:'#3498DB', dur:13, delay:-7,  lane:'L' },
  ],
  // 2 bus-stop
  [
    { color:'#7C3AED', dur:11, delay:-2,  lane:'R' },
    { color:'#F59E0B', dur:18, delay:-5,  lane:'R', bus:true, anim:'bus-stop-right' },
    { color:'#10B981', dur:9,  delay:-8,  lane:'R' },
    { color:'#EF4444', dur:10, delay:-1,  lane:'L' },
    { color:'#6B7280', dur:13, delay:-5,  lane:'L' },
    { color:'#2563EB', dur:9,  delay:-9,  lane:'L', bus:true },
  ],
  // 3 normal
  [
    { color:'#1B9C56', dur:9,  delay:0,   lane:'R' },
    { color:'#F4A261', dur:11, delay:-3,  lane:'R' },
    { color:'#E63946', dur:13, delay:-7,  lane:'R', bus:true },
    { color:'#457B9D', dur:10, delay:-2,  lane:'L' },
    { color:'#F4D03F', dur:9,  delay:-5,  lane:'L' },
    { color:'#2A9D8F', dur:12, delay:-9,  lane:'L', bus:true },
  ],
  // 4 parking
  [
    { color:'#6A4C93', dur:22, delay:0,   lane:'R', anim:'park-into-bay' },
    { color:'#E9C46A', dur:12, delay:-5,  lane:'R' },
    { color:'#264653', dur:9,  delay:-9,  lane:'R' },
    { color:'#E63946', dur:11, delay:-1,  lane:'L' },
    { color:'#2A9D8F', dur:10, delay:-4,  lane:'L', bus:true },
    { color:'#F4A261', dur:13, delay:-8,  lane:'L' },
  ],
  // 5 traffic-light
  [
    { color:'#2563EB', dur:9,  delay:-2,  lane:'R' },
    { color:'#DC2626', dur:11, delay:-5,  lane:'R', bus:true },
    { color:'#16A34A', dur:10, delay:-8,  lane:'R' },
    { color:'#9333EA', dur:12, delay:0,   lane:'L' },
    { color:'#EA580C', dur:9,  delay:-4,  lane:'L' },
    { color:'#0891B2', dur:13, delay:-7,  lane:'L' },
  ],
  // 6 normal
  [
    { color:'#F59E0B', dur:10, delay:0,   lane:'R' },
    { color:'#3B82F6', dur:13, delay:-3,  lane:'R', bus:true },
    { color:'#EF4444', dur:9,  delay:-7,  lane:'R' },
    { color:'#10B981', dur:11, delay:-1,  lane:'L' },
    { color:'#6B7280', dur:10, delay:-5,  lane:'L' },
    { color:'#7C3AED', dur:12, delay:-8,  lane:'L' },
  ],
];

// ── SVG Vehicles (top-down view) ──────────────────────────────────

function CarSVG({ color, flip }: { color: string; flip?: boolean }) {
  const W = CAR_W, H = CAR_H;
  // Darken color for roof by overlaying black
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      style={{ display:'block', ...(flip ? { transform:'scaleX(-1)' } : {}) }}
      aria-hidden="true">
      {/* Drop shadow */}
      <ellipse cx={W/2+1} cy={H/2+1.5} rx={W/2-3} ry={H/2-4} fill="#000" opacity=".35"/>
      {/* Body */}
      <rect x="2" y="3" width={W-4} height={H-6} rx="5" fill={color}/>
      {/* Roof cabin */}
      <rect x="11" y="4.5" width={W-22} height={H-9} rx="3" fill="rgba(0,0,0,.28)"/>
      {/* Front windshield (right side = direction of travel) */}
      <path d={`M${W-13} 4.5 Q${W-3} 4.5 ${W-3} 8 L${W-3} ${H-8} Q${W-3} ${H-4.5} ${W-13} ${H-4.5}Z`}
        fill="rgba(150,215,255,.6)"/>
      {/* Rear windshield */}
      <path d={`M13 4.5 Q3 4.5 3 8 L3 ${H-8} Q3 ${H-4.5} 13 ${H-4.5}Z`}
        fill="rgba(150,215,255,.35)"/>
      {/* Wheels – front */}
      <rect x={W-11} y="1" width="8" height="6" rx="3" fill="#0a0a0a"/>
      <rect x={W-11} y={H-7} width="8" height="6" rx="3" fill="#0a0a0a"/>
      {/* Wheels – rear */}
      <rect x="3" y="1" width="8" height="6" rx="3" fill="#0a0a0a"/>
      <rect x="3" y={H-7} width="8" height="6" rx="3" fill="#0a0a0a"/>
      {/* Headlights (right / front) */}
      <rect x={W-3} y="5"    width="2.5" height="4" rx="1.5" fill="#FFFDCC" opacity=".95"/>
      <rect x={W-3} y={H-9}  width="2.5" height="4" rx="1.5" fill="#FFFDCC" opacity=".95"/>
      {/* Taillights (left / rear) */}
      <rect x=".5" y="5"    width="2.5" height="4" rx="1.5" fill="#FF2222" opacity=".9"/>
      <rect x=".5" y={H-9}  width="2.5" height="4" rx="1.5" fill="#FF2222" opacity=".9"/>
    </svg>
  );
}

function BusSVG({ color, flip }: { color: string; flip?: boolean }) {
  const W = BUS_W, H = BUS_H;
  const winX = [14, 25, 36, 47];
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      style={{ display:'block', ...(flip ? { transform:'scaleX(-1)' } : {}) }}
      aria-hidden="true">
      {/* Shadow */}
      <ellipse cx={W/2+1} cy={H/2+1.5} rx={W/2-2} ry={H/2-3} fill="#000" opacity=".3"/>
      {/* Body */}
      <rect x="1" y="2" width={W-2} height={H-4} rx="3" fill={color}/>
      {/* Roof */}
      <rect x="8" y="3.5" width={W-16} height={H-7} rx="2" fill="rgba(0,0,0,.2)"/>
      {/* Side windows */}
      {winX.map(x => <rect key={x} x={x} y="5" width="9" height={H-10} rx="2" fill="rgba(150,215,255,.55)"/>)}
      {/* Front windshield */}
      <rect x={W-14} y="4.5" width="11" height={H-9} rx="2" fill="rgba(150,215,255,.65)"/>
      {/* Door line */}
      <rect x="10" y="4" width="1.5" height={H-8} fill="rgba(0,0,0,.3)"/>
      {/* Wheels */}
      <rect x="3"    y="0"    width="11" height="6" rx="3" fill="#0a0a0a"/>
      <rect x={W-14} y="0"    width="11" height="6" rx="3" fill="#0a0a0a"/>
      <rect x="3"    y={H-6} width="11" height="6" rx="3" fill="#0a0a0a"/>
      <rect x={W-14} y={H-6} width="11" height="6" rx="3" fill="#0a0a0a"/>
      {/* Headlights */}
      <rect x={W-3} y="5.5"   width="2" height="5" rx="1" fill="#FFFDCC" opacity=".95"/>
      <rect x={W-3} y={H-10.5} width="2" height="5" rx="1" fill="#FFFDCC" opacity=".95"/>
      {/* Taillights */}
      <rect x="1" y="5.5"   width="2" height="5" rx="1" fill="#FF2222" opacity=".9"/>
      <rect x="1" y={H-10.5} width="2" height="5" rx="1" fill="#FF2222" opacity=".9"/>
    </svg>
  );
}

// ── Traffic light post ────────────────────────────────────────────

type Phase = 'red' | 'amber' | 'green';

function TrafficLightPost({ phase, side = 'top' }: { phase: Phase; side?: 'top' | 'bot' }) {
  const colors = {
    red:   { r:'#FF2020', a:'#1a1000', g:'#001a08' },
    amber: { r:'#2a0000', a:'#F59E0B', g:'#001a08' },
    green: { r:'#2a0000', a:'#1a1000', g:'#22C55E' },
  }[phase];
  const glow = {
    red:   { r:`0 0 9px #FF2020,0 0 18px #FF202050`, a:'none', g:'none' },
    amber: { r:'none', a:`0 0 9px #F59E0B,0 0 18px #F59E0B50`, g:'none' },
    green: { r:'none', a:'none', g:`0 0 9px #22C55E,0 0 18px #22C55E50` },
  }[phase];
  const above = side === 'top';
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', position:'relative' }}>
      {above && <div style={{ width:3, height:42, background:'linear-gradient(180deg,#555,#333)' }}/>}
      {/* Housing */}
      <div style={{
        background:'#111', border:'2px solid #2a2a2a', borderRadius:6,
        padding:'5px 6px', display:'flex', flexDirection:'column', gap:4,
        boxShadow:'0 4px 14px rgba(0,0,0,.75)',
      }}>
        <div style={{ width:14, height:14, borderRadius:'50%', background:colors.r, boxShadow:glow.r, transition:'background .25s,box-shadow .25s' }}/>
        <div style={{ width:14, height:14, borderRadius:'50%', background:colors.a, boxShadow:glow.a, transition:'background .25s,box-shadow .25s' }}/>
        <div style={{ width:14, height:14, borderRadius:'50%', background:colors.g, boxShadow:glow.g, transition:'background .25s,box-shadow .25s' }}/>
      </div>
      {!above && <div style={{ width:3, height:42, background:'linear-gradient(180deg,#555,#333)' }}/>}
    </div>
  );
}

// ── Pedestrian (stick figure, crosses on red for cars) ────────────

function Pedestrian({ walkKey }: { walkKey: number }) {
  return (
    <div
      key={walkKey}
      style={{
        position:'absolute',
        left:'25%',
        top: CURB,
        transform:'translateX(-50%)',
        animation:'pedestrian-walk 3.5s ease-in-out 1 forwards',
        zIndex: 8,
        pointerEvents:'none',
      }}
    >
      <svg width="12" height="20" viewBox="0 0 12 20" aria-hidden="true">
        <circle cx="6" cy="3" r="3" fill="#fff" opacity=".92"/>
        <line x1="6" y1="6" x2="6" y2="13" stroke="#fff" strokeWidth="2" opacity=".9"/>
        {/* Arms */}
        <line x1="2" y1="9" x2="10" y2="8" stroke="#fff" strokeWidth="1.5" opacity=".9"/>
        {/* Legs */}
        <line x1="6" y1="13" x2="3" y2="19" stroke="#fff" strokeWidth="1.5" opacity=".9"/>
        <line x1="6" y1="13" x2="9" y2="19" stroke="#fff" strokeWidth="1.5" opacity=".9"/>
      </svg>
    </div>
  );
}

// ── Bus stop sign ─────────────────────────────────────────────────

function BusStopSign() {
  return (
    <div style={{ position:'absolute', left:'55%', top:-46, transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', zIndex:10 }}>
      <div style={{
        background:'#1D4ED8', color:'#fff',
        fontFamily:'var(--display)', fontWeight:800, fontSize:9,
        padding:'3px 7px', borderRadius:4, letterSpacing:'.07em',
        whiteSpace:'nowrap', boxShadow:'0 3px 8px rgba(0,0,0,.55)',
      }}>
        BUS STOP
      </div>
      {/* Bus icon */}
      <div style={{ fontSize:11, marginTop:1, filter:'drop-shadow(0 1px 2px rgba(0,0,0,.5))' }}>🚌</div>
      <div style={{ width:2.5, height:30, background:'linear-gradient(180deg,#555,#333)' }}/>
    </div>
  );
}

// ── Parking bays ──────────────────────────────────────────────────

function ParkingBays() {
  const bays = [28, 40, 52];
  return (
    <>
      {bays.map(pct => (
        <div key={pct} style={{
          position:'absolute',
          left:`${pct}%`,
          top: ROAD_TOP,
          width: CAR_W + 6,
          height: LANE * 0.55,
          transform:'translateX(-50%)',
          border:'1.5px dashed rgba(255,255,255,.35)',
          borderBottom:'none',
          borderRadius:'3px 3px 0 0',
          zIndex:1,
        }}/>
      ))}
      {/* P label in middle bay */}
      <div style={{
        position:'absolute',
        left:'40%',
        top: ROAD_TOP + 4,
        transform:'translateX(-50%)',
        color:'rgba(255,255,255,.28)',
        fontFamily:'var(--display)',
        fontWeight:900,
        fontSize:15,
        lineHeight:1,
        zIndex:1,
      }}>P</div>
      {/* Parking sign above road */}
      <div style={{ position:'absolute', left:'40%', top:-40, transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', zIndex:10 }}>
        <div style={{ width:22, height:22, background:'#1D4ED8', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:'var(--display)', fontWeight:900, fontSize:15, boxShadow:'0 3px 8px rgba(0,0,0,.55)' }}>P</div>
        <div style={{ width:2.5, height:40, background:'linear-gradient(180deg,#555,#333)' }}/>
      </div>
    </>
  );
}

// ── Zebra crossing ────────────────────────────────────────────────

function ZebraCrossing() {
  const stripes = 8;
  const crossW = 36;
  const crossH = RH - 2 * CURB;
  return (
    <div style={{ position:'absolute', left:'25%', top: CURB, transform:'translateX(-50%)', width: crossW, height: crossH, zIndex:1 }}>
      {Array.from({ length: stripes }).map((_, i) => (
        <div key={i} style={{
          position:'absolute',
          top:`${(i / stripes) * 100}%`,
          left:0, right:0,
          height:`${(0.55 / stripes) * 100}%`,
          background:'rgba(255,255,255,.28)',
          borderRadius:1,
        }}/>
      ))}
      {/* Stop line before crossing (on right lane = top) */}
      <div style={{
        position:'absolute',
        left:-6, top:0, width:4, height: LANE + EDGE,
        background:'rgba(255,255,255,.5)',
        borderRadius:2,
      }}/>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────

export default function RoadStrip({ variant = 0 }: { variant?: number }) {
  const v      = variant % SCENE.length;
  const scene  = SCENE[v];
  const cars   = CARS[v];

  // Traffic phase for traffic-light and crossing scenes
  const [phase, setPhase] = useState<Phase>('green');
  const [walkKey, setWalkKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (scene !== 'traffic-light' && scene !== 'crossing') return;

    // Cycle: green 5s → amber 0.7s → red 4s → green 5s …
    function schedule(current: Phase) {
      if (!mountedRef.current) return;
      if (current === 'green') {
        timerRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          setPhase('amber');
          timerRef.current = setTimeout(() => {
            if (!mountedRef.current) return;
            setPhase('red');
            if (scene === 'crossing') setWalkKey(k => k + 1); // new pedestrian
            timerRef.current = setTimeout(() => {
              if (!mountedRef.current) return;
              setPhase('green');
              schedule('green');
            }, 4000);
          }, 700);
        }, 5000);
      }
    }

    setPhase('green');
    schedule('green');
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [scene]);

  // Cars pause when red or amber (traffic-light & crossing)
  const stopped = (scene === 'traffic-light' || scene === 'crossing') && (phase === 'red' || phase === 'amber');

  const carTopY = Math.round(TOP_MID - CAR_H / 2);
  const carBotY = Math.round(BOT_MID - CAR_H / 2);
  const busTopY = Math.round(TOP_MID - BUS_H / 2);
  const busBotY = Math.round(BOT_MID - BUS_H / 2);

  return (
    <div
      aria-hidden="true"
      style={{
        position:'relative',
        height: RH,
        background:'#131313',
        overflow:'visible',
        contain:'layout',
      }}
    >
      {/* ── Sidewalk strips ─────────────────────────────── */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height: CURB, background:'#1e1e1e' }}/>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height: CURB, background:'#1e1e1e' }}/>

      {/* ── Yellow edge lines ────────────────────────────── */}
      <div style={{ position:'absolute', top: CURB, left:0, right:0, height: EDGE, background:'#F2A734' }}/>
      <div style={{ position:'absolute', bottom: CURB, left:0, right:0, height: EDGE, background:'#F2A734' }}/>

      {/* ── Road surface ─────────────────────────────────── */}
      <div style={{ position:'absolute', top: ROAD_TOP, left:0, right:0, height: RH - 2 * CURB - 2 * EDGE, background:'#141414' }}/>

      {/* ── Center white dashes (animated) ───────────────── */}
      <div className="road-center-dash" style={{ position:'absolute', top: CENTER_TOP + LANE, left:0, right:0, height: CENTER }}/>

      {/* ── Scene elements ────────────────────────────────── */}
      {scene === 'crossing' && <ZebraCrossing />}
      {scene === 'crossing' && phase === 'red' && <Pedestrian walkKey={walkKey} />}

      {(scene === 'traffic-light' || scene === 'crossing') && (
        <>
          {/* Traffic light – top of road (controls right lane) */}
          <div style={{ position:'absolute', left: scene === 'traffic-light' ? '70%' : '25%', top:-47, transform:'translateX(-50%)', zIndex:10 }}>
            <TrafficLightPost phase={phase} side="top"/>
          </div>
          {/* Matching light – bottom (controls left lane) */}
          <div style={{ position:'absolute', left: scene === 'traffic-light' ? '70%' : '25%', bottom:-47, transform:'translateX(-50%)', zIndex:10 }}>
            <TrafficLightPost phase={phase === 'red' ? 'red' : phase === 'amber' ? 'amber' : 'green'} side="bot"/>
          </div>
          {/* Stop line on road surface */}
          <div style={{
            position:'absolute',
            left: scene === 'traffic-light' ? 'calc(70% - 4px)' : 'calc(25% - 4px)',
            top: ROAD_TOP, width:4, height: RH - 2 * CURB - 2 * EDGE,
            background:'rgba(255,255,255,.45)',
            borderRadius:2, zIndex:2,
          }}/>
        </>
      )}

      {scene === 'bus-stop' && <BusStopSign />}

      {scene === 'parking' && <ParkingBays />}

      {/* ── Vehicles ─────────────────────────────────────── */}
      {cars.map((car, i) => {
        const isRight = car.lane === 'R';
        const flip    = !isRight;
        const topY    = car.bus ? (isRight ? busTopY : busBotY) : (isRight ? carTopY : carBotY);
        const animName = car.anim ?? (isRight ? 'drive-right' : 'drive-left');

        // For parking animation, don't pause (it's its own complex path)
        const shouldPause = stopped && animName !== 'park-into-bay' && animName !== 'bus-stop-right';

        return (
          <div
            key={i}
            style={{
              position:'absolute',
              top: topY,
              left:0,
              animationName: animName,
              animationDuration: `${car.dur}s`,
              animationDelay: `${car.delay}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              animationPlayState: shouldPause ? 'paused' : 'running',
              willChange:'transform',
              zIndex: 3,
            } as React.CSSProperties}
          >
            {car.bus
              ? <BusSVG color={car.color} flip={flip}/>
              : <CarSVG color={car.color} flip={flip}/>
            }
          </div>
        );
      })}
    </div>
  );
}
