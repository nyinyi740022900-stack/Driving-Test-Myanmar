import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import AuthProvider from '@/components/AuthProvider';
import { CountryProvider } from '@/components/CountryProvider';
import { PageTransitionProvider } from '@/components/PageTransitionProvider';
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/brand';
import '../globals.css';

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;
const GOOGLE_SITE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION;

const PAGE_TITLE = `${BRAND_NAME} — Singapore & Japan Driving Theory Test`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: BRAND_TAGLINE,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://theorylane.app'),
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
  openGraph: {
    title: PAGE_TITLE,
    description: BRAND_TAGLINE,
    type: 'website',
    siteName: BRAND_NAME,
  },
  twitter: {
    card: 'summary',
    title: PAGE_TITLE,
    description: BRAND_TAGLINE,
  },
  appleWebApp: {
    capable: true,
    title: BRAND_NAME,
    statusBarStyle: 'default',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'my' | 'ja')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>{ADSENSE_ID && <><script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`} crossOrigin="anonymous" /><script dangerouslySetInnerHTML={{ __html: `window.adBreak=window.adConfig=function(o){(window.adsbygoogle=window.adsbygoogle||[]).push(o)};` }} /></>}</head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <CountryProvider>
            <AuthProvider>
              <PageTransitionProvider>
                {children}
              </PageTransitionProvider>
            </AuthProvider>
          </CountryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
