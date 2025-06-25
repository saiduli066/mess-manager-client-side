// // public/sw.js
// self.addEventListener("fetch", (event) => {
//   event.respondWith(fetch(event.request));
// });

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch((err) => {
      // You can return a fallback response here (optional)
      console.error("SW fetch failed:", err);
      return new Response("Network error occurred", {
        status: 408,
        statusText: "Request Timeout",
      });
    })
  );
});
