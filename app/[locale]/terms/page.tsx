import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import LegalDocument, { type LegalSection } from '@/components/LegalDocument';
import { BRAND_NAME, SUPPORT_EMAIL } from '@/lib/brand';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'terms' });
  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'terms' });
  const sections = t.raw('sections') as LegalSection[];

  return (
    <LegalDocument
      backHref={`/${locale}`}
      backLabel={t('back', { brand: BRAND_NAME })}
      title={t('title')}
      updated={t('updated')}
      sections={sections}
      contactEmail={SUPPORT_EMAIL}
      contactLabel={t('contact_title')}
    />
  );
}
