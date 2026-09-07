import type { Metadata } from 'next';
import AdSenseScript from '@/components/AdSenseScript';
import TestLanding from '@/components/TestLanding';
import { buildTestLandingMetadata } from '@/lib/seo';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildTestLandingMetadata('ftt', locale);
}

export default async function FttPage({ params }: PageProps) {
  const { locale } = await params;
  return (
    <>
      <AdSenseScript />
      <TestLanding slug="ftt" locale={locale} />
    </>
  );
}
