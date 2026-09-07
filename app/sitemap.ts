import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/brand';
import { TEST_LANDING_PATHS } from '@/lib/seo';
import { routing } from '@/i18n/routing';

type Entry = {
  path: string;
  /** Locales this path is genuinely useful in. Defaults to every locale. */
  locales?: readonly string[];
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
};

/**
 * Locale relevance
 * ----------------
 * The Singapore test landings only make sense to someone sitting a Singapore
 * test, and that audience reads English or Myanmar. Publishing a Japanese
 * variant of a Singapore-only page produced three near-identical URLs where one
 * of them served no audience — surface area that reads as duplicate content
 * without adding a reader.
 *
 * The variants still exist and are still reachable (hreflang continues to
 * declare all three, which is what Google wants); they are simply no longer
 * submitted for indexing.
 */
const SG_AUDIENCE = ['en', 'my'] as const;

/**
 * Deliberately NOT listed:
 *  - /privacy, /terms, /refund — required, linked in the footer, and indexable,
 *    but they are boilerplate. Submitting nine legal URLs pads the sitemap with
 *    pages that carry no original value.
 *  - /resources/handbook — a list of outbound links to official PDFs (noindex).
 *  - /resources/practical-checklist — a reproduction of the Traffic Police
 *    assessment form, not original publisher content (noindex).
 *  - /quiz/**, /auth/**, /payment, /profile, /feedback, /admin — tools and
 *    account screens, all noindex.
 */
const PUBLIC_ENTRIES: readonly Entry[] = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  ...TEST_LANDING_PATHS.map(path => ({
    path,
    locales: SG_AUDIENCE,
    changeFrequency: 'weekly' as const,
    priority: 0.95,
  })),
  { path: '/resources/guide', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/resources/signs', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/resources/memory-tips', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/resources/costs', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/resources/demerit-points', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/resources/license-classes', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/resources/foreigners', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/resources/roadmap', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/resources/faq', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/resources/glossary', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/resources/tutorials', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/experiences', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/premium', changeFrequency: 'monthly', priority: 0.6 },
];

function languagesFor(path: string, locales: readonly string[]): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = `${SITE_URL}/${locale}${path}`;
  }
  if (locales.includes(routing.defaultLocale)) {
    languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}${path}`;
  }
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const entry of PUBLIC_ENTRIES) {
    const locales = entry.locales ?? routing.locales;
    const languages = languagesFor(entry.path, locales);

    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${entry.path}`,
        lastModified: now,
        changeFrequency: entry.changeFrequency,
        priority: entry.priority,
        alternates: { languages },
      });
    }
  }

  return entries;
}
