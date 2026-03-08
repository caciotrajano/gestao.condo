// ── Portal Síndico Profissional — Service Worker ──────────────────────────────
const CACHE_NAME = 'portal-sindico-v1';
const BASE = '/gestao.condo';

// Arquivos essenciais que ficam em cache (funcionam offline)
const STATIC_ASSETS = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/manifest.json',
  BASE + '/icon-192.png',
  BASE + '/icon-512.png',
  BASE + '/apple-touch-icon.png',
  // CDNs críticos
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://cdn.tailwindcss.com',
];

// ── Install: pré-cacheia assets estáticos ─────────────────────────────────────
self.addEventListener('install', event => {
  console.log('[SW] Instalando Portal Síndico PWA...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Tenta cachear cada asset individualmente (não falha tudo se um não carregar)
        return Promise.allSettled(
          STATIC_ASSETS.map(url =>
            cache.add(url).catch(e => console.warn('[SW] Não cacheou:', url, e.message))
          )
        );
      })
      .then(() => {
        console.log('[SW] Instalação concluída');
        return self.skipWaiting();
      })
  );
});

// ── Activate: limpa caches antigos ────────────────────────────────────────────
self.addEventListener('activate', event => {
  console.log('[SW] Ativando...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Removendo cache antigo:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: estratégia Network First para dados, Cache First para assets ────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Supabase — sempre vai para a rede (dados em tempo real)
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => new Response(
          JSON.stringify({ error: 'Sem conexão. Verifique sua internet.' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        ))
    );
    return;
  }

  // Assets estáticos — Cache First (mais rápido)
  if (
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.json')
  ) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // HTML principal — Network First com fallback para cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          // Fallback: retorna o index.html cacheado
          return caches.match(BASE + '/index.html');
        });
      })
  );
});

// ── Mensagens do app ──────────────────────────────────────────────────────────
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
