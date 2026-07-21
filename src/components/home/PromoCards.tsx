/**
 * PromoCards — قسم بطاقتي العروض الترويجية جنباً إلى جنب
 *
 * الوظيفة: عرض بطاقتين كبيرتين (التبريد المائي + إكسسوارات الجيمنج)
 * Props: لا يوجد — بيانات ثابتة مؤقتاً
 * الاستخدام: HomePage — بين "وصل حديثاً" و"شركاء النجاح" (يطابق تصميم Stitch)
 * TODO: ربط هذا بالـ API عند توفر الباك إند — جلب العروض الترويجية النشطة من السيرفر
 */
import { Link } from 'react-router-dom'

const promoCards = [
  {
    title: 'عروض التبريد المائي',
    description: 'خصومات تصل إلى 30% على جميع المبردات المائية',
    ctaLabel: 'تسوق العروض',
    link: '/category/processors',
    image:
      'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800',
  },
  {
    title: 'إكسسوارات الجيمنج',
    description: 'اجمع نقاطك واحصل على خصم فوري على الماوس والكيبورد',
    ctaLabel: 'اكتشف المزيد',
    link: '/category/graphics-cards',
    image:
      'https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=800',
  },
]

export default function PromoCards() {
  return (
    <section className="mb-10 md:mb-14">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {promoCards.map((promo) => (
          <div
            key={promo.title}
            className="group relative flex h-64 items-center overflow-hidden rounded-3xl border border-outline-variant/50 bg-surface-container-low md:h-[300px]"
          >
            {/* صورة خلفية خافتة */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${promo.image})` }}
            />

            {/* المحتوى النصي */}
            <div className="relative z-10 p-8 text-right md:p-12">
              <h3 className="mb-2 font-display text-xl font-bold text-primary md:text-2xl">
                {promo.title}
              </h3>
              <p className="mb-6 max-w-xs text-sm text-on-surface-variant">
                {promo.description}
              </p>
              <Link
                to={promo.link}
                className="inline-block rounded-full bg-primary px-8 py-3 text-sm font-bold text-on-primary transition-all hover:shadow-lg active:scale-95"
              >
                {promo.ctaLabel}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
