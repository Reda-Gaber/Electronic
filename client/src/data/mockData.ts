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
  { label: 'الإعدادات', path: '/admin/settings', icon: 'settings' },
]
