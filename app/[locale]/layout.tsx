import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import AuthProvider from '@/components/AuthProvider';
import { CountryProvider } from '@/components/CountryProvider';
import { PageTransitionProvider } from '@/components/PageTransitionProvider';
import CookieConsent from '@/components/CookieConsent';
import { BRAND_LOGO_PATH, BRAND_NAME, SITE_URL } from '@/lib/brand';
import { buildSiteMetadata } from '@/lib/seo';
import '../globals.css';

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;
const GOOGLE_SITE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const base = await buildSiteMetadata(locale);

  return {
    ...base,
    ...(GOOGLE_SITE_VERIFICATION
      ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
      : {}),
  };
}

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
      <head>
        {/* Static favicon links for crawlers that do not run Next.js metadata scripts (e.g. Googlebot) */}
        <link rel="icon" href={`${SITE_URL}/favicon.ico`} sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href={`${SITE_URL}/icons/favicon-48x48.png`} />
        <link rel="icon" type="image/png" sizes="96x96" href={`${SITE_URL}/icons/favicon-96x96.png`} />
        <link rel="icon" type="image/png" sizes="192x192" href={`${SITE_URL}${BRAND_LOGO_PATH}`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`${SITE_URL}/apple-icon.png`} />
        <meta name="apple-mobile-web-app-title" content={BRAND_NAME} />
        {ADSENSE_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('consent', 'default', {
                  ad_storage: 'denied',
                  ad_user_data: 'denied',
                  ad_personalization: 'denied',
                  analytics_storage: 'denied',
                  wait_for_update: 500
                });
              `,
            }}
          />
        )}
        {ADSENSE_ID && (
          <>
            <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`} crossOrigin="anonymous" />
            <script dangerouslySetInnerHTML={{ __html: `window.adBreak=window.adConfig=function(o){(window.adsbygoogle=window.adsbygoogle||[]).push(o)};` }} />
          </>
        )}
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <CountryProvider>
            <AuthProvider>
              <PageTransitionProvider>
                {children}
                <CookieConsent />
              </PageTransitionProvider>
            </AuthProvider>
          </CountryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
