import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from 'sonner'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/Routes'

document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#0F1729');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="min-h-screen max-w-7xl mx-auto bg-[#0F1729] text-white">
      <RouterProvider router={router} />
      <Toaster theme="dark" />
    </div>
  </StrictMode>
)