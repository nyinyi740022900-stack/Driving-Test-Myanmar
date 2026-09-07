import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import PracticalChecklist from '@/components/PracticalChecklist';
import { pageAlternates } from '@/lib/seo';

type PageProps = { params: Promise<{ locale: string }> };

const PATH = '/resources/practical-checklist';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'practicalChecklist' });

  return {
    title: t('hero.title'),
    description: t('breadcrumb_title'),
    alternates: pageAlternates(locale, PATH),
    // This page is a structured reproduction of the Singapore Traffic Police
    // final assessment form. It is genuinely useful to a candidate revising in
    // the app, but it is not original publisher content, so it stays out of the
    // index and out of the sitemap. It also renders no <AdSenseScript />.
    robots: { index: false, follow: true },
  };
}

export default function PracticalChecklistPage() {
  return <PracticalChecklist />;
}
