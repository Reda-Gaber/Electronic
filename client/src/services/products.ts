// خدمة API المنتجات — بديل productStorage.ts القديم (localStorage)
import { apiFetch } from '@/lib/apiClient'
import type { Product, ProductSpec } from '@/types'

/** بناء query string من كائن، بيتجاهل القيم الفارغة/غير المحددة تلقائياً */
function buildQueryString(query: object): string {
  const params = new URLSearchParams()
  Object.entries(query as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    if (Array.isArray(value)) {
      if (value.length > 0) params.set(key, value.join(','))
    } else {
      params.set(key, String(value))
    }
  })
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export interface ProductQuery {
  category?: string
  search?: string
  brands?: string[]
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  isNew?: boolean
  isFeatured?: boolean
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'popular'
  limit?: number
}

/** المنتجات المنشورة فقط — عام، لواجهة المتجر */
export async function fetchProducts(query: ProductQuery = {}): Promise<Product[]> {
  const res = await apiFetch<{ success: true; data: Product[] }>(
    `/products${buildQueryString(query)}`,
    { withAuth: false },
  )
  return res.data
}

/** منتج واحد منشور بالـ slug */
export async function fetchProductBySlug(slug: string): Promise<Product> {
  const res = await apiFetch<{ success: true; data: Product }>(`/products/${slug}`, {
    withAuth: false,
  })
  return res.data
}

export interface AdminProductQuery {
  search?: string
  categoryId?: string
}

/** كل المنتجات (بما فيها المسودات) — محمي (أدمن) */
export async function adminFetchProducts(query: AdminProductQuery = {}): Promise<Product[]> {
  const res = await apiFetch<{ success: true; data: Product[] }>(
    `/admin/products${buildQueryString(query)}`,
  )
  return res.data
}

/** منتج واحد لأي حالة نشر — محمي (أدمن)، لصفحة التعديل */
export async function adminFetchProductById(id: string): Promise<Product> {
  const res = await apiFetch<{ success: true; data: Product }>(`/admin/products/${id}`)
  return res.data
}

export interface ProductInput {
  name: string
  categoryId: string
  brand: string
  price: number
  originalPrice?: number
  description?: string
  images: string[]
  specs: ProductSpec[]
  inStock: boolean
  stockCount: number
  isFeatured: boolean
  isNew: boolean
  status: 'published' | 'draft'
}

/** إنشاء منتج جديد — محمي (أدمن) */
export async function createProduct(input: ProductInput): Promise<Product> {
  const res = await apiFetch<{ success: true; data: Product }>('/admin/products', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return res.data
}

/** تعديل منتج موجود — محمي (أدمن) */
export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  const res = await apiFetch<{ success: true; data: Product }>(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
  return res.data
}

/** حذف منتج — محمي (أدمن) */
export async function deleteProduct(id: string): Promise<void> {
  await apiFetch(`/admin/products/${id}`, { method: 'DELETE' })
}

export interface UploadedImage {
  url: string
  thumbnailUrl: string
}

/**
 * رفع صورة أو أكتر لصور المنتج — بيرجع مسارات الصور بعد معالجتها في السيرفر
 * (تحويل WebP + تصغير + Thumbnail). الصور دي بترفع كملفات حقيقية (multipart)
 * مش Base64 جوه الـ JSON، عشان تتفادى مشاكل حجم الطلب مع صور كتير أو كبيرة
 */
export async function uploadProductImages(files: File[]): Promise<UploadedImage[]> {
  const formData = new FormData()
  files.forEach((file) => formData.append('images', file))

  const res = await apiFetch<{ success: true; data: UploadedImage[] }>(
    '/admin/uploads/product-images',
    {
      method: 'POST',
      body: formData,
    },
  )
  return res.data
}

/** حذف صورة منتج من على السيرفر فعليًا (مش بس من الفورم) — محمي (أدمن) */
export async function deleteProductImage(url: string): Promise<void> {
  await apiFetch('/admin/uploads/product-images', {
    method: 'DELETE',
    body: JSON.stringify({ url }),
  })
}