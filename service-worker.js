/* =============================================================
   SATORI FAMILY RESTAURANT — service-worker.js
   Cache-first strategy for app shell. Offline-capable.
   ============================================================= */

const CACHE_NAME = 'satori-v3';

const SHELL = [
  './index.html',
  './menu.html',
  './style.css',
  './menu-data.js',
  './app.js',
  './manifest.json',
  './assets/Hero.jpg',
  './assets/satori-team.png',
  './assets/icons/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&display=swap',
];

/* ── Install: pre-cache the app shell ─────────────────────── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

/* ── Activate: remove old caches ─────────────────────────── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* ── Fetch: cache-first, then network ────────────────────── */
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache valid same-origin responses
        if (
          response.ok &&
          (event.request.url.startsWith(self.location.origin) ||
           event.request.url.startsWith('https://fonts.'))
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // If offline and not in cache, return the page or index
        if (event.request.destination === 'document') {
          const url = new URL(event.request.url);
          if (url.pathname.endsWith('menu.html')) {
            return caches.match('./menu.html');
          }
          return caches.match('./index.html');
        }
      });
    })
  );
});
