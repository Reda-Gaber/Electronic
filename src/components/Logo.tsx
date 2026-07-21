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
          isSmall ? 'h-8 w-8' : 'h-10 w-10'
        }`}
      >
        <img
          src="/logo-icon.png"
          alt="شعار عبدالنبي بي سي تيك"
          className="h-full w-full object-contain"
        />
      </div>

      {/* النص — اسم المتجر بسطرين */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-display font-black tracking-tight text-on-surface ${
            isSmall ? 'text-sm' : 'text-base md:text-lg'
          }`}
        >
          عبدالنبي
        </span>
        <span
          className={`font-display font-bold tracking-wide text-primary ${
            isSmall ? 'text-[9px]' : 'text-[10px] md:text-xs'
          }`}
        >
          بي سي تيك
        </span>
      </div>
    </div>
  )
}
