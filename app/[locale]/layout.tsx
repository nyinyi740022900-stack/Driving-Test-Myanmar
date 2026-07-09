import type { Metadata } from 'next';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import AuthProvider from '@/components/AuthProvider';
import DeviceSessionGate from '@/components/DeviceSessionGate';
import { CountryProvider } from '@/components/CountryProvider';
import { PageTransitionProvider } from '@/components/PageTransitionProvider';
import CookieConsent from '@/components/CookieConsent';
import AnalyticsProvider from '@/components/AnalyticsProvider';
import ServiceWorkerManager from '@/components/ServiceWorkerManager';
import ReferralRedeemer from '@/components/ReferralRedeemer';
import { BRAND_NAME } from '@/lib/brand';
import { buildSiteMetadata } from '@/lib/seo';
import '../globals.css';

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
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
        {!ADSENSE_ID && GA_MEASUREMENT_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('consent', 'default', {
                  analytics_storage: 'denied',
                  wait_for_update: 500
                });
              `,
            }}
          />
        )}
      </head>
      <body>
        {/* Analytics — deferred so it never competes with hydration or early taps.
            Consent defaults are already set synchronously in <head> above. */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-config" strategy="afterInteractive">
              {`gtag('js', new Date()); gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });`}
            </Script>
          </>
        )}
        {/* AdSense — lazy-loaded during idle so ads never block interaction. */}
        {ADSENSE_ID && (
          <>
            <Script
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
              strategy="lazyOnload"
              crossOrigin="anonymous"
            />
            <Script id="adsense-config" strategy="lazyOnload">
              {`window.adBreak=window.adConfig=function(o){(window.adsbygoogle=window.adsbygoogle||[]).push(o)};`}
            </Script>
          </>
        )}
        <NextIntlClientProvider messages={messages}>
          <CountryProvider>
            <AuthProvider>
              <PageTransitionProvider>
                <AnalyticsProvider>
                  <DeviceSessionGate>
                    {children}
                  </DeviceSessionGate>
                  <ReferralRedeemer />
                  <CookieConsent />
                  <ServiceWorkerManager />
                </AnalyticsProvider>
              </PageTransitionProvider>
            </AuthProvider>
          </CountryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
