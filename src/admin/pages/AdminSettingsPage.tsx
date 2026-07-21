// إعدادات المتجر — بيانات المتجر، طريقة الدفع (إنستاباي)، مناطق الشحن
// TODO: ربط هذا بالـ API عند توفر الباك إند — استبدال settingsStorage بطلب حقيقي (PUT /settings)
import { useState } from 'react'
import { getSettings, saveSettings } from '@/utils/settingsStorage'
import type { ShippingZone } from '@/types'

export default function AdminSettingsPage() {
  const initialSettings = getSettings()

  // --- بيانات المتجر ---
  const [storeName, setStoreName] = useState(initialSettings.storeName)
  const [storePhone, setStorePhone] = useState(initialSettings.storePhone)
  const [storeMessage, setStoreMessage] = useState<string | null>(null)

  // --- طريقة الدفع ---
  const [instapayNumber, setInstapayNumber] = useState(initialSettings.instapayNumber)
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null)

  // --- مناطق الشحن ---
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>(
    initialSettings.shippingZones,
  )
  const [shippingMessage, setShippingMessage] = useState<string | null>(null)

  // عرض رسالة تأكيد مؤقتة لثلاث ثوانٍ
  const flashMessage = (setter: (msg: string | null) => void, message: string) => {
    setter(message)
    setTimeout(() => setter(null), 3000)
  }

  /** حفظ بيانات المتجر (الاسم والهاتف) في localStorage */
  const handleSaveStoreInfo = () => {
    const current = getSettings()
    saveSettings({
      ...current,
      storeName: storeName.trim(),
      storePhone: storePhone.trim(),
    })
    flashMessage(setStoreMessage, 'تم حفظ بيانات المتجر بنجاح')
  }

  /** حفظ رقم إنستاباي في localStorage */
  const handleSavePaymentSettings = () => {
    const current = getSettings()
    saveSettings({
      ...current,
      instapayNumber: instapayNumber.trim(),
    })
    flashMessage(setPaymentMessage, 'تم حفظ إعدادات الدفع بنجاح')
  }

  /** حفظ مناطق الشحن في localStorage */
  const handleSaveShippingSettings = () => {
    const current = getSettings()
    saveSettings({
      ...current,
      shippingZones,
    })
    flashMessage(setShippingMessage, 'تم حفظ مناطق الشحن بنجاح')
  }

  // --- إدارة مناطق الشحن ---
  const updateZone = (id: string, field: keyof ShippingZone, value: string | number) => {
    setShippingZones((prev) =>
      prev.map((zone) => (zone.id === id ? { ...zone, [field]: value } : zone)),
    )
  }

  const addZone = () => {
    setShippingZones((prev) => [
      ...prev,
      { id: `zone-${Date.now()}`, name: '', fee: 0, estimatedDays: '' },
    ])
  }

  const removeZone = (id: string) => {
    setShippingZones((prev) => prev.filter((zone) => zone.id !== id))
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-extrabold text-on-surface">الإعدادات</h1>

      <div className="space-y-6">
        {/* === بيانات المتجر === */}
        <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 md:p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-on-surface">
            <span className="material-symbols-outlined text-primary">storefront</span>
            بيانات المتجر
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                اسم المتجر
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                رقم هاتف التواصل
              </label>
              <input
                type="tel"
                dir="ltr"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-left text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* شعار المتجر — عرض فقط حالياً بانتظار رفع ملفات حقيقي */}
          <div className="mt-4">
            <span className="mb-1.5 block text-sm font-bold text-on-surface-variant">
              شعار المتجر
            </span>
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-4">
              <span className="material-symbols-outlined text-2xl text-on-surface-variant">
                upload
              </span>
              <p className="text-xs text-on-surface-variant">
                {/* TODO: ربط هذا بالـ API عند توفر الباك إند — تفعيل رفع شعار فعلي */}
                رفع شعار جديد غير مفعّل بعد — المتجر يستخدم شعاراً موحّداً حالياً (مكون Logo)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveStoreInfo}
            className="mt-5 flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-all hover:bg-primary-container active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">save</span>
            حفظ بيانات المتجر
          </button>
          {storeMessage && (
            <p className="mt-3 rounded-lg bg-surface-container-high px-3 py-2 text-xs font-bold text-on-surface-variant">
              {storeMessage}
            </p>
          )}
        </section>

        {/* === طرق الدفع === */}
        <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 md:p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-on-surface">
            <span className="material-symbols-outlined text-primary">payments</span>
            طرق الدفع
          </h2>

          <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
            رقم إنستاباي المعروض للعملاء عند الدفع
          </label>
          <input
            type="text"
            dir="ltr"
            value={instapayNumber}
            onChange={(e) => setInstapayNumber(e.target.value)}
            className="w-full max-w-xs rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-left text-sm outline-none focus:border-primary"
          />
          <p className="mt-2 text-xs text-on-surface-variant">
            هذا الرقم يظهر للعميل في صفحة إتمام الشراء عند اختيار "إنستاباي" كطريقة دفع
          </p>

          <button
            type="button"
            onClick={handleSavePaymentSettings}
            className="mt-5 flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-all hover:bg-primary-container active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">save</span>
            حفظ إعدادات الدفع
          </button>
          {paymentMessage && (
            <p className="mt-3 rounded-lg bg-surface-container-high px-3 py-2 text-xs font-bold text-on-surface-variant">
              {paymentMessage}
            </p>
          )}
        </section>

        {/* === مناطق الشحن === */}
        <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 md:p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-on-surface">
            <span className="material-symbols-outlined text-primary">local_shipping</span>
            مناطق الشحن
          </h2>

          <div className="space-y-3">
            {shippingZones.map((zone) => (
              <div
                key={zone.id}
                className="flex flex-col gap-2 rounded-xl bg-surface-container-low p-3 md:flex-row md:items-center"
              >
                <input
                  type="text"
                  value={zone.name}
                  onChange={(e) => updateZone(zone.id, 'name', e.target.value)}
                  placeholder="اسم المنطقة"
                  className="flex-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={zone.fee}
                    onChange={(e) => updateZone(zone.id, 'fee', Number(e.target.value))}
                    placeholder="رسوم الشحن"
                    className="w-28 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <span className="text-xs text-on-surface-variant">ج.م</span>
                </div>
                <input
                  type="text"
                  value={zone.estimatedDays}
                  onChange={(e) => updateZone(zone.id, 'estimatedDays', e.target.value)}
                  placeholder="مدة التوصيل"
                  className="w-32 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => removeZone(zone.id)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center self-end rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container md:self-auto"
                  aria-label="حذف المنطقة"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addZone}
            className="mt-3 flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-container"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            إضافة منطقة شحن
          </button>

          <div>
            <button
              type="button"
              onClick={handleSaveShippingSettings}
              className="mt-5 flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-all hover:bg-primary-container active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">save</span>
              حفظ مناطق الشحن
            </button>
            {shippingMessage && (
              <p className="mt-3 rounded-lg bg-surface-container-high px-3 py-2 text-xs font-bold text-on-surface-variant">
                {shippingMessage}
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
