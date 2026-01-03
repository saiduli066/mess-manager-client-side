// public/sw.js
self.addEventListener("fetch", (event) => {
  // Skip service worker for API requests
  if (event.request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch((err) => {
      console.error("SW fetch failed:", err);
      // Return a generic offline page response if needed
      return new Response("Network error occurred", {
        status: 408,
        statusText: "Request Timeout",
      });
    })
  );
});
