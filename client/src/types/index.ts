// أنواع TypeScript المشتركة في المشروع — المنتجات والطلبات والتصنيفات

/** تصنيف المنتجات (كروت شاشة، معالجات، رامات...) */
export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
  /** اسم أيقونة Material جاهزة، أو Data URL لأيقونة مرفوعة من الجهاز (حسب isCustomIcon) */
  icon: string
  /** true إذا كانت icon أعلاه صورة مرفوعة من الأدمن، بدل اسم أيقونة جاهزة */
  isCustomIcon: boolean
  /** هل يُعرض هذا التصنيف كبوكس كبير مميز في الصفحة الرئيسية (بدل بوكسات العروض الثابتة سابقاً) */
  featuredOnHomepage: boolean
}

/** مواصفات تقنية للمنتج */
export interface ProductSpec {
  label: string
  value: string
}

/** بيانات المنتج الكاملة */
export interface Product {
  id: string
  name: string
  slug: string
  categoryId: string
  categoryName: string
  brand: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  description: string
  specs: ProductSpec[]
  inStock: boolean
  /** رقم قديم من قاعدة البيانات (افتراضي 0) — غير مستخدَم كحد للشراء؛ التوفر يتحكم فيه الأدمن يدوياً عبر inStock فقط */
  stockCount: number
  rating: number
  reviewCount: number
  isFeatured?: boolean
  isNew?: boolean
  /** حالة النشر — المسودات لا تظهر في المتجر */
  status?: 'published' | 'draft'
}

/** عنصر في سلة التسوق */
export interface CartItem {
  product: Product
  quantity: number
}

/** عنوان التوصيل التفصيلي */
export interface ShippingAddress {
  governorate: string
  city: string
  district: string
  street: string
  buildingNumber: string
  floor: string
  apartment: string
}

/** طريقة الدفع المتاحة */
export type PaymentMethod = 'cash' | 'instapay'

/** بيانات نموذج إتمام الشراء */
export interface CheckoutFormData {
  customerName: string
  phone: string
  address: ShippingAddress
  paymentMethod: PaymentMethod
  notes?: string
}

/** حالة الطلب في لوحة الأدمن */
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

/** طلب كامل — للعرض في الأدمن وتأكيد الطلب */
export interface Order {
  id: string
  referenceNumber: string
  customerName: string
  phone: string
  address: ShippingAddress
  paymentMethod: PaymentMethod
  items: CartItem[]
  subtotal: number
  /** null = لسه ما اتحددتش (بتتحدد لاحقاً من الأدمن بعد ما شركة الشحن تأكد التكلفة) */
  shippingFee: number | null
  total: number
  status: OrderStatus
  createdAt: string
  notes?: string
  /** ملاحظات داخلية يضيفها الأدمن على الطلب — لا يراها العميل */
  adminNotes?: string
}

/** إعدادات المتجر — رقم إنستاباي وبيانات التواصل */
export interface StoreSettings {
  instapayNumber: string
  storeName: string
  storePhone: string
  storeEmail: string
  storeAddress: string
  /** أرقام تليفونات متعددة للتواصل — منفصلة عن رقم إنستاباي الوحيد */
  contactPhones: string[]
}
