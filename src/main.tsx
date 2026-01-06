import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from 'sonner'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/Routes'
import { OfflineIndicator } from './components/OfflineIndicator'

document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#0F1729');

// Register Service Worker for offline functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration.scope);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });

  // Listen for service worker updates
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('Service Worker updated, reloading page...');
    window.location.reload();
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="min-h-screen max-w-7xl mx-auto bg-[#0F1729] text-white">
      <OfflineIndicator />
      <RouterProvider router={router} />
      <Toaster theme="dark" />
    </div>
  </StrictMode>
)