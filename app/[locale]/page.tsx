import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TestCards from '@/components/TestCards';
import QuizDemo from '@/components/QuizDemo';
import HowItWorks from '@/components/HowItWorks';
import Centres from '@/components/Centres';
import Resources from '@/components/Resources';
import FAQ from '@/components/FAQ';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import { buildHomeMetadata, organizationJsonLd, webSiteJsonLd } from '@/lib/seo';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return buildHomeMetadata(locale);
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'faq' });
  const sgFaqs = t.raw('sg') as { q: string; a: string }[];
  const jpFaqs = t.raw('jp') as { q: string; a: string }[];
  const sharedFaqs = t.raw('shared') as { q: string; a: string }[];
  const faqItems = [...sgFaqs, ...jpFaqs, ...sharedFaqs];

  return (
    <>
      <JsonLd
        data={[
          organizationJsonLd(),
          webSiteJsonLd(),
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map(item => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: { '@type': 'Answer', text: item.a },
            })),
          },
        ]}
      />
      <Header />
      <Hero />
      <div className="lane" aria-hidden="true" />
      <Reveal><TestCards /></Reveal>
      <div className="lane" aria-hidden="true" />
      <Reveal delay={60}><QuizDemo /></Reveal>
      <div className="lane" aria-hidden="true" />
      <div className="wrap" style={{ padding: '0 24px' }}>
        <AdSlot slot="5983088447" format="horizontal" />
      </div>
      <div className="lane" aria-hidden="true" />
      <Reveal delay={40}><HowItWorks /></Reveal>
      <div className="lane" aria-hidden="true" />
      <Reveal delay={40}><Centres /></Reveal>
      <div className="lane" aria-hidden="true" />
      <Reveal delay={40}><Resources /></Reveal>
      <div className="lane" aria-hidden="true" />
      <Reveal delay={40}><FAQ /></Reveal>
      <div className="lane" aria-hidden="true" />
      <div className="wrap" style={{ padding: '0 24px' }}>
        <AdSlot slot="5983088447" format="horizontal" />
      </div>
      <div className="lane" aria-hidden="true" />
      <Reveal delay={40}><Pricing /></Reveal>
      <Footer />
    </>
  );
}
