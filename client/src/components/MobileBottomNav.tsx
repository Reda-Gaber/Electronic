/**
 * MobileBottomNav — شريط تنقل سفلي للموبايل
 *
 * الوظيفة: تنقل سريع بين الرئيسية، الفئات، العروض، الدفع/تتبع الطلب، والسلة
 * الاستخدام: StoreLayout — يظهر على الموبايل فقط (md:hidden)
 */
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { getLastOrderId } from '@/utils/lastOrder'

export default function MobileBottomNav() {
  const location = useLocation()
  const { itemCount, openCart } = useCart()
  const lastOrderId = getLastOrderId()

  // منطق زر "الدفع": في السلة → إتمام الشراء، مفيش بالسلة بس عنده طلب سابق →
  // متابعة الطلب (تفاصيله مباشرة)، مفيش سلة ولا طلب سابق → تتبع الطلب (بحث يدوي)
  const checkoutOrTrackPath =
    itemCount > 0
      ? '/checkout'
      : lastOrderId
        ? `/order-confirmation/${lastOrderId}`
        : '/track-order'
  const checkoutOrTrackLabel = itemCount > 0 ? 'الدفع' : lastOrderId ? 'متابعة الطلب' : 'تتبع الطلب'
  const checkoutOrTrackIcon = itemCount > 0 ? 'payments' : 'local_shipping'
  const isCheckoutOrTrackActive =
    location.pathname === '/checkout' ||
    location.pathname === '/track-order' ||
    (lastOrderId !== null && location.pathname === `/order-confirmation/${lastOrderId}`)

  const isHomeActive = location.pathname === '/'
  const isOffersActive = location.pathname === '/offers'

  return (
    <nav className="fixed bottom-0 z-40 w-full rounded-t-xl border-t border-outline-variant bg-surface/90 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] backdrop-blur-md md:hidden">
      <div className="flex h-16 items-center justify-around px-1">
        {/* الرئيسية */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${
            isHomeActive ? 'font-bold text-primary' : 'text-on-surface-variant'
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={isHomeActive ? { fontVariationSettings: '"FILL" 1' } : undefined}
          >
            home
          </span>
          <span className="text-[10px] font-medium">الرئيسية</span>
        </Link>

        {/* الفئات — صفحة حقيقية بقت ليها رابط خاص بيها (بدل نافذة منبثقة) */}
        <Link
          to="/categories"
          className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${
            location.pathname === '/categories' ? 'font-bold text-primary' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined">category</span>
          <span className="text-[10px] font-medium">الفئات</span>
        </Link>

        {/* العروض */}
        <Link
          to="/offers"
          className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${
            isOffersActive ? 'font-bold text-primary' : 'text-on-surface-variant'
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={isOffersActive ? { fontVariationSettings: '"FILL" 1' } : undefined}
          >
            local_offer
          </span>
          <span className="text-[10px] font-medium">العروض</span>
        </Link>

        {/* الدفع أو تتبع الطلب — حسب وجود منتجات بالسلة */}
        <Link
          to={checkoutOrTrackPath}
          className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${
            isCheckoutOrTrackActive ? 'font-bold text-primary' : 'text-on-surface-variant'
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={isCheckoutOrTrackActive ? { fontVariationSettings: '"FILL" 1' } : undefined}
          >
            {checkoutOrTrackIcon}
          </span>
          <span className="text-[10px] font-medium">{checkoutOrTrackLabel}</span>
        </Link>

        {/* السلة — تفتح الدرج بدلاً من التنقل */}
        <button
          type="button"
          onClick={openCart}
          className="relative flex flex-col items-center justify-center text-on-surface-variant transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined">shopping_cart</span>
          <span className="text-[10px] font-medium">السلة</span>
          {itemCount > 0 && (
            <span className="absolute -top-1 right-1/2 flex h-4 w-4 translate-x-3 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-on-primary">
              {itemCount > 9 ? '9+' : itemCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  )
}
