// صفحة تسجيل دخول الأدمن — مربوطة فعلياً بالباك اند (JWT)
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '@/admin/utils/adminAuth'
import { ApiClientError } from '@/lib/apiClient'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError('من فضلك أدخل الإيميل وكلمة المرور')
      return
    }

    setIsSubmitting(true)
    try {
      await loginAdmin(email.trim(), password)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message)
      } else {
        setError('تعذر الاتصال بالسيرفر، تأكد إن الباك اند شغال وحاول تاني')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

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
            لوحة تحكم متجر عبدالنبي بي سي تيك
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-on-surface">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@abdelnabi-pctech.com"
              dir="ltr"
              autoComplete="username"
              className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-on-surface">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-error-container/50 px-4 py-2.5 text-sm font-medium text-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-center font-bold text-on-primary transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && (
              <span className="material-symbols-outlined animate-spin text-lg">
                progress_activity
              </span>
            )}
            {isSubmitting ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  )
}
