const CACHE_NAME = 'vision-padel-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icono.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Devuelve la versión en caché si existe, si no, hace la petición a la red
        return response || fetch(event.request);
      })
  );
});