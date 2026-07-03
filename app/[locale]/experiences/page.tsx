'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useCountry } from '@/components/CountryProvider';
import { useAuth } from '@/components/AuthProvider';
import BackButton from '@/components/BackButton';
import { createClient } from '@/lib/supabase';
import type { ReviewCategory } from '@/lib/types';
import { TEST_META } from '@/lib/types';

interface PublicReview {
  id: string;
  country: string;
  category: ReviewCategory;
  display_name: string;
  title: string;
  body: string;
  rating: number;
  passed: boolean | null;
  created_at: string;
}

interface MyReview extends PublicReview {
  status: 'pending' | 'approved' | 'rejected';
}

const CATEGORY_OPTIONS: { value: ReviewCategory; country: 'sg' | 'jp' }[] = [
  { value: 'sg_btt', country: 'sg' },
  { value: 'sg_ftt', country: 'sg' },
  { value: 'sg_rtt', country: 'sg' },
  { value: 'jp_car', country: 'jp' },
  { value: 'jp_moto', country: 'jp' },
  { value: 'general', country: 'sg' },
];

function categoryLabel(cat: ReviewCategory, locale: string): string {
  if (cat === 'general') return locale === 'my' ? 'အထွေထွေ' : locale === 'ja' ? '一般' : 'General';
  const meta = TEST_META.find(m => m.category === cat);
  if (!meta) return cat;
  return locale === 'my' ? meta.nameMy : locale === 'ja' ? meta.nameJa : meta.nameEn;
}

export default function ExperiencesPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const router = useRouter();
  const { country } = useCountry();
  const { user, loading: authLoading } = useAuth();
  const t = useTranslations('experiences');

  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [myReviews, setMyReviews] = useState<MyReview[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [category, setCategory] = useState<ReviewCategory>(
    country === 'jp' ? 'jp_car' : 'sg_btt'
  );
  const [displayName, setDisplayName] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [rating, setRating] = useState(5);
  const [passed, setPassed] = useState<'yes' | 'no' | 'na'>('na');

  useEffect(() => {
    Promise.all([
      fetch(`/api/reviews?country=${country}`).then(r => r.json()),
      user ? fetch('/api/reviews?mine=1').then(r => r.json()) : Promise.resolve([]),
    ]).then(([pub, mine]) => {
      setReviews(Array.isArray(pub) ? pub : []);
      setMyReviews(Array.isArray(mine) ? mine : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [country, user]);

  useEffect(() => {
    if (!user) { setIsPremium(false); return; }
    const supabase = createClient();
    supabase.from('subscriptions').select('status, expires_at').eq('user_id', user.id).single()
      .then(({ data }) => {
        const prem = data?.status === 'premium' && data.expires_at && new Date(data.expires_at) > new Date();
        setIsPremium(!!prem);
      });
  }, [user]);

  const countryCategories = CATEGORY_OPTIONS.filter(
    c => c.country === country || c.value === 'general'
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);
    if (!user) {
      router.push(`/${locale}/auth/login?redirect=/${locale}/experiences`);
      return;
    }
    if (!isPremium) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country,
          category,
          display_name: displayName,
          title,
          body,
          rating,
          passed: passed === 'yes' ? true : passed === 'no' ? false : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      setFormSuccess(true);
      setShowForm(false);
      setTitle('');
      setBody('');
      const mineRes = await fetch('/api/reviews?mine=1');
      const mine = await mineRes.json();
      setMyReviews(Array.isArray(mine) ? mine : []);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paint)', paddingBottom: 80 }}>
      <div style={{ background: 'var(--paint-2)', borderBottom: '1px solid var(--line)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <BackButton label={t('breadcrumb_home')} style={{ fontSize: '.82rem', color: 'var(--ink-soft)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} />
          <span style={{ color: 'var(--line)' }}>/</span>
          <span style={{ fontSize: '.82rem', color: 'var(--ink)' }}>{t('breadcrumb_title')}</span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 40, textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>{t('hero.eyebrow')}</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, marginBottom: 12 }}>
            {t('hero.title')}
          </h1>
          <p style={{ color: 'var(--ink-soft)', maxWidth: '38em', margin: '0 auto', fontSize: '1.05rem' }}>
            {t('hero.lead')}
          </p>
        </div>

        {/* Submit CTA */}
        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '24px', marginBottom: 40 }}>
          {authLoading ? null : !user ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--ink-soft)', marginBottom: 16 }}>{t('signin_prompt')}</p>
              <Link href={`/${locale}/auth/login?redirect=/${locale}/experiences`} className="btn btn-primary" style={{ textDecoration: 'none' }}>
                {t('signin_btn')}
              </Link>
            </div>
          ) : !isPremium ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--ink-soft)', marginBottom: 16 }}>{t('premium_prompt')}</p>
              <Link href={`/${locale}/premium`} className="btn btn-primary" style={{ textDecoration: 'none' }}>
                {t('premium_btn')}
              </Link>
            </div>
          ) : (
            <div>
              {formSuccess && (
                <div style={{ background: 'rgba(27,156,86,.12)', color: '#1B9C56', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontWeight: 600, fontSize: '.9rem' }}>
                  {t('submit_success')}
                </div>
              )}
              {!showForm ? (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: 'var(--ink-soft)', marginBottom: 16 }}>{t('write_prompt')}</p>
                  <button type="button" className="btn btn-primary" onClick={() => setShowForm(true)}>
                    {t('write_btn')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.1rem', marginBottom: 20 }}>{t('form_title')}</h2>
                  {formError && (
                    <div style={{ background: 'rgba(220,38,38,.1)', color: '#dc2626', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: '.88rem' }}>
                      {formError}
                    </div>
                  )}
                  <div style={{ display: 'grid', gap: 16, marginBottom: 20 }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span style={{ fontSize: '.82rem', fontWeight: 600 }}>{t('field_category')}</span>
                      <select className="field-input" value={category} onChange={e => setCategory(e.target.value as ReviewCategory)}>
                        {countryCategories.map(c => (
                          <option key={c.value} value={c.value}>{categoryLabel(c.value, locale)}</option>
                        ))}
                      </select>
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span style={{ fontSize: '.82rem', fontWeight: 600 }}>{t('field_name')}</span>
                      <input className="field-input" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder={t('field_name_ph')} maxLength={40} />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span style={{ fontSize: '.82rem', fontWeight: 600 }}>{t('field_title')}</span>
                      <input className="field-input" value={title} onChange={e => setTitle(e.target.value)} required maxLength={120} />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span style={{ fontSize: '.82rem', fontWeight: 600 }}>{t('field_body')}</span>
                      <textarea className="field-input" value={body} onChange={e => setBody(e.target.value)} required rows={5} maxLength={2000} style={{ resize: 'vertical' }} />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span style={{ fontSize: '.82rem', fontWeight: 600 }}>{t('field_rating')}</span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {[1, 2, 3, 4, 5].map(n => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setRating(n)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', opacity: n <= rating ? 1 : .3 }}
                            aria-label={`${n} stars`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span style={{ fontSize: '.82rem', fontWeight: 600 }}>{t('field_passed')}</span>
                      <select className="field-input" value={passed} onChange={e => setPassed(e.target.value as 'yes' | 'no' | 'na')}>
                        <option value="na">{t('passed_na')}</option>
                        <option value="yes">{t('passed_yes')}</option>
                        <option value="no">{t('passed_no')}</option>
                      </select>
                    </label>
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? t('submitting') : t('submit_btn')}
                    </button>
                    <button type="button" className="btn" onClick={() => setShowForm(false)} style={{ background: 'var(--paint-2)' }}>
                      {t('cancel')}
                    </button>
                  </div>
                  <p style={{ fontSize: '.78rem', color: 'var(--ink-soft)', marginTop: 14 }}>{t('approval_note')}</p>
                </form>
              )}
            </div>
          )}
        </div>

        {/* My submissions */}
        {user && myReviews.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.1rem', marginBottom: 16 }}>{t('my_reviews')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {myReviews.map(r => (
                <div key={r.id} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 12, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--display)', fontWeight: 700 }}>{r.title}</span>
                    <StatusBadge status={r.status} t={t} />
                  </div>
                  <span style={{ fontSize: '.78rem', color: 'var(--ink-soft)' }}>{categoryLabel(r.category, locale)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Published reviews */}
        <h2 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.1rem', marginBottom: 16 }}>{t('published_title')}</h2>
        {loading ? (
          <p style={{ color: 'var(--ink-soft)' }}>{t('loading')}</p>
        ) : reviews.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '40px 24px', textAlign: 'center', color: 'var(--ink-soft)' }}>
            {t('empty')}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {reviews.map(r => (
              <article key={r.id} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '22px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: '.78rem', color: 'var(--ink-soft)', marginBottom: 4 }}>
                      {r.display_name} · {categoryLabel(r.category, locale)}
                    </div>
                    <h3 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.05rem', margin: 0 }}>{r.title}</h3>
                  </div>
                  <div style={{ color: '#F5A623', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </div>
                </div>
                <p style={{ fontSize: '.92rem', color: 'var(--ink-soft)', lineHeight: 1.65, margin: '0 0 12px' }}>{r.body}</p>
                <div style={{ display: 'flex', gap: 16, fontSize: '.78rem', color: 'var(--ink-soft)' }}>
                  {r.passed !== null && (
                    <span>{r.passed ? t('badge_passed') : t('badge_studying')}</span>
                  )}
                  <span>{new Date(r.created_at).toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-SG')}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status, t }: { status: string; t: ReturnType<typeof useTranslations<'experiences'>> }) {
  const colors = {
    pending: { bg: '#fef3c7', text: '#92400e', label: t('status_pending') },
    approved: { bg: '#1B9C5618', text: '#1B9C56', label: t('status_approved') },
    rejected: { bg: '#fee2e2', text: '#dc2626', label: t('status_rejected') },
  }[status as 'pending' | 'approved' | 'rejected'] ?? { bg: '#eee', text: '#888', label: status };

  return (
    <span style={{ background: colors.bg, color: colors.text, fontSize: '.72rem', fontWeight: 700, padding: '3px 9px', borderRadius: 99, whiteSpace: 'nowrap' }}>
      {colors.label}
    </span>
  );
}

import type React from 'react';
