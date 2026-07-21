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
import { Link } from 'react-router-dom'
import ProductCard from '@/components/ProductCard'
import { getPublishedProducts } from '@/utils/productStorage'
import type { Product } from '@/types'

interface FeaturedProductsProps {
  title: string
  viewAllLink: string
  filter?: 'featured' | 'new' | 'all'
  /** حد أقصى لعدد المنتجات المعروضة — مفيد لتجنب تكرار طويل في الصفحة الرئيسية */
  limit?: number
}

/** فلترة المنتجات حسب النوع المطلوب */
function filterProducts(products: Product[], filter: FeaturedProductsProps['filter']): Product[] {
  switch (filter) {
    case 'featured':
      return products.filter((p) => p.isFeatured)
    case 'new':
      return products.filter((p) => p.isNew)
    default:
      return products
  }
}

export default function FeaturedProducts({
  title,
  viewAllLink,
  filter = 'all',
  limit,
}: FeaturedProductsProps) {
  // TODO: ربط هذا بالـ API عند توفر الباك إند — جلب المنتجات المميزة من endpoint
  const products = filterProducts(getPublishedProducts(), filter).slice(0, limit)

  return (
    <section className="mb-10">
      {/* عنوان القسم */}
      <div className="mb-6 flex items-end justify-between">
        <h3 className="font-display text-xl font-bold text-on-surface md:text-2xl">
          {title}
        </h3>
        <Link
          to={viewAllLink}
          className="text-sm font-bold text-primary transition-colors hover:text-primary-container"
        >
          تصفح الكل
        </Link>
      </div>

      {/* شبكة المنتجات — عمودين على الموبايل، 3-4 على الديسكتوب */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} variant="grid" />
        ))}
      </div>
    </section>
  )
}
