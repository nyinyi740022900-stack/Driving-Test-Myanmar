import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f8f8f8', display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🚧</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>Page not found</h1>
          <p style={{ color: '#666', marginBottom: 24 }}>The page you're looking for doesn't exist.</p>
          <Link href="/en" style={{ display: 'inline-block', padding: '10px 24px', background: '#1a1a1a', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>
            ← Back to home
          </Link>
        </div>
      </body>
    </html>
  );
}
