// صفحة تواصل معنا — بتصميم متكامل مع باقي الموقع (هيرو + بطاقات تواصل + فورم)
// TODO: ربط هذا بالـ API عند توفر الباك إند — إرسال الرسالة فعلياً لبريد/نظام دعم
import { useState, type FormEvent } from 'react'
import { getSettings } from '@/utils/settingsStorage'

export default function ContactPage() {
  const settings = getSettings()

  /** طرق التواصل المعروضة كبطاقات أعلى الصفحة — تُقرأ من إعدادات المتجر */
  const contactMethods = [
    {
      icon: 'call',
      title: 'اتصل بنا',
      value: settings.storePhone,
      href: `tel:${settings.storePhone}`,
      dir: 'ltr' as const,
    },
    {
      icon: 'chat',
      title: 'واتساب',
      value: settings.storePhone,
      href: `https://wa.me/2${settings.storePhone}`,
      dir: 'ltr' as const,
    },
    {
      icon: 'schedule',
      title: 'مواعيد العمل',
      value: 'يومياً 10 صباحاً - 10 مساءً',
      href: undefined,
      dir: 'rtl' as const,
    },
  ]

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setIsSubmitted(true)
  }

  return (
    <div className="pb-24 md:pb-12">
      {/* === هيرو مصغّر === */}
      <section className="mb-12 md:mb-16">
        <div className="hero-gradient relative overflow-hidden border-b border-outline-variant">
          <div className="container-main flex min-h-[200px] flex-col items-center justify-center py-14 text-center md:min-h-[240px]">
            <span className="mb-4 w-fit rounded-full bg-primary px-3 py-1 text-xs font-bold text-on-primary">
              نحن هنا لمساعدتك
            </span>
            <h1 className="mb-4 max-w-xl font-display text-3xl font-black leading-tight text-on-surface md:text-4xl">
              تواصل معنا
            </h1>
            <p className="max-w-lg text-sm leading-relaxed text-on-surface-variant md:text-base">
              عندك سؤال عن منتج أو طلب؟ فريقنا جاهز يرد عليك بسرعة
            </p>
          </div>
        </div>
      </section>

      <div className="container-main">
        {/* === بطاقات طرق التواصل === */}
        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3 md:mb-14">
          {contactMethods.map((method) => {
            const content = (
              <>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="material-symbols-outlined text-xl">{method.icon}</span>
                </div>
                <p className="mb-1 text-xs font-bold text-on-surface-variant">{method.title}</p>
                <p dir={method.dir} className="text-right font-display font-bold text-on-surface">
                  {method.value}
                </p>
              </>
            )
            return method.href ? (
              <a
                key={method.title}
                href={method.href}
                target={method.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lg"
              >
                {content}
              </a>
            ) : (
              <div
                key={method.title}
                className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6"
              >
                {content}
              </div>
            )
          })}
        </section>

        {/* === فورم التواصل + بطاقة جانبية === */}
        <section className="mb-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* الفورم */}
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 lg:col-span-2 md:p-8">
            <h2 className="mb-1 font-display text-lg font-bold text-on-surface">
              ابعتلنا رسالة
            </h2>
            <p className="mb-6 text-sm text-on-surface-variant">
              هنرد عليك خلال يوم عمل واحد
            </p>

            {isSubmitted ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-tertiary/10">
                  <span
                    className="material-symbols-outlined text-3xl text-tertiary"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    check_circle
                  </span>
                </div>
                <p className="font-bold text-on-surface">تم إرسال رسالتك بنجاح</p>
                <p className="text-sm text-on-surface-variant">سيتواصل معك فريقنا قريباً</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                      الاسم
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="اسمك بالكامل"
                      className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                      البريد الإلكتروني (اختياري)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      dir="ltr"
                      className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-left text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                    رسالتك
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder="اكتب استفسارك هنا..."
                    className="w-full resize-none rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-on-primary shadow-[0_8px_20px_rgba(187,0,16,0.25)] transition-all hover:bg-primary-container active:scale-95"
                >
                  <span className="material-symbols-outlined text-lg">send</span>
                  إرسال الرسالة
                </button>
              </form>
            )}
          </div>

          {/* بطاقة جانبية — نفس أسلوب "ملخص الطلب" بصفحة الـ Checkout */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6">
                <h3 className="mb-3 flex items-center gap-2 font-display text-base font-bold text-on-surface">
                  <span className="material-symbols-outlined text-primary">storefront</span>
                  {settings.storeName}
                </h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  متجرك الأول لمكونات الحاسوب عالية الأداء. نرد بسرعة، ونهتم بكل تفاصيل
                  طلبك من التأكيد لحد الاستلام.
                </p>
              </div>
              <div className="rounded-2xl bg-primary/5 p-6">
                <h3 className="mb-2 font-display text-sm font-bold text-primary">
                  محتاج رد سريع؟
                </h3>
                <p className="mb-4 text-sm text-on-surface-variant">
                  للاستفسارات العاجلة، كلمنا مباشرة على واتساب
                </p>
                <a
                  href={`https://wa.me/2${settings.storePhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-on-primary hover:bg-primary-container"
                >
                  <span className="material-symbols-outlined text-lg">chat</span>
                  تواصل عبر واتساب
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
