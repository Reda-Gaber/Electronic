/**
 * AdminLayout — الهيكل العام لصفحات لوحة تحكم الأدمن
 *
 * الوظيفة: سايد بار على اليمين + منطقة محتوى — منفصل تماماً عن متجر العملاء
 * Props:
 *   - children: محتوى الصفحة (Outlet)
 * الاستخدام: Layout wrapper لمسارات /admin/* في App.tsx
 */
import { Outlet, useNavigate } from 'react-router-dom'
import AdminSidebar from '@/admin/components/AdminSidebar'
import AdminMobileBottomNav from '@/admin/components/AdminMobileBottomNav'
import { getStoredAdmin, logoutAdmin } from '@/admin/utils/adminAuth'

export default function AdminLayout() {
  const navigate = useNavigate()
  const admin = getStoredAdmin()

  const handleLogout = () => {
    logoutAdmin()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-surface-container-low print:block print:min-h-0 print:bg-white">
      {/* المحتوى الرئيسي — على اليسار في RTL */}
      <div className="flex flex-1 flex-col print:block">
        {/* === هيدر الديسكتوب: بيانات الأدمن أقصى اليمين + بحث في المنتصف — من lg فما فوق فقط === */}
        <header className="hidden h-16 items-center border-b border-outline-variant bg-surface-container-lowest px-6 print:hidden lg:flex">
          {/* بيانات الأدمن الحالي — أقصى اليمين */}
          <div className="flex flex-1 items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
              {admin?.name ? admin.name.slice(0, 2) : 'أد'}
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface">
                {admin?.name || 'مدير المتجر'}
              </p>
              <p className="text-xs text-on-surface-variant">{admin?.email}</p>
            </div>
          </div>

          {/* بحث سريع — في المنتصف تمامًا — placeholder بصري حتى يُربط بمنطق بحث فعلي */}
          <div className="flex flex-1 justify-center">
            <div className="flex w-full max-w-xs items-center gap-2 rounded-xl bg-surface-container-low px-3 py-2">
              <span className="material-symbols-outlined text-lg text-on-surface-variant">
                search
              </span>
              <input
                type="text"
                placeholder="بحث في الطلبات والمنتجات..."
                className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
              />
            </div>
          </div>

          {/* عمود موازن فارغ لضمان توسيط صندوق البحث فعليًا */}
          <div className="flex-1" />
        </header>

        {/* === هيدر الموبايل/التابلت: مبسّط — شعار + إشعارات + خروج فقط — تحت lg === */}
        <header className="flex h-14 items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-4 print:hidden lg:hidden">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">
              admin_panel_settings
            </span>
            <span className="font-display text-sm font-bold text-on-surface">
              لوحة التحكم
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="relative rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high"
              aria-label="الإشعارات"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-error-container hover:text-error"
              aria-label="تسجيل الخروج"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
            </button>
          </div>
        </header>

        {/* المحتوى — padding أصغر بالموبايل، ومساحة سفلية لتفادي تغطية شريط التنقل السفلي */}
        <main className="flex-1 p-4 pb-24 print:p-0 lg:p-6 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* السايد بار — ديسكتوب فقط — مخفي عند الطباعة */}
      <AdminSidebar />

      {/* شريط التنقل السفلي — موبايل وتابلت فقط */}
      <AdminMobileBottomNav />
    </div>
  )
}
