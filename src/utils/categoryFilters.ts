// دوال فلترة وترتيب منتجات صفحة التصنيف
// TODO: ربط هذا بالـ API عند توفر الباك إند — إرسال معاملات الفلترة للسيرفر
import type { Product } from '@/types'
import { getPublishedProducts } from '@/utils/productStorage'
import { getCategories } from '@/utils/categoryStorage'

/** خيارات الترتيب المتاحة */
export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular'

/** حالة الفلاتر في صفحة التصنيف */
export interface CategoryFilterState {
  brands: string[]
  priceMin: number
  priceMax: number
  inStockOnly: boolean
  sort: SortOption
}

/** تسميات الترتيب بالعربي — للعرض في القائمة */
export const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'price-asc', label: 'السعر: من الأقل للأعلى' },
  { value: 'price-desc', label: 'السعر: من الأعلى للأقل' },
  { value: 'popular', label: 'الأكثر شعبية' },
]

/** جلب تصنيف حسب الـ slug */
export function getCategoryBySlug(slug: string | undefined) {
  if (!slug) return undefined
  return getCategories().find((c) => c.slug === slug)
}

/** جلب منتجات تصنيف معيّن حسب الـ slug */
export function getProductsByCategorySlug(slug: string | undefined): Product[] {
  if (!slug) return []
  const category = getCategoryBySlug(slug)
  if (!category) return []
  // TODO: ربط هذا بالـ API — GET /categories/:slug/products
  return getPublishedProducts().filter((p) => p.categoryId === category.id)
}

/** استخراج الماركات الفريدة من قائمة منتجات */
export function getAvailableBrands(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.brand))].sort()
}

/** حساب نطاق السعر الأدنى والأعلى من المنتجات */
export function getPriceRange(products: Product[]): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 100000 }
  const prices = products.map((p) => p.price)
  return { min: Math.min(...prices), max: Math.max(...prices) }
}

/** إنشاء حالة فلاتر افتراضية بناءً على منتجات التصنيف */
export function createDefaultFilters(products: Product[]): CategoryFilterState {
  const { min, max } = getPriceRange(products)
  return {
    brands: [],
    priceMin: min,
    priceMax: max,
    inStockOnly: false,
    sort: 'newest',
  }
}

/** تطبيق الفلاتر والترتيب على قائمة المنتجات */
export function filterAndSortProducts(
  products: Product[],
  filters: CategoryFilterState,
): Product[] {
  let result = [...products]

  // فلتر الماركة — إذا وُجدت ماركات محددة
  if (filters.brands.length > 0) {
    result = result.filter((p) => filters.brands.includes(p.brand))
  }

  // فلتر نطاق السعر
  result = result.filter(
    (p) => p.price >= filters.priceMin && p.price <= filters.priceMax,
  )

  // فلتر التوفر
  if (filters.inStockOnly) {
    result = result.filter((p) => p.inStock)
  }

  // الترتيب
  switch (filters.sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'popular':
      result.sort((a, b) => b.reviewCount - a.reviewCount)
      break
    case 'newest':
    default:
      result.sort((a, b) => Number(b.isNew) - Number(a.isNew))
      break
  }

  return result
}

/** عدد الفلاتر النشطة — لعرض badge على زر التصفية */
export function countActiveFilters(
  filters: CategoryFilterState,
  defaults: CategoryFilterState,
): number {
  let count = 0
  if (filters.brands.length > 0) count++
  if (filters.priceMin > defaults.priceMin || filters.priceMax < defaults.priceMax) count++
  if (filters.inStockOnly) count++
  return count
}
