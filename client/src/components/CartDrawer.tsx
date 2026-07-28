/**
 * CartDrawer — درج السلة الجانبي الكامل
 *
 * الوظيفة: عرض محتويات السلة مع التحكم في الكمية وحذف المنتجات
 * Props: لا يوجد — يقرأ من CartContext مباشرة
 * الاستخدام: داخل StoreLayout — يظهر من اليسار عند فتح السلة (RTL)
 */
import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/utils/helpers'

export default function CartDrawer() {
  const { items, total, isCartOpen, closeCart, itemCount, updateQuantity, removeFromCart } =
    useCart()

  // لا نعرض شيئاً إذا الدرج مغلق — يوفر إعادة رندر غير ضرورية
  if (!isCartOpen) return null

  return (
    <>
      {/* طبقة التعتيم خلف الدرج — الضغط عليها يغلق السلة */}
      <div
        className="fixed inset-0 z-[60] bg-on-surface/40 backdrop-blur-sm"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* الدرج الجانبي — ينزلق من اليسار لأن الاتجاه RTL */}
      <aside className="fixed left-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-surface-container-lowest shadow-2xl">
        {/* رأس الدرج */}
        <div className="flex items-center justify-between border-b border-outline-variant p-4">
          <h2 className="font-display text-xl font-bold text-on-surface">
            سلة التسوق ({itemCount})
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-full p-2 transition-colors hover:bg-surface-container-high"
            aria-label="إغلاق السلة"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* محتوى السلة */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            // حالة السلة الفارغة
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <span className="material-symbols-outlined mb-4 text-6xl text-outline">
                shopping_cart
              </span>
              <p className="mb-4 font-bold text-on-surface">سلتك فارغة حالياً</p>
              <p className="mb-6 text-sm text-on-surface-variant">
                أضف منتجاتك المفضلة وابدأ التسوق الآن
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-on-primary hover:bg-primary-container"
              >
                تصفح المنتجات
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.product.id}
                  className="flex gap-3 rounded-xl bg-surface-container-low p-3"
                >
                  <Link
                    to={`/product/${item.product.slug}`}
                    onClick={closeCart}
                    className="shrink-0"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-16 w-16 rounded-lg bg-surface-container-lowest object-contain p-1"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${item.product.slug}`}
                        onClick={closeCart}
                        className="line-clamp-2 text-sm font-bold text-on-surface hover:text-primary"
                      >
                        {item.product.name}
                      </Link>
                      {/* زر حذف المنتج من السلة */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="shrink-0 rounded-full p-1 text-outline transition-colors hover:bg-error-container hover:text-on-error-container"
                        aria-label={`حذف ${item.product.name} من السلة`}
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* منتقي الكمية */}
                      <div className="flex items-center rounded-lg border border-outline-variant">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center text-on-surface-variant hover:bg-surface-container-high"
                          aria-label="إنقاص الكمية"
                        >
                          <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-on-surface">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30"
                          disabled={item.quantity >= item.product.stockCount}
                          aria-label="زيادة الكمية"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>

                      <span className="text-sm font-bold text-primary">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* تذييل الدرج — الإجمالي وزر إتمام الشراء */}
        {items.length > 0 && (
          <div className="border-t border-outline-variant p-4">
            <div className="mb-4 flex justify-between text-lg font-bold">
              <span className="text-on-surface">الإجمالي</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={closeCart}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-center font-bold text-on-primary shadow-[0_8px_20px_rgba(187,0,16,0.2)] transition-colors hover:bg-primary-container"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              إتمام الشراء
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
