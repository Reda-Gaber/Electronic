// الصفحة الرئيسية — مطابقة لتصميم Stitch: بانر، تصنيفات، وصل حديثاً، عروض، شركاء
// TODO: ربط هذا بالـ API عند توفر الباك إند — جلب البانر والمنتجات ديناميكياً
import HeroBanner from '@/components/home/HeroBanner'
import CategorySwiper from '@/components/home/CategorySwiper'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import FeaturedCategoryBoxes from '@/components/home/FeaturedCategoryBoxes'
import FeaturedDeals from '@/components/home/FeaturedDeals'
import PartnerLogos from '@/components/home/PartnerLogos'

export default function HomePage() {
  return (
    <div className="container-main pb-24 pt-4 md:pb-8 md:pt-6">
      {/* البانر الترويجي الرئيسي */}
      <HeroBanner />

      {/* تسوق حسب الفئة — Bento Grid */}
      <CategorySwiper />

      {/* بوكسات التصنيفات المميزة (صور كبيرة) — يتحكم فيها الأدمن من إدارة التصنيفات */}
      <FeaturedCategoryBoxes />

      {/* وصل حديثاً — 6 منتجات + زر عرض المزيد */}
      <FeaturedProducts
        title="وصل حديثاً"
        viewAllLink="/new-arrivals"
        filter="new"
        limit={6}
      />

      {/* العروض — 6 منتجات + زر عرض المزيد */}
      <FeaturedDeals />

      {/* شركاء النجاح */}
      <PartnerLogos />
    </div>
  )
}
