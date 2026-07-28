// خدمة API التصنيفات — بديل categoryStorage.ts القديم (localStorage)
import { apiFetch } from '@/lib/apiClient'
import type { Category } from '@/types'

/** كل التصنيفات — عام، لواجهة المتجر */
export async function fetchCategories(): Promise<Category[]> {
  const res = await apiFetch<{ success: true; data: Category[] }>('/categories', {
    withAuth: false,
  })
  return res.data
}

/** تصنيف واحد بالـ slug */
export async function fetchCategoryBySlug(slug: string): Promise<Category> {
  const res = await apiFetch<{ success: true; data: Category }>(`/categories/${slug}`, {
    withAuth: false,
  })
  return res.data
}

export interface CategoryInput {
  name: string
  description?: string
  image?: string
  icon?: string
  isCustomIcon?: boolean
  featuredOnHomepage?: boolean
}

/** إنشاء تصنيف جديد — محمي (أدمن) */
export async function createCategory(input: CategoryInput): Promise<Category> {
  const res = await apiFetch<{ success: true; data: Category }>('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return res.data
}

/** تعديل تصنيف موجود — محمي (أدمن) */
export async function updateCategory(id: string, input: CategoryInput): Promise<Category> {
  const res = await apiFetch<{ success: true; data: Category }>(`/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
  return res.data
}

/** حذف تصنيف — محمي (أدمن) */
export async function deleteCategory(id: string): Promise<void> {
  await apiFetch(`/admin/categories/${id}`, { method: 'DELETE' })
}
