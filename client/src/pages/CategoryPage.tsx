// صفحة تصنيف المنتجات مع الفلاتر — /category/:slug
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import Breadcrumb from '@/components/category/Breadcrumb'
import CategoryFilters from '@/components/category/CategoryFilters'
import Seo from '@/components/Seo'
import CategoryToolbar from '@/components/category/CategoryToolbar'
import ProductCard from '@/components/ProductCard'
import { fetchCategoryBySlug } from '@/services/categories'
import { fetchProducts } from '@/services/products'
import type { Category, Product } from '@/types'
import {
  countActiveFilters,
  createDefaultFilters,
  filterAndSortProducts,
  type CategoryFilterState,
  type SortOption,
} from '@/utils/categoryFilters'

/** عدد المنتجات في كل صفحة — pagination محلي */
const PAGE_SIZE = 6

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()

  const [category, setCategory] = useState<Category | null>(null)
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [filters, setFilters] = useState<CategoryFilterState | null>(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // جلب التصنيف ومنتجاته عند تغيير الـ slug
  useEffect(() => {
    if (!slug) return
    let isMounted = true
    setIsLoading(true)
    setNotFound(false)

    fetchCategoryBySlug(slug)
      .then(async (cat) => {
        const products = await fetchProducts({ category: slug })
        if (!isMounted) return
        setCategory(cat)
        setCategoryProducts(products)
        setFilters(createDefaultFilters(products))
        setVisibleCount(PAGE_SIZE)
      })
      .catch(() => {
        if (isMounted) setNotFound(true)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [slug])

  const defaultFilters = useMemo(
    () => createDefaultFilters(categoryProducts),
    [categoryProducts],
  )

  // تطبيق الفلاتر والترتيب
  const filteredProducts = useMemo(
    () => (filters ? filterAndSortProducts(categoryProducts, filters) : []),
    [categoryProducts, filters],
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
  if (isLoading) {
    return (
      <div className="container-main flex min-h-[50vh] items-center justify-center py-16">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
      </div>
    )
  }

  // تصنيف غير موجود
  if (notFound || !category || !filters) {
    return (
      <div className="container-main flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
        <span className="material-symbols-outlined mb-4 text-5xl text-outline">category</span>
        <h1 className="mb-2 font-display text-2xl font-bold">التصنيف غير موجود</h1>
        <p className="mb-6 text-on-surface-variant">لم نجد تصنيفاً بهذا الاسم.</p>
        <Link
          to="/"
          className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-on-primary hover:bg-primary-container"
        >
          العودة للرئيسية
        </Link>
      </div>
    )
  }

  return (
    <div className="container-main pb-24 pt-4 md:pb-8 md:pt-6">
      <Seo
        title={category.name}
        description={category.description || `تسوّق ${category.name} بأفضل الأسعار في مصر`}
        path={`/category/${category.slug}`}
        image={category.image}
      />

      {/* مسار التنقل */}
      <Breadcrumb
        items={[
          { label: 'الرئيسية', path: '/' },
          { label: category.name },
        ]}
      />

      {/* عنوان التصنيف */}
      <header className="mb-2 md:mb-4">
        <h1 className="mb-2 font-display text-2xl font-extrabold text-on-surface md:text-4xl">
          {category.name}
        </h1>
        <p className="max-w-2xl text-sm text-on-surface-variant md:text-base">
          {category.description}
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
          products={categoryProducts}
          filters={filters}
          defaultFilters={defaultFilters}
          onChange={setFilters}
        />

        {/* درج الفلاتر — موبايل */}
        <CategoryFilters
          variant="drawer"
          products={categoryProducts}
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
              <div className="grid grid-cols-2 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
                {visibleProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="grid"
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