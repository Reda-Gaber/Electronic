// صفحة تفاصيل المنتج — /product/:slug
// TODO: ربط هذا بالـ API عند توفر الباك إند — استبدال getProductBySlug بطلب حقيقي
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Breadcrumb from '@/components/category/Breadcrumb'
import ProductCard from '@/components/ProductCard'
import { useCart } from '@/context/CartContext'
import { getProductBySlug, getRelatedProducts } from '@/utils/productHelpers'
import { formatPrice } from '@/utils/helpers'

export default function ProductDetailPage() {
  // قراءة الـ slug من رابط الصفحة لتحديد أي منتج نعرض
  const { slug } = useParams<{ slug: string }>()
  const product = getProductBySlug(slug)
  const { addToCart } = useCart()

  // فهرس الصورة المختارة حالياً في المعرض (thumbnails)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  // الكمية المطلوبة قبل الإضافة للسلة
  const [quantity, setQuantity] = useState(1)
  // التبويب النشط أسفل الصفحة: المواصفات أو الوصف
  const [activeTab, setActiveTab] = useState<'specs' | 'description'>('specs')

  // === حالة: المنتج غير موجود (slug خاطئ أو مُزال) ===
  if (!product) {
    return (
      <div className="container-main flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
        <span className="material-symbols-outlined mb-4 text-5xl text-outline">
          inventory_2
        </span>
        <h1 className="mb-2 font-display text-2xl font-bold">المنتج غير موجود</h1>
        <p className="mb-6 text-on-surface-variant">
          ربما تم حذف هذا المنتج أو الرابط غير صحيح.
        </p>
        <Link
          to="/"
          className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-on-primary hover:bg-primary-container"
        >
          العودة للرئيسية
        </Link>
      </div>
    )
  }

  // حساب نسبة الخصم إذا وُجد سعر أصلي أعلى من السعر الحالي
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null

  // منتجات من نفس التصنيف — تُعرض أسفل الصفحة
  const relatedProducts = getRelatedProducts(product)

  // إضافة المنتج للسلة بالكمية المختارة
  const handleAddToCart = () => {
    if (product.inStock) {
      addToCart(product, quantity)
    }
  }

  // زيادة/إنقاص الكمية مع الالتزام بحد المخزون المتاح
  const incrementQuantity = () =>
    setQuantity((q) => Math.min(q + 1, product.stockCount))
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1))

  return (
    <div className="container-main pb-28 pt-4 md:pb-12 md:pt-6">
      {/* مسار التنقل: الرئيسية > التصنيف > اسم المنتج */}
      <Breadcrumb
        items={[
          { label: 'الرئيسية', path: '/' },
          { label: product.categoryName, path: `/category/${product.categoryId.replace('cat-', '')}` },
          { label: product.name },
        ]}
      />

      {/* === القسم العلوي: المعرض + معلومات الشراء === */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        {/* --- معرض الصور --- */}
        <section className="lg:col-span-6">
          <div className="flex flex-col-reverse gap-4 md:flex-row">
            {/* الصور المصغّرة (thumbnails) — أفقي على الموبايل، عمودي على الديسكتوب */}
            <div className="flex gap-3 overflow-x-auto md:flex-col md:overflow-visible">
              {product.images.map((img, index) => (
                <button
                  key={img + index}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-surface-container-low p-1 transition-colors md:h-20 md:w-20 ${
                    activeImageIndex === index
                      ? 'border-primary'
                      : 'border-outline-variant hover:border-outline'
                  }`}
                  aria-label={`عرض صورة ${index + 1}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} - صورة ${index + 1}`}
                    className="h-full w-full rounded-lg object-contain"
                  />
                </button>
              ))}
            </div>

            {/* الصورة الرئيسية الكبيرة */}
            <div className="relative flex-1 overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-low">
              <img
                src={product.images[activeImageIndex]}
                alt={product.name}
                className="aspect-square w-full object-contain p-6 md:p-10"
              />
              {discountPercent && (
                <span className="absolute top-4 right-4 rounded-full bg-error px-3 py-1 text-sm font-bold text-on-error shadow-lg">
                  خصم {discountPercent}%
                </span>
              )}
              {product.isNew && (
                <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-sm font-bold text-on-primary shadow-lg">
                  جديد
                </span>
              )}
            </div>
          </div>
        </section>

        {/* --- معلومات المنتج وزر الشراء --- */}
        <section className="lg:col-span-6">
          <span className="mb-2 inline-block rounded-lg bg-surface-container-high px-3 py-1 text-xs font-bold text-on-surface-variant">
            {product.brand}
          </span>

          <h1 className="mb-2 font-display text-2xl font-extrabold leading-tight text-on-surface md:text-3xl">
            {product.name}
          </h1>

          {/* التقييم */}
          <div className="mb-4 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`material-symbols-outlined text-lg ${
                    star <= Math.round(product.rating) ? 'text-amber-400' : 'text-outline-variant'
                  }`}
                  style={{ fontVariationSettings: '"FILL" 1' }}
                >
                  star
                </span>
              ))}
            </div>
            <span className="text-sm font-bold text-on-surface">{product.rating}</span>
            <span className="text-sm text-on-surface-variant">
              ({product.reviewCount} تقييم)
            </span>
          </div>

          {/* السعر */}
          <div className="mb-5 flex items-end gap-3 border-y border-outline-variant/60 py-4">
            <span className="font-display text-3xl font-black text-primary md:text-4xl">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="mb-1 text-lg text-outline line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* حالة المخزون */}
          <div className="mb-6 flex items-center gap-2">
            {product.inStock ? (
              <>
                <span className="h-2.5 w-2.5 rounded-full bg-tertiary" />
                <span className="text-sm font-bold text-tertiary">
                  متوفر في المخزون
                  {product.stockCount <= 5 && ` — كمية محدودة (${product.stockCount} فقط)`}
                </span>
              </>
            ) : (
              <>
                <span className="h-2.5 w-2.5 rounded-full bg-on-surface-variant" />
                <span className="text-sm font-bold text-on-surface-variant">غير متوفر حالياً</span>
              </>
            )}
          </div>

          {/* منتقي الكمية + زر الإضافة — مخفي على الموبايل (يظهر بديله في الشريط الثابت أسفل الشاشة) */}
          {product.inStock && (
            <div className="hidden items-center gap-4 md:flex">
              <div className="flex items-center rounded-xl border border-outline-variant">
                <button
                  type="button"
                  onClick={decrementQuantity}
                  className="flex h-12 w-12 items-center justify-center text-on-surface-variant transition-colors hover:bg-surface-container-high disabled:opacity-30"
                  disabled={quantity <= 1}
                  aria-label="إنقاص الكمية"
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <span className="w-10 text-center text-lg font-bold text-on-surface">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={incrementQuantity}
                  className="flex h-12 w-12 items-center justify-center text-on-surface-variant transition-colors hover:bg-surface-container-high disabled:opacity-30"
                  disabled={quantity >= product.stockCount}
                  aria-label="زيادة الكمية"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-bold text-on-primary shadow-[0_8px_20px_rgba(187,0,16,0.25)] transition-all hover:bg-primary-container active:scale-[0.98]"
              >
                <span className="material-symbols-outlined">add_shopping_cart</span>
                أضف للسلة
              </button>
            </div>
          )}

          {!product.inStock && (
            <div className="rounded-xl bg-surface-container-high py-3.5 text-center text-sm font-bold text-on-surface-variant">
              سيتوفر المنتج قريباً
            </div>
          )}

          {/* شارات ثقة صغيرة */}
          <div className="mt-6 flex flex-col gap-3 border-t border-outline-variant/60 pt-6 text-sm text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">local_shipping</span>
              شحن لجميع محافظات مصر، الدفع كاش أو إنستاباي
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">verified</span>
              ضمان أصلي من الوكيل المعتمد
            </div>
          </div>
        </section>
      </div>

      {/* === تبويبات: المواصفات / الوصف === */}
      <div className="mt-12">
        <div className="mb-6 flex gap-6 border-b border-outline-variant">
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`border-b-2 pb-3 text-sm font-bold transition-colors md:text-base ${
              activeTab === 'specs'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            المواصفات التقنية
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('description')}
            className={`border-b-2 pb-3 text-sm font-bold transition-colors md:text-base ${
              activeTab === 'description'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            الوصف والتقييمات
          </button>
        </div>

        {activeTab === 'specs' ? (
          <div className="overflow-hidden rounded-2xl border border-outline-variant">
            <table className="w-full text-sm md:text-base">
              <tbody>
                {product.specs.map((spec, index) => (
                  <tr
                    key={spec.label}
                    className={index % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low'}
                  >
                    <td className="w-1/3 p-4 font-bold text-on-surface-variant">{spec.label}</td>
                    <td className="p-4 font-medium text-on-surface">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-8">
            {/* الوصف */}
            <p className="max-w-3xl leading-relaxed text-on-surface-variant">
              {product.description}
            </p>

            {/* ملخص التقييمات — عرض مبسط بانتظار نظام تقييمات كامل */}
            <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6">
              <div className="mb-4 flex items-center gap-4">
                <span className="font-display text-4xl font-black text-on-surface">
                  {product.rating}
                </span>
                <div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`material-symbols-outlined text-lg ${
                          star <= Math.round(product.rating) ? 'text-amber-400' : 'text-outline-variant'
                        }`}
                        style={{ fontVariationSettings: '"FILL" 1' }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-on-surface-variant">
                    بناءً على {product.reviewCount} تقييم
                  </span>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant">
                {/* TODO: ربط هذا بالـ API عند توفر الباك إند — عرض قائمة تقييمات حقيقية للعملاء */}
                لا توجد تقييمات مفصّلة بعد. كن أول من يقيّم هذا المنتج بعد الشراء.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* === منتجات ذات صلة === */}
      {relatedProducts.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-6 font-display text-xl font-bold text-on-surface md:text-2xl">
            منتجات ذات صلة
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} variant="grid" />
            ))}
          </div>
        </div>
      )}

      {/* === شريط شراء ثابت أسفل الشاشة — للموبايل فقط === */}
      {product.inStock && (
        <div className="fixed bottom-16 left-0 right-0 z-30 flex items-center gap-3 border-t border-outline-variant bg-surface-container-lowest p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:hidden">
          <div className="flex items-center rounded-xl border border-outline-variant">
            <button
              type="button"
              onClick={decrementQuantity}
              className="flex h-11 w-10 items-center justify-center text-on-surface-variant disabled:opacity-30"
              disabled={quantity <= 1}
              aria-label="إنقاص الكمية"
            >
              <span className="material-symbols-outlined text-lg">remove</span>
            </button>
            <span className="w-8 text-center font-bold text-on-surface">{quantity}</span>
            <button
              type="button"
              onClick={incrementQuantity}
              className="flex h-11 w-10 items-center justify-center text-on-surface-variant disabled:opacity-30"
              disabled={quantity >= product.stockCount}
              aria-label="زيادة الكمية"
            >
              <span className="material-symbols-outlined text-lg">add</span>
            </button>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-on-primary shadow-[0_8px_16px_rgba(187,0,16,0.2)] active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
            أضف للسلة — {formatPrice(product.price * quantity)}
          </button>
        </div>
      )}
    </div>
  )
}
