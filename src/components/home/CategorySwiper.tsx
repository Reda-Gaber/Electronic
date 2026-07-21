import { Link } from 'react-router-dom'
import { getCategories } from '@/utils/categoryStorage'

export default function CategorySwiper() {
  const categories = getCategories().slice(0, 6)

  return (
    <section className="mb-10 md:mb-14">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-on-surface md:text-2xl">
            تسوق حسب الفئة
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            اختر الفئة المناسبة لأحدث القطع والأدوات التقنية
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            className="group relative overflow-hidden rounded-3xl border border-outline-variant/50 bg-surface-container-low p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${category.image})` }}
            />

            <div className="relative z-10 flex min-h-[140px] flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {category.productCount} قطعة
                </span>
                <span className="material-symbols-outlined text-2xl text-primary">
                  {category.icon || 'category'}
                </span>
              </div>

              <div>
                <h3 className="mb-2 font-display text-lg font-bold text-on-surface">
                  {category.name}
                </h3>
                <p className="text-sm leading-6 text-on-surface-variant">
                  {category.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
