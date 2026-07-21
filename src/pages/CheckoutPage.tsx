// صفحة إتمام الشراء — نموذج بيانات العميل والعنوان وطريقة الدفع
// TODO: ربط هذا بالـ API عند توفر الباك إند — إرسال الطلب لسيرفر بدل الحفظ محلياً
import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { getSettings } from '@/utils/settingsStorage'
import { saveOrder } from '@/utils/orderStorage'
import { copyToClipboard, formatPrice, generateOrderReference } from '@/utils/helpers'
import type { PaymentMethod } from '@/types'

/** شكل بيانات نموذج الـ Checkout — حقول العميل والعنوان */
interface CheckoutFormState {
  customerName: string
  phone: string
  zoneId: string
  city: string
  district: string
  street: string
  buildingNumber: string
  floor: string
  apartment: string
  paymentMethod: PaymentMethod
  notes: string
}

/** القيم الافتراضية الفارغة للنموذج */
const initialFormState: CheckoutFormState = {
  customerName: '',
  phone: '',
  zoneId: '',
  city: '',
  district: '',
  street: '',
  buildingNumber: '',
  floor: '',
  apartment: '',
  paymentMethod: 'cash',
  notes: '',
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState<CheckoutFormState>(initialFormState)
  // رسائل الخطأ لكل حقل — تظهر فقط بعد محاولة إرسال أولى
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormState, string>>>({})
  const [copied, setCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const settings = getSettings()

  // منطقة الشحن المختارة — تحدد رسوم التوصيل
  const selectedZone = useMemo(
    () => settings.shippingZones.find((z) => z.id === form.zoneId),
    [form.zoneId, settings.shippingZones],
  )
  const shippingFee = selectedZone?.fee ?? 0
  const grandTotal = total + shippingFee

  // تحديث أي حقل نصي في النموذج
  const updateField = (field: keyof CheckoutFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    // إزالة رسالة الخطأ فور بدء التعديل في الحقل
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // نسخ رقم إنستاباي للحافظة مع تأكيد بصري مؤقت
  const handleCopyInstapay = async () => {
    const success = await copyToClipboard(settings.instapayNumber)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // التحقق من صحة كل الحقول قبل الإرسال — يرجع كائن الأخطاء
  const validateForm = (): Partial<Record<keyof CheckoutFormState, string>> => {
    const newErrors: Partial<Record<keyof CheckoutFormState, string>> = {}
    if (!form.customerName.trim()) newErrors.customerName = 'الاسم مطلوب'
    if (!/^01[0125][0-9]{8}$/.test(form.phone.trim())) {
      newErrors.phone = 'رقم هاتف مصري غير صحيح (مثال: 01012345678)'
    }
    if (!form.zoneId) newErrors.zoneId = 'اختر المحافظة/المنطقة'
    if (!form.city.trim()) newErrors.city = 'المدينة مطلوبة'
    if (!form.district.trim()) newErrors.district = 'الحي/المنطقة مطلوب'
    if (!form.street.trim()) newErrors.street = 'الشارع مطلوب'
    if (!form.buildingNumber.trim()) newErrors.buildingNumber = 'رقم العمارة مطلوب'
    if (!form.floor.trim()) newErrors.floor = 'الدور مطلوب'
    if (!form.apartment.trim()) newErrors.apartment = 'رقم الشقة مطلوب'
    return newErrors
  }

  // إرسال الطلب — تحقق، إنشاء الطلب، حفظه، تفريغ السلة، الانتقال لصفحة التأكيد
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      // التمرير لأعلى النموذج ليرى العميل رسائل الخطأ
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setIsSubmitting(true)

    const orderId = crypto.randomUUID()
    const order = {
      id: orderId,
      referenceNumber: generateOrderReference(),
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      address: {
        governorate: selectedZone?.name ?? '',
        city: form.city.trim(),
        district: form.district.trim(),
        street: form.street.trim(),
        buildingNumber: form.buildingNumber.trim(),
        floor: form.floor.trim(),
        apartment: form.apartment.trim(),
      },
      paymentMethod: form.paymentMethod,
      items,
      subtotal: total,
      shippingFee,
      total: grandTotal,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      notes: form.notes.trim() || undefined,
    }

    saveOrder(order)
    clearCart()
    navigate(`/order-confirmation/${orderId}`)
  }

  // === حالة: السلة فارغة — لا يوجد ما يُشترى ===
  if (items.length === 0) {
    return (
      <div className="container-main flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
        <span className="material-symbols-outlined mb-4 text-5xl text-outline">
          remove_shopping_cart
        </span>
        <h1 className="mb-2 font-display text-2xl font-bold">سلتك فارغة</h1>
        <p className="mb-6 text-on-surface-variant">
          أضف بعض المنتجات أولاً قبل إتمام الشراء.
        </p>
        <Link
          to="/"
          className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-on-primary hover:bg-primary-container"
        >
          تصفح المنتجات
        </Link>
      </div>
    )
  }

  return (
    <div className="container-main pb-24 pt-4 md:pb-12 md:pt-6">
      <h1 className="mb-6 font-display text-2xl font-extrabold text-on-surface md:text-3xl">
        إتمام الشراء
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* === عمود النموذج === */}
        <div className="space-y-6 lg:col-span-7">
          {/* --- بيانات العميل --- */}
          <fieldset className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 md:p-6">
            <legend className="mb-4 flex items-center gap-2 px-1 font-display text-lg font-bold text-on-surface">
              <span className="material-symbols-outlined text-primary">person</span>
              بيانات التواصل
            </legend>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                  الاسم بالكامل
                </label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) => updateField('customerName', e.target.value)}
                  placeholder="مثال: أحمد محمد"
                  className={`w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-sm outline-none transition-colors focus:border-primary ${
                    errors.customerName ? 'border-error' : 'border-outline-variant'
                  }`}
                />
                {errors.customerName && (
                  <p className="mt-1 text-xs font-bold text-error">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="01xxxxxxxxx"
                  dir="ltr"
                  className={`w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-left text-sm outline-none transition-colors focus:border-primary ${
                    errors.phone ? 'border-error' : 'border-outline-variant'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs font-bold text-error">{errors.phone}</p>
                )}
              </div>
            </div>
          </fieldset>

          {/* --- عنوان التوصيل --- */}
          <fieldset className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 md:p-6">
            <legend className="mb-4 flex items-center gap-2 px-1 font-display text-lg font-bold text-on-surface">
              <span className="material-symbols-outlined text-primary">location_on</span>
              عنوان التوصيل
            </legend>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                  المحافظة / منطقة الشحن
                </label>
                <select
                  value={form.zoneId}
                  onChange={(e) => updateField('zoneId', e.target.value)}
                  className={`w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-sm outline-none transition-colors focus:border-primary ${
                    errors.zoneId ? 'border-error' : 'border-outline-variant'
                  }`}
                >
                  <option value="">اختر المحافظة...</option>
                  {settings.shippingZones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} — رسوم شحن {formatPrice(zone.fee)}
                    </option>
                  ))}
                </select>
                {errors.zoneId && (
                  <p className="mt-1 text-xs font-bold text-error">{errors.zoneId}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                    المدينة / المركز
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className={`w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-sm outline-none transition-colors focus:border-primary ${
                      errors.city ? 'border-error' : 'border-outline-variant'
                    }`}
                  />
                  {errors.city && <p className="mt-1 text-xs font-bold text-error">{errors.city}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                    الحي / المنطقة
                  </label>
                  <input
                    type="text"
                    value={form.district}
                    onChange={(e) => updateField('district', e.target.value)}
                    className={`w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-sm outline-none transition-colors focus:border-primary ${
                      errors.district ? 'border-error' : 'border-outline-variant'
                    }`}
                  />
                  {errors.district && (
                    <p className="mt-1 text-xs font-bold text-error">{errors.district}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                  الشارع
                </label>
                <input
                  type="text"
                  value={form.street}
                  onChange={(e) => updateField('street', e.target.value)}
                  className={`w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-sm outline-none transition-colors focus:border-primary ${
                    errors.street ? 'border-error' : 'border-outline-variant'
                  }`}
                />
                {errors.street && <p className="mt-1 text-xs font-bold text-error">{errors.street}</p>}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                    العمارة
                  </label>
                  <input
                    type="text"
                    value={form.buildingNumber}
                    onChange={(e) => updateField('buildingNumber', e.target.value)}
                    className={`w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-sm outline-none transition-colors focus:border-primary ${
                      errors.buildingNumber ? 'border-error' : 'border-outline-variant'
                    }`}
                  />
                  {errors.buildingNumber && (
                    <p className="mt-1 text-xs font-bold text-error">مطلوب</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                    الدور
                  </label>
                  <input
                    type="text"
                    value={form.floor}
                    onChange={(e) => updateField('floor', e.target.value)}
                    className={`w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-sm outline-none transition-colors focus:border-primary ${
                      errors.floor ? 'border-error' : 'border-outline-variant'
                    }`}
                  />
                  {errors.floor && <p className="mt-1 text-xs font-bold text-error">مطلوب</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                    الشقة
                  </label>
                  <input
                    type="text"
                    value={form.apartment}
                    onChange={(e) => updateField('apartment', e.target.value)}
                    className={`w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-sm outline-none transition-colors focus:border-primary ${
                      errors.apartment ? 'border-error' : 'border-outline-variant'
                    }`}
                  />
                  {errors.apartment && <p className="mt-1 text-xs font-bold text-error">مطلوب</p>}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                  ملاحظات إضافية (اختياري)
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  rows={2}
                  placeholder="مثال: علامة مميزة بجانب المبنى"
                  className="w-full resize-none rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                />
              </div>
            </div>
          </fieldset>

          {/* --- طريقة الدفع --- */}
          <fieldset className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 md:p-6">
            <legend className="mb-4 flex items-center gap-2 px-1 font-display text-lg font-bold text-on-surface">
              <span className="material-symbols-outlined text-primary">payments</span>
              طريقة الدفع
            </legend>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {/* كاش عند الاستلام */}
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                  form.paymentMethod === 'cash'
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant hover:border-outline'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={form.paymentMethod === 'cash'}
                  onChange={() => updateField('paymentMethod', 'cash')}
                  className="h-4 w-4 accent-primary"
                />
                <span className="material-symbols-outlined text-tertiary">payments</span>
                <span className="text-sm font-bold text-on-surface">كاش عند الاستلام</span>
              </label>

              {/* إنستاباي */}
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                  form.paymentMethod === 'instapay'
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant hover:border-outline'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={form.paymentMethod === 'instapay'}
                  onChange={() => updateField('paymentMethod', 'instapay')}
                  className="h-4 w-4 accent-primary"
                />
                <span className="material-symbols-outlined text-tertiary">account_balance</span>
                <span className="text-sm font-bold text-on-surface">إنستاباي</span>
              </label>
            </div>

            {/* رقم إنستاباي — يظهر فقط عند اختيار هذه الطريقة */}
            {form.paymentMethod === 'instapay' && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-tertiary/10 p-4">
                <div>
                  <p className="mb-1 text-xs font-bold text-on-surface-variant">
                    حوّل المبلغ على رقم إنستاباي التالي، وسنؤكد طلبك بعد استلام التحويل
                  </p>
                  <p dir="ltr" className="text-left font-display text-lg font-black text-tertiary">
                    {settings.instapayNumber}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyInstapay}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg bg-tertiary px-3 py-2 text-xs font-bold text-on-tertiary transition-transform active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copied ? 'check' : 'content_copy'}
                  </span>
                  {copied ? 'تم النسخ' : 'نسخ الرقم'}
                </button>
              </div>
            )}
          </fieldset>
        </div>

        {/* === عمود ملخص الطلب === */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 md:p-6">
            <h2 className="mb-4 font-display text-lg font-bold text-on-surface">ملخص الطلب</h2>

            {/* قائمة المنتجات */}
            <ul className="mb-4 max-h-64 space-y-3 overflow-y-auto">
              {items.map((item) => (
                <li key={item.product.id} className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-14 w-14 rounded-lg bg-surface-container-low object-contain p-1"
                    />
                    <span className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-on-surface-variant text-[10px] font-bold text-on-primary">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-on-surface">
                      {item.product.name}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-on-surface">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            {/* الإجماليات */}
            <div className="space-y-2 border-t border-outline-variant/60 pt-4 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>المجموع الفرعي</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>رسوم الشحن</span>
                <span>{selectedZone ? formatPrice(shippingFee) : '—'}</span>
              </div>
              <div className="flex justify-between border-t border-outline-variant/60 pt-2 text-base font-black text-on-surface">
                <span>الإجمالي</span>
                <span className="text-primary">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-bold text-on-primary shadow-[0_8px_20px_rgba(187,0,16,0.25)] transition-all hover:bg-primary-container active:scale-[0.98] disabled:opacity-60"
            >
              <span className="material-symbols-outlined">check_circle</span>
              تأكيد الطلب
            </button>

            <p className="mt-3 text-center text-xs text-on-surface-variant">
              بالضغط على "تأكيد الطلب" سيتم التواصل معك لتأكيد التفاصيل
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
