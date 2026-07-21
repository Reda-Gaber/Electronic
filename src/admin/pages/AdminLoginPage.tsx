// صفحة تسجيل دخول الأدمن — واجهة فقط بدون مصادقة حقيقية
import { Link } from 'react-router-dom'

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-container-low p-4">
      <div className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-8 shadow-lg">
        <div className="mb-8 text-center">
          <span className="material-symbols-outlined mb-2 text-5xl text-primary">
            admin_panel_settings
          </span>
          <h1 className="font-display text-2xl font-bold text-on-surface">
            تسجيل دخول الأدمن
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            واجهة فقط — بدون مصادقة حقيقية حالياً
          </p>
        </div>

        {/* نموذج placeholder — TODO: ربط بالـ API */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="mb-1 block text-sm font-medium text-on-surface">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              placeholder="admin@pc-tech.com"
              className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-on-surface">
              كلمة المرور
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Link
            to="/admin/dashboard"
            className="block w-full rounded-xl bg-primary py-3 text-center font-bold text-on-primary transition-colors hover:bg-primary-container"
          >
            دخول
          </Link>
        </form>
      </div>
    </div>
  )
}
