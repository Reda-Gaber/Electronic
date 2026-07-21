// تخزين التصنيفات محلياً في localStorage — يسمح بحفظ تعديلات الأدمن
// (الأيقونة، الصورة، الظهور كبوكس كبير بالرئيسية) وعكسها فوراً على المتجر
// TODO: ربط هذا بالـ API عند توفر الباك إند — استبدال localStorage بطلبات حقيقية (GET/PUT /categories)
import type { Category } from '@/types'
import { mockCategories } from '@/data/mockData'

const CATEGORIES_STORAGE_KEY = 'pc-tech-categories'

/**
 * جلب كل التصنيفات — تُرجع النسخة المحفوظة من تعديلات الأدمن إن وُجدت،
 * وإلا تُرجع القائمة الافتراضية (mockCategories)
 */
export function getCategories(): Category[] {
  try {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY)
    return stored ? (JSON.parse(stored) as Category[]) : mockCategories
  } catch {
    return mockCategories
  }
}

/** حفظ القائمة الكاملة للتصنيفات بعد أي إضافة/تعديل/حذف من لوحة الأدمن */
export function saveCategories(categories: Category[]): void {
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories))
}

/** جلب تصنيف واحد حسب الـ slug */
export function getCategoryBySlug(slug: string | undefined): Category | undefined {
  if (!slug) return undefined
  return getCategories().find((c) => c.slug === slug)
}

/** التصنيفات المحدَّدة للعرض كبوكسات كبيرة في الصفحة الرئيسية */
export function getFeaturedCategories(): Category[] {
  return getCategories().filter((c) => c.featuredOnHomepage)
}
