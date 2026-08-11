/**
 * AdminSidebar — شريط التنقل الجانبي للوحة الأدمن
 *
 * الوظيفة: روابط التنقل بين صفحات الأدمن + رابط العودة للمتجر + تسجيل الخروج
 * Props: لا يوجد
 * الاستخدام: داخل AdminLayout على الجانب الأيمن (RTL)
 */
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { adminNavLinks } from '@/data/mockData'
import { logoutAdmin } from '@/admin/utils/adminAuth'

export default function AdminSidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutAdmin()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-l border-outline-variant bg-surface-container-lowest print:hidden lg:flex">
      {/* شعار لوحة التحكم */}
      <div className="border-b border-outline-variant p-4">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">
            admin_panel_settings
          </span>
          <div>
            <p className="font-display text-sm font-bold text-on-surface">لوحة التحكم</p>
            <p className="text-xs text-on-surface-variant">عبدالنبي للإلكترونيات</p>
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

      {/* زر العودة للمتجر + تسجيل الخروج */}
      <div className="space-y-1 border-t border-outline-variant p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-xl">storefront</span>
          العودة للمتجر
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-on-surface-variant transition-colors hover:bg-error-container hover:text-error"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          تسجيل الخروج
        </button>
      </div>
    </aside>
  )
}
