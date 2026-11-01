// Resenha - service worker: permite instalar o app e mostra o aviso de mensagem (Web Push).
// Não guarda nada em cache. O texto da mensagem nunca passa pelo push: a frase é fixa.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});

self.addEventListener('push', (e) => {
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (wins.some((c) => c.visibilityState === 'visible' && c.focused)) return; // app aberto na frente
    await self.registration.showNotification('Resenha', {
      body: 'Você recebeu uma mensagem',
      tag: 'chat-aviso',
      renotify: true,
      vibrate: [200, 100, 200],
      icon: 'icon-192.png',
      badge: 'icon-192.png'
    });
  })());
});

// Ao tocar na notificação, volta para o app
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ('focus' in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});
