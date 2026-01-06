
const CACHE_NAME = 'gamehub-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://esm.sh/react@^19.2.3',
  'https://esm.sh/react-dom@^19.2.3/'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached asset or fetch from network
      return response || fetch(event.request).then((fetchRes) => {
        // Optionally cache new unique assets here
        return fetchRes;
      });
    }).catch(() => {
      // If offline and request fails
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
