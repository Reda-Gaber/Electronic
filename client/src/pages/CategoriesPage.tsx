/**
 * CategoriesPage — صفحة تصفح كل الفئات — /categories
 *
 * الوظيفة: صفحة حقيقية (مش نافذة منبثقة) بتعرض بوكسات كل التصنيفات، بالإضافة
 * لبوكس "كل المنتجات". بما إنها صفحة ليها رابط خاص بيها، زرار "رجوع" من
 * صفحة منتجات أي فئة بيرجّع المستخدم هنا تلقائيًا بدل ما يرجعه للرئيسية
 * (المشكلة اللي كانت موجودة مع النافذة المنبثقة القديمة CategoriesOverlay)
 */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '@/components/category/Breadcrumb'
import { fetchCategories } from '@/services/categories'
import type { Category } from '@/types'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    fetchCategories()
      .then((data) => {
        if (isMounted) setCategories(data)
      })
      .catch(() => {
        if (isMounted) setCategories([])
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="container-main pb-24 pt-4 md:pb-12 md:pt-6">
      <Breadcrumb items={[{ label: 'الرئيسية', path: '/' }, { label: 'الفئات' }]} />

      <header className="mb-6 md:mb-8">
        <h1 className="mb-2 font-display text-2xl font-extrabold text-on-surface md:text-4xl">
          تصفح حسب الفئة
        </h1>
        <p className="max-w-2xl text-sm text-on-surface-variant md:text-base">
          اختر الفئة اللي محتاجها، أو تصفح كل المنتجات مرة واحدة
        </p>
      </header>

      {isLoading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {/* بوكس "كل المنتجات" — ثابت دايمًا في البداية */}
          <Link
            to="/products"
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 text-center transition-all hover:shadow-lg"
          >
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-primary text-on-primary transition-transform group-hover:scale-110">
              <span className="material-symbols-outlined text-2xl">apps</span>
            </div>
            <span className="font-display text-sm font-bold text-primary">كل المنتجات</span>
          </Link>

          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
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
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
