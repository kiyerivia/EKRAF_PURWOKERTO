const CACHE_NAME = 'ekraf-purwokerto-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css',
  './css/mobile.css',
  './js/data.js',
  './js/supabase.js',
  './js/app.js',
  './js/cms.js',
  './js/mobile.js',
  './manifest.json',
  './assets/images/ekraf_logo.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/images/mendoan_asli.jpg',
  './assets/images/getuk_goreng_asli.jpg',
  './assets/images/purwokerto_batik.jpg',
  './assets/images/kopi_limpakuwus.jpg',
  './assets/images/kenthongan_ebeg.jpg',
  './assets/images/sandal_bandol.jpg',
  './assets/images/dablongan_kaos.jpg',
  './assets/images/studio_animasi.jpg',
  './assets/images/baturraden_asli.jpg',
  './assets/images/kotalama_banyumas.jpg',
  './assets/images/andhang_pangrenan.jpg',
  './assets/images/purwokerto_hero_bg.jpg',
  './assets/images/purwokerto_festival.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

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
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => {
        // Fallback if offline
        return cachedResponse;
      });
    })
  );
});
