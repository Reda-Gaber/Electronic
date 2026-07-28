/**
 * apiClient — دالة موحّدة لكل طلبات الـ API بتاعة الباك اند
 *
 * الوظيفة: تبني الرابط الكامل، وترفق توكن الأدمن تلقائياً لو موجود، وتتعامل
 * مع الأخطاء بشكل موحّد (بترمي Error برسالة عربية واضحة من رد السيرفر نفسه)
 * الاستخدام: أي استدعاء API في المشروع (Auth، وبعدين المنتجات/الطلبات/الإعدادات)
 */
// في الإنتاج (بعد الدمج مع الباك اند في تطبيق واحد) الفرونت والـ API على نفس
// الدومين، فمسار نسبي "/api" يشتغل عادي. وقت التطوير المحلي لو شغّلت الفرونت
// والباك اند منفصلين على بورتين مختلفين، حط VITE_API_URL في .env بتاع الفرونت
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
const TOKEN_STORAGE_KEY = 'admin_token'

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

interface ApiFetchOptions extends RequestInit {
  /** إرسال توكن الأدمن مع الطلب — true افتراضياً لمسارات الأدمن */
  withAuth?: boolean
}

/** خطأ مخصص بيحمل رسالة السيرفر العربية + الكود، عشان الواجهة تعرضه زي ما هو */
export class ApiClientError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { withAuth = true, headers, ...rest } = options

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  }

  if (withAuth) {
    const token = getStoredToken()
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  })

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    const message = body?.message || 'حصل خطأ غير متوقع، حاول تاني'
    throw new ApiClientError(response.status, message)
  }

  return body as T
}
