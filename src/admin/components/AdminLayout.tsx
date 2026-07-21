/**
 * AdminLayout — الهيكل العام لصفحات لوحة تحكم الأدمن
 *
 * الوظيفة: سايد بار على اليمين + منطقة محتوى — منفصل تماماً عن متجر العملاء
 * Props:
 *   - children: محتوى الصفحة (Outlet)
 * الاستخدام: Layout wrapper لمسارات /admin/* في App.tsx
 */
import { Outlet } from 'react-router-dom'
import AdminSidebar from '@/admin/components/AdminSidebar'

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-surface-container-low print:block print:min-h-0 print:bg-white">
      {/* المحتوى الرئيسي — على اليسار في RTL */}
      <div className="flex flex-1 flex-col print:block">
        {/* شريط علوي: بحث سريع + إشعارات + بروفايل الأدمن — مخفي عند الطباعة */}
        <header className="flex h-16 items-center justify-between gap-4 border-b border-outline-variant bg-surface-container-lowest px-6 print:hidden">
          {/* بحث سريع — placeholder بصري حتى يُربط بمنطق بحث فعلي */}
          <div className="hidden max-w-xs flex-1 items-center gap-2 rounded-xl bg-surface-container-low px-3 py-2 md:flex">
            <span className="material-symbols-outlined text-lg text-on-surface-variant">
              search
            </span>
            <input
              type="text"
              placeholder="بحث في الطلبات والمنتجات..."
              className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* جرس الإشعارات — TODO: ربط هذا بالـ API عند توفر الباك إند */}
            <button
              type="button"
              className="relative rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
              aria-label="الإشعارات"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
            </button>

            {/* بروفايل الأدمن */}
            <div className="flex items-center gap-2 border-r border-outline-variant pr-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                أد
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-on-surface">مدير المتجر</p>
                <p className="text-xs text-on-surface-variant">admin@pc-tech.com</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 print:p-0">
          <Outlet />
        </main>
      </div>
      {/* السايد بار — على اليمين — مخفي عند الطباعة */}
      <AdminSidebar />
    </div>
  )
}
