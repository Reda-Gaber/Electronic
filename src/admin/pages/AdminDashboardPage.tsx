// لوحة تحكم الأدمن الرئيسية — نظرة عامة على أداء المتجر
// TODO: ربط هذا بالـ API عند توفر الباك إند — استبدال getAllOrders/getProducts بطلبات حقيقية
import { Link } from 'react-router-dom'
import { getProducts } from '@/utils/productStorage'
import { getAllOrders } from '@/utils/orderStorage'
import { formatDate, formatPrice, getOrderStatusLabel, getShortOrderCode } from '@/utils/helpers'
import type { OrderStatus } from '@/types'

/** ألوان شارة كل حالة طلب — تُستخدم في جدول آخر الطلبات */
const statusStyles: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-tertiary/10 text-tertiary',
  shipped: 'bg-primary/10 text-primary',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-surface-container-high text-on-surface-variant',
}

export default function AdminDashboardPage() {
  // جلب الطلبات (حقيقية أو تجريبية) وترتيبها من الأحدث للأقدم
  const orders = [...getAllOrders()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  // === حساب بطاقات الإحصائيات ===
  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === 'pending').length
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0)
  const lowStockProducts = getProducts().filter((p) => p.inStock && p.stockCount <= 5)

  const statCards = [
    {
      label: 'إجمالي الطلبات',
      value: totalOrders.toLocaleString('ar-EG'),
      icon: 'receipt_long',
      color: 'text-primary bg-primary/10',
    },
    {
      label: 'طلبات قيد الانتظار',
      value: pendingOrders.toLocaleString('ar-EG'),
      icon: 'pending_actions',
      color: 'text-amber-600 bg-amber-100',
    },
    {
      label: 'إجمالي الإيرادات',
      value: formatPrice(totalRevenue),
      icon: 'payments',
      color: 'text-tertiary bg-tertiary/10',
    },
    {
      label: 'تنبيهات مخزون منخفض',
      value: lowStockProducts.length.toLocaleString('ar-EG'),
      icon: 'inventory_2',
      color: 'text-error bg-error-container',
    },
  ]

  // === بيانات مبسّطة لرسم بياني بالمبيعات لآخر 7 أيام ===
  const salesByDay = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    const dayTotal = orders
      .filter((o) => new Date(o.createdAt).toDateString() === date.toDateString())
      .reduce((sum, o) => sum + o.total, 0)
    return {
      label: new Intl.DateTimeFormat('ar-EG', { weekday: 'short' }).format(date),
      total: dayTotal,
    }
  })
  const maxDayTotal = Math.max(...salesByDay.map((d) => d.total), 1)

  // آخر 6 طلبات لعرضها في الجدول
  const recentOrders = orders.slice(0, 6)

  return (
    <div>
      {/* عنوان الصفحة */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold text-on-surface">لوحة التحكم</h1>
        <p className="text-sm text-on-surface-variant">نظرة عامة على أداء المتجر اليوم</p>
      </div>

      {/* === بطاقات الإحصائيات === */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5"
          >
            <div
              className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${card.color}`}
            >
              <span className="material-symbols-outlined">{card.icon}</span>
            </div>
            <p className="mb-1 text-2xl font-black text-on-surface">{card.value}</p>
            <p className="text-sm text-on-surface-variant">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* === رسم بياني مبسّط للمبيعات === */}
        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 xl:col-span-2">
          <h2 className="mb-6 font-display text-lg font-bold text-on-surface">
            المبيعات آخر 7 أيام
          </h2>
          <div className="flex h-48 items-end justify-between gap-2">
            {salesByDay.map((day, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-on-surface-variant">
                  {day.total > 0 ? formatPrice(day.total) : ''}
                </span>
                <div
                  className="w-full rounded-t-lg bg-primary/15 transition-all hover:bg-primary/25"
                  style={{
                    height: `${Math.max((day.total / maxDayTotal) * 100, 4)}%`,
                    backgroundColor: day.total > 0 ? undefined : 'var(--color-surface-container-high)',
                  }}
                />
                <span className="text-xs font-bold text-on-surface-variant">{day.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* === تنبيهات المخزون المنخفض === */}
        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-on-surface">
            <span className="material-symbols-outlined text-error">warning</span>
            مخزون منخفض
          </h2>
          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-on-surface-variant">لا توجد منتجات بمخزون منخفض حالياً</p>
          ) : (
            <ul className="space-y-3">
              {lowStockProducts.map((product) => (
                <li key={product.id} className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-10 w-10 rounded-lg bg-surface-container-low object-contain p-1"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-on-surface">{product.name}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-error-container px-2 py-0.5 text-xs font-bold text-on-error-container">
                    {product.stockCount} فقط
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* === جدول آخر الطلبات === */}
      <div className="mt-6 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-on-surface">آخر الطلبات</h2>
          <Link
            to="/admin/orders"
            className="text-sm font-bold text-primary hover:text-primary-container"
          >
            عرض كل الطلبات
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-outline-variant text-right text-on-surface-variant">
                <th className="pb-3 font-bold">رقم الطلب</th>
                <th className="pb-3 font-bold">العميل</th>
                <th className="pb-3 font-bold">الإجمالي</th>
                <th className="pb-3 font-bold">الحالة</th>
                <th className="pb-3 font-bold">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="cursor-pointer border-b border-outline-variant/60 last:border-0 hover:bg-surface-container-low"
                >
                  <td className="py-3">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      dir="ltr"
                      className="font-bold text-on-surface hover:text-primary"
                    >
                      {getShortOrderCode(order.id, orders)}
                    </Link>
                  </td>
                  <td className="py-3 text-on-surface">{order.customerName}</td>
                  <td className="py-3 font-bold text-on-surface">{formatPrice(order.total)}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[order.status]}`}
                    >
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="py-3 text-on-surface-variant">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
