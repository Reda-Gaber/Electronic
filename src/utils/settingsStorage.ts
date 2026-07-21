// تخزين إعدادات المتجر محلياً في localStorage — يسمح بحفظ تعديلات الأدmin
// TODO: ربط هذا بالـ API عند توفر الباك إند — استبدال localStorage بطلبات حقيقية (GET/PUT /settings)
import type { StoreSettings } from '@/types'
import { mockStoreSettings } from '@/data/mockData'

const SETTINGS_STORAGE_KEY = 'pc-tech-settings'

/**
 * جلب إعدادات المتجر — تُرجع النسخة المحفوظة من تعديلات الأدمن إن وُجدت،
 * وإلا تُرجع الإعدادات الافتراضية (mockStoreSettings)
 */
export function getSettings(): StoreSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
    return stored ? (JSON.parse(stored) as StoreSettings) : mockStoreSettings
  } catch {
    return mockStoreSettings
  }
}

/** حفظ إعدادات المتجر بعد أي تعديل من لوحة الأدمن */
export function saveSettings(settings: StoreSettings): void {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
}
