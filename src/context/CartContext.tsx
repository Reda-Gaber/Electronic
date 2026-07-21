/**
 * CartContext — إدارة حالة سلة التسوق على مستوى التطبيق
 *
 * الوظيفة: تخزين المنتجات المضافة للسلة محلياً في localStorage
 * Props (Provider): children — المكونات الفرعية التي تحتاج الوصول للسلة
 * الاستخدام: يلف التطبيق في main.tsx — Header، CartDrawer، Checkout، ProductDetail
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartItem, Product } from '@/types'
import {
  calculateCartItemCount,
  calculateCartTotal,
} from '@/utils/helpers'

/** مفتاح التخزين المحلي لبيانات السلة */
const CART_STORAGE_KEY = 'pc-tech-cart'

/** شكل بيانات السلة في localStorage */
interface CartContextValue {
  items: CartItem[]
  itemCount: number
  total: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

// إنشاء Context بقيمة افتراضية null — يُملأ من Provider
const CartContext = createContext<CartContextValue | null>(null)

/** قراءة السلة من localStorage عند بدء التطبيق */
function loadCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as CartItem[]
    }
  } catch {
    // TODO: ربط هذا بالـ API عند توفر الباك إند — معالجة أخطاء المزامنة
    localStorage.removeItem(CART_STORAGE_KEY)
  }
  return []
}

/** حفظ السلة في localStorage عند كل تغيير */
function saveCartToStorage(items: CartItem[]): void {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

/**
 * CartProvider — يوفّر حالة السلة لكل المكونات الفرعية
 * Props: children — شجرة React تحت التطبيق
 */
export function CartProvider({ children }: { children: ReactNode }) {
  // حالة عناصر السلة — تُحمّل من localStorage
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage())
  // حالة فتح/إغلاق درج السلة الجانبي
  const [isCartOpen, setIsCartOpen] = useState(false)

  // مزامنة السلة مع localStorage عند أي تغيير
  useEffect(() => {
    saveCartToStorage(items)
  }, [items])

  // حساب عدد القطع والإجمالي — مشتق من items
  const itemCount = useMemo(() => calculateCartItemCount(items), [items])
  const total = useMemo(() => calculateCartTotal(items), [items])

  // فتح درج السلة
  const openCart = useCallback(() => setIsCartOpen(true), [])
  // إغلاق درج السلة
  const closeCart = useCallback(() => setIsCartOpen(false), [])
  // تبديل حالة درج السلة
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), [])

  /**
   * إضافة منتج للسلة — إذا موجود يزيد الكمية، وإلا يضيف عنصر جديد
   */
  const addToCart = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }
      return [...prev, { product, quantity }]
    })
    setIsCartOpen(true)
  }, [])

  /** حذف منتج من السلة بالكامل */
  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId))
  }, [])

  /** تحديث كمية منتج — إذا أصبحت 0 يُحذف */
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.product.id !== productId))
      return
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    )
  }, [])

  /** تفريغ السلة بالكامل — بعد إتمام الطلب */
  const clearCart = useCallback(() => {
    setItems([])
    setIsCartOpen(false)
  }, [])

  const value = useMemo(
    () => ({
      items,
      itemCount,
      total,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      itemCount,
      total,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

/** Hook للوصول لحالة السلة — يُستخدم في أي مكون داخل Provider */
export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart يجب استخدامه داخل CartProvider')
  }
  return context
}
