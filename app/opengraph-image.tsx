import { ImageResponse } from 'next/og';
import { BRAND_NAME } from '@/lib/brand';

export const runtime = 'edge';
export const alt = `${BRAND_NAME} — Singapore & Japan Driving Theory Test Practice`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0D1B0F',
          padding: '72px 80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top accent bar */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 48 }}>
          {['#1B9C56', '#2563EB', '#7C3AED', '#E8A020', '#E8192C'].map((c, i) => (
            <div key={i} style={{ width: 40, height: 5, borderRadius: 3, background: c }} />
          ))}
        </div>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#1B9C56', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', width: 34, height: 34, borderRadius: 8, border: '3px solid rgba(255,255,255,0.88)' }} />
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 12, height: 5, borderRadius: 3, background: '#fff' }} />
              <div style={{ width: 12, height: 5, borderRadius: 3, background: '#F2A734' }} />
            </div>
          </div>
          <span style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{BRAND_NAME}</span>
        </div>

        {/* Headline */}
        <div style={{ fontSize: 64, fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 28, maxWidth: 800 }}>
          Pass your theory test on the first try.
        </div>

        {/* Sub */}
        <div style={{ fontSize: 26, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, maxWidth: 700, marginBottom: 48 }}>
          Practice Singapore BTT / FTT / RTT and Japan driving theory in English, Myanmar & Japanese.
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 14 }}>
          {['🇸🇬 Singapore', '🇯🇵 Japan', '1,300+ questions', '90% pass mark', 'Free'].map(tag => (
            <div key={tag} style={{ padding: '10px 18px', background: 'rgba(255,255,255,0.1)', borderRadius: 100, fontSize: 20, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
              {tag}
            </div>
          ))}
        </div>

        {/* Bottom URL */}
        <div style={{ position: 'absolute', bottom: 48, right: 80, fontSize: 22, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
          theorylane.app
        </div>
      </div>
    ),
    { ...size }
  );
}
