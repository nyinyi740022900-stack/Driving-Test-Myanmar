import Link from 'next/link';
import { PLANS } from '@/lib/subscription';

export default async function PremiumPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paint)', padding: '60px 24px' }}>
      <div style={{ maxWidth: 740, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div className="eyebrow" style={{ color: 'var(--guide-deep)', marginBottom: 12 }}>Simple pricing</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 800, marginBottom: 12 }}>
            Go Premium
          </h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: '1.05rem', maxWidth: '34em', margin: '0 auto' }}>
            No ads, unlimited mock tests, and quiz history tracking.
            Pay via KBZPay or WavePay — activated manually within a few hours.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {(Object.entries(PLANS) as [keyof typeof PLANS, typeof PLANS[keyof typeof PLANS]][]).map(([key, plan]) => (
            <div key={key} style={{
              background: '#fff',
              border: key === 'yearly' ? '2px solid var(--guide)' : '1px solid var(--line)',
              borderRadius: 16,
              padding: '28px 24px',
              position: 'relative',
            }}>
              {key === 'yearly' && (
                <div style={{
                  position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--guide)', color: '#fff', fontFamily: 'var(--display)',
                  fontWeight: 700, fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase',
                  padding: '4px 14px', borderRadius: 999,
                }}>Best value</div>
              )}
              <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: 6 }}>
                {plan.label}
              </div>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '2.2rem', lineHeight: 1, marginBottom: 4 }}>
                {plan.price.toLocaleString()}<span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ink-soft)' }}> Ks</span>
              </div>
              <div style={{ fontSize: '.85rem', color: 'var(--ink-soft)', marginBottom: 20 }}>
                {plan.days} days · {key === 'yearly' ? 'Save 30%+' : 'Pay monthly'}
              </div>
              <ul style={{ listStyle: 'none', fontSize: '.9rem', color: 'var(--ink-soft)', marginBottom: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['No ads', 'Unlimited mock tests', 'Quiz history & best scores', 'Priority support'].map(f => (
                  <li key={f} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: 'var(--guide)', fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/${locale}/payment?plan=${key}`}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', display: 'flex' }}
              >
                Choose {plan.label} →
              </Link>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '.82rem', color: 'var(--ink-soft)' }}>
          <Link href={`/${locale}`} style={{ color: 'var(--guide-deep)', fontWeight: 600 }}>← Back to home</Link>
          &nbsp;&nbsp;·&nbsp;&nbsp;
          Questions? See our <a href="#faq" style={{ color: 'var(--guide-deep)', fontWeight: 600 }}>FAQ</a>
        </p>
      </div>
    </div>
  );
}
