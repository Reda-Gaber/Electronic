// صفحة الأسئلة الشائعة — أكورديون بسيط للأسئلة الأكثر تكراراً
import { useState } from 'react'

const faqItems = [
  {
    question: 'ما هي طرق الدفع المتاحة؟',
    answer: 'يمكنك الدفع كاش عند استلام الطلب، أو عبر تحويل إنستاباي على الرقم الظاهر في صفحة إتمام الشراء.',
  },
  {
    question: 'كم تستغرق مدة التوصيل؟',
    answer: 'تختلف مدة التوصيل حسب المحافظة، وتظهر لك المدة التقديرية عند اختيار منطقة الشحن في صفحة إتمام الشراء.',
  },
  {
    question: 'هل المنتجات أصلية وعليها ضمان؟',
    answer: 'نعم، كل منتجاتنا أصلية 100% ومستوردة من موزعين معتمدين، وتأتي بضمان الوكيل الرسمي.',
  },
  {
    question: 'هل يمكنني تعديل طلبي بعد إرساله؟',
    answer: 'بعد إرسال الطلب سيتواصل معك فريقنا لتأكيد التفاصيل، ويمكنك حينها طلب أي تعديل قبل الشحن.',
  },
  {
    question: 'ماذا لو استلمت منتجاً به عيب مصنعي؟',
    answer: 'تواصل معنا فوراً عبر صفحة "تواصل معنا" وسنقوم باستبدال المنتج وفق سياسة الضمان.',
  },
]

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="container-main max-w-3xl pb-24 pt-4 md:pb-12 md:pt-6">
      <h1 className="mb-6 font-display text-2xl font-extrabold text-on-surface md:text-3xl">
        الأسئلة الشائعة
      </h1>

      <div className="space-y-3">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index
          return (
            <div
              key={item.question}
              className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 p-5 text-right"
              >
                <span className="font-bold text-on-surface">{item.question}</span>
                <span
                  className={`material-symbols-outlined shrink-0 text-primary transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                >
                  expand_more
                </span>
              </button>
              {isOpen && (
                <p className="px-5 pb-5 text-sm leading-relaxed text-on-surface-variant">
                  {item.answer}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
