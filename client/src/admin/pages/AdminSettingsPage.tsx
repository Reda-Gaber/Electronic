// إعدادات المتجر — بيانات المتجر وطريقة الدفع (إنستاباي)
// ملحوظة: مفيش إدارة "مناطق شحن" هنا — رسوم الشحن بقت بتتحدد لكل طلب لوحده
// من صفحة تفاصيل الطلب في الأدمن، بعد ما شركة الشحن تأكد التكلفة الفعلية
import { useEffect, useState } from 'react'
import { fetchSettings, updateSettings } from '@/services/settings'
import { ApiClientError } from '@/lib/apiClient'

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)

  // --- بيانات المتجر ---
  const [storeName, setStoreName] = useState('')
  const [storePhone, setStorePhone] = useState('')
  const [storeMessage, setStoreMessage] = useState<string | null>(null)

  // --- طريقة الدفع ---
  const [instapayNumber, setInstapayNumber] = useState('')
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
      .then((settings) => {
        setStoreName(settings.storeName)
        setStorePhone(settings.storePhone)
        setInstapayNumber(settings.instapayNumber)
      })
      .finally(() => setIsLoading(false))
  }, [])

  // عرض رسالة تأكيد مؤقتة لثلاث ثوانٍ
  const flashMessage = (setter: (msg: string | null) => void, message: string) => {
    setter(message)
    setTimeout(() => setter(null), 3000)
  }

  /** حفظ بيانات المتجر (الاسم والهاتف) */
  const handleSaveStoreInfo = async () => {
    try {
      await updateSettings({
        storeName: storeName.trim(),
        storePhone: storePhone.trim(),
        instapayNumber,
      })
      flashMessage(setStoreMessage, 'تم حفظ بيانات المتجر بنجاح')
    } catch (err) {
      flashMessage(
        setStoreMessage,
        err instanceof ApiClientError ? err.message : 'تعذر الحفظ، حاول تاني',
      )
    }
  }

  /** حفظ رقم إنستاباي */
  const handleSavePaymentSettings = async () => {
    try {
      await updateSettings({
        storeName,
        storePhone,
        instapayNumber: instapayNumber.trim(),
      })
      flashMessage(setPaymentMessage, 'تم حفظ إعدادات الدفع بنجاح')
    } catch (err) {
      flashMessage(
        setPaymentMessage,
        err instanceof ApiClientError ? err.message : 'تعذر الحفظ، حاول تاني',
      )
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
      </div>
    )
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

        {/* === معلومة عن رسوم الشحن === */}
        <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 md:p-6">
          <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-bold text-on-surface">
            <span className="material-symbols-outlined text-primary">local_shipping</span>
            رسوم الشحن
          </h2>
          <p className="text-sm text-on-surface-variant">
            رسوم الشحن مش بتتحدد من هنا — بيتم تحديدها لكل طلب على حدة من داخل صفحة
            "تفاصيل الطلب" بعد ما شركة الشحن تأكد التكلفة الفعلية حسب منطقة العميل.
          </p>
        </section>
      </div>
    </div>
  )
}
