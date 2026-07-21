/**
 * TrustBadges — شارات الثقة (شحن، ضمان، دعم)
 *
 * الوظيفة: عرض مميزات المتجر لبناء الثقة
 * Props: لا يوجد
 * الاستخدام: HomePage — بين الأقسام
 */
const badges = [
  { icon: 'local_shipping', title: 'شحن سريع', desc: 'توصيل لكل المحافظات' },
  { icon: 'verified_user', title: 'ضمان أصلي', desc: 'منتجات 100% أصلية' },
  { icon: 'support_agent', title: 'دعم فني', desc: 'مساعدة في اختيار القطع' },
  { icon: 'payments', title: 'دفع آمن', desc: 'كاش أو إنستاباي' },
]

export default function TrustBadges() {
  return (
    <section className="mb-10">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {badges.map((badge) => (
          <div
            key={badge.title}
            className="flex flex-col items-center rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 text-center transition-shadow hover:shadow-md"
          >
            <span className="material-symbols-outlined mb-2 text-3xl text-primary">
              {badge.icon}
            </span>
            <h4 className="mb-1 text-sm font-bold text-on-surface">{badge.title}</h4>
            <p className="text-xs text-on-surface-variant">{badge.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
