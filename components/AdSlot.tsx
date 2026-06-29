'use client';

// Placeholder ad slot — swap in real Google AdSense publisher ID when ready.
// Renders a clearly-labelled placeholder in dev; in production, injects the AdSense script.

interface AdSlotProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
}

export default function AdSlot({ slot = '0000000000', format = 'auto', className = '' }: AdSlotProps) {
  const isDev = process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_ADSENSE_ID;

  if (isDev) {
    return (
      <div
        className={className}
        style={{
          background: 'var(--paint-2)',
          border: '1.5px dashed var(--line)',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: format === 'rectangle' ? 250 : 90,
          color: 'var(--ink-soft)',
          fontSize: '.78rem',
          fontFamily: 'var(--display)',
          fontWeight: 700,
          letterSpacing: '.06em',
          textTransform: 'uppercase',
        }}
      >
        AD SLOT — {format.toUpperCase()}
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
