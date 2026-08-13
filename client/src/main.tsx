// نقطة الدخول الرئيسية للتطبيق — تربط React بالـ DOM وتفعّل Router و CartContext
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { CartProvider } from './context/CartContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)

// تسجيل الـ Service Worker — شرط لازم عشان كروم/أندرويد يظهر خيار "تثبيت
// التطبيق"، ومش بيأثر على أي حاجة تانية في الموقع
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* لو فشل التسجيل لأي سبب، الموقع بيفضل شغال عادي من غيره */
    })
  })
}
