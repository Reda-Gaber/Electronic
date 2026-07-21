// صفحة "من نحن" — نبذة تعريفية عن المتجر بتصميم متكامل مع باقي الموقع
import { Link } from 'react-router-dom'
import { getSettings } from '@/utils/settingsStorage'

/** أرقام موجزة تبني الثقة — بيانات تعريفية ثابتة حالياً */
const storeStats = [
  { value: '+5000', label: 'عميل راضٍ' },
  { value: '+800', label: 'منتج أصلي' },
  { value: '27', label: 'محافظة نوصّل لها' },
  { value: '4.9', label: 'تقييم العملاء' },
]

/** بطاقات "ليه تختارنا" — نفس أسلوب الأيقونات الدائرية المستخدم بالموقع */
const whyUs = [
  {
    icon: 'verified',
    title: 'منتجات أصلية 100%',
    description: 'كل قطعة مستوردة من موزعين معتمدين، وتأتي بضمان الوكيل الرسمي.',
  },
  {
    icon: 'local_shipping',
    title: 'شحن لكل المحافظات',
    description: 'نوصّل طلبك أينما كنت في مصر، مع تتبع واضح لحالة كل طلب.',
  },
  {
    icon: 'payments',
    title: 'دفع مرن وآمن',
    description: 'ادفع كاش عند الاستلام أو عبر إنستاباي، من غير أي تعقيد.',
  },
  {
    icon: 'support_agent',
    title: 'دعم فني حقيقي',
    description: 'فريقنا بيتواصل معاك شخصياً بعد كل طلب لتأكيد التفاصيل ومساعدتك.',
  },
]

export default function AboutPage() {
  const settings = getSettings()

  return (
    <div className="pb-24 md:pb-12">
      {/* === هيرو مصغّر === */}
      <section className="mb-12 md:mb-16">
        <div className="hero-gradient relative overflow-hidden border-b border-outline-variant">
          <div className="container-main flex min-h-[220px] flex-col items-center justify-center py-14 text-center md:min-h-[280px]">
            <span className="mb-4 w-fit rounded-full bg-primary px-3 py-1 text-xs font-bold text-on-primary">
              قصتنا
            </span>
            <h1 className="mb-4 max-w-2xl font-display text-3xl font-black leading-tight text-on-surface md:text-4xl">
              متجرك الموثوق لعالم الهاردوير
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-on-surface-variant md:text-base">
              {settings.storeName} هو وجهتك الأولى للحصول على أحدث قطع الكمبيوتر
              والعتاد الاحترافي بأسعار تنافسية وضمان حقيقي.
            </p>
          </div>
        </div>
      </section>

      <div className="container-main">
        {/* === إحصائيات === */}
        <section className="mb-14 grid grid-cols-2 gap-4 md:mb-20 md:grid-cols-4 md:gap-6">
          {storeStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 text-center"
            >
              <p className="mb-1 font-display text-2xl font-black text-primary md:text-3xl">
                {stat.value}
              </p>
              <p className="text-xs font-bold text-on-surface-variant md:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* === قصتنا (نص + صورة) === */}
        <section className="mb-14 grid grid-cols-1 items-center gap-8 md:mb-20 md:grid-cols-2 md:gap-12">
          <div className="order-2 md:order-1">
            <h2 className="mb-4 font-display text-2xl font-bold text-on-surface md:text-3xl">
              مين إحنا؟
            </h2>
            <div className="space-y-4 leading-relaxed text-on-surface-variant">
              <p>
                بدأنا رحلتنا بشغف حقيقي بعالم الجيمنج وصناعة المحتوى، وقررنا نبني متجر
                يوفّر لكل لاعب ومحترف عتاداً يليق بطموحه، من غير ما يقلق من مصدر المنتج
                أو جودته.
              </p>
              <p>
                بننتقي كل منتج بعناية، ونتابع كل طلب من لحظة التأكيد لحد ما يوصل لباب
                العميل، عشان تجربتك معانا تبقى سهلة وآمنة من أول لحظة.
              </p>
            </div>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-on-primary shadow-lg shadow-primary/25 transition-all hover:bg-primary-container active:scale-95"
            >
              تصفح المنتجات
              <span className="material-symbols-outlined text-lg">arrow_back</span>
            </Link>
          </div>
          <div className="order-1 overflow-hidden rounded-3xl border border-outline-variant md:order-2">
            <img
              src="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800"
              alt="ورشة تجميع أجهزة الحاسوب"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </section>

        {/* === ليه تختارنا === */}
        <section className="mb-4">
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-on-surface md:text-3xl">
            ليه تختار {settings.storeName}؟
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 text-center transition-shadow hover:shadow-lg"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                </div>
                <h3 className="mb-2 font-display text-base font-bold text-on-surface">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
