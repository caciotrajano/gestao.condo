// ── Portal Síndico — Service Worker v8 ──────────────────────────────────────
// Estratégia: Network First para HTML/API, Cache First para assets estáticos

const CACHE_NAME   = 'portal-sindico-v8';
const CACHE_STATIC = 'portal-sindico-static-v8';

const STATIC_ASSETS = [
  'https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js',
  'https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js',
];

// ── INSTALL ──────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  console.log('[SW] Instalando v8...');
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache =>
        Promise.allSettled(
          STATIC_ASSETS.map(url =>
            cache.add(url).catch(e => console.warn('[SW] Nao cacheou:', url, e.message))
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  console.log('[SW] Ativando v8...');
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(k => k !== CACHE_NAME && k !== CACHE_STATIC)
            .map(k => { console.log('[SW] Removendo cache antigo:', k); return caches.delete(k); })
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── FETCH ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Supabase → nunca interceptar
  if (url.hostname.includes('supabase.co')) return;

  // index.html / navegacao → Network First
  if (event.request.mode === 'navigate' ||
      url.pathname.endsWith('/') ||
      url.pathname.endsWith('index.html')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // CDN externo → Cache First
  if (url.hostname !== self.location.hostname) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Assets locais → Network First
  event.respondWith(networkFirst(event.request));
});

// ── Network First ─────────────────────────────────────────────────────────────
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      return new Response(
        '<html><body style="font-family:sans-serif;text-align:center;padding:40px">' +
        '<h2>Sem conexao</h2><p>Verifique sua internet e tente novamente.</p>' +
        '<button onclick="location.reload()">Tentar novamente</button></body></html>',
        { headers: { 'Content-Type': 'text/html' } }
      );
    }
    throw e;
  }
}

// ── Cache First (stale-while-revalidate) ─────────────────────────────────────
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    fetch(request)
      .then(r => { if (r && r.status === 200) caches.open(CACHE_STATIC).then(c => c.put(request, r)); })
      .catch(() => {});
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_STATIC);
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) { throw e; }
}

// ── Mensagens ─────────────────────────────────────────────────────────────────
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
