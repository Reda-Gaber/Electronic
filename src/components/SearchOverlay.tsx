/**
 * SearchOverlay — نافذة البحث المنبثقة عن المنتجات
 *
 * الوظيفة: حقل بحث فوري يظهر أفضل 6 نتائج مطابقة أثناء الكتابة، مع رابط
 * لعرض كل النتائج في صفحة مستقلة عند الضغط على Enter أو زر "عرض الكل"
 * Props:
 *   - isOpen: هل النافذة ظاهرة حالياً
 *   - onClose: دالة إغلاق النافذة
 * الاستخدام: Header.tsx — يظهر عند الضغط على أيقونة البحث
 */
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchProducts } from '@/utils/productHelpers'
import { formatPrice } from '@/utils/helpers'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const MAX_QUICK_RESULTS = 6

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // نتائج البحث الفوري — أول 6 نتائج مطابقة بس
  const allResults = searchProducts(query)
  const quickResults = allResults.slice(0, MAX_QUICK_RESULTS)

  // تركيز تلقائي على حقل البحث فور فتح النافذة
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      // تأخير بسيط لضمان أن العنصر أصبح مرئياً قبل التركيز عليه
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

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

  // الانتقال لصفحة كل النتائج
  const goToFullResults = () => {
    if (!query.trim()) return
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    onClose()
  }

  const handleResultClick = (slug: string) => {
    navigate(`/product/${slug}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[80] flex justify-center bg-on-surface/40 px-4 pt-20 backdrop-blur-sm md:pt-28">
      {/* طبقة إغلاق عند الضغط خارج النافذة */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 h-fit w-full max-w-xl rounded-2xl bg-surface-container-lowest shadow-2xl">
        {/* حقل البحث */}
        <div className="flex items-center gap-3 border-b border-outline-variant p-4">
          <span className="material-symbols-outlined text-xl text-on-surface-variant">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && goToFullResults()}
            placeholder="ابحث عن كروت شاشة، معالجات، رامات..."
            className="flex-1 bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container-high"
            aria-label="إغلاق البحث"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* النتائج */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {!query.trim() ? (
            <p className="p-6 text-center text-sm text-on-surface-variant">
              اكتب اسم المنتج أو الماركة أو التصنيف للبحث
            </p>
          ) : quickResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <span className="material-symbols-outlined mb-2 text-3xl text-outline">
                search_off
              </span>
              <p className="text-sm font-bold text-on-surface">لا توجد نتائج لـ "{query}"</p>
              <p className="text-xs text-on-surface-variant">جرّب كلمة بحث مختلفة</p>
            </div>
          ) : (
            <ul>
              {quickResults.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    onClick={() => handleResultClick(product.slug)}
                    className="flex w-full items-center gap-3 rounded-xl p-2.5 text-right transition-colors hover:bg-surface-container-low"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 shrink-0 rounded-lg bg-surface-container-low object-contain p-1"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-on-surface">{product.name}</p>
                      <p className="text-xs text-on-surface-variant">{product.categoryName}</p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* عرض كل النتائج — يظهر فقط لو فيه نتائج أكتر من المعروض */}
        {query.trim() && allResults.length > 0 && (
          <button
            type="button"
            onClick={goToFullResults}
            className="flex w-full items-center justify-center gap-1.5 rounded-b-2xl border-t border-outline-variant py-3 text-sm font-bold text-primary hover:bg-surface-container-low"
          >
            عرض كل النتائج ({allResults.length})
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
        )}
      </div>
    </div>
  )
}
