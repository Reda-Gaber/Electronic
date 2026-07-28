/**
 * PartnerLogos — قسم "شركاء النجاح" (شعارات الماركات الموثوقة)
 *
 * الوظيفة: عرض أسماء الماركات التي يتعامل معها المتجر بشكل نصي أنيق
 * Props: لا يوجد — قائمة ثابتة
 * الاستخدام: HomePage — أسفل الصفحة قبل الفوتر (يطابق تصميم Stitch)
 *
 * ملاحظة: استخدمنا أسماء نصية بدل صور شعارات حقيقية لتفادي أي مشاكل
 * متعلقة بحقوق الملكية الفكرية للعلامات التجارية. عند التعاقد الفعلي مع
 * موزعين، يمكن استبدال هذا بصور الشعارات الرسمية بعد الحصول على إذن استخدامها.
 */
const partnerBrands = ['ASUS', 'MSI', 'NVIDIA', 'CORSAIR', 'GIGABYTE']

export default function PartnerLogos() {
  return (
    <section className="mb-12 md:mb-16">
      <h2 className="mb-8 text-center font-display text-xl font-bold text-on-surface md:text-2xl">
        شركاء النجاح
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {partnerBrands.map((brand) => (
          <span
            key={brand}
            className="font-display text-xl font-black tracking-wide text-outline opacity-60 grayscale transition-all hover:text-primary hover:opacity-100 hover:grayscale-0 md:text-2xl"
          >
            {brand}
          </span>
        ))}
      </div>
    </section>
  )
}
