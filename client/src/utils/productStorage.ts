// تخزين المنتجات محلياً في localStorage — يسمح بحفظ إضافة/تعديل/حذف الأدمن
// TODO: ربط هذا بالـ API عند توفر الباك إند — استبدال localStorage بطلبات حقيقية (GET/PUT /products)
import type { Product } from '@/types'
import { mockProducts } from '@/data/mockData'

const PRODUCTS_STORAGE_KEY = 'pc-tech-products'

/**
 * جلب كل المنتجات — تُرجع النسخة المحفوظة من تعديلات الأدمن إن وُجدت،
 * وإلا تُرجع القائمة الافتراضية (mockProducts)
 */
export function getProducts(): Product[] {
  try {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY)
    return stored ? (JSON.parse(stored) as Product[]) : mockProducts
  } catch {
    return mockProducts
  }
}

/** حفظ القائمة الكاملة للمنتجات بعد أي إضافة/تعديل/حذف من لوحة الأدمن */
export function saveProducts(products: Product[]): void {
  localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products))
}

/**
 * جلب المنتجات المنشورة فقط — المسودات لا تظهر في واجهة المتجر
 */
export function getPublishedProducts(): Product[] {
  return getProducts().filter((product) => product.status !== 'draft')
}

/** جلب منتج واحد حسب المعرّف — للأدمن (يشمل المسودات) */
export function getProductById(id: string | undefined): Product | undefined {
  if (!id) return undefined
  return getProducts().find((product) => product.id === id)
}

/** توليد معرّف فريد لمنتج جديد */
export function generateProductId(): string {
  return `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/**
 * توليد slug فريد من اسم المنتج — يُستخدم عند إنشاء منتج جديد
 * يتجنب التكرار بإضافة رقم تسلسلي عند الحاجة
 */
export function generateProductSlug(name: string, existingProducts: Product[]): string {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0600-\u06FF-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  let base = normalized || `product-${Date.now()}`
  let slug = base
  let counter = 1

  while (existingProducts.some((product) => product.slug === slug)) {
    slug = `${base}-${counter}`
    counter += 1
  }

  return slug
}
