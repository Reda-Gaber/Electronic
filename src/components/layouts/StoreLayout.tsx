/**
 * StoreLayout — الهيكل العام لصفحات المتجر
 *
 * الوظيفة: يضم Header ثابت + محتوى الصفحة + Footer + CartDrawer
 * Props:
 *   - children: محتوى الصفحة الحالية (Outlet من React Router)
 * الاستخدام: Layout wrapper لكل مسارات المتجر في App.tsx
 */
import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import MobileBottomNav from '@/components/MobileBottomNav'

export default function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      {/* pt-16 لتعويض الهيدر — pb-20 على الموبايل لتعويض الشريط السفلي */}
      <main className="flex-1 pt-16 pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <MobileBottomNav />
    </div>
  )
}
