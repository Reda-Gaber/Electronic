// تذكّر آخر طلب أنشأه العميل من هذا المتصفح — تُستخدم لتحويل رابط
// "اتمام الشراء" إلى "متابعة الطلب" تلقائياً لو السلة فاضية وعنده طلب قائم
const LAST_ORDER_ID_KEY = 'pc-tech-last-order-id'

/** حفظ رقم الطلب (public_id) بعد نجاح إنشاء الطلب من صفحة الـ Checkout */
export function saveLastOrderId(orderId: string): void {
  localStorage.setItem(LAST_ORDER_ID_KEY, orderId)
}

/** جلب آخر رقم طلب محفوظ محلياً — null لو محدش عمل طلب من المتصفح ده قبل كده */
export function getLastOrderId(): string | null {
  return localStorage.getItem(LAST_ORDER_ID_KEY)
}
