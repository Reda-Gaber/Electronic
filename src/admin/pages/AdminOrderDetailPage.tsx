// تفاصيل طلب واحد — بيانات العميل، المنتجات، وتغيير الحالة
// TODO: ربط هذا بالـ API عند توفر الباك إند — استبدال getOrderById/updateOrder بطلبات حقيقية
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getAllOrders, getOrderById, updateOrder } from '@/utils/orderStorage'
import {
  formatDate,
  formatPrice,
  getOrderStatusLabel,
  getPaymentMethodLabel,
  getShortOrderCode,
  ORDER_STATUSES,
} from '@/utils/helpers'
import type { OrderStatus } from '@/types'

const statusStyles: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-tertiary/10 text-tertiary',
  shipped: 'bg-primary/10 text-primary',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-surface-container-high text-on-surface-variant',
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const order = getOrderById(id)

  // حالة محلية للحالة والملاحظات — تسمح بالتعديل حتى للطلبات التجريبية (Demo) بصرياً
  const [currentStatus, setCurrentStatus] = useState<OrderStatus | undefined>(order?.status)
  const [adminNotes, setAdminNotes] = useState(order?.adminNotes ?? '')
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  // === حالة: الطلب غير موجود ===
  if (!order || !currentStatus) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined mb-4 text-5xl text-outline">
          receipt_long
        </span>
        <h1 className="mb-2 font-display text-xl font-bold text-on-surface">
          الطلب غير موجود
        </h1>
        <Link
          to="/admin/orders"
          className="mt-4 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-on-primary hover:bg-primary-container"
        >
          العودة لإدارة الطلبات
        </Link>
      </div>
    )
  }

  // حفظ الحالة الجديدة والملاحظات
  const handleSave = () => {
    const success = updateOrder(order.id, { status: currentStatus, adminNotes })
    setSaveMessage(
      success
        ? 'تم حفظ التغييرات بنجاح'
        : 'هذا طلب تجريبي (Demo) للعرض فقط — التغيير لن يُحفظ فعلياً',
    )
    setTimeout(() => setSaveMessage(null), 3000)
  }

  return (
    <div>
      {/* رأس الصفحة: زر الرجوع + رقم الطلب + شارة الحالة */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/admin/orders')}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
          aria-label="العودة"
        >
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
        <div>
          <h1 className="font-display text-xl font-extrabold text-on-surface">
            {getShortOrderCode(order.id, getAllOrders())}
          </h1>
          <p dir="ltr" className="text-right text-xs text-on-surface-variant">
            {order.referenceNumber} — {formatDate(order.createdAt)}
          </p>
        </div>
        <span
          className={`mr-auto rounded-full px-3 py-1.5 text-sm font-bold ${statusStyles[order.status]}`}
        >
          {getOrderStatusLabel(order.status)}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* === العمود الرئيسي: بيانات العميل + المنتجات === */}
        <div className="space-y-6 lg:col-span-2">
          {/* بيانات العميل والعنوان */}
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-on-surface">
              <span className="material-symbols-outlined text-primary">person</span>
              بيانات العميل
            </h2>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div>
                <span className="mb-1 block font-bold text-on-surface-variant">الاسم</span>
                <span className="text-on-surface">{order.customerName}</span>
              </div>
              <div>
                <span className="mb-1 block font-bold text-on-surface-variant">رقم الهاتف</span>
                <a
                  href={`tel:${order.phone}`}
                  dir="ltr"
                  className="text-left font-bold text-primary hover:underline"
                >
                  {order.phone}
                </a>
              </div>
              <div className="md:col-span-2">
                <span className="mb-1 block font-bold text-on-surface-variant">
                  عنوان التوصيل
                </span>
                <span className="text-on-surface">
                  {order.address.governorate} — {order.address.city}، {order.address.district}
                  <br />
                  {order.address.street}، عمارة {order.address.buildingNumber}، الدور{' '}
                  {order.address.floor}، شقة {order.address.apartment}
                </span>
              </div>
              {order.notes && (
                <div className="md:col-span-2">
                  <span className="mb-1 block font-bold text-on-surface-variant">
                    ملاحظات العميل
                  </span>
                  <span className="text-on-surface">{order.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* المنتجات المطلوبة */}
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-on-surface">
              <span className="material-symbols-outlined text-primary">inventory_2</span>
              المنتجات ({order.items.length})
            </h2>
            <ul className="space-y-3">
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
                    <p className="text-xs text-on-surface-variant">
                      الكمية: {item.quantity} × {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-on-surface">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-2 border-t border-outline-variant/60 pt-4 text-sm">
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
          </div>
        </div>

        {/* === العمود الجانبي: تغيير الحالة + طريقة الدفع + ملاحظات === */}
        <div className="space-y-6">
          {/* طريقة الدفع */}
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5">
            <h2 className="mb-3 flex items-center gap-2 font-display text-base font-bold text-on-surface">
              <span className="material-symbols-outlined text-primary">payments</span>
              طريقة الدفع
            </h2>
            <span className="rounded-lg bg-surface-container-high px-3 py-1.5 text-sm font-bold text-on-surface">
              {getPaymentMethodLabel(order.paymentMethod)}
            </span>
          </div>

          {/* تغيير حالة الطلب */}
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5">
            <h2 className="mb-3 flex items-center gap-2 font-display text-base font-bold text-on-surface">
              <span className="material-symbols-outlined text-primary">sync_alt</span>
              تغيير الحالة
            </h2>
            <div className="space-y-2">
              {ORDER_STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setCurrentStatus(status)}
                  className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition-colors ${
                    currentStatus === status
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-outline-variant text-on-surface-variant hover:border-outline'
                  }`}
                >
                  {getOrderStatusLabel(status)}
                  {currentStatus === status && (
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ملاحظات داخلية للأدمن */}
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5">
            <h2 className="mb-3 flex items-center gap-2 font-display text-base font-bold text-on-surface">
              <span className="material-symbols-outlined text-primary">edit_note</span>
              ملاحظات داخلية
            </h2>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
              placeholder="مثال: تم التواصل مع العميل، سيستلم مساءً..."
              className="w-full resize-none rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            <p className="mt-1.5 text-xs text-on-surface-variant">
              هذه الملاحظات داخلية ولا يراها العميل
            </p>
          </div>

          {/* حفظ التغييرات */}
          <button
            type="button"
            onClick={handleSave}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-on-primary shadow-[0_8px_20px_rgba(187,0,16,0.2)] transition-all hover:bg-primary-container active:scale-[0.98]"
          >
            <span className="material-symbols-outlined">save</span>
            حفظ التغييرات
          </button>
          {saveMessage && (
            <p className="rounded-lg bg-surface-container-high px-3 py-2 text-center text-xs font-bold text-on-surface-variant">
              {saveMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
