// صفحة العروض — كل المنتجات المنشورة التي عليها خصم حالياً
import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { fetchProducts } from '@/services/products'
import type { Product } from '@/types'

export default function OffersPage() {
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    fetchProducts()
      .then((products) => {
        if (isMounted) {
          setDiscountedProducts(
            products.filter((p) => p.originalPrice && p.originalPrice > p.price),
          )
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="container-main pb-24 pt-4 md:pb-12 md:pt-6">
      <h1 className="mb-2 font-display text-2xl font-extrabold text-on-surface md:text-3xl">
        العروض والخصومات
      </h1>
      <p className="mb-6 text-sm text-on-surface-variant">
        {discountedProducts.length} منتج عليه خصم حالياً — العروض متجددة باستمرار
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>
        </div>
      ) : discountedProducts.length === 0 ? (
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
