'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function QuizError({ error, reset }: { error: Error; reset: () => void }) {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '40px 24px', background: 'var(--paint)' }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ fontSize: '2.4rem', marginBottom: 16 }}>⚠️</div>
        <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>
          Something went wrong
        </h2>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 24, fontSize: '.95rem' }}>
          The quiz couldn&apos;t load. Try again or go back to the tests.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={reset}>Try again</button>
          <Link href={`/${locale}`} className="btn btn-ghost">← Back</Link>
        </div>
      </div>
    </div>
  );
}
