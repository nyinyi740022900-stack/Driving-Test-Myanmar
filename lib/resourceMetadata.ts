import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BRAND_LOGO_URL, SITE_URL } from '@/lib/brand';
import { routing } from '@/i18n/routing';

function localeAlternates(path: string): Metadata['alternates'] {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `${SITE_URL}/${locale}${path}`;
  }
  return { languages };
}

export async function buildResourceMetadata(
  locale: string,
  namespace: string,
  path: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });
  const title = t('meta_title');
  const description = t('meta_description');

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}${path}`,
      ...localeAlternates(path),
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}${path}`,
      images: [{ url: BRAND_LOGO_URL, width: 192, height: 192, alt: title }],
    },
  };
}
