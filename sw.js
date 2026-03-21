// Portal do Síndico Profissional — Service Worker v10.2
// v10: F3-04 — estratégia definitiva Network First + auto-reload

const CACHE_NAME = 'portal-sindico-v10.11';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './template_importacao_condominio.xlsx',
];

// ── Install ────────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  console.log('[SW v10.1] Install');
  // skipWaiting: ativa imediatamente, não espera aba fechar
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// ── Activate ───────────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  console.log('[SW v10.1] Activate — limpando caches antigos');
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => { console.log('[SW v10.1] Removendo:', k); return caches.delete(k); })
      ))
      .then(() => {
        console.log('[SW v10.1] Assumindo controle de todas as abas');
        return self.clients.claim(); // assume controle imediato de todas as abas abertas
      })
      .then(() => {
        // Notifica todas as abas para recarregar com a versão nova
        return self.clients.matchAll({ type: 'window' }).then(clients => {
          clients.forEach(client => client.postMessage({ type: 'SW_UPDATED' }));
        });
      })
  );
});

// ── Fetch ──────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Ignora requests não-GET e de outras origens
  if (event.request.method !== 'GET') return;
  if (!url.origin.includes('caciotrajano.github.io') && 
      !url.origin.includes('localhost')) return;

  // Network First para index.html, privacidade.html, termos.html
  // Garante que o usuário sempre recebe a versão mais recente
  if (
    url.pathname.endsWith('/') ||
    url.pathname.endsWith('index.html') ||
    url.pathname.endsWith('privacidade.html') ||
    url.pathname.endsWith('termos.html')
  ) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          console.log('[SW v10.1] Offline — servindo cache para:', url.pathname);
          return caches.match(event.request);
        })
    );
    return;
  }

  // Cache First para sw.js e manifest.json (mudam raramente)
  if (url.pathname.endsWith('sw.js') || url.pathname.endsWith('manifest.json')) {
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
    return;
  }

  // Stale-While-Revalidate para demais assets (xlsx, imagens, etc.)
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cached => {
        const fetchPromise = fetch(event.request).then(response => {
          if (response && response.status === 200) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
        return cached || fetchPromise;
      })
    )
  );
});

// ── Mensagens ──────────────────────────────────────────────────────────────────
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW v10.1] SKIP_WAITING recebido');
    self.skipWaiting();
  }
});
