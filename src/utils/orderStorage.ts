// تخزين الطلبات محلياً في localStorage — بديل مؤقت لحين ربط الباك إند
// TODO: ربط هذا بالـ API عند توفر الباك إند — POST /orders و GET /orders/:id
import type { Order } from '@/types'
import { mockOrders } from '@/data/mockData'

/** مفتاح التخزين المحلي لكل الطلبات */
const ORDERS_STORAGE_KEY = 'pc-tech-orders'

/** قراءة كل الطلبات المحفوظة محلياً */
function loadOrdersFromStorage(): Order[] {
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY)
    return stored ? (JSON.parse(stored) as Order[]) : []
  } catch {
    return []
  }
}

/**
 * حفظ طلب جديد في localStorage
 * تُستدعى من CheckoutPage بعد تأكيد العميل للطلب
 */
export function saveOrder(order: Order): void {
  const orders = loadOrdersFromStorage()
  orders.unshift(order)
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
}

/**
 * تحديث بيانات طلب حقيقي موجود (الحالة أو الملاحظات الداخلية)
 * تُستخدم في صفحة تفاصيل الطلب بالأدمن
 * ترجع true لو التحديث نجح، أو false لو الطلب تجريبي (Demo) غير قابل للتعديل الفعلي
 */
export function updateOrder(orderId: string, updates: Partial<Order>): boolean {
  const orders = loadOrdersFromStorage()
  const index = orders.findIndex((o) => o.id === orderId)
  if (index === -1) return false
  orders[index] = { ...orders[index], ...updates }
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
  return true
}

/**
 * جلب طلب واحد حسب المعرّف — تُستخدم في صفحة تأكيد الطلب وتفاصيل طلب الأدمن
 * تبحث في الطلبات الحقيقية أولاً، ثم التجريبية — ترجع undefined إذا لم يوجد
 */
export function getOrderById(orderId: string | undefined): Order | undefined {
  if (!orderId) return undefined
  const realOrder = loadOrdersFromStorage().find((o) => o.id === orderId)
  if (realOrder) return realOrder
  return mockOrders.find((o) => o.id === orderId)
}

/**
 * جلب كل الطلبات لعرضها في لوحة تحكم الأدمن
 * تُرجع الطلبات الحقيقية إن وُجدت، وإلا تُرجع طلبات تجريبية (Demo) لعرض
 * شكل اللوحة قبل استقبال أي طلب فعلي من عميل
 * TODO: ربط هذا بالـ API عند توفر الباك إند — إزالة الرجوع لـ mockOrders
 */
export function getAllOrders(): Order[] {
  const realOrders = loadOrdersFromStorage()
  return realOrders.length > 0 ? realOrders : mockOrders
}
