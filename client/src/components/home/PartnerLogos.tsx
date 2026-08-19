/**
 * PartnerLogos — قسم "قصة المتجر" (كان اسمه "شركاء النجاح" سابقًا)
 *
 * الوظيفة: عرض نبذة عن تاريخ المتجر وخبرته، ببادچ سنة التأسيس وإحصائية بارزة
 * لعدد سنين الخبرة بدل نص مكدّس
 * Props: لا يوجد — نص ثابت
 * الاستخدام: HomePage — أسفل الصفحة قبل الفوتر
 */
export default function PartnerLogos() {
  return (
    <section className="mb-12 md:mb-16">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-outline-variant/50 bg-surface-container-low">
        {/* شريط علوي بلون العلامة التجارية */}
        <div className="h-1.5 w-full bg-gradient-to-l from-primary via-primary-container to-primary" />

        <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-[auto_1fr] md:items-center md:p-12">
          {/* --- العمود الجانبي: أيقونة + سنة التأسيس + رقم الخبرة --- */}
          <div className="flex flex-row items-center justify-center gap-6 md:flex-col md:justify-start md:gap-4 md:border-l md:border-outline-variant/50 md:pl-12">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-[0_8px_16px_rgba(187,0,16,0.25)] md:h-20 md:w-20">
              <span className="material-symbols-outlined text-3xl md:text-4xl">verified</span>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-extrabold text-primary md:text-5xl">+20</p>
              <p className="text-xs font-bold text-on-surface-variant md:text-sm">سنة خبرة</p>
            </div>
          </div>

          {/* --- المحتوى النصي --- */}
          <div className="text-center md:text-right">
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary md:text-sm">
              تأسس عام 2004
            </span>
            <p className="mb-4 text-base leading-relaxed text-on-surface md:text-lg">
              تم تأسيس محل عبدالنبي للإلكترونيات عام 2004، ومنذ ذلك الحين ونحن نسعى لتقديم أفضل
              قطع الغيار والمستلزمات الإلكترونية بأعلى جودة وخدمة نثق بها.
            </p>
            <p className="mb-5 text-base leading-relaxed text-on-surface md:text-lg">
              ثقة عملائنا هي نجاحنا، ومستمرون معكم دائمًا نحو الأفضل. 🔧📺
            </p>
            <p className="font-display text-lg font-extrabold text-on-surface md:text-xl">
              عبدالنبي للإلكترونيات{' '}
              <span className="text-primary">— خبرة وثقة منذ 2004</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
