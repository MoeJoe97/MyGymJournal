importScripts('./sw-cache-policy.js');

const CACHE_NAME = 'mygymjournal-shell-v3';
const SHELL = ['/', '/index.html', '/privacy.html', '/imprint.html', '/terms.html', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/icon-maskable-512.png', '/icons/apple-touch-icon.png'];

async function cacheShellResponse(path) {
  try {
    const request = new Request(new URL(path, self.location.origin), { method: 'GET', cache: 'reload' });
    const response = await fetch(request);
    if (!self.MyGymJournalCachePolicy.isCacheableResponse(request, response, self.location.origin)) return;

    const cachedResponse = response.clone();
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, cachedResponse);
  } catch {
    // A missing shell resource, especially the manifest behind preview protection, must not fail installation.
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all(SHELL.map(cacheShellResponse)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (self.MyGymJournalCachePolicy.isCacheableResponse(request, response, self.location.origin)) {
        const cachedResponse = response.clone();
        const cacheWrite = caches.open(CACHE_NAME)
          .then((cache) => cache.put(request, cachedResponse))
          .catch(() => undefined);
        try {
          event.waitUntil(cacheWrite);
        } catch {
          await cacheWrite;
        }
      }
      return response;
    } catch {
      try {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === 'navigate') {
          const appShell = await caches.match('/index.html') || await caches.match('/');
          if (appShell) return appShell;
        }
      } catch {
        return Response.error();
      }
      return Response.error();
    }
  })());
});
