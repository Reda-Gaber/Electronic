/**
 * CategorySwiper — قسم "تسوق حسب الفئة" بتصميم Bento Grid
 *
 * الوظيفة: عرض شبكة تصنيفات، مع تكبير أول تصنيف (الأكثر أهمية) ليأخذ عمودين
 * Props: لا يوجد — يجيب التصنيفات من الـ API (يعكس أي تعديل من لوحة الأدمن)
 * الاستخدام: HomePage — قسم التصنيفات (يطابق تصميم Stitch: Categories Bento Grid)
 */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchCategories } from '@/services/categories'
import type { Category } from '@/types'

export default function CategorySwiper() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    let isMounted = true
    fetchCategories()
      .then((data) => {
        if (isMounted) setCategories(data)
      })
      .catch(() => {
        if (isMounted) setCategories([])
      })
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="mb-10 md:mb-14">
      {/* رأس القسم: عنوان + وصف فرعي + رابط عرض الكل */}
      <div className="mb-6 flex items-end justify-between md:mb-8">
        <div>
          <h2 className="font-display text-xl font-bold text-on-surface md:text-2xl">
            تسوق حسب الفئة
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            اختر العتاد المناسب لجهازك القادم
          </p>
        </div>
        <Link
          to="/categories"
          className="shrink-0 text-sm font-bold text-primary transition-colors hover:text-primary-container"
        >
          عرض الكل
        </Link>
      </div>

      {/* شبكة Bento — على الموبايل كل البوكسات متساوية (بوكسين في كل سطر)،
          وعلى الديسكتوب أول تصنيف ياخد عمودين لإبرازه */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
        {/* بوكس ثابت لكل المنتجات — أول عنصر دايمًا، بعرض بوكسين على كل المقاسات */}
        <Link
          to="/products"
          className="group col-span-2 flex flex-col items-center justify-center gap-4 rounded-2xl border border-outline-variant/50 bg-surface-container-low p-6 text-center transition-all hover:shadow-xl md:p-8"
        >
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110 md:h-20 md:w-20">
            <span className="material-symbols-outlined text-3xl md:text-4xl">apps</span>
          </div>
          <span className="font-display text-sm font-bold text-on-surface md:text-base">
            كل المنتجات
          </span>
        </Link>

        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            className="group flex flex-col items-center justify-center gap-4 rounded-2xl border border-outline-variant/50 bg-surface-container-low p-6 text-center transition-all hover:shadow-xl md:p-8"
          >
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
              {category.isCustomIcon ? (
                <img src={category.icon} alt={category.name} className="h-full w-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-3xl">{category.icon || 'category'}</span>
              )}
            </div>
            <span className="font-display text-sm font-bold text-on-surface md:text-base">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}