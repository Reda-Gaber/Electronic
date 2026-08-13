// بيانات ثابتة عرضية بحتة (مش من قاعدة البيانات) — بانر الهيرو، عدّاد العروض، وروابط التنقل

export const mockHeroBanner = {
  badge: 'وصل حديثاً',
  title: 'GeForce RTX™ 4090',
  description:
    'أقوى أداء في العالم للألعاب وصناعة المحتوى. اختبر قوة الذكاء الاصطناعي اليوم.',
  ctaLabel: 'تسوق الآن',
  ctaLink: '/product/nvidia-rtx-4090',
  image: '/hero.jpg',
}

/** مدة العرض الترويجي بالساعات — وهمية حتى ربط API */
export const mockDealCountdown = {
  hours: 4,
  minutes: 22,
  seconds: 15,
}

export const mainNavLinks = [
  { label: 'الرئيسية', path: '/' },
  { label: 'العروض', path: '/offers' },
  { label: 'المضاف حديثاً', path: '/new-arrivals' },
  { label: 'من نحن', path: '/about' },
  { label: 'تواصل معنا', path: '/contact' },
]

/** روابط لوحة تحكم الأدمن في السايد بار */
export const adminNavLinks = [
  { label: 'لوحة التحكم', path: '/admin/dashboard', icon: 'dashboard' },
  { label: 'الطلبات', path: '/admin/orders', icon: 'receipt_long' },
  { label: 'المنتجات', path: '/admin/products', icon: 'inventory_2' },
  { label: 'التصنيفات', path: '/admin/categories', icon: 'category' },
  { label: 'واتساب', path: '/admin/whatsapp', icon: 'chat' },
  { label: 'الإعدادات', path: '/admin/settings', icon: 'settings' },
]

// --- Minimal demo mock data for local-only storage and admin UI ---
import type { Product, Order, Category, StoreSettings, CartItem } from '@/types'

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'كروت شاشة',
    slug: 'graphics-cards',
    description: 'بطاقات رسومية للألعاب والعمل',
    image: '/categories/gpu.jpg',
    productCount: 1,
    icon: 'memory',
    isCustomIcon: false,
    featuredOnHomepage: true,
  },
]

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Demo GPU',
    slug: 'demo-gpu',
    categoryId: 'cat-1',
    categoryName: 'كروت شاشة',
    brand: 'DemoBrand',
    price: 999,
    originalPrice: 1299,
    image: '/products/gpu.jpg',
    images: ['/products/gpu.jpg'],
    description: 'منتج تجريبي للعرض المحلي',
    specs: [],
    inStock: true,
    stockCount: 10,
    isFeatured: true,
    isNew: true,
    status: 'published',
  },
]

const demoCartItem: CartItem = { product: mockProducts[0], quantity: 1 }

export const mockOrders: Order[] = [
  {
    id: 'order-demo-1',
    referenceNumber: 'REF123456',
    customerName: 'عميل تجريبي',
    phone: '0123456789',
    address: {
      governorate: 'Cairo',
      city: 'Cairo',
      district: 'Demo',
      street: 'Demo St',
      buildingNumber: '1',
      floor: '1',
      apartment: '1',
    },
    paymentMethod: 'cash',
    items: [demoCartItem],
    subtotal: mockProducts[0].price,
    shippingFee: null,
    total: mockProducts[0].price,
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
]

export const mockStoreSettings: StoreSettings = {
  instapayNumber: '0123456789',
  storeName: 'Demo Store',
  storePhone: '0123456789',
  storeEmail: 'demo@example.com',
  storeAddress: 'Demo Address',
  contactPhones: ['0123456789'],
  whatsappMessageTemplate: null,
}
