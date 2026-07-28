/**
 * FeaturedCategoryBoxes — بطاقات التصنيفات المميزة الكبيرة في الرئيسية
 *
 * الوظيفة: عرض أي تصنيف حدده الأدمن كـ "بوكس كبير" (بدل بوكسات العروض الثابتة
 * سابقاً)، باستخدام صورة ووصف التصنيف نفسه
 * Props: لا يوجد — يجيب التصنيفات المميزة من الـ API
 * الاستخدام: HomePage — بين "وصل حديثاً" و"شركاء النجاح"
 */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchCategories } from '@/services/categories'
import type { Category } from '@/types'

export default function FeaturedCategoryBoxes() {
  const [featuredCategories, setFeaturedCategories] = useState<Category[]>([])

  useEffect(() => {
    let isMounted = true
    fetchCategories()
      .then((data) => {
        if (isMounted) setFeaturedCategories(data.filter((c) => c.featuredOnHomepage))
      })
      .catch(() => {
        if (isMounted) setFeaturedCategories([])
      })
    return () => {
      isMounted = false
    }
  }, [])

  // لا نعرض القسم إطلاقاً إذا لم يحدد الأدمن أي تصنيف كبوكس مميز
  if (featuredCategories.length === 0) return null

  return (
    <section className="mb-10 md:mb-14">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {featuredCategories.map((category) => (
          <div
            key={category.id}
            className="group relative flex h-64 items-center overflow-hidden rounded-3xl border border-outline-variant/50 bg-surface-container-low md:h-[300px]"
          >
            {/* صورة خلفية خافتة */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${category.image})` }}
            />

            {/* المحتوى النصي */}
            <div className="relative z-10 p-8 text-right md:p-12">
              <h3 className="mb-2 font-display text-xl font-bold text-primary md:text-2xl">
                {category.name}
              </h3>
              <p className="mb-6 max-w-xs text-sm text-on-surface-variant">
                {category.description}
              </p>
              <Link
                to={`/category/${category.slug}`}
                className="inline-block rounded-full bg-primary px-8 py-3 text-sm font-bold text-on-primary transition-all hover:shadow-lg active:scale-95"
              >
                تسوق الآن
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
