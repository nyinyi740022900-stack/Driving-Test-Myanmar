import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { BRAND_LOGO_URL, BRAND_NAME, SITE_URL } from '@/lib/brand';
import { TEST_META, type Category } from '@/lib/types';
import { routing } from '@/i18n/routing';

export type TestSlug = 'btt' | 'ftt' | 'rtt';

export const TEST_SLUG_CATEGORY: Record<TestSlug, Category> = {
  btt: 'sg_btt',
  ftt: 'sg_ftt',
  rtt: 'sg_rtt',
};

export const TEST_LANDING_PATHS = ['/btt', '/ftt', '/rtt'] as const;

type QuizMode = 'lesson' | 'practice' | 'test';

const MODE_LABEL_KEY: Record<QuizMode, string> = {
  lesson: 'lesson_title',
  practice: 'practice_title',
  test: 'test_title',
};

function localeAlternates(path: string): Metadata['alternates'] {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `${SITE_URL}/${locale}${path}`;
  }
  return { languages };
}

export async function buildSiteMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'seo.site' });

  return {
    applicationName: BRAND_NAME,
    title: {
      default: t('title'),
      template: `%s · ${BRAND_NAME}`,
    },
    description: t('description'),
    metadataBase: new URL(SITE_URL),
    alternates: localeAlternates(''),
    icons: {
      icon: [
        { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/icons/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
        { url: '/icons/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
        { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/favicon.ico', sizes: 'any' },
      ],
      apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
      shortcut: '/favicon.ico',
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      siteName: BRAND_NAME,
      url: `${SITE_URL}/${locale}`,
      images: [{ url: BRAND_LOGO_URL, width: 192, height: 192, alt: BRAND_NAME }],
    },
    twitter: {
      card: 'summary',
      title: t('title'),
      description: t('description'),
      images: [BRAND_LOGO_URL],
    },
    appleWebApp: {
      capable: true,
      title: BRAND_NAME,
      statusBarStyle: 'default',
    },
  };
}

export async function buildHomeMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'seo.home' });

  return {
    title: { absolute: t('title') },
    description: t('description'),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      ...localeAlternates(''),
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${SITE_URL}/${locale}`,
      images: [{ url: BRAND_LOGO_URL, width: 192, height: 192, alt: BRAND_NAME }],
    },
  };
}

export async function buildTestLandingMetadata(
  slug: TestSlug,
  locale: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `seo.${slug}` });
  const path = `/${slug}`;

  return {
    title: { absolute: t('meta_title') },
    description: t('meta_description'),
    alternates: {
      canonical: `${SITE_URL}/${locale}${path}`,
      ...localeAlternates(path),
    },
    openGraph: {
      title: t('meta_title'),
      description: t('meta_description'),
      url: `${SITE_URL}/${locale}${path}`,
      images: [{ url: BRAND_LOGO_URL, width: 192, height: 192, alt: BRAND_NAME }],
    },
  };
}

export async function buildQuizMetadata(
  category: Category,
  mode: QuizMode,
  locale: string,
): Promise<Metadata> {
  const meta = TEST_META.find(m => m.category === category);
  if (!meta) {
    return { title: BRAND_NAME };
  }

  const t = await getTranslations({ locale, namespace: 'seo.quiz' });
  const title = t(MODE_LABEL_KEY[mode], { test: meta.tag });
  const description = t('description', {
    test: meta.tag,
    count: meta.bankQuestionCount,
    mock: meta.questionCount,
    pass: meta.passPercent,
  });

  const path = `/quiz/${category}/${mode}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}${path}`,
      ...localeAlternates(path),
    },
    robots: mode === 'test' ? { index: true, follow: true } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}${path}`,
    },
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND_NAME,
    url: SITE_URL,
    logo: BRAND_LOGO_URL,
  };
}

export function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/en?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function courseJsonLd(opts: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: opts.name,
    description: opts.description,
    provider: {
      '@type': 'Organization',
      name: BRAND_NAME,
      url: SITE_URL,
    },
    url: opts.url,
    isAccessibleForFree: true,
    inLanguage: ['en', 'my', 'ja'],
  };
}

export function faqPageJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
