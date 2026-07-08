'use client';

import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'rr_reminder';

interface ReminderConfig {
  enabled: boolean;
  hour: number;
  minute: number;
}

function load(): ReminderConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { enabled: false, hour: 19, minute: 0 };
}

function save(cfg: ReminderConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

function msUntil(hour: number, minute: number): number {
  const now = new Date();
  const target = new Date();
  target.setHours(hour, minute, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime() - now.getTime();
}

async function scheduleNotification(cfg: ReminderConfig, lang: string) {
  if (!cfg.enabled) return;
  if (!('serviceWorker' in navigator) || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const reg = await navigator.serviceWorker.ready;
  const delay = msUntil(cfg.hour, cfg.minute);

  const titles: Record<string, string> = {
    my: '🚗 ယနေ့ လေ့ကျင့်ဖို့ မမေ့နဲ့!',
    ja: '🚗 今日の練習を忘れずに！',
    en: '🚗 Time to practise!',
  };
  const bodies: Record<string, string> = {
    my: 'TheoryLane မှာ ယနေ့ quiz တစ်ခု ဖြေလိုက်ပါ။',
    ja: 'TheoryLane で今日の問題を解いてみましょう。',
    en: 'Keep your streak going — do a quick quiz on TheoryLane.',
  };

  reg.active?.postMessage({
    type: 'SCHEDULE_REMINDER',
    delayMs: delay,
    title: titles[lang] ?? titles.en,
    body: bodies[lang] ?? bodies.en,
  });
}

export default function ReminderBell({ lang = 'en' }: { lang?: string }) {
  const [open, setOpen] = useState(false);
  const [cfg, setCfg] = useState<ReminderConfig>({ enabled: false, hour: 19, minute: 0 });
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [saved, setSaved] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCfg(load());
    if ('Notification' in window) setPermission(Notification.permission);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  async function requestAndSchedule(newCfg: ReminderConfig) {
    if (!('Notification' in window)) return;
    let perm = Notification.permission;
    if (perm === 'default') {
      perm = await Notification.requestPermission();
      setPermission(perm);
    }
    if (perm !== 'granted') return;

    if (!('serviceWorker' in navigator)) return;
    try {
      await navigator.serviceWorker.register('/sw.js');
      await scheduleNotification(newCfg, lang);
    } catch {}
  }

  async function handleToggle() {
    const next = { ...cfg, enabled: !cfg.enabled };
    setCfg(next);
    save(next);
    if (next.enabled) await requestAndSchedule(next);
  }

  async function handleSave() {
    save(cfg);
    if (cfg.enabled) await requestAndSchedule(cfg);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const pad = (n: number) => n.toString().padStart(2, '0');
  const timeStr = `${pad(cfg.hour)}:${pad(cfg.minute)}`;

  const label = {
    my: { title: 'နေ့စဉ် သတိပေးချက်', on: 'ဖွင့်ထားသည်', off: 'ပိတ်ထားသည်', time: 'အချိန်', save: 'သိမ်းမည်', saved: 'သိမ်းပြီး ✓', denied: 'Browser က notification ခွင့်မပြုပါ', note: 'ရွေးချယ်ထားသည့် အချိန်တိုင်း notification ရလိမ့်မည်' },
    ja: { title: '毎日リマインダー', on: 'オン', off: 'オフ', time: '時刻', save: '保存', saved: '保存済み ✓', denied: 'ブラウザの通知が拒否されています', note: '毎日この時間に通知が届きます' },
    en: { title: 'Daily reminder', on: 'On', off: 'Off', time: 'Time', save: 'Save', saved: 'Saved ✓', denied: 'Notifications blocked — enable in browser settings', note: 'You\'ll get a notification at this time each day' },
  }[lang] ?? { title: 'Daily reminder', on: 'On', off: 'Off', time: 'Time', save: 'Save', saved: 'Saved ✓', denied: 'Notifications blocked', note: "You'll get a daily notification" };

  return (
    <div style={{ position: 'relative' }} ref={panelRef}>
      {/* Bell button */}
      <button
        className="reminder-bell-btn"
        onClick={() => setOpen(v => !v)}
        title={label.title}
        style={{
          background: cfg.enabled ? 'rgba(27,156,86,.12)' : 'transparent',
          border: cfg.enabled ? '1.5px solid rgba(27,156,86,.35)' : '1.5px solid var(--line)',
          borderRadius: 12,
          width: 38, height: 38,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
          transition: 'background .15s, border-color .15s',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={cfg.enabled ? 'var(--guide)' : 'var(--ink-soft)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          {cfg.enabled && <circle cx="18" cy="5" r="3" fill="var(--guide)" stroke="none" />}
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: 0,
          background: '#fff', border: '1px solid var(--line)',
          borderRadius: 18, padding: '20px 20px 16px',
          boxShadow: '0 8px 32px rgba(0,0,0,.12)',
          width: 260, zIndex: 200,
        }}>
          {/* Title + toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '.9rem' }}>
              {label.title}
            </span>
            {/* Toggle switch */}
            <button
              onClick={handleToggle}
              style={{
                width: 46, height: 26, borderRadius: 13,
                background: cfg.enabled ? 'var(--guide)' : 'var(--line)',
                border: 'none', cursor: 'pointer', position: 'relative',
                transition: 'background .2s', flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute', top: 3,
                left: cfg.enabled ? 23 : 3,
                width: 20, height: 20, borderRadius: '50%',
                background: '#fff', transition: 'left .2s',
                boxShadow: '0 1px 4px rgba(0,0,0,.2)',
              }} />
            </button>
          </div>

          {permission === 'denied' && (
            <div style={{ fontSize: '.75rem', color: 'var(--red)', background: 'rgba(224,71,76,.08)', borderRadius: 8, padding: '8px 10px', marginBottom: 12 }}>
              {label.denied}
            </div>
          )}

          {/* Time picker */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: '.72rem', fontFamily: 'var(--display)', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginBottom: 6 }}>
              {label.time}
            </div>
            <input
              type="time"
              value={timeStr}
              disabled={!cfg.enabled}
              onChange={e => {
                const [h, m] = e.target.value.split(':').map(Number);
                if (!isNaN(h) && !isNaN(m)) setCfg(c => ({ ...c, hour: h, minute: m }));
              }}
              style={{
                width: '100%', padding: '9px 12px',
                border: '1.5px solid var(--line)', borderRadius: 10,
                fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1.1rem',
                background: cfg.enabled ? '#fff' : 'var(--paint-2)',
                color: cfg.enabled ? 'var(--ink)' : 'var(--ink-soft)',
                cursor: cfg.enabled ? 'auto' : 'not-allowed',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ fontSize: '.72rem', color: 'var(--ink-soft)', marginBottom: 14, lineHeight: 1.5 }}>
            {label.note}
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!cfg.enabled || permission === 'denied'}
            style={{
              width: '100%', padding: '10px',
              background: saved ? 'rgba(27,156,86,.15)' : 'var(--guide)',
              color: saved ? 'var(--guide-deep)' : '#fff',
              border: 'none', borderRadius: 10,
              fontFamily: 'var(--display)', fontWeight: 700, fontSize: '.85rem',
              cursor: cfg.enabled && permission !== 'denied' ? 'pointer' : 'not-allowed',
              opacity: cfg.enabled && permission !== 'denied' ? 1 : .45,
              transition: 'background .2s',
            }}
          >
            {saved ? label.saved : label.save}
          </button>
        </div>
      )}
    </div>
  );
}
