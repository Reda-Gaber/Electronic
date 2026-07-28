// خدمة API الإعدادات — بديل settingsStorage.ts القديم (localStorage)
import { apiFetch } from '@/lib/apiClient'
import type { StoreSettings } from '@/types'

/** إعدادات المتجر — عام (يستخدمها الفوتر وصفحة الـ Checkout) */
export async function fetchSettings(): Promise<StoreSettings> {
  const res = await apiFetch<{ success: true; data: StoreSettings }>('/settings', {
    withAuth: false,
  })
  return res.data
}

/** تحديث إعدادات المتجر ومناطق الشحن — محمي (أدمن) */
export async function updateSettings(settings: StoreSettings): Promise<StoreSettings> {
  const res = await apiFetch<{ success: true; data: StoreSettings }>('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  })
  return res.data
}
