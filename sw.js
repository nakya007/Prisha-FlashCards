const CACHE = 'gsp-v2';
const ASSETS = [
  '/11-Plus-Exam-Flash-Cards/',
  '/11-Plus-Exam-Flash-Cards/index.html',
  '/11-Plus-Exam-Flash-Cards/Maths_Flashcards.html',
  '/11-Plus-Exam-Flash-Cards/English_Flashcards.html',
  '/11-Plus-Exam-Flash-Cards/icon-192.png',
  '/11-Plus-Exam-Flash-Cards/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first: always try to get the latest from GitHub Pages.
// Falls back to cache only if offline.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res && res.status === 200 && res.type !== 'opaque') {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
      }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
