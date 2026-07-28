/**
 * Breadcrumb — مسار التنقل (الرئيسية > التصنيف)
 *
 * الوظيفة: يعرض مسار الصفحة الحالية للمستخدم
 * Props:
 *   - items: { label, path? }[] — عناصر المسار
 * الاستخدام: CategoryPage، ProductDetailPage (لاحقاً)
 */
import { Link } from 'react-router-dom'

interface BreadcrumbItem {
  label: string
  path?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="mb-4 flex items-center gap-2 text-sm text-outline">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={item.label} className="flex items-center gap-2">
            {index > 0 && (
              <span className="material-symbols-outlined text-[14px]">chevron_left</span>
            )}
            {isLast || !item.path ? (
              <span className={isLast ? 'font-bold text-primary' : ''}>{item.label}</span>
            ) : (
              <Link to={item.path} className="transition-colors hover:text-primary">
                {item.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
