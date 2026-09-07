import type { Metadata } from 'next';
import AdSenseScript from '@/components/AdSenseScript';
import TestLanding from '@/components/TestLanding';
import { buildTestLandingMetadata } from '@/lib/seo';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildTestLandingMetadata('rtt', locale);
}

export default async function RttPage({ params }: PageProps) {
  const { locale } = await params;
  return (
    <>
      <AdSenseScript />
      <TestLanding slug="rtt" locale={locale} />
    </>
  );
}
