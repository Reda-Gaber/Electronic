/**
 * adminAuth — كل منطق تسجيل دخول/خروج الأدمن في مكان واحد
 *
 * الوظيفة: تسجيل الدخول (يحفظ التوكن)، تسجيل الخروج (يمسحه)، التحقق من
 * صلاحية الجلسة الحالية عن طريق سؤال السيرفر فعلياً (مش بس وجود التوكن محلياً)
 * الاستخدام: AdminLoginPage (تسجيل الدخول)، ProtectedAdminRoute (حماية المسارات)،
 * AdminLayout/AdminSidebar (عرض بيانات الأدمن الحالي + زر الخروج)
 */
import { apiFetch, setStoredToken, clearStoredToken, getStoredToken } from '@/lib/apiClient'

export interface AdminUser {
  id: number
  name: string
  email: string
}

const ADMIN_STORAGE_KEY = 'admin_user'

/** تسجيل الدخول — يحفظ التوكن وبيانات الأدمن محلياً عند النجاح */
export async function loginAdmin(email: string, password: string): Promise<AdminUser> {
  const res = await apiFetch<{ success: true; data: { token: string; admin: AdminUser } }>(
    '/auth/login',
    {
      method: 'POST',
      withAuth: false,
      body: JSON.stringify({ email, password }),
    },
  )
  setStoredToken(res.data.token)
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(res.data.admin))
  return res.data.admin
}

/** تسجيل الخروج — مسح كل بيانات الجلسة المحلية */
export function logoutAdmin(): void {
  clearStoredToken()
  localStorage.removeItem(ADMIN_STORAGE_KEY)
}

/** بيانات الأدمن المحفوظة محلياً (للعرض السريع بدون انتظار السيرفر) */
export function getStoredAdmin(): AdminUser | null {
  const raw = localStorage.getItem(ADMIN_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AdminUser
  } catch {
    return null
  }
}

/**
 * التحقق الفعلي من صحة الجلسة عن طريق سؤال السيرفر (مش بس التأكد من وجود
 * توكن محلي، لأنه ممكن يكون منتهي أو الحساب اتحذف). تُستخدم في حماية المسارات.
 */
export async function verifySession(): Promise<AdminUser | null> {
  if (!getStoredToken()) return null

  try {
    const res = await apiFetch<{ success: true; data: { admin: AdminUser } }>('/auth/me')
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(res.data.admin))
    return res.data.admin
  } catch {
    // التوكن غلط أو منتهي — نمسح كل حاجة محفوظة محلياً
    logoutAdmin()
    return null
  }
}
