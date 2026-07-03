'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

interface Submission {
  id: string;
  user_id: string;
  email: string;
  plan: string;
  amount: number;
  wallet: string;
  transaction_id: string;
  screenshot_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  notes?: string | null;
}

interface MemberReviewRow {
  id: string;
  user_id: string;
  email: string;
  country: string;
  category: string;
  display_name: string;
  title: string;
  body: string;
  rating: number;
  passed: boolean | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  admin_notes?: string | null;
}

interface UserRow {
  id: string;
  email: string;
  created_at: string;
  email_confirmed_at: string | null;
  subscription: { status: string; expires_at: string | null } | null;
}

interface Stats {
  totalUsers: number;
  premiumUsers: number;
  pendingPayments: number;
  pendingReviews: number;
  totalRevenue: number;
}

interface Config {
  kbzpay: string;
  wavepay: string;
  monthlyPrice: number;
  yearlyPrice: number;
}

interface AppSetting {
  key: string;
  value: string;
  label: string | null;
}

interface Faq {
  id: string;
  country: 'sg' | 'jp';
  question_en: string;
  question_my: string;
  question_ja: string;
  answer_en: string;
  answer_my: string;
  answer_ja: string;
  sort_order: number;
  published: boolean;
}

type Tab = 'overview' | 'payments' | 'reviews' | 'users' | 'content' | 'settings';

const BLANK_FAQ: Omit<Faq, 'id'> = {
  country: 'sg', question_en: '', question_my: '', question_ja: '',
  answer_en: '', answer_my: '', answer_ja: '', sort_order: 0, published: true,
};

function ExpiryReminderButton({ userEmail }: { userEmail: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [result, setResult] = useState('');

  async function send() {
    setStatus('sending');
    try {
      const res = await fetch(`/api/admin/send-expiry-reminders?caller=${encodeURIComponent(userEmail)}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      setResult(`✓ Sent ${data.sent} / ${data.total} emails`);
      setStatus('done');
    } catch (e) {
      setResult(e instanceof Error ? e.message : 'Error');
      setStatus('error');
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <button
        onClick={send}
        disabled={status === 'sending'}
        style={{ padding: '9px 18px', background: status === 'done' ? 'rgba(27,156,86,.15)' : '#1B9C56', color: status === 'done' ? '#1B9C56' : '#fff', border: 'none', borderRadius: 8, fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.85rem', cursor: status === 'sending' ? 'wait' : 'pointer', opacity: status === 'sending' ? .6 : 1 }}
      >
        {status === 'sending' ? 'Sending…' : '📧 Send reminders now'}
      </button>
      {result && (
        <span style={{ fontSize: '.82rem', color: status === 'error' ? '#dc2626' : 'var(--guide-deep)', fontWeight: 600 }}>{result}</span>
      )}
    </div>
  );
}

export default function AdminDashboard({
  locale, submissions: initialSubs, reviews: initialReviews, users, stats, settings: initialSettings, faqs: initialFaqs, config,
}: {
  locale: string;
  submissions: Submission[];
  reviews: MemberReviewRow[];
  users: UserRow[];
  stats: Stats;
  settings: AppSetting[];
  faqs: Faq[];
  config: Config;
}) {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [submissions, setSubmissions] = useState(initialSubs);
  const [reviews, setReviews] = useState(initialReviews);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');

  // Content state
  const [settings, setSettings] = useState<AppSetting[]>(initialSettings);
  const [settingBusy, setSettingBusy] = useState<string | null>(null);
  const [settingSaved, setSettingSaved] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [faqForm, setFaqForm] = useState<Omit<Faq, 'id'> | null>(null);
  const [editingFaq, setEditingFaq] = useState<string | null>(null);
  const [faqBusy, setFaqBusy] = useState(false);
  const [faqLang, setFaqLang] = useState<'en' | 'my' | 'ja'>('en');

  async function saveSetting(key: string, value: string) {
    setSettingBusy(key);
    const res = await fetch('/api/admin/settings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    if (res.ok) {
      setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
      setSettingSaved(key);
      setTimeout(() => setSettingSaved(null), 2000);
    } else alert('Save failed');
    setSettingBusy(null);
  }

  async function submitFaq() {
    if (!faqForm) return;
    setFaqBusy(true);
    try {
      if (editingFaq) {
        const res = await fetch(`/api/admin/faqs/${editingFaq}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(faqForm),
        });
        if (!res.ok) throw new Error('Failed');
        setFaqs(prev => prev.map(f => f.id === editingFaq ? { ...f, ...faqForm } : f));
      } else {
        const res = await fetch('/api/admin/faqs', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(faqForm),
        });
        if (!res.ok) throw new Error('Failed');
        const newFaq = await res.json();
        setFaqs(prev => [...prev, newFaq]);
      }
      setFaqForm(null);
      setEditingFaq(null);
    } catch { alert('Save failed'); }
    setFaqBusy(false);
  }

  async function deleteFaq(id: string) {
    if (!confirm('Delete this FAQ?')) return;
    const res = await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' });
    if (res.ok) setFaqs(prev => prev.filter(f => f.id !== id));
    else alert('Delete failed');
  }

  async function act(id: string, action: 'approve' | 'reject') {
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: id, notes: notes[id] ?? '' }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed');
      setSubmissions(prev =>
        prev.map(s => s.id === id ? { ...s, status: action === 'approve' ? 'approved' : 'rejected' } : s)
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error');
    } finally {
      setBusy(null);
    }
  }

  async function actReview(id: string, action: 'approve' | 'reject') {
    setBusy(id);
    try {
      const res = await fetch(`/api/admin/reviews/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId: id, notes: reviewNotes[id] ?? '' }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed');
      setReviews(prev =>
        prev.map(r => r.id === id ? { ...r, status: action === 'approve' ? 'approved' : 'rejected' } : r)
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error');
    } finally {
      setBusy(null);
    }
  }

  const pending = submissions.filter(s => s.status === 'pending');
  const pendingReviews = reviews.filter(r => r.status === 'pending');
  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(userSearch.toLowerCase()));

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'payments', label: `Payments${pending.length ? ` (${pending.length})` : ''}`, icon: '💳' },
    { key: 'reviews', label: `Reviews${pendingReviews.length ? ` (${pendingReviews.length})` : ''}`, icon: '💬' },
    { key: 'users', label: 'Users', icon: '👥' },
    { key: 'content', label: 'Content', icon: '✏️' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f0' }}>
      {/* Top bar */}
      <div style={{ background: '#1a1a1a', borderBottom: '1px solid #333' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16, height: 56 }}>
          <Link href={`/${locale}`} style={{ color: '#888', fontSize: '.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            ← Myanpass
          </Link>
          <div style={{ width: 1, height: 18, background: '#333' }} />
          <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '.95rem', color: '#fff' }}>Admin Dashboard</span>
          {pending.length > 0 && (
            <span style={{ background: '#ef4444', color: '#fff', fontSize: '.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>
              {pending.length + pendingReviews.length} pending
            </span>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

        {/* Tab nav */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: '#fff', borderRadius: 12, padding: 4, border: '1px solid var(--line)', width: 'fit-content' }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '8px 18px', borderRadius: 9, border: 'none', cursor: 'pointer',
                fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.85rem',
                background: tab === t.key ? '#1a1a1a' : 'transparent',
                color: tab === t.key ? '#fff' : 'var(--ink-soft)',
                transition: 'all .15s',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
              <StatCard label="Total users" value={stats.totalUsers} icon="👤" color="#2563eb" />
              <StatCard label="Premium users" value={stats.premiumUsers} icon="⭐" color="#1B9C56" />
              <StatCard label="Pending payments" value={stats.pendingPayments} icon="⏳" color="#d97706" alert={stats.pendingPayments > 0} />
              <StatCard label="Pending reviews" value={stats.pendingReviews} icon="💬" color="#ea580c" alert={stats.pendingReviews > 0} />
              <StatCard label="Total revenue approved" value={`${stats.totalRevenue.toLocaleString()} Ks`} icon="💰" color="#7C3AED" />
            </div>

            {/* Recent pending */}
            {pending.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 14, border: '1.5px solid #fde68a', overflow: 'hidden' }}>
                <div style={{ background: '#fef3c7', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.9rem', color: '#92400e' }}>
                    ⏳ {pending.length} payment{pending.length > 1 ? 's' : ''} awaiting approval
                  </span>
                  <button onClick={() => setTab('payments')} style={{ fontSize: '.82rem', fontFamily: 'var(--display)', fontWeight: 700, color: '#92400e', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Review now →
                  </button>
                </div>
                <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {pending.slice(0, 3).map(s => (
                    <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '.85rem' }}>
                      <span style={{ color: 'var(--ink-soft)', minWidth: 80 }}>{new Date(s.created_at).toLocaleDateString()}</span>
                      <span style={{ flex: 1, fontFamily: 'var(--display)', fontWeight: 600 }}>{s.email || s.user_id.slice(0, 10) + '…'}</span>
                      <span style={{ fontFamily: 'var(--display)', fontWeight: 700 }}>{s.amount.toLocaleString()} Ks</span>
                      <span style={{ color: 'var(--ink-soft)' }}>{s.wallet}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pending.length === 0 && (
              <div style={{ background: '#fff', borderRadius: 14, padding: '32px', textAlign: 'center', border: '1px solid var(--line)', color: 'var(--ink-soft)' }}>
                ✓ No pending payments
              </div>
            )}
          </div>
        )}

        {/* ── PAYMENTS ── */}
        {tab === 'payments' && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--line)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1rem' }}>Payment submissions</div>
              <div style={{ display: 'flex', gap: 8, fontSize: '.78rem' }}>
                <Badge color="#d97706">Pending: {submissions.filter(s => s.status === 'pending').length}</Badge>
                <Badge color="#1B9C56">Approved: {submissions.filter(s => s.status === 'approved').length}</Badge>
                <Badge color="#dc2626">Rejected: {submissions.filter(s => s.status === 'rejected').length}</Badge>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>User</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Wallet</th>
                    <th>Txn ID</th>
                    <th>Screenshot</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(s => (
                    <tr key={s.id}>
                      <td style={{ whiteSpace: 'nowrap', fontSize: '.82rem', color: 'var(--ink-soft)' }}>
                        {new Date(s.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ fontSize: '.85rem' }}>{s.email || s.user_id.slice(0, 10) + '…'}</td>
                      <td style={{ fontFamily: 'var(--display)', fontWeight: 700, textTransform: 'capitalize' }}>{s.plan}</td>
                      <td style={{ fontFamily: 'var(--display)', fontWeight: 700 }}>{s.amount.toLocaleString()} Ks</td>
                      <td>{s.wallet}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '.82rem' }}>{s.transaction_id}</td>
                      <td>
                        {s.screenshot_url
                          ? <a href={s.screenshot_url} target="_blank" rel="noreferrer" style={{ color: 'var(--guide-deep)', fontWeight: 700, fontSize: '.82rem' }}>View ↗</a>
                          : <span style={{ color: 'var(--ink-soft)', fontSize: '.82rem' }}>—</span>}
                      </td>
                      <td>
                        <StatusBadge status={s.status} />
                      </td>
                      <td>
                        {s.status === 'pending' ? (
                          <input
                            className="field-input"
                            placeholder="Optional notes"
                            value={notes[s.id] ?? ''}
                            onChange={e => setNotes(prev => ({ ...prev, [s.id]: e.target.value }))}
                            style={{ minWidth: 140, fontSize: '.82rem', padding: '6px 10px' }}
                          />
                        ) : (
                          <span style={{ fontSize: '.82rem', color: 'var(--ink-soft)' }}>{s.notes ?? '—'}</span>
                        )}
                      </td>
                      <td>
                        {s.status === 'pending' && (
                          <div style={{ display: 'flex', gap: 6, whiteSpace: 'nowrap' }}>
                            <button
                              onClick={() => act(s.id, 'approve')}
                              disabled={busy === s.id}
                              style={{ padding: '5px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', background: '#1B9C56', color: '#fff', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', opacity: busy === s.id ? .6 : 1 }}
                            >✓ Approve</button>
                            <button
                              onClick={() => act(s.id, 'reject')}
                              disabled={busy === s.id}
                              style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid #fca5a5', cursor: 'pointer', background: '#fff', color: '#dc2626', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', opacity: busy === s.id ? .6 : 1 }}
                            >✗ Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {submissions.length === 0 && (
                    <tr><td colSpan={10} style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-soft)' }}>No submissions yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── REVIEWS ── */}
        {tab === 'reviews' && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--line)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1rem' }}>Member experience reviews</div>
              <div style={{ display: 'flex', gap: 8, fontSize: '.78rem' }}>
                <Badge color="#d97706">Pending: {reviews.filter(r => r.status === 'pending').length}</Badge>
                <Badge color="#1B9C56">Approved: {reviews.filter(r => r.status === 'approved').length}</Badge>
                <Badge color="#dc2626">Rejected: {reviews.filter(r => r.status === 'rejected').length}</Badge>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>User</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Rating</th>
                    <th>Title</th>
                    <th>Body</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map(r => (
                    <tr key={r.id}>
                      <td style={{ whiteSpace: 'nowrap', fontSize: '.82rem', color: 'var(--ink-soft)' }}>
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ fontSize: '.82rem' }}>{r.email || r.user_id.slice(0, 10) + '…'}</td>
                      <td style={{ fontSize: '.85rem', fontWeight: 600 }}>{r.display_name}</td>
                      <td style={{ fontSize: '.82rem' }}>{r.category}</td>
                      <td style={{ color: '#F5A623' }}>{'★'.repeat(r.rating)}</td>
                      <td style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.85rem', maxWidth: 140 }}>{r.title}</td>
                      <td style={{ fontSize: '.82rem', color: 'var(--ink-soft)', maxWidth: 220, lineHeight: 1.4 }}>{r.body.slice(0, 120)}{r.body.length > 120 ? '…' : ''}</td>
                      <td><StatusBadge status={r.status} /></td>
                      <td>
                        {r.status === 'pending' ? (
                          <input
                            className="field-input"
                            placeholder="Optional notes"
                            value={reviewNotes[r.id] ?? ''}
                            onChange={e => setReviewNotes(prev => ({ ...prev, [r.id]: e.target.value }))}
                            style={{ minWidth: 120, fontSize: '.82rem', padding: '6px 10px' }}
                          />
                        ) : (
                          <span style={{ fontSize: '.82rem', color: 'var(--ink-soft)' }}>{r.admin_notes ?? '—'}</span>
                        )}
                      </td>
                      <td>
                        {r.status === 'pending' && (
                          <div style={{ display: 'flex', gap: 6, whiteSpace: 'nowrap' }}>
                            <button
                              onClick={() => actReview(r.id, 'approve')}
                              disabled={busy === r.id}
                              style={{ padding: '5px 12px', borderRadius: 7, border: 'none', cursor: 'pointer', background: '#1B9C56', color: '#fff', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', opacity: busy === r.id ? .6 : 1 }}
                            >✓ Approve</button>
                            <button
                              onClick={() => actReview(r.id, 'reject')}
                              disabled={busy === r.id}
                              style={{ padding: '5px 12px', borderRadius: 7, border: '1px solid #fca5a5', cursor: 'pointer', background: '#fff', color: '#dc2626', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.78rem', opacity: busy === r.id ? .6 : 1 }}
                            >✗ Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {reviews.length === 0 && (
                    <tr><td colSpan={10} style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-soft)' }}>No member reviews yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--line)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1rem', flex: 1 }}>
                Users — {users.length} total
              </div>
              <input
                className="field-input"
                placeholder="Search by email…"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                style={{ width: 220, fontSize: '.85rem', padding: '7px 12px' }}
              />
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Verified</th>
                    <th>Plan</th>
                    <th>Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => {
                    const isPremium = u.subscription?.status === 'premium' && u.subscription?.expires_at && new Date(u.subscription.expires_at) > new Date();
                    return (
                      <tr key={u.id}>
                        <td style={{ fontFamily: 'var(--display)', fontWeight: 600, fontSize: '.88rem' }}>{u.email}</td>
                        <td style={{ fontSize: '.82rem', color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td>
                          <span style={{ fontSize: '.78rem', fontWeight: 700, color: u.email_confirmed_at ? '#1B9C56' : '#d97706' }}>
                            {u.email_confirmed_at ? '✓ Yes' : '✗ No'}
                          </span>
                        </td>
                        <td>
                          <span style={{ background: isPremium ? '#1B9C5618' : '#88888818', color: isPremium ? '#1B9C56' : '#888', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.75rem', padding: '3px 9px', borderRadius: 99 }}>
                            {isPremium ? 'Premium' : 'Free'}
                          </span>
                        </td>
                        <td style={{ fontSize: '.82rem', color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>
                          {u.subscription?.expires_at ? new Date(u.subscription.expires_at).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-soft)' }}>No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── CONTENT ── */}
        {tab === 'content' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* App Settings editor */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--line)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--line)' }}>
                <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '.95rem' }}>⚙️ App Settings</div>
                <div style={{ fontSize: '.78rem', color: 'var(--ink-soft)', marginTop: 2 }}>Wallet numbers, pricing, announcement banner</div>
              </div>
              <div style={{ padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {settings.map(s => (
                  <SettingEditor
                    key={s.key}
                    setting={s}
                    busy={settingBusy === s.key}
                    saved={settingSaved === s.key}
                    onSave={v => saveSetting(s.key, v)}
                  />
                ))}
                {settings.length === 0 && (
                  <div style={{ color: 'var(--ink-soft)', fontSize: '.88rem', padding: '12px 0' }}>
                    No settings found — run the updated SQL schema first.
                  </div>
                )}
              </div>
            </div>

            {/* FAQ Editor */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--line)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '.95rem' }}>❓ FAQ Manager</div>
                  <div style={{ fontSize: '.78rem', color: 'var(--ink-soft)', marginTop: 2 }}>{faqs.length} questions · EN / MY / JA per question</div>
                </div>
                <button
                  onClick={() => { setFaqForm({ ...BLANK_FAQ }); setEditingFaq(null); }}
                  style={{ padding: '7px 16px', borderRadius: 9, background: '#1a1a1a', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.82rem' }}
                >
                  + Add FAQ
                </button>
              </div>

              {/* FAQ form modal */}
              {faqForm && (
                <div style={{ padding: '20px 22px', borderBottom: '2px solid var(--guide)', background: '#f8fffe' }}>
                  <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.88rem', marginBottom: 14 }}>
                    {editingFaq ? 'Edit FAQ' : 'New FAQ'}
                  </div>

                  {/* Country + Published */}
                  <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.85rem' }}>
                      Country:
                      <select
                        value={faqForm.country}
                        onChange={e => setFaqForm(f => f && ({ ...f, country: e.target.value as 'sg' | 'jp' }))}
                        style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid var(--line)', fontFamily: 'var(--display)', fontWeight: 600 }}
                      >
                        <option value="sg">🇸🇬 Singapore</option>
                        <option value="jp">🇯🇵 Japan</option>
                      </select>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.85rem' }}>
                      <input type="checkbox" checked={faqForm.published} onChange={e => setFaqForm(f => f && ({ ...f, published: e.target.checked }))} />
                      Published
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.85rem' }}>
                      Order:
                      <input
                        type="number"
                        value={faqForm.sort_order}
                        onChange={e => setFaqForm(f => f && ({ ...f, sort_order: +e.target.value }))}
                        style={{ width: 60, padding: '5px 8px', borderRadius: 7, border: '1px solid var(--line)' }}
                      />
                    </label>
                  </div>

                  {/* Language tabs */}
                  <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                    {(['en', 'my', 'ja'] as const).map(l => (
                      <button key={l} onClick={() => setFaqLang(l)}
                        style={{ padding: '5px 14px', borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.82rem', background: faqLang === l ? '#1a1a1a' : 'var(--paint)', color: faqLang === l ? '#fff' : 'var(--ink-soft)' }}>
                        {l.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div>
                      <div style={{ fontSize: '.78rem', fontFamily: 'var(--display)', fontWeight: 700, marginBottom: 4, color: 'var(--ink-soft)' }}>Question ({faqLang.toUpperCase()})</div>
                      <input
                        className="field-input"
                        value={(faqForm as unknown as Record<string, string>)[`question_${faqLang}`]}
                        onChange={e => setFaqForm(f => f && ({ ...f, [`question_${faqLang}`]: e.target.value }))}
                        placeholder={`Question in ${faqLang.toUpperCase()}…`}
                        style={{ width: '100%', fontSize: '.88rem' }}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: '.78rem', fontFamily: 'var(--display)', fontWeight: 700, marginBottom: 4, color: 'var(--ink-soft)' }}>Answer ({faqLang.toUpperCase()})</div>
                      <textarea
                        className="field-input"
                        value={(faqForm as unknown as Record<string, string>)[`answer_${faqLang}`]}
                        onChange={e => setFaqForm(f => f && ({ ...f, [`answer_${faqLang}`]: e.target.value }))}
                        placeholder={`Answer in ${faqLang.toUpperCase()}…`}
                        rows={3}
                        style={{ width: '100%', fontSize: '.88rem', resize: 'vertical' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                    <button onClick={submitFaq} disabled={faqBusy}
                      style={{ padding: '8px 20px', borderRadius: 9, background: '#1B9C56', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.85rem', opacity: faqBusy ? .6 : 1 }}>
                      {faqBusy ? 'Saving…' : editingFaq ? 'Save changes' : 'Add FAQ'}
                    </button>
                    <button onClick={() => { setFaqForm(null); setEditingFaq(null); }}
                      style={{ padding: '8px 16px', borderRadius: 9, background: 'none', color: 'var(--ink-soft)', border: '1px solid var(--line)', cursor: 'pointer', fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.85rem' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* FAQ list */}
              <div style={{ padding: '8px 22px 22px' }}>
                {['sg', 'jp'].map(country => {
                  const countryFaqs = faqs.filter(f => f.country === country);
                  if (countryFaqs.length === 0) return null;
                  return (
                    <div key={country} style={{ marginTop: 16 }}>
                      <div style={{ fontSize: '.75rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 10 }}>
                        {country === 'sg' ? '🇸🇬 Singapore' : '🇯🇵 Japan'}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {countryFaqs.map(faq => (
                          <div key={faq.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'var(--paint)', borderRadius: 10, padding: '12px 14px' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.88rem', marginBottom: 3 }}>
                                {faq.question_en || faq.question_my || faq.question_ja || <span style={{ color: 'var(--ink-soft)', fontStyle: 'italic' }}>No EN question</span>}
                              </div>
                              <div style={{ fontSize: '.78rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                                {faq.answer_en || faq.answer_my || faq.answer_ja || '—'}
                              </div>
                              {!faq.published && <span style={{ fontSize: '.72rem', background: '#fef3c7', color: '#92400e', padding: '2px 7px', borderRadius: 99, marginTop: 4, display: 'inline-block' }}>Draft</span>}
                            </div>
                            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                              <button
                                onClick={() => { setEditingFaq(faq.id); setFaqForm({ country: faq.country, question_en: faq.question_en, question_my: faq.question_my, question_ja: faq.question_ja, answer_en: faq.answer_en, answer_my: faq.answer_my, answer_ja: faq.answer_ja, sort_order: faq.sort_order, published: faq.published }); }}
                                style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid var(--line)', background: '#fff', cursor: 'pointer', fontSize: '.78rem', fontFamily: 'var(--display)', fontWeight: 700 }}>
                                Edit
                              </button>
                              <button
                                onClick={() => deleteFaq(faq.id)}
                                style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid #fca5a5', background: '#fff', cursor: 'pointer', fontSize: '.78rem', fontFamily: 'var(--display)', fontWeight: 700, color: '#dc2626' }}>
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {faqs.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--ink-soft)', fontSize: '.9rem' }}>
                    No FAQs yet — run the SQL schema update, then click "+ Add FAQ".
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {tab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Pricing */}
            <SettingsCard title="💳 Pricing" subtitle="Configured in .env.local (NEXT_PUBLIC_*)">
              <SettingRow label="Monthly plan" value={`${config.monthlyPrice.toLocaleString()} Ks / 30 days`} />
              <SettingRow label="Yearly plan" value={`${config.yearlyPrice.toLocaleString()} Ks / 365 days`} />
            </SettingsCard>

            {/* Wallet numbers */}
            <SettingsCard title="📱 Payment wallets" subtitle="Configured in .env.local">
              <SettingRow label="KBZPay number" value={config.kbzpay || '(not set)'} mono />
              <SettingRow label="WavePay number" value={config.wavepay || '(not set)'} mono />
              <div style={{ marginTop: 12, padding: '10px 14px', background: '#fef3c7', borderRadius: 8, fontSize: '.82rem', color: '#92400e' }}>
                To change wallet numbers, edit <code>NEXT_PUBLIC_KBZPAY_NUMBER</code> and <code>NEXT_PUBLIC_WAVEPAY_NUMBER</code> in <code>.env.local</code>, then restart the server.
              </div>
            </SettingsCard>

            {/* Admin access */}
            <SettingsCard title="🔐 Admin access" subtitle="Configured in .env.local">
              <SettingRow label="ADMIN_EMAILS" value={process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '(not exposed)'} mono />
              <div style={{ marginTop: 12, padding: '10px 14px', background: '#eff6ff', borderRadius: 8, fontSize: '.82rem', color: '#1e40af' }}>
                Add multiple admin emails with comma separation: <code>admin1@x.com,admin2@x.com</code>
              </div>
            </SettingsCard>

            {/* Email reminders */}
            <SettingsCard title="📧 Premium expiry reminders" subtitle="Send email to users whose premium expires within 3 days">
              <ExpiryReminderButton userEmail={user?.email ?? ''} />
              <div style={{ marginTop: 10, fontSize: '.8rem', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                Requires <code>RESEND_API_KEY</code> and <code>FROM_EMAIL</code> in .env.local.<br />
                Sign up free at <strong>resend.com</strong> to get an API key.
              </div>
            </SettingsCard>

            {/* Quick links */}
            <SettingsCard title="🔗 Quick links" subtitle="Supabase project management">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {[
                  { label: 'Supabase Dashboard', url: 'https://supabase.com/dashboard/project/mymxufmvdxgyjuwuibwq' },
                  { label: 'SQL Editor', url: 'https://supabase.com/dashboard/project/mymxufmvdxgyjuwuibwq/sql/new' },
                  { label: 'Auth Users', url: 'https://supabase.com/dashboard/project/mymxufmvdxgyjuwuibwq/auth/users' },
                  { label: 'Storage', url: 'https://supabase.com/dashboard/project/mymxufmvdxgyjuwuibwq/storage/buckets' },
                ].map(l => (
                  <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: '.82rem', fontFamily: 'var(--display)', fontWeight: 700, padding: '7px 14px', borderRadius: 8, border: '1px solid var(--line)', textDecoration: 'none', color: 'var(--asphalt)' }}>
                    {l.label} ↗
                  </a>
                ))}
              </div>
            </SettingsCard>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, alert }: { label: string; value: string | number; icon: string; color: string; alert?: boolean }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', border: alert ? `1.5px solid ${color}60` : '1px solid var(--line)' }}>
      <div style={{ fontSize: '1.4rem', marginBottom: 10 }}>{icon}</div>
      <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.6rem', color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '.8rem', color: 'var(--ink-soft)', marginTop: 5 }}>{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    pending: { bg: '#fef3c7', color: '#92400e' },
    approved: { bg: '#d1fae5', color: '#065f46' },
    rejected: { bg: '#fee2e2', color: '#991b1b' },
  };
  const s = map[status] ?? { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{ background: s.bg, color: s.color, fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.72rem', padding: '3px 9px', borderRadius: 99, textTransform: 'capitalize' }}>
      {status}
    </span>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span style={{ background: `${color}18`, color, fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.75rem', padding: '3px 9px', borderRadius: 99 }}>
      {children}
    </span>
  );
}

function SettingsCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--line)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '.95rem' }}>{title}</div>
        <div style={{ fontSize: '.78rem', color: 'var(--ink-soft)', marginTop: 2 }}>{subtitle}</div>
      </div>
      <div style={{ padding: '16px 22px' }}>{children}</div>
    </div>
  );
}

function SettingRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--line)', gap: 12, flexWrap: 'wrap' }}>
      <span style={{ fontSize: '.85rem', color: 'var(--ink-soft)' }}>{label}</span>
      <span style={{ fontSize: '.85rem', fontFamily: mono ? 'monospace' : 'var(--display)', fontWeight: 600 }}>{value}</span>
    </div>
  );
}

function SettingEditor({ setting, busy, saved, onSave }: {
  setting: AppSetting;
  busy: boolean;
  saved: boolean;
  onSave: (v: string) => void;
}) {
  const [val, setVal] = useState(setting.value);
  const dirty = val !== setting.value;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <div style={{ flex: '0 0 220px' }}>
        <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.85rem' }}>{setting.label ?? setting.key}</div>
        <div style={{ fontSize: '.72rem', color: 'var(--ink-soft)', fontFamily: 'monospace' }}>{setting.key}</div>
      </div>
      <input
        className="field-input"
        value={val}
        onChange={e => setVal(e.target.value)}
        style={{ flex: 1, minWidth: 160, fontSize: '.88rem', padding: '7px 12px' }}
      />
      <button
        onClick={() => onSave(val)}
        disabled={busy || !dirty}
        style={{
          padding: '7px 16px', borderRadius: 8, border: 'none', cursor: dirty ? 'pointer' : 'default',
          background: saved ? '#1B9C56' : dirty ? '#1a1a1a' : 'var(--paint)',
          color: saved || dirty ? '#fff' : 'var(--ink-soft)',
          fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.82rem',
          opacity: busy ? .6 : 1, transition: 'all .15s', whiteSpace: 'nowrap',
        }}
      >
        {saved ? '✓ Saved' : busy ? 'Saving…' : 'Save'}
      </button>
    </div>
  );
}
