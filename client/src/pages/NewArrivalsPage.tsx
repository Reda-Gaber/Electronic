// صفحة المضاف حديثاً — كل المنتجات المنشورة المعلَّمة كجديدة
import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { fetchProducts } from '@/services/products'
import type { Product } from '@/types'

export default function NewArrivalsPage() {
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    fetchProducts({ isNew: true })
      .then((data) => {
        if (isMounted) setNewProducts(data)
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
        المضاف حديثاً
      </h1>
      <p className="mb-6 text-sm text-on-surface-variant">
        {newProducts.length} منتج وصل حديثاً لمتجرنا
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>
        </div>
      ) : newProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="material-symbols-outlined mb-4 text-5xl text-outline">
            new_releases
          </span>
          <p className="font-bold text-on-surface">لا توجد منتجات جديدة حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant="grid" />
          ))}
        </div>
      )}
    </div>
  )
}
