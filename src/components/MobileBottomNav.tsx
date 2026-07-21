/**
 * MobileBottomNav — شريط تنقل سفلي للموبايل
 *
 * الوظيفة: تنقل سريع بين الرئيسية، الفئات، السلة
 * Props: لا يوجد — يستخدم CartContext لفتح السلة وعرض العداد
 * الاستخدام: StoreLayout — يظهر على الموبايل فقط (md:hidden)
 */
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '@/context/CartContext'

const navItems = [
  { label: 'الرئيسية', path: '/', icon: 'home' },
  { label: 'الفئات', path: '/category/graphics-cards', icon: 'category' },
  { label: 'السلة', path: '#cart', icon: 'shopping_cart', isCart: true },
]

export default function MobileBottomNav() {
  const location = useLocation()
  const { itemCount, openCart } = useCart()

  return (
    <nav className="fixed bottom-0 z-40 w-full rounded-t-xl border-t border-outline-variant bg-surface/90 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] backdrop-blur-md md:hidden">
      <div className="flex h-16 items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive =
            item.path !== '#cart' &&
            (item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path))

          // زر السلة — يفتح الدرج بدلاً من التنقل
          if (item.isCart) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={openCart}
                className="relative flex flex-col items-center justify-center text-on-surface-variant transition-transform active:scale-90"
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-[10px] font-medium">{item.label}</span>
                {itemCount > 0 && (
                  <span className="absolute -top-1 right-1/2 flex h-4 w-4 translate-x-3 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-on-primary">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>
            )
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${
                isActive
                  ? 'font-bold text-primary'
                  : 'text-on-surface-variant'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive ? { fontVariationSettings: '"FILL" 1' } : undefined}
              >
                {item.icon}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
