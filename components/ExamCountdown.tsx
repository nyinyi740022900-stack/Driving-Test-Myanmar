'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const STORAGE_KEY = 'rr_exam_date';

/** Days between today and the exam date (both at local midnight). */
function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = dateStr.split('-').map(Number);
  const exam = new Date(y, (m ?? 1) - 1, d ?? 1);
  exam.setHours(0, 0, 0, 0);
  return Math.round((exam.getTime() - today.getTime()) / 86_400_000);
}

export default function ExamCountdown({ locale }: { locale: string }) {
  const t = useTranslations('countdown');
  const [date, setDate] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setDate(stored);
    else setEditing(true);
  }, []);

  function handleSave() {
    if (!draft) return;
    localStorage.setItem(STORAGE_KEY, draft);
    setDate(draft);
    setEditing(false);
  }

  function handleClear() {
    localStorage.removeItem(STORAGE_KEY);
    setDate(null);
    setDraft('');
    setEditing(true);
  }

  const days = date ? daysUntil(date) : null;
  const examLabel = date
    ? new Date(date).toLocaleDateString(locale === 'ja' ? 'ja-JP' : locale === 'my' ? 'my-MM' : 'en-SG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div style={{ background: '#fff', borderRadius: 18, padding: '24px 28px', marginBottom: 20, border: '1px solid var(--line)' }}>
      <div style={{ fontSize: '.72rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 16 }}>
        {t('heading')}
      </div>

      {date && !editing ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            {days !== null && days > 0 && (
              <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.9rem', lineHeight: 1.1, color: days <= 7 ? 'var(--amber)' : 'var(--guide)' }}>
                {t('days_to_go', { count: days })}
              </div>
            )}
            {days === 0 && (
              <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--guide)' }}>{t('today')}</div>
            )}
            {days !== null && days < 0 && (
              <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.95rem', color: 'var(--ink-soft)' }}>{t('passed')}</div>
            )}
            <div style={{ fontSize: '.82rem', color: 'var(--ink-soft)', marginTop: 6 }}>{t('exam_on', { date: examLabel })}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => { setDraft(date); setEditing(true); }}
              style={{ fontSize: '.8rem', fontFamily: 'var(--display)', fontWeight: 700, color: 'var(--ink-soft)', background: 'none', border: '1px solid var(--line)', borderRadius: 8, cursor: 'pointer', padding: '7px 14px' }}
            >
              {t('change_cta')}
            </button>
            <button
              onClick={handleClear}
              style={{ fontSize: '.8rem', fontFamily: 'var(--display)', fontWeight: 700, color: 'var(--red)', background: 'none', border: '1px solid var(--line)', borderRadius: 8, cursor: 'pointer', padding: '7px 14px' }}
            >
              {t('clear_cta')}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: '.85rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 14 }}>{t('intro')}</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label style={{ display: 'block', fontSize: '.72rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 6 }}>
                {t('date_label')}
              </label>
              <input
                type="date"
                value={draft}
                min={todayStr}
                onChange={e => setDraft(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', border: '1.5px solid var(--line)', borderRadius: 10, fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <button
              onClick={handleSave}
              disabled={!draft}
              style={{ padding: '10px 20px', background: 'var(--guide)', color: '#fff', border: 'none', borderRadius: 10, fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.85rem', cursor: draft ? 'pointer' : 'not-allowed', opacity: draft ? 1 : 0.45 }}
            >
              {t('save_cta')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
