/* TheoryLane service worker — offline caching + daily reminders. */

const CACHE = 'theorylane-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

// ── Caching strategy ──────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try {
    url = new URL(req.url);
  } catch {
    return;
  }

  // Only handle same-origin requests. Third-party (Supabase, GA, AdSense)
  // must always hit the network so auth and ads work correctly.
  if (url.origin !== self.location.origin) return;

  // Immutable static assets — cache-first.
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/signs/') ||
    url.pathname.startsWith('/fonts/')
  ) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // Page navigations — network-first with cached fallback for offline.
  if (req.mode === 'navigate') {
    event.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    return cached || Response.error();
  }
}

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    const cached = await cache.match(req);
    if (cached) return cached;
    const home = await cache.match('/');
    return home || Response.error();
  }
}

// ── Daily reminder (kept from sw-reminder.js) ─────────────────────
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SCHEDULE_REMINDER') {
    const { delayMs, title, body } = event.data;
    if (delayMs < 0) return;
    setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        icon: '/images/icon-192.png',
        badge: '/images/icon-192.png',
        tag: 'daily-reminder',
        requireInteraction: false,
        vibrate: [200, 100, 200],
      });
    }, delayMs);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    }),
  );
});
