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
      {/* أيقونة الشعار — دائرة حمراء بأيقونة معالج/شريحة */}
      <div
        className={`flex shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary shadow-[0_4px_12px_rgba(187,0,16,0.25)] ${
          isSmall ? 'h-8 w-8' : 'h-10 w-10'
        }`}
      >
        <span
          className={`material-symbols-outlined ${isSmall ? 'text-lg' : 'text-2xl'}`}
          style={{ fontVariationSettings: '"FILL" 1' }}
        >
          memory
        </span>
      </div>

      {/* النص — اسم المتجر بسطرين */}
      <div className="flex flex-col leading-none">
        <span
          className={`font-display font-black tracking-tight text-on-surface ${
            isSmall ? 'text-sm' : 'text-base md:text-lg'
          }`}
        >
          بي سي-تك
        </span>
        <span
          className={`font-display font-bold tracking-wide text-primary ${
            isSmall ? 'text-[9px]' : 'text-[10px] md:text-xs'
          }`}
        >
          ARABIA
        </span>
      </div>
    </div>
  )
}
