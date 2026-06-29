import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import AuthProvider from '@/components/AuthProvider';
import { CountryProvider } from '@/components/CountryProvider';
import { PageTransitionProvider } from '@/components/PageTransitionProvider';
import '../globals.css';

export const metadata: Metadata = {
  title: 'RoadReady — Theory Test Practice',
  description: 'Practice Singapore BTT/FTT/RTT and Japan driving theory tests in English, Myanmar, and Japanese.',
  openGraph: {
    title: 'RoadReady — Theory Test Practice',
    description: 'Practice Singapore BTT/FTT/RTT and Japan driving theory tests in English, Myanmar, and Japanese.',
    type: 'website',
    siteName: 'RoadReady',
  },
  twitter: {
    card: 'summary',
    title: 'RoadReady — Theory Test Practice',
    description: 'Practice Singapore BTT/FTT/RTT and Japan driving theory tests.',
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
