/**
 * ProtectedAdminRoute — يحمي كل مسارات لوحة تحكم الأدمن من الدخول بدون تسجيل دخول
 *
 * الوظيفة: عند فتح أي صفحة أدمن، يتأكد فعلياً من السيرفر إن التوكن المحفوظ
 * لسه صالح (مش بس موجود محلياً). لو مش صالح أو مش موجود، يحوّل لصفحة تسجيل
 * الدخول تلقائياً. أثناء التحقق، يعرض شاشة تحميل بسيطة بدل ما يومض المحتوى.
 * الاستخدام: يلف مسارات /admin/* في App.tsx (ما عدا /admin/login نفسها)
 */
import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { verifySession } from '@/admin/utils/adminAuth'

export default function ProtectedAdminRoute() {
  const [status, setStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>(
    'checking',
  )

  useEffect(() => {
    let isMounted = true
    verifySession().then((admin) => {
      if (isMounted) setStatus(admin ? 'authenticated' : 'unauthenticated')
    })
    return () => {
      isMounted = false
    }
  }, [])

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-container-low">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>
          <p className="text-sm text-on-surface-variant">جاري التحقق من الجلسة...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
