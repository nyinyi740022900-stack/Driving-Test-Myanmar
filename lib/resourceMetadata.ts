import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BRAND_LOGO_URL, SITE_URL } from '@/lib/brand';
import { pageAlternates } from '@/lib/seo';

interface ResourceMetadataOptions {
  /**
   * Set false for pages that reproduce official material (e.g. the Traffic
   * Police assessment form) or that are only a list of outbound links. Those
   * add no original value to the index and read as replicated content.
   */
  index?: boolean;
}

export async function buildResourceMetadata(
  locale: string,
  namespace: string,
  path: string,
  options: ResourceMetadataOptions = {},
): Promise<Metadata> {
  const { index = true } = options;
  const t = await getTranslations({ locale, namespace });
  const title = t('meta_title');
  const description = t('meta_description');

  return {
    title,
    description,
    alternates: pageAlternates(locale, path),
    ...(index ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}${path}`,
      images: [{ url: BRAND_LOGO_URL, width: 192, height: 192, alt: title }],
    },
  };
}
