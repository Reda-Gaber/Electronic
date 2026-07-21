// صفحة العروض — كل المنتجات المنشورة التي عليها خصم حالياً
import ProductCard from '@/components/ProductCard'
import { getPublishedProducts } from '@/utils/productStorage'

export default function OffersPage() {
  const discountedProducts = getPublishedProducts().filter(
    (p) => p.originalPrice && p.originalPrice > p.price,
  )

  return (
    <div className="container-main pb-24 pt-4 md:pb-12 md:pt-6">
      <h1 className="mb-2 font-display text-2xl font-extrabold text-on-surface md:text-3xl">
        العروض والخصومات
      </h1>
      <p className="mb-6 text-sm text-on-surface-variant">
        {discountedProducts.length} منتج عليه خصم حالياً — العروض متجددة باستمرار
      </p>

      {discountedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="material-symbols-outlined mb-4 text-5xl text-outline">
            local_offer
          </span>
          <p className="font-bold text-on-surface">لا توجد عروض حالياً</p>
          <p className="text-sm text-on-surface-variant">تابعنا قريباً لعروض جديدة</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {discountedProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant="grid" />
          ))}
        </div>
      )}
    </div>
  )
}
