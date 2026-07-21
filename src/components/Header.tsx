/**
 * Header — شريط التنقل العلوي الثابت للمتجر
 *
 * الوظيفة: عرض الشعار، روابط التنقل، أيقونات البحث والسلة والقائمة
 * Props: لا يوجد — يقرأ عدد السلة من CartContext
 * الاستخدام: داخل StoreLayout في أعلى كل صفحة متجر
 */
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { mainNavLinks } from '@/data/mockData'
import SearchOverlay from '@/components/SearchOverlay'

export default function Header() {
  const { itemCount, openCart } = useCart()
  const location = useLocation()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="glass-header fixed top-0 z-50 flex h-16 w-full items-center justify-between px-4 md:px-10">
      {/* الشعار — يربط بالصفحة الرئيسية */}
      <Link to="/" className="flex shrink-0 items-center">
        <img src="/logo.jpg" alt="PC-TECH ARABIA" className="h-11 w-auto object-contain md:h-12" />
      </Link>

      {/* روابط التنقل — تظهر على الشاشات المتوسطة فما فوق */}
      <nav className="hidden items-center gap-1 lg:flex">
        {mainNavLinks.map((link) => {
          const isActive = location.pathname === link.path
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-on-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* أزرار الإجراءات — بحث، سلة، قائمة */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="rounded-full p-2 transition-colors hover:bg-surface-container-high active:scale-95"
          aria-label="بحث"
        >
          <span className="material-symbols-outlined text-primary">search</span>
        </button>

        {/* زر السلة — يفتح الدرج الجانبي ويعرض عدد القطع */}
        <button
          type="button"
          onClick={openCart}
          className="relative rounded-full p-2 transition-colors hover:bg-surface-container-high active:scale-95"
          aria-label="سلة التسوق"
        >
          <span className="material-symbols-outlined text-primary">shopping_cart</span>
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
              {itemCount > 9 ? '9+' : itemCount}
            </span>
          )}
        </button>

        {/* رابط لوحة الأدmin — للوصول السريع */}
        <Link
          to="/admin/login"
          className="hidden rounded-full p-2 transition-colors hover:bg-surface-container-high sm:flex"
          aria-label="لوحة التحكم"
        >
          <span className="material-symbols-outlined text-on-surface-variant">admin_panel_settings</span>
        </Link>
      </div>

      {/* نافذة البحث المنبثقة */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  )
}
