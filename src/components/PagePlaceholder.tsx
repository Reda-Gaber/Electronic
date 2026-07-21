/**
 * PagePlaceholder — مكون مؤقت لعرض صفحات قيد البناء
 *
 * الوظيفة: يعرض عنوان الصفحة ووصفها حتى يُبنى المحتوى الكامل
 * Props:
 *   - title: عنوان الصفحة بالعربي
 *   - description: وصف مختصر لما ستتضمنه الصفحة
 *   - icon: اسم أيقونة Material Symbols (اختياري)
 * الاستخدام: في كل صفحة placeholder حتى الموافقة على البناء
 */
interface PagePlaceholderProps {
  title: string
  description: string
  icon?: string
}

export default function PagePlaceholder({
  title,
  description,
  icon = 'construction',
}: PagePlaceholderProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-container">
        <span className="material-symbols-outlined text-4xl text-primary">{icon}</span>
      </div>
      <h1 className="mb-3 font-display text-2xl font-bold text-on-surface md:text-3xl">
        {title}
      </h1>
      <p className="max-w-md text-on-surface-variant">{description}</p>
      <span className="mt-6 rounded-full bg-surface-container-high px-4 py-1.5 text-xs font-medium text-on-surface-variant">
        قيد التطوير — المرحلة التالية
      </span>
    </div>
  )
}
