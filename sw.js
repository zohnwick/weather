const CACHE_NAME = 'witty-weather-v3';
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './quotes.js',
  './app.js',
  './icon.png'
];

const API_CACHE_NAME = 'witty-weather-api-v1';
const API_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in ms

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names
          .filter(name => name !== CACHE_NAME && name !== API_CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API requests — network-first with timed cache fallback
  if (url.hostname.includes('open-meteo.com')) {
    event.respondWith(handleApiRequest(event.request));
    return;
  }

  // Static assets — cache-first
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});

async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Clone and store with a timestamp header
      const responseToCache = networkResponse.clone();
      const headers = new Headers(responseToCache.headers);
      headers.set('x-cached-at', Date.now().toString());

      const body = await responseToCache.blob();
      const timestampedResponse = new Response(body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers,
      });
      cache.put(request, timestampedResponse);
    }
    return networkResponse;
  } catch (networkError) {
    // Network failed — try cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      const cachedAt = parseInt(cachedResponse.headers.get('x-cached-at') || '0', 10);
      const age = Date.now() - cachedAt;
      if (age < API_CACHE_DURATION) {
        return cachedResponse;
      }
    }
    // Nothing usable — propagate the error
    throw networkError;
  }
}
