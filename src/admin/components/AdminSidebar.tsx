/**
 * AdminSidebar — شريط التنقل الجانبي للوحة الأدمن
 *
 * الوظيفة: روابط التنقل بين صفحات الأدmin + زر الخروج
 * Props: لا يوجد
 * الاستخدام: داخل AdminLayout على الجانب الأيمن (RTL)
 */
import { Link, useLocation } from 'react-router-dom'
import { adminNavLinks } from '@/data/mockData'

export default function AdminSidebar() {
  const location = useLocation()

  return (
    <aside className="flex w-64 shrink-0 flex-col border-l border-outline-variant bg-surface-container-lowest print:hidden">
      {/* شعار لوحة التحكم */}
      <div className="border-b border-outline-variant p-4">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">
            admin_panel_settings
          </span>
          <div>
            <p className="font-display text-sm font-bold text-on-surface">لوحة التحكم</p>
            <p className="text-xs text-on-surface-variant">PC-TECH ARABIA</p>
          </div>
        </Link>
      </div>

      {/* روابط التنقل */}
      <nav className="flex-1 space-y-1 p-3">
        {adminNavLinks.map((link) => {
          const isActive = location.pathname.startsWith(link.path)
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* زر العودة للمتجر */}
      <div className="border-t border-outline-variant p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-xl">storefront</span>
          العودة للمتجر
        </Link>
      </div>
    </aside>
  )
}
