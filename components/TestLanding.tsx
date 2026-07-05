import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import { SITE_URL } from '@/lib/brand';
import {
  TEST_SLUG_CATEGORY,
  breadcrumbJsonLd,
  courseJsonLd,
  faqPageJsonLd,
  type TestSlug,
} from '@/lib/seo';
import { TEST_META } from '@/lib/types';

interface TestLandingProps {
  slug: TestSlug;
  locale: string;
}

const RELATED_LINKS: Record<TestSlug, { href: string; key: string }[]> = {
  btt: [
    { href: '/resources/signs', key: 'related_signs' },
    { href: '/resources/faq', key: 'related_faq' },
    { href: '/resources/guide', key: 'related_guide' },
  ],
  ftt: [
    { href: '/resources/signs', key: 'related_signs' },
    { href: '/resources/faq', key: 'related_faq' },
    { href: '/resources/roadmap', key: 'related_roadmap' },
  ],
  rtt: [
    { href: '/resources/signs', key: 'related_signs' },
    { href: '/resources/license-classes', key: 'related_classes' },
    { href: '/resources/faq', key: 'related_faq' },
  ],
};

export default async function TestLanding({ slug, locale }: TestLandingProps) {
  const t = await getTranslations({ locale, namespace: `seo.${slug}` });
  const tCommon = await getTranslations({ locale, namespace: 'seo.common' });
  const category = TEST_SLUG_CATEGORY[slug];
  const meta = TEST_META.find(m => m.category === category);
  const faq = t.raw('faq') as { q: string; a: string }[];
  const formatItems = t.raw('format_items') as string[];
  const pageUrl = `${SITE_URL}/${locale}/${slug}`;

  const jsonLd = [
    courseJsonLd({
      name: t('h1'),
      description: t('meta_description'),
      url: pageUrl,
    }),
    faqPageJsonLd(faq.map(item => ({ question: item.q, answer: item.a }))),
    breadcrumbJsonLd([
      { name: tCommon('home_label'), url: `${SITE_URL}/${locale}` },
      { name: t('breadcrumb'), url: pageUrl },
    ]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <Header />
      <article style={{ minHeight: '100vh', background: 'var(--paint)' }}>
        <header
          style={{
            background: 'var(--paint-2)',
            borderBottom: '1px solid var(--line)',
            padding: '20px 24px',
          }}
        >
          <div className="wrap" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link href={`/${locale}`} style={{ fontSize: '.82rem', color: 'var(--ink-soft)' }}>
              {tCommon('home')}
            </Link>
            <span style={{ color: 'var(--line)' }}>/</span>
            <span style={{ fontSize: '.82rem', color: 'var(--ink)' }}>{t('breadcrumb')}</span>
          </div>
        </header>

        <div className="wrap" style={{ padding: '48px 24px 80px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto 48px', textAlign: 'center' }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>{t('eyebrow')}</div>
            <h1
              style={{
                fontFamily: 'var(--display)',
                fontSize: 'clamp(1.8rem,4vw,2.6rem)',
                fontWeight: 800,
                marginBottom: 16,
                lineHeight: 1.15,
              }}
            >
              {t('h1')}
            </h1>
            <p style={{ color: 'var(--ink-soft)', fontSize: '1.05rem', lineHeight: 1.6 }}>
              {t('lead')}
            </p>
            {meta && (
              <p style={{ marginTop: 12, fontSize: '.9rem', color: 'var(--ink-soft)' }}>
                {t('stats', {
                  count: meta.bankQuestionCount,
                  mock: meta.questionCount,
                  pass: meta.passPercent,
                })}
              </p>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: 56,
            }}
          >
            <Link className="btn btn-primary" href={`/${locale}/quiz/${category}/lesson`}>
              {t('cta_learn')} →
            </Link>
            <Link className="btn btn-ghost" href={`/${locale}/quiz/${category}/practice`}>
              {t('cta_practice')} →
            </Link>
            <Link className="btn btn-ghost" href={`/${locale}/quiz/${category}/test`}>
              {t('cta_mock')} →
            </Link>
          </div>

          <div className="lane" aria-hidden="true" style={{ marginBottom: 48 }} />

          <section style={{ maxWidth: 720, margin: '0 auto 40px' }}>
            <h2 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.35rem', marginBottom: 12 }}>
              {t('about_title')}
            </h2>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 12 }}>{t('about_p1')}</p>
            <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7 }}>{t('about_p2')}</p>
          </section>

          <section style={{ maxWidth: 720, margin: '0 auto 40px' }}>
            <h2 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.35rem', marginBottom: 16 }}>
              {t('format_title')}
            </h2>
            <ul style={{ paddingLeft: 20, color: 'var(--ink-soft)', lineHeight: 1.9 }}>
              {formatItems.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section style={{ maxWidth: 720, margin: '0 auto 40px' }}>
            <h2 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.35rem', marginBottom: 16 }}>
              {t('modes_title')}
            </h2>
            <div className="steps">
              <div className="step">
                <div className="num">01</div>
                <p>{t('modes_learn')}</p>
              </div>
              <div className="step">
                <div className="num">02</div>
                <p>{t('modes_practice')}</p>
              </div>
              <div className="step">
                <div className="num">03</div>
                <p>{t('modes_mock')}</p>
              </div>
            </div>
          </section>

          <section style={{ maxWidth: 720, margin: '0 auto 40px' }}>
            <h2 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.35rem', marginBottom: 16 }}>
              {t('related_title')}
            </h2>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {RELATED_LINKS[slug].map(link => (
                <Link
                  key={link.key}
                  href={`/${locale}${link.href}`}
                  style={{
                    fontSize: '.88rem',
                    fontWeight: 600,
                    color: 'var(--guide-deep)',
                    padding: '8px 14px',
                    border: '1px solid var(--line)',
                    borderRadius: 10,
                    background: 'var(--paint-2)',
                  }}
                >
                  {t(link.key)} →
                </Link>
              ))}
            </div>
          </section>

          <section style={{ maxWidth: 720, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.35rem', marginBottom: 16 }}>
              {t('faq_title')}
            </h2>
            <div className="faq">
              {faq.map(item => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <div className="ans">{item.a}</div>
                </details>
              ))}
            </div>
          </section>
        </div>
      </article>
      <Footer />
    </>
  );
}
