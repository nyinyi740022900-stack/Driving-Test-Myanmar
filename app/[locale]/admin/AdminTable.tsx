'use client';

import { useState } from 'react';

interface Submission {
  id: string;
  user_id: string;
  plan: string;
  amount: number;
  wallet: string;
  transaction_id: string;
  screenshot_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  notes?: string;
  profiles?: { email: string } | null;
}

export default function AdminTable({ submissions: initial }: { submissions: Submission[] }) {
  const [items, setItems] = useState(initial);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

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
      setItems(prev => prev.map(s => s.id === id ? { ...s, status: action === 'approve' ? 'approved' : 'rejected' } : s));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error');
    } finally {
      setBusy(null);
    }
  }

  const statusBadge = (s: string) => {
    const cls = s === 'pending' ? 'badge badge-pending' : s === 'approved' ? 'badge badge-approved' : 'badge badge-rejected';
    return <span className={cls}>{s}</span>;
  };

  return (
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
          {items.map(s => (
            <tr key={s.id}>
              <td style={{ whiteSpace: 'nowrap', fontSize: '.82rem', color: 'var(--ink-soft)' }}>
                {new Date(s.created_at).toLocaleDateString()}
              </td>
              <td style={{ fontSize: '.85rem' }}>{s.profiles?.email ?? s.user_id.slice(0, 8) + '…'}</td>
              <td style={{ fontFamily: 'var(--display)', fontWeight: 700, textTransform: 'capitalize' }}>{s.plan}</td>
              <td style={{ fontFamily: 'var(--display)', fontWeight: 700 }}>{s.amount.toLocaleString()} Ks</td>
              <td>{s.wallet}</td>
              <td style={{ fontFamily: 'monospace', fontSize: '.82rem' }}>{s.transaction_id}</td>
              <td>
                {s.screenshot_url
                  ? <a href={s.screenshot_url} target="_blank" rel="noreferrer" style={{ color: 'var(--guide-deep)', fontWeight: 700, fontSize: '.82rem' }}>View</a>
                  : <span style={{ color: 'var(--ink-soft)', fontSize: '.82rem' }}>—</span>
                }
              </td>
              <td>{statusBadge(s.status)}</td>
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
                  <div style={{ display: 'flex', gap: 8, whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => act(s.id, 'approve')}
                      disabled={busy === s.id}
                      style={{
                        padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: 'var(--guide)', color: '#fff',
                        fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.82rem',
                        opacity: busy === s.id ? .6 : 1,
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => act(s.id, 'reject')}
                      disabled={busy === s.id}
                      style={{
                        padding: '6px 14px', borderRadius: 8, border: '1px solid var(--line)', cursor: 'pointer',
                        background: '#fff', color: 'var(--red)',
                        fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.82rem',
                        opacity: busy === s.id ? .6 : 1,
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={10} style={{ textAlign: 'center', padding: '32px', color: 'var(--ink-soft)' }}>No submissions yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
