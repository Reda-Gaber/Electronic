/**
 * ProductCard — بطاقة منتج قابلة لإعادة الاستخدام
 *
 * الوظيفة: عرض ملخص المنتج (صورة، سعر، تقييم) مع زر إضافة للسلة
 * Props:
 *   - product: Product — بيانات المنتج الكاملة
 *   - variant: 'grid' | 'deal' | 'category' — شكل العرض
 *   - className: string — classes CSS إضافية (اختياري)
 * الاستخدام: HomePage، CategoryPage، ProductDetail (منتجات مشابهة)
 */
import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/utils/helpers'

interface ProductCardProps {
  product: Product
  variant?: 'grid' | 'deal' | 'category'
  className?: string
  style?: React.CSSProperties
}

export default function ProductCard({
  product,
  variant = 'grid',
  className = '',
  style,
}: ProductCardProps) {
  const { addToCart } = useCart()

  // حساب نسبة الخصم إذا وُجد سعر أصلي
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100,
        )
      : null

  // إضافة للسلة مع منع انتشار الحدث لعدم فتح صفحة المنتج
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (product.inStock) {
      addToCart(product)
    }
  }

  // شارة حالة المخزون — للعرض في variant category
  const stockBadge = !product.inStock
    ? { label: 'غير متوفر', className: 'bg-on-surface/80 text-on-primary' }
    : product.stockCount <= 5
      ? { label: 'كمية محدودة', className: 'bg-error-container text-on-error-container' }
      : { label: 'متوفر', className: 'bg-tertiary/10 text-tertiary' }

  // بطاقة العروض المضغوطة — للتمرير الأفقي في قسم "عروض الساعة"
  if (variant === 'deal') {
    return (
      <div
        className={`group relative flex w-44 shrink-0 flex-col rounded-2xl border border-outline-variant bg-surface-container-lowest p-3 shadow-md transition-transform hover:-translate-y-1 ${className}`}
      >
        <Link to={`/product/${product.slug}`} className="flex flex-1 flex-col">
          {/* منطقة الصورة مع شارة الخصم */}
          <div className="relative mb-3 h-32 overflow-hidden rounded-xl bg-surface-container-low">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            />
            {discountPercent && (
              <span className="absolute top-2 right-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-on-primary">
                -{discountPercent}%
              </span>
            )}
          </div>
          <h4 className="mb-1 line-clamp-1 text-sm font-bold text-on-surface">
            {product.name}
          </h4>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="mr-1 text-xs text-outline line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {product.inStock && (
            <button
              type="button"
              onClick={handleAddToCart}
              className="rounded-lg bg-primary p-1.5 text-on-primary transition-transform active:scale-90 hover:bg-primary-container"
              aria-label={`إضافة ${product.name} للسلة`}
            >
              <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
            </button>
          )}
        </div>
      </div>
    )
  }

  // بطاقة صفحة التصنيف — تصميم أكبر مع زر سلة بارز
  if (variant === 'category') {
    return (
      <article
        className={`group product-card-shadow flex flex-col overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${className}`}
        style={style}
      >
        <Link to={`/product/${product.slug}`} className="relative flex aspect-square items-center justify-center overflow-hidden bg-surface-variant/20 p-6">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
          <span
            className={`absolute top-4 right-4 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${stockBadge.className}`}
          >
            {product.inStock && (
              <span className="h-2 w-2 rounded-full bg-current opacity-80" />
            )}
            {stockBadge.label}
          </span>
          {product.isNew && (
            <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-on-primary shadow-lg">
              جديد
            </span>
          )}
          {product.isFeatured && !product.isNew && (
            <span className="absolute top-4 left-4 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-on-secondary shadow-lg">
              الأكثر مبيعاً
            </span>
          )}
        </Link>

        <div className="flex flex-grow flex-col p-4 md:p-6">
          <span className="mb-2 text-xs text-outline">{product.brand}</span>
          <Link to={`/product/${product.slug}`}>
            <h3 className="mb-3 line-clamp-2 font-display text-base font-bold leading-tight text-on-surface transition-colors hover:text-primary md:text-lg">
              {product.name}
            </h3>
          </Link>

          <div className="mb-4 flex items-center gap-1">
            <span
              className="material-symbols-outlined text-sm text-amber-400"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              star
            </span>
            <span className="text-xs text-on-surface-variant">
              {product.rating} ({product.reviewCount} تقييم)
            </span>
          </div>

          <div className="mt-auto flex items-end justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xl font-black text-primary md:text-2xl">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-outline line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {product.inStock ? (
              <>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 md:flex"
                  aria-label={`إضافة ${product.name} للسلة`}
                >
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-on-primary shadow-[0_8px_16px_rgba(187,0,16,0.2)] transition-all active:scale-[0.98] hover:bg-primary-container md:hidden"
                >
                  <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                  أضف للسلة
                </button>
              </>
            ) : (
              <span className="rounded-xl bg-surface-container-high px-4 py-2 text-xs font-bold text-on-surface-variant">
                غير متوفر
              </span>
            )}
          </div>
        </div>
      </article>
    )
  }

  // البطاقة الافتراضية — شبكة المنتجات (grid)
  return (
    <Link
      to={`/product/${product.slug}`}
      className={`group product-card-shadow flex flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest transition-all hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] ${className}`}
    >
      {/* منطقة الصورة */}
      <div className="relative flex h-40 items-center justify-center bg-surface-container-low p-4 md:h-48">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
        />

        {/* شارات: جديد / خصم / نفاد المخزون */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-on-primary md:px-2 md:text-[10px]">
              جديد
            </span>
          )}
          {discountPercent && (
            <span className="rounded-full bg-error px-1.5 py-0.5 text-[9px] font-bold text-on-error md:px-2 md:text-[10px]">
              خصم {discountPercent}%
            </span>
          )}
        </div>
        {!product.inStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-on-surface/40 text-xs font-bold text-on-primary md:text-sm">
            غير متوفر
          </span>
        )}

        {/* زر إضافة سريع — يظهر عند hover على الديسكتوب */}
        {product.inStock && (
          <button
            type="button"
            onClick={handleAddToCart}
            className="absolute bottom-2 left-2 hidden rounded-lg bg-primary p-2 text-on-primary shadow-lg transition-transform hover:bg-primary-container active:scale-90 md:group-hover:flex"
            aria-label={`إضافة ${product.name} للسلة`}
          >
            <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
          </button>
        )}
      </div>

      {/* معلومات المنتج */}
      <div className="flex flex-1 flex-col p-3 md:p-4">
        {/* التقييم */}
        <div className="mb-1 flex items-center gap-1">
          <span
            className="material-symbols-outlined text-[11px] text-yellow-500 md:text-xs"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            star
          </span>
          <span className="text-[9px] font-bold text-on-surface-variant md:text-xs">
            {product.rating} ({product.reviewCount} تقييم)
          </span>
        </div>

        {/* اسم المنتج */}
        <h4 className="mb-2 line-clamp-2 min-h-[34px] text-xs font-bold leading-snug text-on-surface md:min-h-[40px] md:text-base">
          {product.name}
        </h4>

        {/* الماركة */}
        <span className="mb-2 w-fit rounded-lg bg-surface-container-high px-1.5 py-0.5 text-[9px] text-on-surface-variant md:px-2 md:text-[10px]">
          {product.brand}
        </span>

        {/* السعر وزر الإضافة */}
        <div className="mt-auto flex items-end justify-between">
          <div>
            {product.originalPrice && (
              <span className="block text-[10px] text-outline line-through md:text-xs">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-sm font-bold text-on-surface md:text-lg">
              {formatPrice(product.price)}
            </span>
          </div>
          {product.inStock && (
            <button
              type="button"
              onClick={handleAddToCart}
              className="rounded-lg bg-primary p-1.5 text-on-primary transition-transform active:scale-90 hover:bg-primary-container md:hidden"
              aria-label={`إضافة ${product.name} للسلة`}
            >
              <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}
