// خدمة API الطلبات — بديل orderStorage.ts القديم (localStorage)
import { apiFetch } from '@/lib/apiClient'
import type { Order, PaymentMethod } from '@/types'

export interface CreateOrderInput {
  customerName: string
  phone: string
  governorate: string
  city: string
  district: string
  street: string
  buildingNumber: string
  floor: string
  apartment: string
  paymentMethod: PaymentMethod
  notes?: string
  items: { productId: string; quantity: number }[]
}

/** إنشاء طلب جديد من السلة (Checkout) — عام، Guest بالكامل */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const res = await apiFetch<{ success: true; data: Order }>('/orders', {
    method: 'POST',
    withAuth: false,
    body: JSON.stringify(input),
  })
  return res.data
}

/** جلب طلب لصفحة التأكيد مباشرة بعد الشراء */
export async function fetchOrderConfirmation(publicId: string): Promise<Order> {
  const res = await apiFetch<{ success: true; data: Order }>(`/orders/confirmation/${publicId}`, {
    withAuth: false,
  })
  return res.data
}

/** تتبع الطلب بالرقم المرجعي + رقم الهاتف */
export async function trackOrder(referenceNumber: string, phone: string): Promise<Order> {
  const params = new URLSearchParams({ referenceNumber, phone })
  const res = await apiFetch<{ success: true; data: Order }>(`/orders/track?${params}`, {
    withAuth: false,
  })
  return res.data
}

export interface AdminOrderQuery {
  status?: string
  search?: string
  dateFrom?: string
  dateTo?: string
}

/** كل الطلبات — محمي (أدمن) */
export async function adminFetchOrders(query: AdminOrderQuery = {}): Promise<Order[]> {
  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })
  const qs = params.toString()
  const res = await apiFetch<{ success: true; data: Order[] }>(
    `/admin/orders${qs ? `?${qs}` : ''}`,
  )
  return res.data
}

/** طلب واحد بالتفصيل — محمي (أدمن) */
export async function adminFetchOrderById(id: string): Promise<Order> {
  const res = await apiFetch<{ success: true; data: Order }>(`/admin/orders/${id}`)
  return res.data
}

/** تحديث حالة الطلب و/أو رسوم الشحن و/أو ملاحظات الأدمن — محمي (أدمن) */
export async function adminUpdateOrder(
  id: string,
  updates: { status?: string; adminNotes?: string; shippingFee?: number | null },
): Promise<Order> {
  const res = await apiFetch<{ success: true; data: Order }>(`/admin/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
  return res.data
}
