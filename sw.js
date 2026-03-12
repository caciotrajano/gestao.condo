// Portal do Síndico Profissional — Service Worker v9
// v9: force cache refresh Fase 2
const CACHE_NAME = 'portal-sindico-v9';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
];

// Install — abre o novo cache
self.addEventListener('install', event => {
  console.log('[SW v9] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting(); // ativa imediatamente sem esperar aba fechar
});

// Activate — limpa caches antigos
self.addEventListener('activate', event => {
  console.log('[SW v9] Activate — limpando caches antigos');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => {
          console.log('[SW v9] Deletando cache antigo:', k);
          return caches.delete(k);
        })
      )
    ).then(() => self.clients.claim()) // assume controle de todas as abas
  );
});

// Fetch — Network First para index.html, Cache First para o resto
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Sempre busca index.html na rede (garante versão mais recente)
  if (url.pathname.endsWith('/') || url.pathname.endsWith('index.html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache First para demais assets estáticos
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
