import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const locale = useLocale();

  return (
    <footer>
      <div className="wrap">
        <div className="frow" style={{ alignItems: 'flex-start', gap: '40px 60px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <Link className="logo" href={`/${locale}`} style={{ color: 'var(--paint)' }}>
              <span className="mark"><span /></span>Myanpass
            </Link>
            <div style={{ fontSize: '.86rem', marginTop: 10, color: 'var(--ink-soft)' }}>{t('tagline')}</div>
          </div>
          <nav style={{ display: 'flex', gap: '12px 48px', flexWrap: 'wrap', flex: '1 1 300px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href={`/${locale}#tests`} style={{ fontSize: '.88rem', color: 'var(--ink-soft)' }}>{nav('tests')}</Link>
              <Link href={`/${locale}#how`} style={{ fontSize: '.88rem', color: 'var(--ink-soft)' }}>{nav('how')}</Link>
              <Link href={`/${locale}#resources`} style={{ fontSize: '.88rem', color: 'var(--ink-soft)' }}>{nav('res')}</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href={`/${locale}#pricing`} style={{ fontSize: '.88rem', color: 'var(--ink-soft)' }}>{nav('pricing')}</Link>
              <Link href={`/${locale}/premium`} style={{ fontSize: '.88rem', color: 'var(--guide-deep)', fontWeight: 600 }}>{nav('premium')}</Link>
              <Link href={`/${locale}/auth/login`} style={{ fontSize: '.88rem', color: 'var(--ink-soft)' }}>{nav('signin')}</Link>
            </div>
          </nav>
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,.1)' }}>
          <Link href={`/${locale}/feedback`} style={{ fontSize: '.8rem', color: 'var(--ink-soft)' }}>{t('report')}</Link>
          <Link href={`/${locale}/privacy`} style={{ fontSize: '.8rem', color: 'var(--ink-soft)' }}>Privacy Policy</Link>
        </div>
        <p className="fnote">{t('note')}</p>
      </div>
    </footer>
  );
}
