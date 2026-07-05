import type { Metadata } from 'next';
import TestLanding from '@/components/TestLanding';
import { buildTestLandingMetadata } from '@/lib/seo';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildTestLandingMetadata('ftt', locale);
}

export default async function FttPage({ params }: PageProps) {
  const { locale } = await params;
  return <TestLanding slug="ftt" locale={locale} />;
}
