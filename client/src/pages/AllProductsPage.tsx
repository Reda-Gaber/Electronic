// صفحة كل المنتجات (بدون فلترة بفئة معيّنة) — /products
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import Breadcrumb from '@/components/category/Breadcrumb'
import CategoryFilters from '@/components/category/CategoryFilters'
import CategoryToolbar from '@/components/category/CategoryToolbar'
import ProductCard from '@/components/ProductCard'
import { fetchProducts } from '@/services/products'
import type { Product } from '@/types'
import {
  countActiveFilters,
  createDefaultFilters,
  filterAndSortProducts,
  type CategoryFilterState,
  type SortOption,
} from '@/utils/categoryFilters'

/** عدد المنتجات في كل صفحة — pagination محلي */
const PAGE_SIZE = 6

export default function AllProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [filters, setFilters] = useState<CategoryFilterState | null>(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // جلب كل المنتجات المنشورة — بدون تحديد فئة
  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    fetchProducts({})
      .then((products) => {
        if (!isMounted) return
        setAllProducts(products)
        setFilters(createDefaultFilters(products))
        setVisibleCount(PAGE_SIZE)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const defaultFilters = useMemo(() => createDefaultFilters(allProducts), [allProducts])

  // تطبيق الفلاتر والترتيب
  const filteredProducts = useMemo(
    () => (filters ? filterAndSortProducts(allProducts, filters) : []),
    [allProducts, filters],
  )

  const visibleProducts = filteredProducts.slice(0, visibleCount)
  const activeFilterCount = filters ? countActiveFilters(filters, defaultFilters) : 0
  const hasMore = visibleCount < filteredProducts.length

  // تحديث الترتيب فقط
  const handleSortChange = (sort: SortOption) => {
    setFilters((prev) => (prev ? { ...prev, sort } : prev))
    setVisibleCount(PAGE_SIZE)
  }

  // حالة التحميل
  if (isLoading || !filters) {
    return (
      <div className="container-main flex min-h-[50vh] items-center justify-center py-16">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
      </div>
    )
  }

  return (
    <div className="container-main pb-24 pt-4 md:pb-8 md:pt-6">
      {/* مسار التنقل */}
      <Breadcrumb items={[{ label: 'الرئيسية', path: '/' }, { label: 'كل المنتجات' }]} />

      {/* عنوان الصفحة */}
      <header className="mb-2 md:mb-4">
        <h1 className="mb-2 font-display text-2xl font-extrabold text-on-surface md:text-4xl">
          كل المنتجات
        </h1>
        <p className="max-w-2xl text-sm text-on-surface-variant md:text-base">
          تصفح كل منتجاتنا من جميع الفئات في مكان واحد
        </p>
      </header>

      {/* شريط الفلترة والترتيب الثابت */}
      <CategoryToolbar
        productCount={filteredProducts.length}
        sort={filters.sort}
        onSortChange={handleSortChange}
        onOpenFilters={() => setMobileFiltersOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      {/* تخطيط: سايد بار فلاتر + شبكة منتجات */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* سايد بار الفلاتر — ديسكتوب */}
        <CategoryFilters
          variant="sidebar"
          products={allProducts}
          filters={filters}
          defaultFilters={defaultFilters}
          onChange={setFilters}
        />

        {/* درج الفلاتر — موبايل */}
        <CategoryFilters
          variant="drawer"
          products={allProducts}
          filters={filters}
          defaultFilters={defaultFilters}
          onChange={setFilters}
          mobileOpen={mobileFiltersOpen}
          onMobileClose={() => setMobileFiltersOpen(false)}
        />

        {/* شبكة المنتجات */}
        <section className="lg:col-span-9">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-outline-variant bg-surface-container-low py-16 text-center">
              <span className="material-symbols-outlined mb-4 text-5xl text-outline">
                search_off
              </span>
              <h2 className="mb-2 font-display text-lg font-bold">لا توجد منتجات</h2>
              <p className="mb-4 text-sm text-on-surface-variant">
                جرّب تغيير الفلاتر أو إعادة ضبطها
              </p>
              <button
                type="button"
                onClick={() => setFilters(defaultFilters)}
                className="rounded-xl border border-primary px-6 py-2 text-sm font-bold text-primary hover:bg-primary/5"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {visibleProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="category"
                    className="animate-card"
                    style={{ animationDelay: `${index * 0.05}s` } as CSSProperties}
                  />
                ))}
              </div>

              {/* زر عرض المزيد */}
              {hasMore && (
                <div className="mt-12 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="flex items-center gap-2 rounded-full border-2 border-primary/20 px-8 py-3 text-sm font-bold text-primary transition-all hover:bg-primary/5 active:scale-95"
                  >
                    عرض المزيد من المنتجات
                    <span className="material-symbols-outlined text-[20px]">refresh</span>
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  )
}
