// دوال مساعدة مشتركة — تنسيق الأسعار والأرقام ونسخ النص
// TODO: ربط هذا بالـ API عند توفر الباك إند — بعض الدوال قد تُستبدل ببيانات من السيرفر
import type { Order, ShippingAddress } from '@/types'

/** تنسيق السعر بالجنيه المصري مع فواصل الآلاف */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(amount)
}

/** توليد رقم طلب مرجعي وهمي — سيُستبدل برقم من API */
export function generateOrderReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

/**
 * توليد كود مختصر وسهل القراءة للطلب (مثال: ORD-24) بدل الرقم المرجعي
 * الطويل (مثال: ORD-MRPEOTUQ-L80A). يُبنى من ترتيب الطلب زمنياً بين كل
 * الطلبات — أول طلب تم إنشاؤه يكون ORD-1، والذي يليه ORD-2، وهكذا
 */
export function getShortOrderCode(orderId: string, allOrders: Order[]): string {
  const sortedByDate = [...allOrders].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )
  const index = sortedByDate.findIndex((o) => o.id === orderId)
  return `ORD-${index === -1 ? '?' : index + 1}`
}

/** نسخ نص إلى الحافظة — يُستخدم لرقم إنستاباي */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/** حساب إجمالي السلة من العناصر */
export function calculateCartTotal(
  items: { product: { price: number }; quantity: number }[],
): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
}

/** حساب عدد قطع السلة الإجمالي */
export function calculateCartItemCount(
  items: { quantity: number }[],
): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

/** تنسيق التاريخ بالعربي (يوم/شهر/سنة) — يُستخدم في جداول الأدمن */
export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('ar-EG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoString))
}

/** ترجمة حالة الطلب للعربية */
export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'قيد الانتظار',
    confirmed: 'مؤكد',
    shipped: 'جاري التسليم',
    delivered: 'تم التسليم',
    cancelled: 'ملغي',
  }
  return labels[status] ?? status
}

/** ترجمة طريقة الدفع للعربية */
/**
 * تكوين نص عنوان مقروء من بيانات العنوان — كل حقل بقى اختياري وممكن يوصل فاضي،
 * فبنستبعد أي جزء فاضي بدل ما نطبع فواصل ومسافات زيادة من غير قيمة
 */
export function formatAddress(address: ShippingAddress): string {
  const line1 = [address.governorate, address.city, address.district]
    .filter((part) => part && part.trim())
    .join('، ')

  const buildingParts: string[] = []
  if (address.street && address.street.trim()) buildingParts.push(address.street.trim())
  if (address.buildingNumber && address.buildingNumber.trim())
    buildingParts.push(`عمارة ${address.buildingNumber.trim()}`)
  if (address.floor && address.floor.trim()) buildingParts.push(`الدور ${address.floor.trim()}`)
  if (address.apartment && address.apartment.trim())
    buildingParts.push(`شقة ${address.apartment.trim()}`)
  const line2 = buildingParts.join('، ')

  const full = [line1, line2].filter(Boolean).join('\n')
  return full || 'العميل لم يحدد عنوانًا'
}

export function getPaymentMethodLabel(method: string): string {
  return method === 'instapay' ? 'إنستاباي' : 'كاش عند الاستلام'
}

/** كل حالات الطلب بالترتيب المنطقي — تُستخدم في فلاتر وأزرار تغيير الحالة بالأدمن */
export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
] as const
