/**
 * CategoryFilters — لوحة فلاتر التصنيف (سايد بار + درج موبايل)
 *
 * الوظيفة: فلترة حسب الماركة، السعر، والتوفر
 * Props:
 *   - products: Product[] — لاستخراج الماركات ونطاق السعر
 *   - filters: CategoryFilterState — حالة الفلاتر الحالية
 *   - defaultFilters: CategoryFilterState — القيم الافتراضية لإعادة الضبط
 *   - onChange: (filters) => void — تحديث الفلاتر
 *   - mobileOpen: boolean — فتح/إغلاق درج الموبايل
 *   - onMobileClose: () => void
 *   - variant: 'sidebar' | 'drawer' — شكل العرض
 * الاستخدام: CategoryPage — على اليمين (RTL) في الديسكتوب
 */
import type { Product } from '@/types'
import type { CategoryFilterState } from '@/utils/categoryFilters'
import { formatPrice } from '@/utils/helpers'
import { getAvailableBrands } from '@/utils/categoryFilters'

interface CategoryFiltersProps {
  products: Product[]
  filters: CategoryFilterState
  defaultFilters: CategoryFilterState
  onChange: (filters: CategoryFilterState) => void
  mobileOpen?: boolean
  onMobileClose?: () => void
  variant?: 'sidebar' | 'drawer'
}

export default function CategoryFilters({
  products,
  filters,
  defaultFilters,
  onChange,
  mobileOpen = false,
  onMobileClose,
  variant = 'sidebar',
}: CategoryFiltersProps) {
  const brands = getAvailableBrands(products)
  const { min: priceMinBound, max: priceMaxBound } = {
    min: defaultFilters.priceMin,
    max: defaultFilters.priceMax,
  }

  // تبديل ماركة في قائمة الفلاتر
  const toggleBrand = (brand: string) => {
    const brands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand]
    onChange({ ...filters, brands })
  }

  // تحديث الحد الأدنى للسعر
  const handlePriceMin = (value: number) => {
    onChange({ ...filters, priceMin: Math.min(value, filters.priceMax) })
  }

  // تحديث الحد الأقصى للسعر
  const handlePriceMax = (value: number) => {
    onChange({ ...filters, priceMax: Math.max(value, filters.priceMin) })
  }

  // إعادة ضبط كل الفلاتر
  const handleReset = () => {
    onChange(defaultFilters)
  }

  const filterContent = (
    <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-6">
      <h3 className="mb-6 flex items-center gap-2 font-display text-lg font-bold text-on-surface">
        <span className="material-symbols-outlined text-primary">filter_list</span>
        تصفية النتائج
      </h3>

      {/* فلتر الماركة */}
      {brands.length > 0 && (
        <div className="mb-8">
          <h4 className="mb-4 text-sm font-bold text-on-surface">العلامة التجارية</h4>
          <div className="space-y-3">
            {brands.map((brand) => (
              <label
                key={brand}
                className="group flex cursor-pointer items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="h-5 w-5 rounded-lg border-outline-variant text-primary focus:ring-primary"
                />
                <span className="text-sm transition-colors group-hover:text-primary">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* فلتر نطاق السعر */}
      <div className="mb-8">
        <h4 className="mb-4 text-sm font-bold text-on-surface">نطاق السعر</h4>
        <div className="mb-3 flex items-center justify-between text-xs text-on-surface-variant">
          <span>{formatPrice(filters.priceMin)}</span>
          <span>{formatPrice(filters.priceMax)}</span>
        </div>
        <input
          type="range"
          min={priceMinBound}
          max={priceMaxBound}
          step={500}
          value={filters.priceMax}
          onChange={(e) => handlePriceMax(Number(e.target.value))}
          className="mb-2 w-full accent-primary"
        />
        <input
          type="range"
          min={priceMinBound}
          max={priceMaxBound}
          step={500}
          value={filters.priceMin}
          onChange={(e) => handlePriceMin(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      {/* فلتر التوفر */}
      <div className="mb-6">
        <h4 className="mb-4 text-sm font-bold text-on-surface">التوفر</h4>
        <label className="group flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              onChange({ ...filters, inStockOnly: e.target.checked })
            }
            className="h-5 w-5 rounded-lg border-outline-variant text-primary focus:ring-primary"
          />
          <span className="text-sm transition-colors group-hover:text-primary">
            متوفر في المخزن فقط
          </span>
        </label>
      </div>

      {/* أزرار التطبيق وإعادة الضبط */}
      <div className="flex flex-col gap-2">
        {variant === 'drawer' && onMobileClose && (
          <button
            type="button"
            onClick={onMobileClose}
            className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-on-primary transition-transform active:scale-95 hover:bg-primary-container"
          >
            تطبيق الفلاتر
          </button>
        )}
        <button
          type="button"
          onClick={handleReset}
          className="w-full rounded-xl border border-outline-variant py-2.5 text-sm font-medium text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
        >
          إعادة ضبط
        </button>
      </div>
    </div>
  )

  // درج الموبايل — ينزلق من اليمين
  if (variant === 'drawer') {
    if (!mobileOpen) return null
    return (
      <>
        <div
          className="fixed inset-0 z-[60] bg-on-surface/40 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
        <aside className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-sm flex-col overflow-y-auto bg-surface p-4 shadow-2xl lg:hidden">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-on-surface">تصفية</h2>
            <button
              type="button"
              onClick={onMobileClose}
              className="rounded-full p-2 hover:bg-surface-container-high"
              aria-label="إغلاق"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          {filterContent}
        </aside>
      </>
    )
  }

  // سايد بار الديسكتوب — sticky على اليمين
  return (
    <aside className="hidden lg:block lg:col-span-3">
      <div className="sticky top-24">{filterContent}</div>
    </aside>
  )
}
