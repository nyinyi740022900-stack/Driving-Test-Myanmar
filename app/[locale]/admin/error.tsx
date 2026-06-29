'use client';

import { useEffect } from 'react';

export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '40px 24px', background: 'var(--paint)' }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ fontSize: '2.4rem', marginBottom: 16 }}>⚠️</div>
        <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>
          Admin panel error
        </h2>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 24, fontSize: '.95rem' }}>
          {error.message}
        </p>
        <button className="btn btn-primary" onClick={reset}>Try again</button>
      </div>
    </div>
  );
}
