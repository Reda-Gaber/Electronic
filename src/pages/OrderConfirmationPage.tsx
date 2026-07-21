// صفحة تأكيد الطلب — رقم مرجعي وبيانات الطلب بعد الإرسال
// TODO: ربط هذا بالـ API عند توفر الباك إند — جلب الطلب من السيرفر بدل localStorage
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getOrderById } from '@/utils/orderStorage'
import {
  formatPrice,
  getOrderStatusLabel,
  getPaymentMethodLabel,
} from '@/utils/helpers'

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const order = getOrderById(orderId)
  // إظهار/إخفاء تفاصيل تتبع الطلب عند الضغط على الزر الثانوي
  const [showTracking, setShowTracking] = useState(false)

  // === حالة: الطلب غير موجود (رابط قديم أو تم مسح بيانات المتصفح) ===
  if (!order) {
    return (
      <div className="container-main flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <span className="material-symbols-outlined mb-4 text-5xl text-outline">
          receipt_long
        </span>
        <h1 className="mb-2 font-display text-2xl font-bold">لم يتم العثور على الطلب</h1>
        <p className="mb-6 max-w-md text-on-surface-variant">
          ربما تم مسح بيانات المتصفح أو الرابط غير صحيح. تواصل معنا إذا كنت بحاجة لمساعدة.
        </p>
        <Link
          to="/"
          className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-on-primary hover:bg-primary-container"
        >
          العودة للرئيسية
        </Link>
      </div>
    )
  }

  return (
    <div className="container-main flex justify-center pb-16 pt-8 md:pt-12">
      <div className="w-full max-w-2xl">
        {/* === بطاقة النجاح === */}
        <div className="mb-6 flex flex-col items-center rounded-2xl border border-outline-variant bg-surface-container-lowest px-6 py-10 text-center md:px-10">
          {/* أيقونة النجاح الدائرية */}
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-tertiary/10">
            <span
              className="material-symbols-outlined text-5xl text-tertiary"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              check_circle
            </span>
          </div>

          <h1 className="mb-2 font-display text-2xl font-extrabold text-on-surface md:text-3xl">
            تم استلام طلبك بنجاح
          </h1>
          <p className="mb-6 max-w-md text-sm text-on-surface-variant md:text-base">
            جاري تأكيد طلبك، وسيتم التواصل معك قريباً على رقم الهاتف{' '}
            <span dir="ltr" className="font-bold text-on-surface">
              {order.phone}
            </span>{' '}
            لتأكيد التفاصيل.
          </p>

          {/* رقم الطلب المرجعي */}
          <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-6 py-3">
            <span className="block text-xs font-bold text-on-surface-variant">
              رقم الطلب المرجعي
            </span>
            <span dir="ltr" className="font-display text-xl font-black text-primary">
              #{order.referenceNumber}
            </span>
          </div>
        </div>

        {/* === ملخص الطلب === */}
        <div className="mb-6 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 md:p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-on-surface">تفاصيل الطلب</h2>

          {/* المنتجات */}
          <ul className="mb-4 space-y-3 border-b border-outline-variant/60 pb-4">
            {order.items.map((item) => (
              <li key={item.product.id} className="flex items-center gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-14 w-14 rounded-lg bg-surface-container-low object-contain p-1"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-on-surface">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-on-surface-variant">الكمية: {item.quantity}</p>
                </div>
                <span className="shrink-0 text-sm font-bold text-on-surface">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          {/* الإجماليات */}
          <div className="mb-4 space-y-2 border-b border-outline-variant/60 pb-4 text-sm">
            <div className="flex justify-between text-on-surface-variant">
              <span>المجموع الفرعي</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-on-surface-variant">
              <span>رسوم الشحن</span>
              <span>{formatPrice(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-on-surface">
              <span>الإجمالي</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* العنوان وطريقة الدفع */}
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div>
              <span className="mb-1 flex items-center gap-1.5 font-bold text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                عنوان التوصيل
              </span>
              <p className="text-on-surface">
                {order.address.governorate} — {order.address.city}، {order.address.district}
                <br />
                {order.address.street}، عمارة {order.address.buildingNumber}، الدور{' '}
                {order.address.floor}، شقة {order.address.apartment}
              </p>
            </div>
            <div>
              <span className="mb-1 flex items-center gap-1.5 font-bold text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">payments</span>
                طريقة الدفع
              </span>
              <p className="text-on-surface">{getPaymentMethodLabel(order.paymentMethod)}</p>
            </div>
          </div>

          {/* حالة تتبع الطلب — تظهر عند الضغط على "تتبع الطلب" */}
          {showTracking && (
            <div className="mt-4 rounded-xl bg-surface-container-high p-4">
              <span className="mb-1 block text-xs font-bold text-on-surface-variant">
                حالة الطلب الحالية
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {getOrderStatusLabel(order.status)}
              </span>
              <p className="mt-2 text-xs text-on-surface-variant">
                سيقوم فريقنا بتحديث حالة الطلب فور التواصل معك وتأكيد التفاصيل.
              </p>
            </div>
          )}
        </div>

        {/* === أزرار الإجراءات === */}
        <div className="flex flex-col gap-3 md:flex-row">
          <Link
            to="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-on-primary shadow-[0_8px_20px_rgba(187,0,16,0.2)] transition-all hover:bg-primary-container active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[20px]">storefront</span>
            متابعة التسوق
          </Link>
          <button
            type="button"
            onClick={() => setShowTracking((prev) => !prev)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-outline-variant py-3.5 text-sm font-bold text-on-surface transition-colors hover:border-primary hover:text-primary"
          >
            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            {showTracking ? 'إخفاء حالة الطلب' : 'تتبع الطلب'}
          </button>
        </div>
      </div>
    </div>
  )
}
