/**
 * HeroBanner — البانر الترويجي الرئيسي في الصفحة الرئيسية
 *
 * الوظيفة: بانر عريض بعرض الصفحة بالكامل مع عنوان وزرّي تسوق (مطابق لتصميم Stitch)
 * Props: لا يوجد — يقرأ البيانات من mockHeroBanner
 * الاستخدام: HomePage — أعلى الصفحة
 */
import { Link } from 'react-router-dom'
import { mockHeroBanner } from '@/data/mockData'

export default function HeroBanner() {
  return (
    <section className="mb-10 md:mb-14">
      <div className="hero-gradient relative overflow-hidden rounded-3xl border border-outline-variant">
        {/* صورة خلفية المنتج */}
        <div className="absolute inset-0">
          <img
            src={mockHeroBanner.image}
            alt={mockHeroBanner.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* تدرج للقراءة فوق الصورة */}
        <div className="absolute inset-0 bg-gradient-to-l from-surface via-surface/70 to-surface/30 md:via-surface/60 md:to-transparent" />

        {/* المحتوى النصي */}
        <div className="relative z-10 flex min-h-[340px] flex-col justify-center px-6 py-12 md:min-h-[420px] md:px-14">
          <span className="mb-4 w-fit rounded-full bg-primary px-3 py-1 text-xs font-bold text-on-primary">
            {mockHeroBanner.badge}
          </span>

          <h1 className="mb-6 max-w-xl font-display text-3xl font-black leading-tight text-on-surface md:text-5xl">
            قوة الأداء بين يديك
            <br />
            <span className="text-primary">أحدث كروت الشاشة</span>
          </h1>

          <p className="mb-8 max-w-lg text-sm leading-relaxed text-on-surface-variant md:text-base">
            اكتشف التشكيلة الأوسع من معالجات الرسوميات للجيل القادم. تجربة لعب
            استثنائية وأداء لا يضاهى في صناعة المحتوى.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to={mockHeroBanner.ctaLink}
              className="flex items-center gap-2 rounded-full bg-primary px-10 py-4 text-sm font-bold text-on-primary shadow-lg shadow-primary/25 transition-all hover:bg-primary-container active:scale-95"
            >
              تسوق الآن
            </Link>
            <Link
              to="/category/graphics-cards"
              className="flex items-center gap-2 rounded-full border-2 border-outline-variant bg-surface-container-lowest/60 px-10 py-4 text-sm font-bold text-on-surface backdrop-blur-sm transition-all hover:border-primary hover:text-primary active:scale-95"
            >
              شاهد العروض
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
