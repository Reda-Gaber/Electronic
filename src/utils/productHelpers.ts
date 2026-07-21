// دوال مساعدة للوصول إلى بيانات منتج واحد ومنتجات ذات صلة
// TODO: ربط هذا بالـ API عند توفر الباك إند — GET /products/:slug و GET /products/:id/related
import type { Product } from '@/types'
import { getPublishedProducts } from '@/utils/productStorage'

/**
 * جلب منتج واحد حسب الـ slug — تُستخدم في صفحة تفاصيل المنتج
 * ترجع undefined إذا لم يوجد المنتج (لعرض حالة "غير موجود")
 * تقرأ من productStorage — تتجاهل المسودات
 */
export function getProductBySlug(slug: string | undefined): Product | undefined {
  if (!slug) return undefined
  return getPublishedProducts().find((product) => product.slug === slug)
}

/**
 * جلب منتجات ذات صلة (نفس التصنيف) لعرضها أسفل صفحة تفاصيل المنتج
 * تستبعد المنتج الحالي نفسه، وتحدد العدد بـ limit (افتراضياً 4)
 */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return getPublishedProducts()
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, limit)
}

/**
 * البحث عن منتجات مطابقة لنص معين — بالاسم أو الماركة أو اسم التصنيف
 * تُستخدم في شريط البحث بالهيدر وصفحة نتائج البحث
 * TODO: ربط هذا بالـ API عند توفر الباك إند — استبدال البحث المحلي بطلب بحث حقيقي للسيرفر
 */
export function searchProducts(query: string): Product[] {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return []

  return getPublishedProducts().filter(
    (product) =>
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.brand.toLowerCase().includes(normalizedQuery) ||
      product.categoryName.toLowerCase().includes(normalizedQuery),
  )
}
