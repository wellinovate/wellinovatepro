// Wellinovate Clinical Continuity Offline Service Worker
const CACHE_NAME = 'wellinovate-offline-v10';

const CORE_ASSETS = [
  './',
  './index.html',
  './about.html',
  './solutions.html',
  './team.html',
  './process.html',
  './privacy.html',
  './terms.html',
  './styles/main.css',
  './simulator.js',
  './manifest.webmanifest',
  './favicon.ico',
  './assets/favicon-16x16.png',
  './assets/favicon-32x32.png',
  './assets/apple-touch-icon.png',
  './assets/wellinovate-logo-mark.png',
  './assets/wellinovate-logo.png',
  './assets/wellirecord-how-it-works.jpg',
  './assets/wellirecord-device.jpg',
  './assets/team-office.jpg',
  './assets/chibuike-nwogha.jpg',
  './assets/david-okafor.jpg',
  './assets/chidiebere-nwokeocha-cmo.jpg'
];

// Install: Cache all core platform assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn('[Wellinovate SW] Non-fatal pre-cache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Purge obsolete cache generations
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-first for HTML pages with offline fallback; Cache-first for static media
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Ignore non-GET or cross-origin requests
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) {
    return;
  }

  // Navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          return caches.match('./index.html');
        })
    );
    return;
  }

  // Static assets: Cache-first with network fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Revalidate in background
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      });
    })
  );
});
