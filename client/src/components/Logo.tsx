/**
 * Logo — شعار المتجر (أيقونة + نص)
 *
 * الوظيفة: عرض شعار موحّد للمتجر بدل الاعتماد على صورة خارجية أو نص عادي فقط
 * Props:
 *   - size: 'sm' | 'md' — يتحكم في حجم الشعار (افتراضي md)
 * الاستخدام: Header (أعلى كل صفحة متجر)، ويمكن استخدامه لاحقاً في صفحة تسجيل دخول الأدمن
 */
interface LogoProps {
  size?: 'sm' | 'md'
}

export default function Logo({ size = 'md' }: LogoProps) {
  const isSmall = size === 'sm'

  return (
    <div className="flex items-center gap-2.5">
      {/* أيقونة الشعار — الشعار الفعلي (العلامة المميزة) المأخوذ من صورة اللوجو الأصلية */}
      <div
        className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-container-lowest ${
          isSmall ? 'h-10 w-10' : 'h-12 w-12'
        }`}
      >
        <img
          src="/logo.jpg"
          alt="شعار عبدالنبي للإلكترونيات"
          className="h-full w-full object-contain"
        />
      </div>

      {/* النص — اسم المتجر بسطرين */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-display font-black tracking-tight text-on-surface ${
            isSmall ? 'text-lg' : 'text-xl md:text-2xl'
          }`}
        >
          عبدالنبي
        </span>
        <span
          className={`font-display font-bold tracking-wide text-primary ${
            isSmall ? 'text-[11px]' : 'text-sm md:text-base'
          }`}
        >
          للإلكترونيات
        </span>
      </div>
    </div>
  )
}
