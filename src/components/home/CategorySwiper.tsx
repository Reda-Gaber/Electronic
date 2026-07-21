/**
 * CategorySwiper — قسم "تسوق حسب الفئة" بتصميم Bento Grid
 *
 * الوظيفة: عرض شبكة تصنيفات، مع تكبير أول تصنيف (الأكثر أهمية) ليأخذ عمودين
 * Props: لا يوجد — يقرأ من categoryStorage (يعكس أي تعديل من لوحة الأدمن)
 * الاستخدام: HomePage — قسم التصنيفات (يطابق تصميم Stitch: Categories Bento Grid)
 */
import { Link } from 'react-router-dom'
import { getCategories } from '@/utils/categoryStorage'

export default function CategorySwiper() {
  const categories = getCategories()

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
          to="/category/graphics-cards"
          className="shrink-0 text-sm font-bold text-primary transition-colors hover:text-primary-container"
        >
          عرض الكل
        </Link>
      </div>

      {/* شبكة Bento — أول تصنيف يأخذ عمودين لإبرازه */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            className={`group flex flex-col items-center justify-center gap-4 rounded-2xl border border-outline-variant/50 bg-surface-container-low p-6 text-center transition-all hover:shadow-xl md:p-8 ${
              index === 0 ? 'col-span-2 md:col-span-2' : 'col-span-1'
            }`}
          >
            <div
              className={`flex items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110 ${
                index === 0 ? 'h-20 w-20' : 'h-16 w-16'
              }`}
            >
              {category.isCustomIcon ? (
                <img src={category.icon} alt={category.name} className="h-full w-full object-cover" />
              ) : (
                <span className={`material-symbols-outlined ${index === 0 ? 'text-4xl' : 'text-3xl'}`}>
                  {category.icon || 'category'}
                </span>
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
