/**
 * CategoriesOverlay — نافذة منبثقة تعرض بوكسات كل التصنيفات فقط
 *
 * الوظيفة: تظهر كشاشة منفصلة بخلفية Blur، وتعرض شبكة تصنيفات فقط (بدون أي
 * محتوى آخر). الضغط على أي بوكس يغلق النافذة وينقل مباشرة لصفحة منتجات
 * هذا التصنيف
 * Props:
 *   - isOpen: هل النافذة ظاهرة حالياً
 *   - onClose: دالة إغلاق النافذة
 * الاستخدام: Header.tsx (ديسكتوب) و MobileBottomNav.tsx (موبايل) — يظهر
 * عند الضغط على "الفئات" بدل الانتقال المباشر لصفحة تصنيف واحد
 */
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategories } from '@/utils/categoryStorage'

interface CategoriesOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export default function CategoriesOverlay({ isOpen, onClose }: CategoriesOverlayProps) {
  const navigate = useNavigate()
  const categories = getCategories()

  // إغلاق النافذة بمفتاح Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleCategoryClick = (slug: string) => {
    navigate(`/category/${slug}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-on-surface/40 px-4 backdrop-blur-md">
      {/* طبقة إغلاق عند الضغط خارج النافذة */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-surface-container-lowest p-6 shadow-2xl md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-on-surface md:text-xl">
            تصفح حسب الفئة
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container-high"
            aria-label="إغلاق"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* شبكة بوكسات التصنيفات فقط */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryClick(category.slug)}
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-outline-variant/50 bg-surface-container-low p-6 text-center transition-all hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
                {category.isCustomIcon ? (
                  <img
                    src={category.icon}
                    alt={category.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-2xl">{category.icon}</span>
                )}
              </div>
              <span className="font-display text-sm font-bold text-on-surface">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
