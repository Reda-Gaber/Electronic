/**
 * FeaturedDeals — قسم عروض الساعة مع عدّاد تنازلي
 *
 * الوظيفة: عرض منتجات مخفضة في شريط أفقي
 * Props: لا يوجد — يفلتر المنتجات المنشورة ذات originalPrice من productStorage
 * الاستخدام: HomePage — قسم "عروض الساعة"
 */
import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { mockDealCountdown } from '@/data/mockData'
import { getPublishedProducts } from '@/utils/productStorage'

export default function FeaturedDeals() {
  // TODO: ربط هذا بالـ API عند توفر الباك إند — جلب العروض النشطة من السيرفر
  const dealProducts = getPublishedProducts().filter((p) => p.originalPrice)

  // عدّاد تنازلي وهمي — يُحدَّث كل ثانية
  const [countdown, setCountdown] = useState(mockDealCountdown)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { hours, minutes, seconds } = prev
        seconds -= 1
        if (seconds < 0) {
          seconds = 59
          minutes -= 1
        }
        if (minutes < 0) {
          minutes = 59
          hours -= 1
        }
        if (hours < 0) {
          return mockDealCountdown
        }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  if (dealProducts.length === 0) return null

  return (
    <section className="mb-10">
      <div className="relative overflow-hidden rounded-3xl bg-secondary-container p-6">
        {/* رأس القسم */}
        <div className="relative z-10 mb-6 flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-on-secondary-container md:text-2xl">
              عروض الساعة
            </h3>
            <p className="text-sm text-on-secondary-container/80">
              تنتهي العروض خلال{' '}
              {pad(countdown.hours)}:{pad(countdown.minutes)}:{pad(countdown.seconds)}
            </p>
          </div>
          <span className="rounded-full bg-on-secondary-container px-3 py-1 text-xs font-bold text-secondary-container">
            وفر حتى 40%
          </span>
        </div>

        {/* شريط المنتجات المخفضة */}
        <div className="hide-scrollbar -mx-2 flex gap-4 overflow-x-auto px-2">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} variant="deal" />
          ))}
        </div>
      </div>
    </section>
  )
}
