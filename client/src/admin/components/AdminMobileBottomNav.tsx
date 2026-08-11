/**
 * AdminMobileBottomNav — شريط تنقل سفلي لموبايل لوحة التحكم
 *
 * الوظيفة: تنقل سريع بين أقسام الأدمن الخمسة (نفس أسلوب MobileBottomNav
 * بجانب العميل)، يظهر فقط تحت مقاس lg، ويختفي تماماً عند الطباعة
 * Props: لا يوجد — يقرأ روابط الأدمن من adminNavLinks
 * الاستخدام: AdminLayout — بديل السايد بار في الموبايل والتابلت
 */
import { Link, useLocation } from 'react-router-dom'
import { adminNavLinks } from '@/data/mockData'

export default function AdminMobileBottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 z-40 w-full border-t border-outline-variant bg-surface-container-lowest shadow-[0_-4px_20px_rgba(0,0,0,0.06)] print:hidden lg:hidden">
      <div className="flex h-16 items-center justify-around px-1">
        {adminNavLinks.map((link) => {
          // "لوحة التحكم" نشطة فقط في المسار الجذري، وباقي الروابط نشطة لو المسار بيبدأ بيها
          const isActive =
            link.path === '/admin/dashboard'
              ? location.pathname === link.path
              : location.pathname.startsWith(link.path)

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 transition-transform active:scale-90 ${
                isActive ? 'font-bold text-primary' : 'text-on-surface-variant'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: '"FILL" 1' } : undefined}
              >
                {link.icon}
              </span>
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
