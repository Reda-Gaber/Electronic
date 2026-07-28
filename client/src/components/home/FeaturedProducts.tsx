/**
 * FeaturedProducts — شبكة المنتجات المميزة / وصل حديثاً
 *
 * الوظيفة: عرض شبكة ProductCard للمنتجات المميزة أو الجديدة
 * Props:
 *   - title: string — عنوان القسم
 *   - viewAllLink: string — رابط "تصفح الكل"
 *   - filter: 'featured' | 'new' | 'all' — نوع الفلترة
 * الاستخدام: HomePage — أقسام "وصل حديثاً" و"الأكثر مبيعاً"
 */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '@/components/ProductCard'
import { fetchProducts } from '@/services/products'
import type { Product } from '@/types'

interface FeaturedProductsProps {
  title: string
  viewAllLink: string
  filter?: 'featured' | 'new' | 'all'
  /** حد أقصى لعدد المنتجات المعروضة — مفيد لتجنب تكرار طويل في الصفحة الرئيسية */
  limit?: number
}

export default function FeaturedProducts({
  title,
  viewAllLink,
  filter = 'all',
  limit,
}: FeaturedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    let isMounted = true
    fetchProducts({
      isNew: filter === 'new' ? true : undefined,
      isFeatured: filter === 'featured' ? true : undefined,
      limit,
    })
      .then((data) => {
        if (isMounted) setProducts(data)
      })
      .catch(() => {
        if (isMounted) setProducts([])
      })
    return () => {
      isMounted = false
    }
  }, [filter, limit])

  if (products.length === 0) return null

  return (
    <section className="mb-10">
      {/* عنوان القسم */}
      <div className="mb-6 flex items-end justify-between">
        <h3 className="font-display text-xl font-bold text-on-surface md:text-2xl">
          {title}
        </h3>
      </div>

      {/* شبكة المنتجات — عمودين على الموبايل، 3-4 على الديسكتوب */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} variant="grid" />
        ))}
      </div>

      {/* زر عرض المزيد */}
      <div className="mt-8 flex justify-center">
        <Link
          to={viewAllLink}
          className="rounded-full border-2 border-outline-variant bg-surface-container-lowest px-10 py-3 text-sm font-bold text-on-surface transition-all hover:border-primary hover:text-primary active:scale-95"
        >
          عرض المزيد
        </Link>
      </div>
    </section>
  )
}
