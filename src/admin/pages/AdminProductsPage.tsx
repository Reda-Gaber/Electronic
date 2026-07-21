// إدارة المنتجات — جدول + بحث + فلاتر
// TODO: ربط هذا بالـ API عند توفر الباك إند — استبدال productStorage بطلبات حقيقية (GET/DELETE /products)
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories } from '@/utils/categoryStorage'
import { getProducts, saveProducts } from '@/utils/productStorage'
import { formatPrice } from '@/utils/helpers'

export default function AdminProductsPage() {
  // المنتجات تُحمّل من localStorage — أي حذف أو تعديل يُ persist فوراً
  const [products, setProducts] = useState(() => getProducts())
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  // منتج مطلوب تأكيد حذفه حالياً (لعرض نافذة تأكيد بسيطة)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return products.filter((product) => {
      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query)
      const matchesCategory = categoryFilter === 'all' || product.categoryId === categoryFilter
      return matchesQuery && matchesCategory
    })
  }, [products, searchQuery, categoryFilter])

  // حذف منتج من القائمة وحفظ التغيير في localStorage
  const confirmDelete = () => {
    if (!productToDelete) return
    const updated = products.filter((p) => p.id !== productToDelete)
    setProducts(updated)
    saveProducts(updated)
    setProductToDelete(null)
  }

  return (
    <div>
      {/* عنوان الصفحة + زر إضافة منتج */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-on-surface">
            إدارة المنتجات
          </h1>
          <p className="text-sm text-on-surface-variant">
            {filteredProducts.length} منتج من إجمالي {products.length}
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary shadow-[0_8px_16px_rgba(187,0,16,0.2)] transition-all hover:bg-primary-container active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          إضافة منتج جديد
        </Link>
      </div>

      {/* شريط البحث والفلاتر */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 md:max-w-sm">
          <span className="material-symbols-outlined text-lg text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم أو الماركة..."
            className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface outline-none focus:border-primary md:w-56"
        >
          <option value="all">كل التصنيفات</option>
          {getCategories().map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* جدول المنتجات */}
      <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="material-symbols-outlined mb-3 text-4xl text-outline">
              search_off
            </span>
            <p className="font-bold text-on-surface">لا توجد منتجات مطابقة</p>
            <p className="text-sm text-on-surface-variant">جرّب تعديل البحث أو الفلتر</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-outline-variant text-right text-on-surface-variant">
                  <th className="p-4 font-bold">المنتج</th>
                  <th className="p-4 font-bold">التصنيف</th>
                  <th className="p-4 font-bold">السعر</th>
                  <th className="p-4 font-bold">المخزون</th>
                  <th className="p-4 font-bold">الحالة</th>
                  <th className="p-4 font-bold">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-outline-variant/60 transition-colors last:border-0 hover:bg-surface-container-low"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 shrink-0 rounded-lg bg-surface-container-low object-contain p-1"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-bold text-on-surface">{product.name}</p>
                          <p className="text-xs text-on-surface-variant">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-on-surface-variant">{product.categoryName}</td>
                    <td className="p-4 font-bold text-on-surface">{formatPrice(product.price)}</td>
                    <td className="p-4 text-on-surface-variant">
                      {product.stockCount}
                      {product.stockCount <= 5 && product.inStock && (
                        <span className="mr-1.5 text-xs font-bold text-error">(منخفض)</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            product.inStock
                              ? 'bg-tertiary/10 text-tertiary'
                              : 'bg-surface-container-high text-on-surface-variant'
                          }`}
                        >
                          {product.inStock ? 'متوفر' : 'غير متوفر'}
                        </span>
                        {product.status === 'draft' && (
                          <span className="rounded-full bg-surface-container-high px-2.5 py-1 text-xs font-bold text-on-surface-variant">
                            مسودة
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
                          aria-label={`تعديل ${product.name}`}
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setProductToDelete(product.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container"
                          aria-label={`حذف ${product.name}`}
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* === نافذة تأكيد الحذف === */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-surface-container-lowest p-6 text-center shadow-2xl">
            <span className="material-symbols-outlined mb-3 text-4xl text-error">warning</span>
            <h2 className="mb-2 font-display text-lg font-bold text-on-surface">
              تأكيد حذف المنتج
            </h2>
            <p className="mb-5 text-sm text-on-surface-variant">
              هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 rounded-xl border-2 border-outline-variant py-2.5 text-sm font-bold text-on-surface hover:border-outline"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 rounded-xl bg-error py-2.5 text-sm font-bold text-on-error hover:opacity-90"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
