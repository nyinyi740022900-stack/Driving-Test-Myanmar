#!/usr/bin/env node
/**
 * SVG Sign Asset Generator for RoadReady
 * Generates all 565 unique sign/diagram/infographic SVGs from question bank metadata.
 */
const fs = require('fs');
const path = require('path');

const CATS = ['sg_btt','sg_ftt','sg_rtt','jp_car','jp_moto'];
const OUT_BASE = path.join(__dirname, '../public/signs');
const QUESTIONS_DIR = path.join(__dirname, '../content/questions');

// ── Colour palette ────────────────────────────────────────────────────────────
const C = {
  // Singapore palette
  regRed:'#E0474C', regRedLight:'rgba(224,71,76,.08)',
  white:'#FFFFFF', cream:'#F5F3EA',
  guideGreen:'#1B9C56', guideDeep:'#127A41',
  amber:'#F2A734',
  blue:'#2C6FC9', blueLight:'#4A8FE0',
  asphalt:'#13160F', asphaltLight:'#1C2018',
  road:'#3A3D34', laneWhite:'rgba(255,255,255,0.85)',
  ink:'#181C13', inkSoft:'#52584A',
  // Japan palette
  jpBlue:'#003087', jpGreen:'#1B5E20', jpYellow:'#FFD600',
  jpOrange:'#E65100', jpSign:'#0047AB',
};

// ── SVG wrapper ───────────────────────────────────────────────────────────────
function svg(w, h, content, extra='') {
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" ${extra}>\n${content}\n</svg>`;
}

// ── Shared primitives ─────────────────────────────────────────────────────────
function circle(cx,cy,r,fill,stroke='none',sw=0) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
}
function rect(x,y,w,h,fill,rx=0,stroke='none',sw=0) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
}
function text(x,y,t,size,fill,anchor='middle',weight=700,fontFamily='system-ui,sans-serif') {
  return `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}" dominant-baseline="central" font-family="${fontFamily}">${t}</text>`;
}
function line(x1,y1,x2,y2,stroke,sw=2,cap='round') {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="${cap}"/>`;
}

// ── Road signs ─────────────────────────────────────────────────────────────────

// SG regulatory (red circle, white bg)
function sgRegSign(innerContent, w=200) {
  const cx=w/2, cy=w/2, r=w*0.46, inner=r-w*0.06;
  return `${circle(cx,cy,r,C.regRed)}${circle(cx,cy,r,C.white,'#CC0000',2)}${circle(cx,cy,inner,C.white)}${innerContent}`;
}

// SG warning (yellow triangle)
function sgWarnSign(innerContent, w=200) {
  const m=w*0.05, s=w-2*m;
  const pts=`${w/2},${m} ${m},${w-m} ${w-m},${w-m}`;
  return `<polygon points="${pts}" fill="${C.amber}" stroke="#CC8800" stroke-width="2"/>
<polygon points="${w/2},${m+24} ${m+20},${w-m-10} ${w-m-20},${w-m-10}" fill="${C.cream}"/>
${innerContent}`;
}

// JP regulatory (white circle, red border)
function jpRegSign(innerContent, w=200) {
  const cx=w/2, cy=w/2, r=w*0.46;
  return `${circle(cx,cy,r,C.white,C.regRed,w*0.07)}${innerContent}`;
}

// JP warning (yellow diamond)
function jpWarnSign(innerContent, w=200) {
  const cx=w/2, cy=w/2, r=w*0.44;
  const pts=`${cx},${cy-r} ${cx+r},${cy} ${cx},${cy+r} ${cx-r},${cy}`;
  return `<polygon points="${pts}" fill="${C.jpYellow}" stroke="#AA8800" stroke-width="2"/>
<polygon points="${cx},${cy-r+14} ${cx+r-14},${cy} ${cx},${cy+r-14} ${cx-r+14},${cy}" fill="${C.jpYellow}" stroke="none"/>
${innerContent}`;
}

// JP informatory (blue rectangle with white border)
function jpInfoSign(label, subLabel='', w=240, h=100) {
  const pad=8;
  return `${rect(0,0,w,h,C.jpBlue,8)}${rect(pad,pad,w-2*pad,h-2*pad,C.jpBlue,4,'white',2)}
${text(w/2,h*0.42,label,h*0.35,'white')}
${subLabel ? text(w/2,h*0.75,subLabel,h*0.2,'rgba(255,255,255,0.8)') : ''}`;
}

// ── Infographic template ───────────────────────────────────────────────────────
function infographic(icon, mainNum, unit, desc, w=240, h=240, accent=C.guideGreen) {
  return `${rect(0,0,w,h,C.cream,16)}
${rect(0,0,w,h,C.white,16,'#E0DDD4',1.5)}
${rect(20,20,w-40,h-40,accent,10,'none',0)}
${rect(20,20,w-40,h-40,C.white,10,'none',0)}
<rect x="20" y="20" width="${w-40}" height="5" rx="0" fill="${accent}"/>
${icon}
${text(w/2,h*0.62,mainNum,h*0.28,C.ink)}
${text(w/2,h*0.78,unit,h*0.12,C.inkSoft)}
${text(w/2,h*0.9,desc,h*0.085,C.inkSoft)}`;
}

// Speed limit sign (SG style – white circle red border, number)
function speedLimitSG(speed, w=200) {
  const cx=w/2, cy=w/2, r=w*0.46;
  return svg(w,w,`${circle(cx,cy,r,C.white,C.regRed,w*0.08)}${text(cx,cy+2,speed,w*0.38,C.ink)}`);
}

// Speed limit sign (JP style)
function speedLimitJP(speed, w=200) {
  return svg(w,w,jpRegSign(`${text(w/2,w/2+4,speed,w*0.38,C.regRed,'middle',900)}`,w));
}

// No-entry sign
function noEntry(w=200) {
  return svg(w,w,sgRegSign(`<rect x="${w*0.23}" y="${w*0.43}" width="${w*0.54}" height="${w*0.14}" rx="${w*0.025}" fill="${C.regRed}"/>`,w));
}

// No-parking sign
function noPark(w=200) {
  const cx=w/2, cy=w/2;
  return svg(w,w,sgRegSign(`
${text(cx,cy,'P',w*0.36,C.regRed)}
<line x1="${w*0.25}" y1="${w*0.25}" x2="${w*0.75}" y2="${w*0.75}" stroke="${C.regRed}" stroke-width="${w*0.07}" stroke-linecap="round"/>`,w));
}

// No-stopping sign
function noStopping(w=200) {
  const cx=w/2, cy=w/2;
  return svg(w,w,sgRegSign(`
<circle cx="${cx}" cy="${cy}" r="${w*0.22}" fill="none" stroke="${C.regRed}" stroke-width="${w*0.065}"/>
<line x1="${w*0.3}" y1="${w*0.3}" x2="${w*0.7}" y2="${w*0.7}" stroke="${C.regRed}" stroke-width="${w*0.065}" stroke-linecap="round"/>`,w));
}

// Give-way / yield
function giveWay(w=200, country='sg') {
  const pts=`${w/2},${w*0.06} ${w*0.94},${w*0.94} ${w*0.06},${w*0.94}`;
  const fill = country==='jp' ? C.jpYellow : C.white;
  const stroke = country==='jp' ? '#AA8800' : C.regRed;
  const textFill = country==='jp' ? C.ink : C.regRed;
  const label = country==='jp' ? '徐行' : 'GIVE\nWAY';
  return svg(w,w,`
<polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="${w*0.04}"/>
<polygon points="${w/2},${w*0.2} ${w*0.84},${w*0.9} ${w*0.16},${w*0.9}" fill="none" stroke="${stroke}" stroke-width="${w*0.025}"/>
${text(w/2,w*0.65,'GIVE WAY',w*0.14,textFill,'middle',700)}`);
}

// Stop sign
function stopSign(w=200) {
  // Octagon
  const r=w*0.46, cx=w/2, cy=w/2;
  const n=8, pts=Array.from({length:n},(_,i)=>{
    const a=Math.PI/n+i*2*Math.PI/n;
    return `${cx+r*Math.cos(a)},${cy+r*Math.sin(a)}`;
  }).join(' ');
  return svg(w,w,`<polygon points="${pts}" fill="${C.regRed}" stroke="white" stroke-width="3"/>
${text(cx,cy,'STOP',w*0.22,C.white)}`);
}

// One-way arrow
function oneWay(dir='right', w=240, h=100) {
  const arrowColor=C.white;
  const bgColor=C.ink;
  let arrow='';
  if(dir==='right') arrow=`<polygon points="160,20 220,50 160,80 160,60 60,60 60,40 160,40" fill="${arrowColor}"/>`;
  else if(dir==='left') arrow=`<polygon points="80,20 20,50 80,80 80,60 180,60 180,40 80,40" fill="${arrowColor}"/>`;
  else arrow=`<polygon points="95,160 145,160 145,80 170,80 120,20 70,80 95,80" fill="${arrowColor}"/>`;
  return svg(w,h,`${rect(0,0,w,h,bgColor,8)}${arrow}`);
}

// Double yellow line / centre line
function doubleYellowLine(w=240, h=120) {
  return svg(w,h,`${rect(0,0,w,h,C.asphalt,0)}
<rect x="0" y="${h/2-10}" width="${w}" height="4" fill="${C.amber}"/>
<rect x="0" y="${h/2+6}" width="${w}" height="4" fill="${C.amber}"/>
${text(w/2,h*0.25,'DOUBLE YELLOW LINE',w*0.06,C.cream,'middle',600)}
${text(w/2,h*0.78,'No stopping at any time',w*0.065,C.inkSoft,'middle',400)}`);
}

// Junction/intersection diagram (top-down)
function junctionDiagram(label='', w=240, h=240) {
  const roadW=50, cx=w/2, cy=h/2;
  return svg(w,h,`${rect(0,0,w,h,C.cream,0)}
<rect x="0" y="${cy-roadW/2}" width="${w}" height="${roadW}" fill="${C.road}"/>
<rect x="${cx-roadW/2}" y="0" width="${roadW}" height="${h}" fill="${C.road}"/>
<rect x="0" y="${cy-2}" width="${cx-roadW/2}" height="4" fill="${C.amber}" opacity="0.7"/>
<rect x="${cx+roadW/2}" y="${cy-2}" width="${cx-roadW/2}" height="4" fill="${C.amber}" opacity="0.7"/>
${text(cx,h*0.9,label,h*0.065,C.inkSoft)}`);
}

// Roundabout diagram
function roundaboutDiagram(w=240, h=240) {
  const cx=w/2, cy=h/2, r=70, inner=30, roadW=28;
  return svg(w,h,`${rect(0,0,w,h,C.cream,0)}
${circle(cx,cy,r+roadW,C.road)}${circle(cx,cy,r,C.cream)}${circle(cx,cy,inner,C.asphalt)}
<rect x="0" y="${cy-roadW/2}" width="${cx-r}" height="${roadW}" fill="${C.road}"/>
<rect x="${cx+r}" y="${cy-roadW/2}" width="${w-cx-r}" height="${roadW}" fill="${C.road}"/>
<rect x="${cx-roadW/2}" y="0" width="${roadW}" height="${cy-r}" fill="${C.road}"/>
<rect x="${cx-roadW/2}" y="${cy+r}" width="${roadW}" height="${h-cy-r}" fill="${C.road}"/>
${text(cx,h*0.92,'Roundabout — yield to circulating traffic',w*0.055,C.inkSoft)}`);
}

// Lane diagram
function laneDiagram(lanes=3, label='', w=240, h=180) {
  const roadH=h*0.55, y0=h*0.22, laneW=w/lanes;
  let content=`${rect(0,y0,w,roadH,C.road,0)}`;
  for(let i=1;i<lanes;i++){
    content+=`<line x1="${i*laneW}" y1="${y0}" x2="${i*laneW}" y2="${y0+roadH}" stroke="${C.amber}" stroke-width="2" stroke-dasharray="14,10"/>`;
  }
  content+=text(w/2,h*0.87,label,h*0.07,C.inkSoft);
  return svg(w,h,content);
}

// Following distance infographic
function followingDistance(meters, label='Safe following distance', w=280, h=140) {
  return svg(w,h,`${rect(0,0,w,h,C.cream,12)}
${rect(8,8,w-16,h-16,C.white,8,'#E0DDD4',1)}
<!-- car 1 -->
<rect x="20" y="${h/2-14}" width="52" height="28" rx="5" fill="${C.guideGreen}" opacity="0.9"/>
<rect x="26" y="${h/2-22}" width="40" height="16" rx="3" fill="${C.guideGreen}"/>
<circle cx="30" cy="${h/2+16}" r="7" fill="${C.asphalt}"/>
<circle cx="62" cy="${h/2+16}" r="7" fill="${C.asphalt}"/>
<!-- car 2 -->
<rect x="${w-72}" y="${h/2-14}" width="52" height="28" rx="5" fill="${C.regRed}" opacity="0.85"/>
<rect x="${w-78}" y="${h/2-22}" width="40" height="16" rx="3" fill="${C.regRed}"/>
<circle cx="${w-62}" cy="${h/2+16}" r="7" fill="${C.asphalt}"/>
<circle cx="${w-30}" cy="${h/2+16}" r="7" fill="${C.asphalt}"/>
<!-- distance arrow -->
<line x1="76" y1="${h/2}" x2="${w-76}" y2="${h/2}" stroke="${C.amber}" stroke-width="2" stroke-dasharray="5,4"/>
<polygon points="76,${h/2} 90,${h/2-5} 90,${h/2+5}" fill="${C.amber}"/>
<polygon points="${w-76},${h/2} ${w-90},${h/2-5} ${w-90},${h/2+5}" fill="${C.amber}"/>
${text(w/2,h/2,meters,14,C.ink)}
${text(w/2,h*0.88,label,11,C.inkSoft)}`);
}

// Speed + braking distance
function brakingDistance(speed, dist, w=240, h=200) {
  return svg(w,h,`${rect(0,0,w,h,C.cream,12)}${rect(8,8,w-16,h-16,C.white,8,'#E0DDD4',1)}
${circle(w/2,h*0.35,50,C.white,C.regRed,7)}
${text(w/2,h*0.32,speed,32,C.ink)}
${text(w/2,h*0.42,'km/h',13,C.inkSoft)}
${text(w/2,h*0.62,'Stopping distance',12,C.inkSoft)}
${text(w/2,h*0.74,dist,28,C.guideGreen)}
${text(w/2,h*0.85,'metres',13,C.inkSoft)}`);
}

// Alcohol limit infographic
function alcoholLimit(limit, label='Blood Alcohol Level', w=240, h=200) {
  return svg(w,h,`${rect(0,0,w,h,C.cream,12)}${rect(8,8,w-16,h-16,C.white,8,'#E0DDD4',1)}
<!-- glass icon -->
<path d="M95,30 L145,30 L135,100 Q120,120 120,130 L100,130 Q100,120 85,100 Z" fill="${C.regRed}" opacity="0.15" stroke="${C.regRed}" stroke-width="2"/>
<line x1="100" y1="130" x2="140" y2="130" stroke="${C.regRed}" stroke-width="2"/>
<line x1="120" y1="130" x2="120" y2="150" stroke="${C.regRed}" stroke-width="2"/>
<line x1="105" y1="150" x2="135" y2="150" stroke="${C.regRed}" stroke-width="2"/>
<!-- cross overlay -->
<line x1="82" y1="22" x2="158" y2="158" stroke="${C.regRed}" stroke-width="5" stroke-linecap="round"/>
${text(w/2,h*0.72,limit,26,C.ink)}
${text(w/2,h*0.83,'mg/100 ml',12,C.inkSoft)}
${text(w/2,h*0.93,label,11,C.inkSoft)}`);
}

// Helmet infographic
function helmetInfographic(w=200, h=200) {
  return svg(w,h,`${rect(0,0,w,h,C.cream,12)}${rect(8,8,w-16,h-16,C.white,8,C.guideGreen,1.5)}
<!-- helmet shape -->
<ellipse cx="100" cy="85" rx="55" ry="50" fill="${C.asphalt}"/>
<ellipse cx="100" cy="95" rx="55" ry="20" fill="${C.asphalt}"/>
<rect x="55" y="95" width="90" height="22" rx="8" fill="${C.asphalt-10}" opacity="0.5" fill="${C.inkSoft}"/>
<ellipse cx="100" cy="75" rx="45" ry="35" fill="${C.blue}" opacity="0.3"/>
<path d="M55,85 Q55,40 100,35 Q145,40 145,85" fill="${C.asphalt}" opacity="0.9"/>
${text(w/2,h*0.78,'HELMET',15,C.guideGreen,'middle',800)}
${text(w/2,h*0.88,'REQUIRED BY LAW',11,C.inkSoft)}`);
}

// Vehicle check infographic
function vehicleCheck(items, w=240, h=240) {
  let y=50, content='';
  content+=`${rect(0,0,w,h,C.cream,12)}${rect(8,8,w-16,h-16,C.white,8,'#E0DDD4',1)}`;
  content+=text(w/2,25,'PRE-DRIVE CHECKS',13,C.guideDeep,'middle',800);
  for(const item of items) {
    content+=`<circle cx="35" cy="${y}" r="10" fill="${C.guideGreen}"/>`;
    content+=`<text x="35" y="${y}" font-size="12" fill="white" text-anchor="middle" dominant-baseline="central" font-weight="700">✓</text>`;
    content+=text(w/2+10,y,item,12,C.ink,'middle',500);
    y+=30;
  }
  return svg(w,h,content);
}

// Road marking
function roadMarking(type='centre-line', w=280, h=120) {
  let markings='';
  if(type==='centre-line') {
    markings=`<line x1="0" y1="${h/2}" x2="${w}" y2="${h/2}" stroke="${C.amber}" stroke-width="4" stroke-dasharray="20,15"/>`;
  } else if(type==='double-yellow') {
    markings=`<line x1="0" y1="${h/2-4}" x2="${w}" y2="${h/2-4}" stroke="${C.amber}" stroke-width="4"/>
<line x1="0" y1="${h/2+4}" x2="${w}" y2="${h/2+4}" stroke="${C.amber}" stroke-width="4"/>`;
  } else if(type==='white-divider') {
    markings=`<line x1="0" y1="${h/2}" x2="${w}" y2="${h/2}" stroke="${C.white}" stroke-width="4" stroke-dasharray="20,15"/>`;
  } else {
    markings=`<line x1="0" y1="${h/2}" x2="${w}" y2="${h/2}" stroke="${C.white}" stroke-width="6"/>`;
  }
  return svg(w,h,`${rect(0,0,w,h,C.road,0)}${markings}`);
}

// Car silhouette (simple side view)
function carSilhouette(x,y,w,h,fill) {
  const bw=w, bh=h*0.55, by=y+h*0.45;
  const tw=w*0.55, th=h*0.48, tx=x+w*0.22, ty=y+h*0.05;
  const wr=h*0.18;
  return `<rect x="${x}" y="${by}" width="${bw}" height="${bh}" rx="${h*0.1}" fill="${fill}"/>
<rect x="${tx}" y="${ty}" width="${tw}" height="${th}" rx="${h*0.1}" fill="${fill}"/>
<circle cx="${x+w*0.22}" cy="${by+bh}" r="${wr}" fill="${C.asphalt}"/>
<circle cx="${x+w*0.78}" cy="${by+bh}" r="${wr}" fill="${C.asphalt}"/>`;
}

// Pedestrian crossing / zebra
function pedestrianCrossing(w=240, h=160) {
  const stripes=6, sw=w/stripes;
  let content=`${rect(0,0,w,h,C.road,0)}`;
  for(let i=0;i<stripes;i+=2) content+=`<rect x="${i*sw}" y="${h*0.2}" width="${sw}" height="${h*0.6}" fill="white" opacity="0.9"/>`;
  // stick figure
  content+=`${circle(w*0.5,h*0.12,12,C.amber)}
<line x1="${w*0.5}" y1="${h*0.25}" x2="${w*0.5}" y2="${h*0.65}" stroke="${C.amber}" stroke-width="4"/>
<line x1="${w*0.5}" y1="${h*0.38}" x2="${w*0.35}" y2="${h*0.55}" stroke="${C.amber}" stroke-width="4"/>
<line x1="${w*0.5}" y1="${h*0.38}" x2="${w*0.65}" y2="${h*0.55}" stroke="${C.amber}" stroke-width="4"/>
<line x1="${w*0.5}" y1="${h*0.65}" x2="${w*0.38}" y2="${h*0.88}" stroke="${C.amber}" stroke-width="4"/>
<line x1="${w*0.5}" y1="${h*0.65}" x2="${w*0.62}" y2="${h*0.88}" stroke="${C.amber}" stroke-width="4"/>`;
  return svg(w,h,content);
}

// Expressway speed sign
function expresswaySpeed(max, min='', w=240, h=160) {
  return svg(w,h,`${rect(0,0,w,h,C.guideGreen,10)}
${rect(10,10,w-20,h-20,C.guideGreen,6,'white',2)}
${text(w/2,h*0.32,'MAXIMUM',14,C.white,'middle',600)}
${text(w/2,h*0.58,max,42,C.white,'middle',900)}
${text(w/2,h*0.76,'km/h',16,C.white,'middle',500)}
${min ? text(w/2,h*0.9,'Min '+min+' km/h',11,'rgba(255,255,255,0.7)') : ''}`);
}

// Generic warning / hazard infographic
function hazardInfo(icon_path, title, desc, w=240, h=200, accent=C.amber) {
  return svg(w,h,`${rect(0,0,w,h,C.cream,12)}${rect(8,8,w-16,h-16,C.white,8,accent,1.5)}
<rect x="8" y="8" width="${w-16}" height="40" rx="8" fill="${accent}"/>
${text(w/2,28,title,13,accent==='#F2A734'?C.ink:C.white,'middle',700)}
${icon_path}
${text(w/2,h*0.82,desc,11,C.inkSoft,'middle',400)}`);
}

// Blind spot diagram
function blindSpotDiagram(w=280, h=200) {
  const cx=w/2, cy=h*0.45;
  return svg(w,h,`${rect(0,0,w,h,C.cream,0)}
<!-- car top-down -->
<rect x="${cx-20}" y="${cy-55}" width="40" height="80" rx="8" fill="${C.blue}"/>
<rect x="${cx-16}" y="${cy-52}" width="32" height="30" rx="4" fill="${C.blueLight}" opacity="0.5"/>
<!-- blind spot zones -->
<ellipse cx="${cx-60}" cy="${cy-10}" rx="50" ry="35" fill="${C.regRed}" opacity="0.2" stroke="${C.regRed}" stroke-width="1.5" stroke-dasharray="5,3"/>
<ellipse cx="${cx+60}" cy="${cy-10}" rx="50" ry="35" fill="${C.regRed}" opacity="0.2" stroke="${C.regRed}" stroke-width="1.5" stroke-dasharray="5,3"/>
${text(cx-60,cy-10,'BLIND',10,C.regRed)}
${text(cx+60,cy-10,'BLIND',10,C.regRed)}
${text(cx-60,cy+4,'SPOT',10,C.regRed)}
${text(cx+60,cy+4,'SPOT',10,C.regRed)}
${text(cx,h*0.88,'Check mirrors and blind spots before changing lanes',w*0.042,C.inkSoft)}`);
}

// Wet road / slippery conditions
function wetRoadDiagram(w=240, h=180) {
  return svg(w,h,`${rect(0,0,w,h,C.road,0)}
<!-- rain drops -->
${[...Array(12)].map((_,i)=>`<ellipse cx="${20+i*18}" cy="${15+((i*37)%40)}" rx="2" ry="6" fill="${C.blue}" opacity="0.7" transform="rotate(-15,${20+i*18},${15+((i*37)%40)})"/>`).join('')}
<!-- wet road shimmer -->
<rect x="0" y="${h*0.55}" width="${w}" height="${h*0.45}" fill="${C.road}"/>
<rect x="0" y="${h*0.55}" width="${w}" height="${h*0.08}" fill="${C.blueLight}" opacity="0.3"/>
${text(w/2,h*0.85,'Increase following distance in wet conditions',w*0.053,C.cream,'middle',500)}`);
}

// ── Name → generator mapping ───────────────────────────────────────────────────

function parseName(filename) {
  return filename.replace(/\.svg$/,'').replace(/\.json$/,'');
}

function getSpeedFromName(name) {
  const m = name.match(/[-_](\d+)$/);
  return m ? m[1] : null;
}

function generateSVG(src, q) {
  const name = parseName(path.basename(src));
  const country = src.includes('/sg/') ? 'sg' : 'jp';
  const topic = q ? q.topic : '';
  const isAnimation = src.endsWith('.json');

  if(isAnimation) return null; // handled separately

  // ── SG Signs ────────────────────────────────────────────────────────────────
  if(name==='no-entry') return noEntry();
  if(name.includes('no-parking') && !name.includes('zone')) return noPark();
  if(name.includes('no-stopping')) return noStopping();
  if(name.includes('give-way') || name.includes('yield')) return giveWay(200, country);
  if(name==='stop-sign'||name.includes('stop-sign')) return stopSign();

  // Speed limits
  const speedMatch = name.match(/speed-limit[-_](\d+)/);
  if(speedMatch) {
    return country==='sg' ? speedLimitSG(speedMatch[1]) : speedLimitJP(speedMatch[1]);
  }
  const defaultSpeedMatch = name.match(/default-speed-limit[-_](\d+)/);
  if(defaultSpeedMatch) {
    return country==='sg' ? speedLimitSG(defaultSpeedMatch[1]) : speedLimitJP(defaultSpeedMatch[1]);
  }
  const maxSpeedMatch = name.match(/(?:max|maximum)-speed[-_](\d+)/);
  if(maxSpeedMatch) {
    return country==='sg' ? speedLimitSG(maxSpeedMatch[1]) : expresswaySpeed(maxSpeedMatch[1]);
  }
  if(name.includes('expressway-max-speed')) {
    const m2=name.match(/(\d+)/); return expresswaySpeed(m2?m2[1]:'90');
  }

  // Directional / one-way
  if(name.includes('one-way') && name.includes('right')) return oneWay('right');
  if(name.includes('one-way') && name.includes('left')) return oneWay('left');
  if(name.includes('one-way')) return oneWay('right');

  // Pedestrian
  if(name.includes('pedestrian-crossing')||name.includes('zebra')||name.includes('crosswalk')) return pedestrianCrossing();

  // Roundabout
  if(name.includes('roundabout')) return roundaboutDiagram();

  // Lane
  if(name.includes('lane-discipline')||name.includes('lane-position')||name.includes('lane-filtering')) return laneDiagram(3,'Lane discipline');
  if(name.includes('expressway-lane')) return laneDiagram(3,'Expressway lanes');

  // Junction
  if(name.includes('junction')||name.includes('intersection')||name.includes('right-of-way')) return junctionDiagram('Yield to traffic on major road');

  // Blind spot
  if(name.includes('blind-spot')||name.includes('blind_spot')) return blindSpotDiagram();

  // Following distance
  if(name.includes('two-second')||name.includes('following-distance')||name.includes('safe-distance')) return followingDistance('2s','2-second rule');
  if(name.includes('following')) return followingDistance('≥2s','Maintain safe gap');

  // Braking / stopping distance
  if(name.includes('braking-distance')||name.includes('stopping-distance')) {
    const sp=name.match(/(\d+)/); return brakingDistance(sp?sp[1]:'50','40m');
  }
  if(name.includes('speed-braking')) return brakingDistance('50','40m');

  // Alcohol
  if(name.includes('alcohol')||name.includes('drink-drive')||name.includes('bac')) return alcoholLimit('35 μg','Breath alcohol limit (SG)');

  // Helmet
  if(name.includes('helmet')) return helmetInfographic();

  // Vehicle checks
  if(name.includes('pre-drive')||name.includes('vehicle-check')) return vehicleCheck(['Tyres','Brakes','Lights','Mirrors'],240,200);

  // Road markings
  if(name.includes('double-yellow')) return doubleYellowLine();
  if(name.includes('road-marking')||name.includes('road_marking')||name.includes('centre-line')) return roadMarking('centre-line');
  if(name.includes('white-line')) return roadMarking('white-divider');

  // Wet / weather
  if(name.includes('wet')||name.includes('rain')||name.includes('slippery')||name.includes('aquaplan')) return wetRoadDiagram();

  // ── SG specific sign shapes ─────────────────────────────────────────────────
  const sgRegPatterns = ['no-motorcycles','no-vehicles','no-bicycles','no-trucks','no-u-turn','no-horn','no-pedestrians','no-left','no-right','no-overtaking','no-through','no-entry'];
  for(const p of sgRegPatterns) {
    if(name.includes(p)) {
      const w=200, cx=w/2, cy=w/2;
      return svg(w,w,sgRegSign(`${text(cx,cy,'⊘',w*0.42,C.regRed)}`,w));
    }
  }

  const sgWarnPatterns = ['hazard','warning','danger','curve','bend','children','animal','school-zone','level-crossing','railway','narrowing','hill','dip','hump','slippery'];
  for(const p of sgWarnPatterns) {
    if(name.includes(p)) {
      return svg(200,200,sgWarnSign(`${text(100,125,'⚠',60,C.ink)}`));
    }
  }

  // SG info/blue mandatory
  const sgMandatoryPatterns = ['must-keep','keep-left','keep-right','go-straight','turn-left','turn-right'];
  for(const p of sgMandatoryPatterns) {
    if(name.includes(p)) {
      const w=200, cx=w/2, cy=w/2;
      return svg(w,w,`${circle(cx,cy,w*0.46,C.blue)}${circle(cx,cy,w*0.46,'none','white',2)}${text(cx,cy,'↑',w*0.45,C.white,'middle',900)}`);
    }
  }

  // ── JP specific ──────────────────────────────────────────────────────────────
  const jpWarnPatterns = ['curve','bend','animal','children','crosswind','rough-road','slope','dip','intersection-ahead','railway','narrowing'];
  for(const p of jpWarnPatterns) {
    if(name.includes(p)) {
      return svg(200,200,jpWarnSign(`${text(100,110,'⚠',55,C.ink)}`));
    }
  }

  const jpRegPatterns = ['no-entry','no-passing','no-stopping','no-parking','no-vehicles','no-bicycles','no-motorcycles','no-pedestrians','no-left','no-right','no-u-turn'];
  for(const p of jpRegPatterns) {
    if(name.includes(p)) {
      return svg(200,200,jpRegSign(`${text(100,100,'⊘',80,C.regRed)}`,200));
    }
  }

  // JP blue mandatory
  const jpMandatoryPatterns = ['must','keep-left','go-straight','allowed','permitted','bicycle-only','bus-only','pedestrian-only'];
  for(const p of jpMandatoryPatterns) {
    if(name.includes(p)) {
      const w=200;
      return svg(w,w,`${circle(w/2,w/2,w*0.46,C.jpBlue)}${circle(w/2,w/2,w*0.46,'none','white',2)}${text(w/2,w/2,'↑',w*0.4,C.white,'middle',900)}`);
    }
  }

  // JP info / green
  if(name.includes('expressway')||name.includes('highway')||name.includes('freeway')) {
    return svg(240,100,jpInfoSign('高速道路','Expressway',240,100));
  }
  if(name.includes('direction')||name.includes('route')||name.includes('destination')) {
    return svg(240,100,jpInfoSign(name.replace(/-/g,' ').replace(/_/g,' '),'',240,100));
  }

  // ── Infographic fallback (topic-based) ──────────────────────────────────────
  if(topic.includes('speed')||name.includes('speed')) {
    const sp=name.match(/(\d+)/); return brakingDistance(sp?sp[1]:'60','48m');
  }
  if(topic.includes('alcohol')||name.includes('alcohol')) return alcoholLimit('35 μg','Limit');
  if(topic.includes('helmet')||name.includes('helmet')) return helmetInfographic();
  if(topic.includes('blind_spot')||topic.includes('visibility')) return blindSpotDiagram();
  if(topic.includes('weather')||name.includes('weather')||name.includes('night')) return wetRoadDiagram();
  if(topic.includes('lane')||name.includes('lane')) return laneDiagram(3,'Lane usage');
  if(topic.includes('roundabout')||name.includes('roundabout')) return roundaboutDiagram();
  if(topic.includes('junction')||topic.includes('right_of_way')||name.includes('intersection')) return junctionDiagram('Right of way');
  if(topic.includes('pedestrian')||name.includes('pedestrian')) return pedestrianCrossing();
  if(topic.includes('expressway')||name.includes('expressway')) return laneDiagram(3,'Expressway');

  // Final fallback: clean generic infographic with sign name
  const displayName = name.replace(/-/g,' ').replace(/_/g,' ')
    .replace(/\b\w/g, l=>l.toUpperCase()).substring(0,30);
  const w=240, h=200;
  return svg(w,h,`${rect(0,0,w,h,C.cream,12)}${rect(8,8,w-16,h-16,C.white,8,C.guideGreen,1.5)}
<rect x="8" y="8" width="${w-16}" height="46" rx="8" fill="${C.guideGreen}"/>
${text(w/2,31,'ROAD RULE',12,C.white,'middle',700)}
${text(w/2,h*0.5,displayName,13,C.ink,'middle',600)}
${circle(w/2,h*0.28,24,C.guideGreen)}
${text(w/2,h*0.28,'✓',22,C.white,'middle',900)}`);
}

// ── Animation stub (Lottie JSON placeholder) ──────────────────────────────────
function animationStub(name) {
  const displayName = name.replace(/-/g,' ').replace(/_/g,' ');
  // Lightweight looping SVG animation (not Lottie, but works without a player)
  return `<svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="240" height="200" rx="12" fill="#13160F"/>
  <text x="120" y="80" font-size="13" fill="#F5F3EA" text-anchor="middle" font-weight="600" font-family="system-ui,sans-serif">${displayName.substring(0,36)}</text>
  <!-- animated car -->
  <rect x="-60" y="110" width="60" height="28" rx="6" fill="#1B9C56">
    <animateTransform attributeName="transform" type="translate" from="0,0" to="300,0" dur="3s" repeatCount="indefinite"/>
  </rect>
  <rect x="-60" y="96" width="42" height="20" rx="4" fill="#127A41">
    <animateTransform attributeName="transform" type="translate" from="0,0" to="300,0" dur="3s" repeatCount="indefinite"/>
  </rect>
  <text x="120" y="170" font-size="11" fill="#52584A" text-anchor="middle" font-family="system-ui,sans-serif">Animation — see explanation below</text>
</svg>`;
}

// ── Main runner ────────────────────────────────────────────────────────────────
async function main() {
  // Load all questions and build src→question map
  const srcToQ = {};
  for(const cat of CATS) {
    const qs = JSON.parse(fs.readFileSync(path.join(QUESTIONS_DIR, cat+'.json'),'utf8'));
    for(const q of qs) {
      if(!srcToQ[q.media.src]) srcToQ[q.media.src] = q;
    }
  }

  let created=0, skipped=0, errors=0;

  for(const [src, q] of Object.entries(srcToQ)) {
    const outPath = path.join(OUT_BASE, src.replace(/^\/signs\//,''));
    const dir = path.dirname(outPath);
    if(!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive:true});

    if(fs.existsSync(outPath)) { skipped++; continue; }

    try {
      let content;
      if(src.endsWith('.json')) {
        content = animationStub(parseName(path.basename(src)));
        // Save as SVG instead (rename ext)
        const svgPath = outPath.replace(/\.json$/,'.svg');
        fs.writeFileSync(svgPath, content, 'utf8');
        // Also create a JSON stub pointing to the SVG
        fs.writeFileSync(outPath, JSON.stringify({v:'5.5.7',w:240,h:200,nm:parseName(path.basename(src)),_comment:'svg_fallback',svgFallback:src.replace(/\.json$/,'.svg')}), 'utf8');
        created++;
      } else {
        content = generateSVG(src, q);
        if(!content) { skipped++; continue; }
        fs.writeFileSync(outPath, content, 'utf8');
        created++;
      }
    } catch(e) {
      console.error('Error generating '+src+':', e.message);
      errors++;
    }
  }

  console.log(`\nDone! Created: ${created}, Skipped (existing): ${skipped}, Errors: ${errors}`);
  console.log('Total unique assets processed:', Object.keys(srcToQ).length);
}

main().catch(console.error);
