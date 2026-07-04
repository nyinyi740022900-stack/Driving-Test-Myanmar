'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { BRAND_NAME } from '@/lib/brand';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useCountry } from './CountryProvider';
import { useAuth } from './AuthProvider';
import { useNavigate, useFadeSwap, useNavigateWithSwap } from './PageTransitionProvider';
import type { Country } from '@/lib/types';
import ReminderBell from './ReminderBell';

const LANGS: Record<Country, Array<[string, string]>> = {
  sg: [['en', 'EN'], ['my', 'MY']],
  jp: [['ja', 'JA'], ['en', 'EN'], ['my', 'MY']],
};

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean);

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const { country, setCountry } = useCountry();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const fadeSwap = useFadeSwap();
  const navigateWithSwap = useNavigateWithSwap();
  const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email);
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const langs = LANGS[country];

  // Close drawer on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  // Close drawer on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  function switchLang(newLocale: string) {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    navigate(segments.join('/'));
    setMenuOpen(false);
  }

  function switchCountry(c: Country) {
    if (c === country) return;
    const defaultLang = c === 'sg' ? 'en' : 'ja';
    if (locale !== 'my') {
      const segments = pathname.split('/');
      const validFor = LANGS[c].map(([code]) => code);
      segments[1] = validFor.includes(locale) ? locale : defaultLang;
      navigateWithSwap(segments.join('/'), () => setCountry(c));
    } else {
      fadeSwap(() => setCountry(c));
    }
    setMenuOpen(false);
  }

  return (
    <>
      <header>
        <div className="wrap bar">
          <Link className="logo" href={`/${locale}`}>
            <span className="mark"><span /></span>{BRAND_NAME}
          </Link>
          <nav className="main">
            <a href="#tests">{t('tests')}</a>
            <a href="#try">{t('try')}</a>
            <a href="#centres">{t('centre')}</a>
            <a href="#resources">{t('res')}</a>
            <a href="#pricing">{t('pricing')}</a>
            <Link href={`/${locale}/feedback`}>{t('help')}</Link>
          </nav>
          <div className="spacer" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <ReminderBell lang={locale} />
            {user ? (
              <>
                {isAdmin && (
                  <Link href={`/${locale}/admin`} style={{ fontSize: '.78rem', fontFamily: 'var(--display)', fontWeight: 700, background: '#7C3AED', color: '#fff', padding: '5px 11px', borderRadius: 7, letterSpacing: '.04em' }}>
                    ⚙ Admin
                  </Link>
                )}
                <Link href={`/${locale}/profile`} style={{ fontSize: '.82rem', fontFamily: 'var(--display)', fontWeight: 700, color: 'var(--asphalt)', padding: '6px 12px', border: '1.5px solid var(--line)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--asphalt)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '.7rem', fontWeight: 800 }}>
                    {user.email?.[0].toUpperCase()}
                  </span>
                  Profile
                </Link>
              </>
            ) : (
              <Link href={`/${locale}/auth/login`} style={{ fontSize: '.82rem', fontFamily: 'var(--display)', fontWeight: 700, background: 'var(--asphalt)', color: 'var(--paint)', padding: '7px 14px', borderRadius: 8 }} className="hide-mobile">
                {t('signin')}
              </Link>
            )}
          </div>
          <div className="switches hide-mobile">
            <div className="seg flag" role="group" aria-label="Country">
              <button aria-pressed={country === 'sg' ? 'true' : 'false'} onClick={() => switchCountry('sg')}>🇸🇬 SG</button>
              <button aria-pressed={country === 'jp' ? 'true' : 'false'} onClick={() => switchCountry('jp')}>🇯🇵 JP</button>
            </div>
            <div className="seg lang" role="group" aria-label="Language">
              {langs.map(([code, label]) => (
                <button key={code} aria-pressed={locale === code ? 'true' : 'false'} onClick={() => switchLang(code)}>{label}</button>
              ))}
            </div>
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="hamburger"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(v => !v)}
          >
            <span style={{ display: 'block', width: 20, height: 2, background: 'var(--asphalt)', borderRadius: 2, transition: 'transform .2s, opacity .2s', transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none' }} />
            <span style={{ display: 'block', width: 20, height: 2, background: 'var(--asphalt)', borderRadius: 2, margin: '4px 0', opacity: menuOpen ? 0 : 1, transition: 'opacity .15s' }} />
            <span style={{ display: 'block', width: 20, height: 2, background: 'var(--asphalt)', borderRadius: 2, transition: 'transform .2s, opacity .2s', transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.35)', zIndex: 1000 }}>
          <div
            ref={drawerRef}
            style={{
              position: 'absolute', top: 0, right: 0, bottom: 0,
              width: 'min(300px, 85vw)',
              background: '#fff',
              boxShadow: '-4px 0 24px rgba(0,0,0,.15)',
              display: 'flex', flexDirection: 'column',
              overflowY: 'auto',
              animation: 'slideInRight .22s cubic-bezier(.22,.68,0,1.1)',
            }}
          >
            {/* Drawer header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 16px', borderBottom: '1px solid var(--line)' }}>
              <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1rem' }}>{BRAND_NAME}</span>
              <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem', color: 'var(--ink-soft)', lineHeight: 1 }}>✕</button>
            </div>

            {/* Nav links */}
            <nav style={{ padding: '12px 8px' }}>
              {([
                ['#tests', t('tests')],
                ['#try', t('try')],
                ['#centres', t('centre')],
                ['#resources', t('res')],
                ['#pricing', t('pricing')],
                [`/${locale}/feedback`, t('help')],
              ] as [string, string][]).map(([href, label]) => (
                href.startsWith('/') ? (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    style={{ display: 'block', padding: '13px 16px', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.95rem', color: 'var(--asphalt)', textDecoration: 'none', borderRadius: 10 }}
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    style={{ display: 'block', padding: '13px 16px', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.95rem', color: 'var(--asphalt)', textDecoration: 'none', borderRadius: 10 }}
                  >
                    {label}
                  </a>
                )
              ))}
            </nav>

            <div style={{ height: 1, background: 'var(--line)', margin: '0 16px' }} />

            {/* Country switcher */}
            <div style={{ padding: '16px 20px 8px' }}>
              <div style={{ fontSize: '.72rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 10 }}>Country</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['sg', 'jp'] as Country[]).map(c => (
                  <button
                    key={c}
                    onClick={() => switchCountry(c)}
                    style={{ flex: 1, padding: '10px', borderRadius: 10, border: country === c ? '2px solid var(--asphalt)' : '1.5px solid var(--line)', background: country === c ? 'var(--asphalt)' : 'var(--paint)', color: country === c ? '#fff' : 'var(--asphalt)', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.9rem', cursor: 'pointer' }}
                  >
                    {c === 'sg' ? '🇸🇬 SG' : '🇯🇵 JP'}
                  </button>
                ))}
              </div>
            </div>

            {/* Language switcher */}
            <div style={{ padding: '8px 20px 16px' }}>
              <div style={{ fontSize: '.72rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 10 }}>Language</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {langs.map(([code, label]) => (
                  <button
                    key={code}
                    onClick={() => switchLang(code)}
                    style={{ flex: 1, padding: '10px', borderRadius: 10, border: locale === code ? '2px solid var(--asphalt)' : '1.5px solid var(--line)', background: locale === code ? 'var(--asphalt)' : 'var(--paint)', color: locale === code ? '#fff' : 'var(--asphalt)', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.9rem', cursor: 'pointer' }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: 'var(--line)', margin: '0 16px' }} />

            {/* Auth */}
            <div style={{ padding: '16px 20px' }}>
              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontSize: '.82rem', color: 'var(--ink-soft)' }}>{user.email}</div>
                  {isAdmin && (
                    <Link href={`/${locale}/admin`} style={{ padding: '12px 16px', background: '#7C3AED', color: '#fff', borderRadius: 10, fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.9rem', textDecoration: 'none', textAlign: 'center' }}>⚙ Admin Dashboard</Link>
                  )}
                  <Link href={`/${locale}/profile`} style={{ padding: '12px 16px', border: '1.5px solid var(--line)', borderRadius: 10, fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.9rem', textDecoration: 'none', color: 'var(--asphalt)', textAlign: 'center' }}>Profile</Link>
                  <button onClick={() => { signOut(); setMenuOpen(false); }} style={{ padding: '12px 16px', background: 'none', border: '1.5px solid var(--line)', borderRadius: 10, fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.9rem', color: 'var(--ink-soft)', cursor: 'pointer' }}>{t('signout')}</button>
                </div>
              ) : (
                <Link href={`/${locale}/auth/login`} style={{ display: 'block', padding: '13px 16px', background: 'var(--asphalt)', color: '#fff', borderRadius: 10, fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.95rem', textDecoration: 'none', textAlign: 'center' }}>
                  {t('signin')}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
