// صفحة نتائج البحث — /search?q=...
// TODO: ربط هذا بالـ API عند توفر الباك إند — استبدال searchProducts ببحث حقيقي على السيرفر
import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '@/components/ProductCard'
import { searchProducts } from '@/utils/productHelpers'

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  const [inputValue, setInputValue] = useState(initialQuery)

  const results = searchProducts(initialQuery)

  // تحديث رابط الصفحة بالكلمة الجديدة عند الضغط على بحث
  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    setSearchParams(inputValue.trim() ? { q: inputValue.trim() } : {})
  }

  return (
    <div className="container-main pb-24 pt-4 md:pb-12 md:pt-6">
      {/* حقل بحث قابل للتعديل أعلى الصفحة */}
      <form onSubmit={handleSearch} className="mb-6 flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3">
          <span className="material-symbols-outlined text-lg text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
          />
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-on-primary hover:bg-primary-container"
        >
          بحث
        </button>
      </form>

      {/* عنوان النتائج */}
      {initialQuery && (
        <h1 className="mb-6 font-display text-lg font-bold text-on-surface md:text-xl">
          نتائج البحث عن "{initialQuery}"{' '}
          <span className="font-normal text-on-surface-variant">({results.length} منتج)</span>
        </h1>
      )}

      {/* شبكة النتائج أو حالة عدم وجود نتائج */}
      {!initialQuery ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="material-symbols-outlined mb-4 text-5xl text-outline">search</span>
          <p className="font-bold text-on-surface">اكتب كلمة بحث للبدء</p>
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="material-symbols-outlined mb-4 text-5xl text-outline">
            search_off
          </span>
          <p className="mb-1 font-bold text-on-surface">لا توجد منتجات مطابقة</p>
          <p className="text-sm text-on-surface-variant">
            جرّب كلمة بحث مختلفة أو تصفح التصنيفات مباشرة
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} variant="grid" />
          ))}
        </div>
      )}
    </div>
  )
}
