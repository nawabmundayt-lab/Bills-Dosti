/*
 * BillSplit Dost — service worker.
 *
 * NOTE: @serwist/next generates this file at build time when Next.js builds
 * with webpack. Next 15.5's default Turbopack build doesn't run Serwist's
 * plugin yet (serwist#54), so this static fallback ships in `public/` and
 * guarantees PWA installability + offline caching regardless of bundler.
 * It is overwritten by Serwist's generated worker on webpack builds.
 */
const CACHE = "billsplit-dost-v1";
const PRECACHE = [
  "/",
  "/en",
  "/ur",
  "/hi",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-512.png",
];

/* Install: precache shell */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

/* Activate: clean old caches, take control immediately */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

/* Fetch: network-first for navigations (fresh hisaab!), cache-first for assets */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() =>
          caches.match(request).then(
            (cached) =>
              cached ||
              caches.match("/").then((root) => root || Response.error())
          )
        )
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          if (res.ok && new URL(request.url).origin === self.location.origin) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
    )
  );
});

/* Update-available: notify clients so they can show the refresh banner */
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
