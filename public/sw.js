// Service Worker for UnMess PWA
const CACHE_NAME = "unmess-v7";

// Minimal static assets to cache
const STATIC_ASSETS = ["/", "/index.html", "/manifest.json", "/offline.html"];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((err) => {
        console.log("Service Worker: Cache failed", err);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Don't intercept API requests - let them fail naturally
  if (request.url.includes("/api/")) {
    return;
  }

  // 1. Navigation Requests (HTML)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => {
        // If offline, try to serve the App Shell (index.html) first
        return caches.match("/index.html").then((response) => {
          if (response) return response;
          // If index.html is missing, fall back to offline.html
          return caches.match("/offline.html");
        });
      })
    );
    return;
  }

  // 2. Asset Requests (JS, CSS, Images, Fonts)
  // Stale-While-Revalidate Strategy
  // This ensures assets are updated in background but served instantly
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image" ||
    request.destination === "font" ||
    request.url.includes("assets/") || // Vite assets folder
    request.url.includes("/icons/")
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // Return cached response if available
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            // Update cache with new version
            if (
              networkResponse &&
              networkResponse.status === 200 &&
              networkResponse.type === "basic"
            ) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Network failed, nothing to do (we hopefully returned cache)
          });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }
});
