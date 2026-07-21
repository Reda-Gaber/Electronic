// صفحة تتبع الطلب — العميل يدخل رقم الهاتف + الرقم المرجعي للاطلاع على حالة طلبه
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { findOrderByReference } from '@/utils/orderStorage'
import {
  formatDate,
  formatPrice,
  getOrderStatusLabel,
  getPaymentMethodLabel,
} from '@/utils/helpers'
import type { Order } from '@/types'

export default function OrderTrackingPage() {
  const [referenceNumber, setReferenceNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [result, setResult] = useState<Order | undefined | null>(null)

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (!referenceNumber.trim() || !phone.trim()) return
    const found = findOrderByReference(referenceNumber, phone)
    setResult(found ?? undefined)
  }

  return (
    <div className="container-main flex justify-center pb-24 pt-4 md:pb-12 md:pt-6">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-2xl">local_shipping</span>
          </div>
          <h1 className="mb-1 font-display text-2xl font-extrabold text-on-surface">
            تتبع طلبك
          </h1>
          <p className="text-sm text-on-surface-variant">
            أدخل رقم الهاتف والرقم المرجعي الظاهرين في صفحة تأكيد الطلب
          </p>
        </div>

        {/* فورم البحث */}
        <form
          onSubmit={handleSearch}
          className="mb-6 space-y-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 md:p-6"
        >
          <div>
            <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
              الرقم المرجعي للطلب
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="ORD-XXXXXXX-XXXX"
              dir="ltr"
              className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-left text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
              رقم الهاتف المستخدَم في الطلب
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01xxxxxxxxx"
              dir="ltr"
              className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-left text-sm outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-on-primary shadow-[0_8px_20px_rgba(187,0,16,0.2)] transition-all hover:bg-primary-container active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-lg">search</span>
            ابحث عن طلبي
          </button>
        </form>

        {/* النتيجة */}
        {result === undefined && (
          <div className="rounded-2xl border border-error/30 bg-error-container/40 p-5 text-center">
            <span className="material-symbols-outlined mb-2 text-3xl text-error">error</span>
            <p className="font-bold text-on-surface">لم نجد طلباً مطابقاً</p>
            <p className="text-sm text-on-surface-variant">
              تأكد من الرقم المرجعي ورقم الهاتف وحاول مرة أخرى
            </p>
          </div>
        )}

        {result && (
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-outline-variant/60 pb-4">
              <span dir="ltr" className="font-display font-bold text-on-surface">
                #{result.referenceNumber}
              </span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {getOrderStatusLabel(result.status)}
              </span>
            </div>

            <ul className="mb-4 space-y-3 border-b border-outline-variant/60 pb-4">
              {result.items.map((item) => (
                <li key={item.product.id} className="flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-12 w-12 rounded-lg bg-surface-container-low object-contain p-1"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-on-surface">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-on-surface-variant">الكمية: {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>تاريخ الطلب</span>
                <span>{formatDate(result.createdAt)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>طريقة الدفع</span>
                <span>{getPaymentMethodLabel(result.paymentMethod)}</span>
              </div>
              <div className="flex justify-between font-bold text-on-surface">
                <span>الإجمالي</span>
                <span className="text-primary">{formatPrice(result.total)}</span>
              </div>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          محتاج مساعدة؟{' '}
          <Link to="/contact" className="font-bold text-primary hover:underline">
            تواصل معنا
          </Link>
        </p>
      </div>
    </div>
  )
}
