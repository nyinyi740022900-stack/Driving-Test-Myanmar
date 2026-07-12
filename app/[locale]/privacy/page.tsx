import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import LegalDocument, { type LegalSection } from '@/components/LegalDocument';
import { BRAND_NAME, SITE_URL, SUPPORT_EMAIL } from '@/lib/brand';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });
  return {
    metadataBase: new URL(SITE_URL),
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });
  const sections = t.raw('sections') as LegalSection[];
  const siteHost = SITE_URL.replace('https://', '');

  const localizedSections = sections.map(section => ({
    ...section,
    paragraphs: (section.paragraphs ?? []).map(p =>
      p.replaceAll('{brand}', BRAND_NAME).replaceAll('{site}', siteHost),
    ),
    bullets: section.bullets?.map(b =>
      b.replaceAll('{brand}', BRAND_NAME).replaceAll('{site}', siteHost),
    ),
  }));

  return (
    <LegalDocument
      backHref={`/${locale}`}
      backLabel={t('back', { brand: BRAND_NAME })}
      title={t('title')}
      updated={t('updated')}
      sections={localizedSections}
      contactEmail={SUPPORT_EMAIL}
      contactLabel={t('contact_title')}
    />
  );
}
