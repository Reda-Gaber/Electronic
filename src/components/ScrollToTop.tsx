/**
 * ScrollToTop — يعيد التمرير لأعلى الصفحة عند كل تنقّل بين الروابط
 *
 * الوظيفة: React Router لا يصفّر التمرير تلقائياً عند تغيير المسار (كما يفعل
 * المتصفح في التنقل التقليدي)، فبدونه تفتح الصفحة الجديدة من نفس نقطة تمرير
 * الصفحة السابقة. هذا المكوّن يراقب المسار الحالي، وكل مرة يتغيّر فيها يعيد
 * window scroll للأعلى (0,0) مباشرة.
 * الاستخدام: يُوضع مرة واحدة أعلى شجرة الراوتر في App.tsx
 */
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
