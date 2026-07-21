/**
 * NewsletterSection — قسم الاشتراك في النشرة البريدية
 *
 * الوظيفة: نموذج اشتراك بسيط (واجهة فقط)
 * Props: لا يوجد
 * الاستخدام: HomePage — أسفل الصفحة
 */
import { useState } from 'react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // TODO: ربط هذا بالـ API عند توفر الباك إند — إرسال البريد لخدمة النشرة
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
    }
  }

  return (
    <section className="mb-12">
      <div className="relative overflow-hidden rounded-[32px] bg-on-background p-8 text-surface md:p-10">
        {/* تأثير ضوئي خلفي */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative z-10 max-w-lg">
          <h3 className="mb-2 font-display text-xl font-bold md:text-2xl">
            انضم لمجتمع اللاعبين
          </h3>
          <p className="mb-6 text-sm opacity-80 md:text-base">
            اشترك للحصول على آخر الأخبار والعروض الحصرية مباشرة في بريدك.
          </p>

          {submitted ? (
            <p className="rounded-xl bg-primary/20 px-4 py-3 text-sm font-bold">
              شكراً! تم تسجيل اشتراكك بنجاح.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                required
                className="flex-1 rounded-xl border border-surface-variant/20 bg-surface-variant/10 px-4 py-3 text-surface outline-none placeholder:text-surface-variant/50 focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-on-primary transition-transform active:scale-95 hover:bg-primary-container"
              >
                اشترك الآن
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
