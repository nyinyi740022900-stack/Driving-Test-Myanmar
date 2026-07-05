'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useCountry } from '@/components/CountryProvider';
import { useAuth } from '@/components/AuthProvider';
import BackButton from '@/components/BackButton';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { FeedbackArea, FeedbackType } from '@/lib/types';

interface MyFeedback {
  id: string;
  type: FeedbackType;
  area: FeedbackArea;
  subject: string;
  body: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  priority: 'low' | 'normal' | 'high';
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
}

const TYPES: FeedbackType[] = ['bug', 'difficulty', 'feedback', 'other'];
const AREAS: FeedbackArea[] = ['quiz', 'account', 'payment', 'content', 'ui', 'other'];

export default function FeedbackPage() {
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
  const { country } = useCountry();
  const { user, loading: authLoading } = useAuth();
  const t = useTranslations('feedback');

  const [myReports, setMyReports] = useState<MyFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const [type, setType] = useState<FeedbackType>('bug');
  const [area, setArea] = useState<FeedbackArea>('quiz');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [pageUrl, setPageUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPageUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    fetch('/api/feedback?mine=1')
      .then(r => r.json())
      .then(data => {
        setMyReports(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, authLoading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);
    setSubmitting(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          area,
          subject,
          body,
          page_url: pageUrl,
          country,
          locale,
          contact_email: user ? undefined : contactEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed');

      setFormSuccess(true);
      setSubject('');
      setBody('');
      if (!user) setContactEmail('');

      if (user) {
        const mineRes = await fetch('/api/feedback?mine=1');
        const mine = await mineRes.json();
        if (Array.isArray(mine)) setMyReports(mine);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : t('error_generic'));
    } finally {
      setSubmitting(false);
    }
  }

  function statusLabel(status: MyFeedback['status']): string {
    const key = `status_${status}` as 'status_pending' | 'status_reviewing' | 'status_resolved' | 'status_dismissed';
    return t(key);
  }

  return (
    <>
      <Header />
      <div style={{ minHeight: '100vh', background: 'var(--paint)', paddingBottom: 80 }}>
      <div style={{ background: 'var(--paint-2)', borderBottom: '1px solid var(--line)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          <BackButton
            label={t('breadcrumb_home')}
            fallback={`/${locale}`}
            style={{ fontSize: '.82rem', color: 'var(--ink-soft)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          />
          <span style={{ color: 'var(--line)' }}>/</span>
          <span style={{ fontSize: '.82rem', color: 'var(--ink)' }}>{t('breadcrumb_title')}</span>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 10, color: 'var(--guide-deep)' }}>{t('eyebrow')}</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 800, marginBottom: 12 }}>
            {t('title')}
          </h1>
          <p style={{ color: 'var(--ink-soft)', maxWidth: '36em', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
            {t('lead')}
          </p>
        </div>

        {formSuccess && (
          <div style={{ padding: '16px 20px', marginBottom: 20, borderRadius: 14, border: '1px solid rgba(27,156,86,.25)', background: 'rgba(27,156,86,.08)' }}>
            <strong style={{ color: 'var(--guide-deep)' }}>{t('success_title')}</strong>
            <p style={{ margin: '6px 0 0', fontSize: '.9rem', color: 'var(--ink-soft)' }}>{t('success_body')}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            background: '#fff',
            border: '1px solid var(--line)',
            borderRadius: 16,
            padding: '24px',
            marginBottom: 28,
          }}
        >
          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <label className="field-label" htmlFor="fb-type">{t('type_label')}</label>
              <select
                id="fb-type"
                className="field-input"
                value={type}
                onChange={e => setType(e.target.value as FeedbackType)}
              >
                {TYPES.map(v => (
                  <option key={v} value={v}>{t(`type_${v}`)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label" htmlFor="fb-area">{t('area_label')}</label>
              <select
                id="fb-area"
                className="field-input"
                value={area}
                onChange={e => setArea(e.target.value as FeedbackArea)}
              >
                {AREAS.map(v => (
                  <option key={v} value={v}>{t(`area_${v}`)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label" htmlFor="fb-subject">{t('subject_label')}</label>
              <input
                id="fb-subject"
                className="field-input"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder={t('subject_placeholder')}
                maxLength={120}
                required
              />
            </div>

            <div>
              <label className="field-label" htmlFor="fb-body">{t('body_label')}</label>
              <textarea
                id="fb-body"
                className="field-input"
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder={t('body_placeholder')}
                rows={5}
                maxLength={2000}
                required
                style={{ resize: 'vertical', minHeight: 120 }}
              />
            </div>

            {!user && (
              <div>
                <label className="field-label" htmlFor="fb-email">{t('email_label')}</label>
                <input
                  id="fb-email"
                  type="email"
                  className="field-input"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder={t('email_placeholder')}
                  required
                />
                <p style={{ fontSize: '.8rem', color: 'var(--ink-soft)', marginTop: 6 }}>{t('email_hint')}</p>
              </div>
            )}

            {user && (
              <p style={{ fontSize: '.85rem', color: 'var(--ink-soft)', margin: 0 }}>
                {t('signed_in_as')} <strong>{user.email}</strong>
              </p>
            )}

            {formError && (
              <p style={{ color: 'var(--stop)', fontSize: '.88rem', margin: 0 }}>{formError}</p>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ alignSelf: 'flex-start' }}
            >
              {submitting ? t('submitting') : t('submit')}
            </button>
          </div>
        </form>

        {user && (
          <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 16, padding: '24px' }}>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '1.1rem', marginBottom: 16 }}>{t('my_reports')}</h2>
            {loading ? (
              <p style={{ color: 'var(--ink-soft)' }}>{t('loading')}</p>
            ) : myReports.length === 0 ? (
              <p style={{ color: 'var(--ink-soft)' }}>{t('no_reports')}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {myReports.map(r => (
                  <div key={r.id} style={{ padding: '14px 16px', borderRadius: 10, border: '1px solid var(--line)', background: 'var(--surface)' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontFamily: 'var(--display)', fontWeight: 700 }}>{r.subject}</span>
                      <span className="chip" style={{ fontSize: '.75rem' }}>{t(`type_${r.type}`)}</span>
                      <span style={{ fontSize: '.78rem', color: 'var(--ink-soft)' }}>{statusLabel(r.status)}</span>
                      <span style={{ fontSize: '.78rem', color: 'var(--ink-soft)', marginLeft: 'auto' }}>
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ fontSize: '.88rem', color: 'var(--ink-soft)', margin: '0 0 8px', lineHeight: 1.5 }}>{r.body}</p>
                    {r.admin_notes && (
                      <p style={{ fontSize: '.82rem', margin: 0, padding: '8px 12px', borderRadius: 8, background: 'rgba(37,99,235,.06)' }}>
                        <strong>{t('admin_reply')}:</strong> {r.admin_notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!user && !authLoading && (
          <p style={{ textAlign: 'center', fontSize: '.88rem', color: 'var(--ink-soft)' }}>
            {t('signin_hint')}{' '}
            <Link href={`/${locale}/auth/login`} style={{ color: 'var(--guide-deep)', fontWeight: 600 }}>
              {t('signin_link')}
            </Link>
          </p>
        )}
      </div>
      </div>
      <Footer />
    </>
  );
}
