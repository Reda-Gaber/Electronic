// صفحة المضاف حديثاً — كل المنتجات المنشورة المعلَّمة كجديدة
import ProductCard from '@/components/ProductCard'
import { getPublishedProducts } from '@/utils/productStorage'

export default function NewArrivalsPage() {
  const newProducts = getPublishedProducts().filter((p) => p.isNew)

  return (
    <div className="container-main pb-24 pt-4 md:pb-12 md:pt-6">
      <h1 className="mb-2 font-display text-2xl font-extrabold text-on-surface md:text-3xl">
        المضاف حديثاً
      </h1>
      <p className="mb-6 text-sm text-on-surface-variant">
        {newProducts.length} منتج وصل حديثاً لمتجرنا
      </p>

      {newProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="material-symbols-outlined mb-4 text-5xl text-outline">
            new_releases
          </span>
          <p className="font-bold text-on-surface">لا توجد منتجات جديدة حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant="grid" />
          ))}
        </div>
      )}
    </div>
  )
}
