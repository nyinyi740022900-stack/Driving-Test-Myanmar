self.addEventListener('message', event => {
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

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
