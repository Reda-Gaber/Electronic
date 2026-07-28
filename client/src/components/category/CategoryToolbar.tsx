/**
 * CategoryToolbar — شريط الفلترة والترتيب الثابت
 *
 * الوظيفة: زر فتح الفلاتر (موبايل)، قائمة الترتيب، وعدد المنتجات
 * Props:
 *   - productCount: number — عدد المنتجات بعد الفلترة
 *   - sort: SortOption — الترتيب الحالي
 *   - onSortChange: (sort) => void
 *   - onOpenFilters: () => void — فتح درج الفلاتر على الموبايل
 *   - activeFilterCount: number — عدد الفلاتر النشطة
 * الاستخدام: CategoryPage — أسفل عنوان الصفحة
 */
import type { SortOption } from '@/utils/categoryFilters'
import { sortOptions } from '@/utils/categoryFilters'

interface CategoryToolbarProps {
  productCount: number
  sort: SortOption
  onSortChange: (sort: SortOption) => void
  onOpenFilters: () => void
  activeFilterCount: number
}

export default function CategoryToolbar({
  productCount,
  sort,
  onSortChange,
  onOpenFilters,
  activeFilterCount,
}: CategoryToolbarProps) {
  return (
    <section className="sticky top-16 z-30 -mx-4 mb-6 border-b border-outline-variant/30 bg-background/95 px-4 py-4 backdrop-blur-sm md:-mx-10 md:px-10">
      <div className="flex items-center justify-between gap-4 overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-2">
          {/* زر الفلاتر — يظهر على الموبايل والتابلت */}
          <button
            type="button"
            onClick={onOpenFilters}
            className="relative flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container px-4 py-2 text-sm font-bold text-on-surface transition-transform active:scale-95 lg:hidden"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
            تصفية
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* قائمة الترتيب */}
          <div className="relative flex items-center gap-2 rounded-xl border border-outline-variant/50 bg-surface-container-low px-4 py-2">
            <span className="hidden text-xs text-outline sm:inline">الترتيب:</span>
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="cursor-pointer border-none bg-transparent text-sm font-bold text-on-surface focus:ring-0"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined pointer-events-none text-[18px] text-on-surface-variant">
              expand_more
            </span>
          </div>
        </div>

        {/* عدد المنتجات */}
        <span className="shrink-0 whitespace-nowrap text-xs text-outline">
          {productCount} منتج
        </span>
      </div>
    </section>
  )
}
