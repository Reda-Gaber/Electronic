// إدارة الطلبات — جدول قابل للفلترة والبحث + طباعة الطلبات المؤكدة
// TODO: ربط هذا بالـ API عند توفر الباك إند — استبدال getAllOrders بطلب حقيقي مع pagination
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllOrders } from '@/utils/orderStorage'
import {
  formatDate,
  formatPrice,
  getOrderStatusLabel,
  getShortOrderCode,
  ORDER_STATUSES,
} from '@/utils/helpers'
import type { Order, OrderStatus } from '@/types'

/** ألوان شارة كل حالة طلب */
const statusStyles: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-tertiary/10 text-tertiary',
  shipped: 'bg-primary/10 text-primary',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-surface-container-high text-on-surface-variant',
}

/** تكوين نص عنوان مختصر من بيانات عنوان الشحن — لعرضه في عمود العميل */
function formatShortAddress(order: Order): string {
  return `${order.address.governorate} — ${order.address.city}، ${order.address.district}، شارع ${order.address.street}`
}

export default function AdminOrdersPage() {
  // نص البحث — يبحث في اسم العميل ورقم الطلب المرجعي
  const [searchQuery, setSearchQuery] = useState('')
  // فلتر الحالة — 'all' يعني عرض كل الحالات
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  // فلتر المدى الزمني (من/إلى) — فارغ يعني بدون قيد
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const allOrders = getAllOrders()

  // عدد الطلبات في كل حالة — يُحسب من كامل الطلبات بغض النظر عن الفلتر الحالي
  const statusCounts = useMemo(() => {
    const counts: Record<OrderStatus, number> = {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    }
    for (const order of allOrders) counts[order.status]++
    return counts
  }, [allOrders])

  // تطبيق البحث والفلاتر مع بعض، مرتبة من الأحدث للأقدم
  const filteredOrders = useMemo(() => {
    return [...allOrders]
      .filter((order) => statusFilter === 'all' || order.status === statusFilter)
      .filter((order) => {
        const query = searchQuery.trim().toLowerCase()
        if (!query) return true
        return (
          order.customerName.toLowerCase().includes(query) ||
          order.referenceNumber.toLowerCase().includes(query) ||
          order.phone.includes(query)
        )
      })
      .filter((order) => {
        const orderDate = new Date(order.createdAt).getTime()
        if (dateFrom && orderDate < new Date(dateFrom).getTime()) return false
        if (dateTo && orderDate > new Date(dateTo).setHours(23, 59, 59, 999)) return false
        return true
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [allOrders, searchQuery, statusFilter, dateFrom, dateTo])

  // الطلبات المؤكدة فقط — تُستخدم في نسخة الطباعة بغض النظر عن الفلاتر الحالية
  const confirmedOrders = useMemo(
    () => allOrders.filter((order) => order.status === 'confirmed'),
    [allOrders],
  )

  const handlePrint = () => window.print()

  return (
    <div>
      {/* عنوان الصفحة + زر الطباعة */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-on-surface">
            إدارة الطلبات
          </h1>
          <p className="text-sm text-on-surface-variant">
            {filteredOrders.length} طلب من إجمالي {allOrders.length}
          </p>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          disabled={confirmedOrders.length === 0}
          className="flex items-center gap-2 rounded-xl border-2 border-outline-variant px-5 py-2.5 text-sm font-bold text-on-surface transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          title={
            confirmedOrders.length === 0
              ? 'لا توجد طلبات مؤكدة لطباعتها'
              : `طباعة ${confirmedOrders.length} طلب مؤكد`
          }
        >
          <span className="material-symbols-outlined text-lg">print</span>
          طباعة الطلبات المؤكدة ({confirmedOrders.length})
        </button>
      </div>

      {/* شريط البحث والفلاتر */}
      <div className="mb-4 flex flex-col gap-3 print:hidden md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 md:max-w-sm">
          <span className="material-symbols-outlined text-lg text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم أو رقم الطلب أو الهاتف..."
            className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
          />
        </div>

        {/* فلتر المدى الزمني */}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined shrink-0 text-lg text-on-surface-variant">
            date_range
          </span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
            aria-label="من تاريخ"
          />
          <span className="text-xs text-on-surface-variant">إلى</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
            aria-label="إلى تاريخ"
          />
          {(dateFrom || dateTo) && (
            <button
              type="button"
              onClick={() => {
                setDateFrom('')
                setDateTo('')
              }}
              className="text-xs font-bold text-primary hover:text-primary-container"
            >
              مسح
            </button>
          )}
        </div>
      </div>

      {/* أزرار فلتر الحالة مع عداد لكل حالة */}
      <div className="hide-scrollbar mb-5 flex gap-2 overflow-x-auto print:hidden">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
            statusFilter === 'all'
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
          }`}
        >
          الكل
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] ${
              statusFilter === 'all' ? 'bg-on-primary/20' : 'bg-surface-container-highest'
            }`}
          >
            {allOrders.length}
          </span>
        </button>
        {ORDER_STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors ${
              statusFilter === status
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            {getOrderStatusLabel(status)}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                statusFilter === status ? 'bg-on-primary/20' : 'bg-surface-container-highest'
              }`}
            >
              {statusCounts[status]}
            </span>
          </button>
        ))}
      </div>

      {/* جدول الطلبات — يظهر على الشاشة فقط */}
      <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest print:hidden">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="material-symbols-outlined mb-3 text-4xl text-outline">
              search_off
            </span>
            <p className="font-bold text-on-surface">لا توجد طلبات مطابقة</p>
            <p className="text-sm text-on-surface-variant">جرّب تعديل البحث أو الفلتر</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-outline-variant text-right text-on-surface-variant">
                  <th className="p-4 font-bold">رقم الطلب</th>
                  <th className="p-4 font-bold">العميل والعنوان</th>
                  <th className="p-4 font-bold">الهاتف</th>
                  <th className="p-4 font-bold">عدد القطع</th>
                  <th className="p-4 font-bold">الإجمالي</th>
                  <th className="p-4 font-bold">الدفع</th>
                  <th className="p-4 font-bold">الحالة</th>
                  <th className="p-4 font-bold">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-outline-variant/60 transition-colors last:border-0 hover:bg-surface-container-low"
                  >
                    <td className="p-4">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        dir="ltr"
                        className="text-right font-bold text-on-surface hover:text-primary"
                      >
                        {getShortOrderCode(order.id, allOrders)}
                      </Link>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-on-surface">{order.customerName}</p>
                      <p className="mt-0.5 max-w-[220px] text-xs text-on-surface-variant">
                        {formatShortAddress(order)}
                      </p>
                    </td>
                    <td dir="ltr" className="p-4 text-left text-on-surface-variant">
                      {order.phone}
                    </td>
                    <td className="p-4 text-on-surface-variant">
                      {order.items.reduce((sum, i) => sum + i.quantity, 0)}
                    </td>
                    <td className="p-4 font-bold text-on-surface">{formatPrice(order.total)}</td>
                    <td className="p-4 text-on-surface-variant">
                      {order.paymentMethod === 'instapay' ? 'إنستاباي' : 'كاش'}
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[order.status]}`}
                      >
                        {getOrderStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="p-4 text-on-surface-variant">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* === نسخة الطباعة — مخفية على الشاشة، تظهر فقط عند الطباعة === */}
      <div className="hidden print:block">
        <h1 className="mb-1 text-xl font-bold">تقرير الطلبات المؤكدة</h1>
        <p className="mb-4 text-xs text-gray-600">
          تاريخ الطباعة: {formatDate(new Date().toISOString())} — عدد الطلبات: {confirmedOrders.length}
        </p>

        {confirmedOrders.map((order) => (
          <div key={order.id} className="mb-4 break-inside-avoid border border-gray-400 p-3">
            <div className="mb-2 flex justify-between border-b border-gray-300 pb-2 text-sm">
              <span className="font-bold">{getShortOrderCode(order.id, allOrders)}</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <table className="w-full text-xs">
              <tbody>
                <tr>
                  <td className="w-28 py-1 font-bold">اسم العميل</td>
                  <td className="py-1">{order.customerName}</td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">رقم الهاتف</td>
                  <td className="py-1" dir="ltr">
                    {order.phone}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">العنوان</td>
                  <td className="py-1">
                    {order.address.governorate} — {order.address.city}، {order.address.district}
                    ، {order.address.street}، عمارة {order.address.buildingNumber}، الدور{' '}
                    {order.address.floor}، شقة {order.address.apartment}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 font-bold">حالة الدفع</td>
                  <td className="py-1">
                    {order.paymentMethod === 'instapay'
                      ? 'مدفوع مسبقاً (إنستاباي)'
                      : 'غير مدفوع — كاش عند الاستلام'}
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="mt-2 w-full border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-400">
                  <th className="py-1 text-right">المنتج</th>
                  <th className="py-1 text-right">الكمية</th>
                  <th className="py-1 text-right">السعر</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.product.id} className="border-b border-gray-200">
                    <td className="py-1">{item.product.name}</td>
                    <td className="py-1">{item.quantity}</td>
                    <td className="py-1">{formatPrice(item.product.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-right text-sm font-bold">
              الإجمالي: {formatPrice(order.total)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
