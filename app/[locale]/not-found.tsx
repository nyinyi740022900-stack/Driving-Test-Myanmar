'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function LocaleNotFound() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '40px 24px', background: 'var(--paint)' }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🚧</div>
        <h1 style={{ fontFamily: 'var(--display)', fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>
          Page not found
        </h1>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 24 }}>
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href={`/${locale}`} className="btn btn-primary" style={{ display: 'inline-flex' }}>
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
