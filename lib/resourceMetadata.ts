import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BRAND_NAME, SITE_URL } from '@/lib/brand';
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
    // Points at the real branded 1200x630 card (app/[locale]/opengraph-image.tsx)
    // explicitly rather than relying on Next.js's file-convention auto-image,
    // which only attaches to pages in that exact route segment, not nested
    // ones like every page under /resources/*. See lib/seo.ts's ogImage().
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}${path}`,
      images: [{ url: `${SITE_URL}/${locale}/opengraph-image`, width: 1200, height: 630, alt: BRAND_NAME }],
    },
  };
}
