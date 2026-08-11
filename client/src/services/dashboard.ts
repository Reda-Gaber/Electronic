// خدمة API لوحة التحكم الرئيسية — محمي (أدمن)
import { apiFetch } from '@/lib/apiClient'
import type { Order, Product } from '@/types'

export interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  outOfStockProducts: Product[]
  salesByDay: { date: string; total: number }[]
  recentOrders: (Order & { shortCode: string })[]
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await apiFetch<{ success: true; data: DashboardStats }>('/admin/dashboard')
  return res.data
}
