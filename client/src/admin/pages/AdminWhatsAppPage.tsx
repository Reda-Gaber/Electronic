// إعدادات واتساب — تحكم كامل في صيغة الرسالة اللي بتتبعت للعميل عند الطلب
import { useEffect, useState } from 'react'
import { fetchSettings, updateSettings } from '@/services/settings'
import { ApiClientError } from '@/lib/apiClient'
import {
  DEFAULT_WHATSAPP_TEMPLATE,
  WHATSAPP_TEMPLATE_PLACEHOLDERS,
  buildOrderWhatsAppMessage,
} from '@/utils/whatsapp'
import type { Order, StoreSettings } from '@/types'

/** طلب وهمي بس لعرض معاينة حية لشكل الرسالة أثناء التعديل على القالب */
const SAMPLE_ORDER: Order = {
  id: 'sample',
  referenceNumber: 'ORD-SAMPLE-001',
  customerName: 'أحمد محمد',
  phone: '01012345678',
  address: {
    governorate: 'القاهرة',
    city: 'مدينة نصر',
    district: 'الحي السابع',
    street: 'شارع مصطفى النحاس',
    buildingNumber: '15',
    floor: '3',
    apartment: '12',
  },
  paymentMethod: 'cash',
  items: [
    {
      product: {
        id: 'sample-1',
        name: 'NVIDIA GeForce RTX 4090',
        slug: 'sample',
        categoryId: '',
        categoryName: '',
        brand: 'NVIDIA',
        price: 65000,
        image: '',
        images: [],
        description: '',
        specs: [],
        inStock: true,
        stockCount: 5,
        rating: 5,
        reviewCount: 10,
      },
      quantity: 1,
    },
  ],
  subtotal: 65000,
  shippingFee: null,
  total: 65000,
  status: 'pending',
  createdAt: new Date().toISOString(),
}

const FALLBACK_SETTINGS: StoreSettings = {
  storeName: 'عبدالنبي بي سي تيك',
  storePhone: '',
  instapayNumber: '',
  whatsappMessageTemplate: null,
}

export default function AdminWhatsAppPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<StoreSettings>(FALLBACK_SETTINGS)
  const [template, setTemplate] = useState(DEFAULT_WHATSAPP_TEMPLATE)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
      .then((data) => {
        setSettings(data)
        setTemplate(data.whatsappMessageTemplate || DEFAULT_WHATSAPP_TEMPLATE)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const flashMessage = (message: string) => {
    setSaveMessage(message)
    setTimeout(() => setSaveMessage(null), 3000)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateSettings({
        storeName: settings.storeName,
        storePhone: settings.storePhone,
        instapayNumber: settings.instapayNumber,
        whatsappMessageTemplate: template.trim(),
      })
      flashMessage('تم حفظ صيغة الرسالة بنجاح')
    } catch (err) {
      flashMessage(err instanceof ApiClientError ? err.message : 'تعذر الحفظ، حاول تاني')
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetToDefault = () => {
    setTemplate(DEFAULT_WHATSAPP_TEMPLATE)
  }

  const insertPlaceholder = (token: string) => {
    setTemplate((prev) => `${prev}${prev.endsWith('\n') || prev === '' ? '' : ' '}${token}`)
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
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold text-on-surface">واتساب</h1>
        <p className="text-sm text-on-surface-variant">
          تحكّم في صيغة رسالة الواتساب اللي بتتجهّز تلقائيًا لكل عميل من صفحات الطلبات
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* === محرّر القالب === */}
        <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold text-on-surface">
              <span className="material-symbols-outlined text-primary">edit_note</span>
              صيغة الرسالة
            </h2>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-xs font-bold text-on-surface-variant hover:text-primary"
            >
              استعادة الافتراضي
            </button>
          </div>

          <textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            rows={16}
            dir="rtl"
            className="w-full resize-none rounded-xl border border-outline-variant bg-surface-container-lowest p-3 font-mono text-sm leading-relaxed outline-none focus:border-primary"
          />

          {/* قائمة المتغيّرات المتاحة — دوس عليها تتضاف في آخر النص */}
          <div className="mt-4">
            <p className="mb-2 text-sm font-bold text-on-surface-variant">
              المتغيّرات المتاحة (دوس على أي واحد يتضاف للرسالة):
            </p>
            <div className="flex flex-wrap gap-2">
              {WHATSAPP_TEMPLATE_PLACEHOLDERS.map((p) => (
                <button
                  key={p.token}
                  type="button"
                  onClick={() => insertPlaceholder(p.token)}
                  title={p.label}
                  dir="ltr"
                  className="rounded-lg bg-surface-container-high px-2.5 py-1.5 font-mono text-xs font-bold text-primary hover:bg-surface-container-highest"
                >
                  {p.token}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="mt-5 flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-all hover:bg-primary-container active:scale-95 disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-lg">save</span>
            {isSaving ? 'جاري الحفظ...' : 'حفظ الصيغة'}
          </button>
          {saveMessage && (
            <p className="mt-3 rounded-lg bg-surface-container-high px-3 py-2 text-xs font-bold text-on-surface-variant">
              {saveMessage}
            </p>
          )}
        </section>

        {/* === معاينة حيّة === */}
        <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5">
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-on-surface">
            <span className="material-symbols-outlined text-[#25D366]">chat</span>
            معاينة حية
          </h2>
          <p className="mb-3 text-xs text-on-surface-variant">
            شكل الرسالة ببيانات طلب تجريبي — بتتحدّث أول ما تعدّل في النص جنبها
          </p>
          <div className="whitespace-pre-wrap rounded-xl bg-[#e5ddd5] p-4 font-sans text-sm leading-relaxed text-on-surface shadow-inner">
            <div className="rounded-lg bg-white p-3 shadow">
              {buildOrderWhatsAppMessage(SAMPLE_ORDER, template)}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}