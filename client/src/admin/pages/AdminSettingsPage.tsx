// إعدادات المتجر — بيانات المتجر، بيانات التواصل، طريقة الدفع، وبيانات تسجيل الدخول
// ملحوظة: مفيش إدارة "مناطق شحن" هنا — رسوم الشحن بقت بتتحدد لكل طلب لوحده
// من صفحة تفاصيل الطلب في الأدمن، بعد ما شركة الشحن تأكد التكلفة الفعلية
import { useEffect, useState } from 'react'
import { fetchSettings, updateSettings } from '@/services/settings'
import { ApiClientError } from '@/lib/apiClient'
import { changeAdminEmail, changeAdminPassword, getStoredAdmin } from '@/admin/utils/adminAuth'

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)

  // --- بيانات المتجر ---
  const [storeName, setStoreName] = useState('')
  const [storePhone, setStorePhone] = useState('')
  const [storeEmail, setStoreEmail] = useState('')
  const [storeAddress, setStoreAddress] = useState('')
  const [storeMessage, setStoreMessage] = useState<string | null>(null)

  // --- أرقام التواصل المتعددة (منفصلة عن رقم إنستاباي) ---
  const [contactPhones, setContactPhones] = useState<string[]>([''])
  const [contactMessage, setContactMessage] = useState<string | null>(null)

  // --- طريقة الدفع (رقم إنستاباي — واحد بس) ---
  const [instapayNumber, setInstapayNumber] = useState('')
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null)

  // --- بيانات تسجيل الدخول ---
  const admin = getStoredAdmin()
  const [emailPassword, setEmailPassword] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [emailMessage, setEmailMessage] = useState<string | null>(null)
  const [isSavingEmail, setIsSavingEmail] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  useEffect(() => {
    fetchSettings()
      .then((settings) => {
        setStoreName(settings.storeName)
        setStorePhone(settings.storePhone)
        setStoreEmail(settings.storeEmail)
        setStoreAddress(settings.storeAddress)
        setContactPhones(settings.contactPhones.length > 0 ? settings.contactPhones : [''])
        setInstapayNumber(settings.instapayNumber)
      })
      .finally(() => setIsLoading(false))
  }, [])

  // عرض رسالة تأكيد/خطأ مؤقتة لثلاث ثوانٍ
  const flashMessage = (setter: (msg: string | null) => void, message: string) => {
    setter(message)
    setTimeout(() => setter(null), 3000)
  }

  /** حفظ بيانات المتجر (الاسم والهاتف والإيميل والعنوان) */
  const handleSaveStoreInfo = async () => {
    try {
      await updateSettings({
        storeName: storeName.trim(),
        storePhone: storePhone.trim(),
        storeEmail: storeEmail.trim(),
        storeAddress: storeAddress.trim(),
        contactPhones,
        instapayNumber,
      })
      flashMessage(setStoreMessage, 'تم حفظ بيانات المتجر بنجاح')
    } catch (err) {
      flashMessage(
        setStoreMessage,
        err instanceof ApiClientError ? err.message : 'تعذر الحفظ، حاول تاني',
      )
    }
  }

  // --- إدارة أرقام التواصل المتعددة ---
  const updateContactPhone = (index: number, value: string) => {
    setContactPhones((prev) => prev.map((phone, i) => (i === index ? value : phone)))
  }
  const addContactPhone = () => setContactPhones((prev) => [...prev, ''])
  const removeContactPhone = (index: number) => {
    setContactPhones((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))
  }

  /** حفظ أرقام التواصل المتعددة (لصفحة تواصل معنا والفوتر) */
  const handleSaveContactPhones = async () => {
    const cleaned = contactPhones.map((p) => p.trim()).filter((p) => p.length > 0)
    if (cleaned.length === 0) {
      flashMessage(setContactMessage, 'لازم رقم تواصل واحد على الأقل')
      return
    }
    try {
      await updateSettings({
        storeName,
        storePhone,
        storeEmail,
        storeAddress,
        contactPhones: cleaned,
        instapayNumber,
      })
      setContactPhones(cleaned)
      flashMessage(setContactMessage, 'تم حفظ أرقام التواصل بنجاح')
    } catch (err) {
      flashMessage(
        setContactMessage,
        err instanceof ApiClientError ? err.message : 'تعذر الحفظ، حاول تاني',
      )
    }
  }

  /** حفظ رقم إنستاباي (رقم واحد فقط) */
  const handleSavePaymentSettings = async () => {
    try {
      await updateSettings({
        storeName,
        storePhone,
        storeEmail,
        storeAddress,
        contactPhones,
        instapayNumber: instapayNumber.trim(),
      })
      flashMessage(setPaymentMessage, 'تم حفظ إعدادات الدفع بنجاح')
    } catch (err) {
      flashMessage(
        setPaymentMessage,
        err instanceof ApiClientError ? err.message : 'تعذر الحفظ، حاول تاني',
      )
    }
  }

  /** تغيير إيميل تسجيل الدخول — يتطلب كلمة المرور الحالية كتأكيد أمني */
  const handleChangeEmail = async () => {
    if (!emailPassword || !newEmail.trim()) {
      flashMessage(setEmailMessage, 'أدخل كلمة المرور الحالية والإيميل الجديد')
      return
    }
    setIsSavingEmail(true)
    try {
      await changeAdminEmail(emailPassword, newEmail.trim())
      setEmailPassword('')
      setNewEmail('')
      flashMessage(setEmailMessage, 'تم تغيير الإيميل بنجاح')
    } catch (err) {
      flashMessage(
        setEmailMessage,
        err instanceof ApiClientError ? err.message : 'تعذر تغيير الإيميل، حاول تاني',
      )
    } finally {
      setIsSavingEmail(false)
    }
  }

  /** تغيير كلمة المرور — يتطلب كلمة المرور الحالية + تأكيد الجديدة */
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      flashMessage(setPasswordMessage, 'أدخل كلمة المرور الحالية والجديدة')
      return
    }
    if (newPassword.length < 8) {
      flashMessage(setPasswordMessage, 'كلمة المرور الجديدة لازم تكون 8 حروف/أرقام على الأقل')
      return
    }
    if (newPassword !== confirmPassword) {
      flashMessage(setPasswordMessage, 'تأكيد كلمة المرور غير مطابق')
      return
    }
    setIsSavingPassword(true)
    try {
      await changeAdminPassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      flashMessage(setPasswordMessage, 'تم تغيير كلمة المرور بنجاح')
    } catch (err) {
      flashMessage(
        setPasswordMessage,
        err instanceof ApiClientError ? err.message : 'تعذر تغيير كلمة المرور، حاول تاني',
      )
    } finally {
      setIsSavingPassword(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-display text-2xl font-extrabold text-on-surface">الإعدادات</h1>

      <div className="space-y-6">
        {/* === بيانات المتجر === */}
        <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 md:p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-on-surface">
            <span className="material-symbols-outlined text-primary">storefront</span>
            بيانات المتجر
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                اسم المتجر
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                رقم هاتف رئيسي
              </label>
              <input
                type="tel"
                dir="ltr"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-left text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                الإيميل العام للمتجر
              </label>
              <input
                type="email"
                dir="ltr"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
                placeholder="info@example.com"
                className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-left text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                العنوان
              </label>
              <input
                type="text"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                placeholder="مثال: القاهرة، مصر"
                className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* شعار المتجر — عرض فقط حالياً بانتظار رفع ملفات حقيقي */}
          <div className="mt-4">
            <span className="mb-1.5 block text-sm font-bold text-on-surface-variant">
              شعار المتجر
            </span>
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-4">
              <span className="material-symbols-outlined text-2xl text-on-surface-variant">
                upload
              </span>
              <p className="text-xs text-on-surface-variant">
                رفع شعار جديد غير مفعّل بعد — المتجر يستخدم شعاراً موحّداً حالياً (مكون Logo)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveStoreInfo}
            className="mt-5 flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-all hover:bg-primary-container active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">save</span>
            حفظ بيانات المتجر
          </button>
          {storeMessage && (
            <p className="mt-3 rounded-lg bg-surface-container-high px-3 py-2 text-xs font-bold text-on-surface-variant">
              {storeMessage}
            </p>
          )}
        </section>

        {/* === أرقام التواصل المتعددة === */}
        <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 md:p-6">
          <h2 className="mb-1 flex items-center gap-2 font-display text-lg font-bold text-on-surface">
            <span className="material-symbols-outlined text-primary">call</span>
            أرقام التواصل
          </h2>
          <p className="mb-4 text-xs text-on-surface-variant">
            بتظهر في صفحة "تواصل معنا" والفوتر — تقدر تضيف أكتر من رقم
          </p>

          <div className="space-y-2.5">
            {contactPhones.map((phone, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => updateContactPhone(index, e.target.value)}
                  placeholder="01xxxxxxxxx"
                  className="flex-1 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-left text-sm outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => removeContactPhone(index)}
                  disabled={contactPhones.length <= 1}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-on-surface-variant hover:bg-error-container hover:text-on-error-container disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="حذف الرقم"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addContactPhone}
            className="mt-3 flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-container"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            إضافة رقم تواصل
          </button>

          <button
            type="button"
            onClick={handleSaveContactPhones}
            className="mt-5 flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-all hover:bg-primary-container active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">save</span>
            حفظ أرقام التواصل
          </button>
          {contactMessage && (
            <p className="mt-3 rounded-lg bg-surface-container-high px-3 py-2 text-xs font-bold text-on-surface-variant">
              {contactMessage}
            </p>
          )}
        </section>

        {/* === طرق الدفع (رقم إنستاباي — واحد بس) === */}
        <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 md:p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-on-surface">
            <span className="material-symbols-outlined text-primary">payments</span>
            طرق الدفع
          </h2>

          <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
            رقم إنستاباي المعروض للعملاء عند الدفع
          </label>
          <input
            type="text"
            dir="ltr"
            value={instapayNumber}
            onChange={(e) => setInstapayNumber(e.target.value)}
            className="w-full max-w-xs rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-left text-sm outline-none focus:border-primary"
          />
          <p className="mt-2 text-xs text-on-surface-variant">
            رقم واحد بس — هذا الرقم يظهر للعميل في صفحة إتمام الشراء عند اختيار "إنستاباي"
          </p>

          <button
            type="button"
            onClick={handleSavePaymentSettings}
            className="mt-5 flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-on-primary transition-all hover:bg-primary-container active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">save</span>
            حفظ إعدادات الدفع
          </button>
          {paymentMessage && (
            <p className="mt-3 rounded-lg bg-surface-container-high px-3 py-2 text-xs font-bold text-on-surface-variant">
              {paymentMessage}
            </p>
          )}
        </section>

        {/* === بيانات تسجيل الدخول === */}
        <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 md:p-6">
          <h2 className="mb-1 flex items-center gap-2 font-display text-lg font-bold text-on-surface">
            <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
            بيانات تسجيل الدخول
          </h2>
          <p className="mb-4 text-xs text-on-surface-variant">
            الإيميل الحالي: <span dir="ltr">{admin?.email}</span>
          </p>

          {/* تغيير الإيميل */}
          <div className="mb-6 rounded-xl bg-surface-container-low p-4">
            <h3 className="mb-3 text-sm font-bold text-on-surface">تغيير الإيميل</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                type="password"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                placeholder="كلمة المرور الحالية"
                className="rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
              <input
                type="email"
                dir="ltr"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="الإيميل الجديد"
                className="rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-left text-sm outline-none focus:border-primary"
              />
            </div>
            <button
              type="button"
              onClick={handleChangeEmail}
              disabled={isSavingEmail}
              className="mt-3 flex items-center gap-2 rounded-xl border-2 border-outline-variant px-5 py-2 text-sm font-bold text-on-surface hover:border-primary hover:text-primary disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-lg">mail</span>
              {isSavingEmail ? 'جاري الحفظ...' : 'تغيير الإيميل'}
            </button>
            {emailMessage && (
              <p className="mt-2 text-xs font-bold text-on-surface-variant">{emailMessage}</p>
            )}
          </div>

          {/* تغيير كلمة المرور */}
          <div className="rounded-xl bg-surface-container-low p-4">
            <h3 className="mb-3 text-sm font-bold text-on-surface">تغيير كلمة المرور</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="كلمة المرور الحالية"
                className="rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="كلمة المرور الجديدة"
                className="rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="تأكيد كلمة المرور الجديدة"
                className="rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <p className="mt-2 text-xs text-on-surface-variant">
              كلمة المرور الجديدة لازم تكون 8 حروف/أرقام على الأقل
            </p>
            <button
              type="button"
              onClick={handleChangePassword}
              disabled={isSavingPassword}
              className="mt-3 flex items-center gap-2 rounded-xl border-2 border-outline-variant px-5 py-2 text-sm font-bold text-on-surface hover:border-primary hover:text-primary disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-lg">lock_reset</span>
              {isSavingPassword ? 'جاري الحفظ...' : 'تغيير كلمة المرور'}
            </button>
            {passwordMessage && (
              <p className="mt-2 text-xs font-bold text-on-surface-variant">{passwordMessage}</p>
            )}
          </div>
        </section>

        {/* === معلومة عن رسوم الشحن === */}
        <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 md:p-6">
          <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-bold text-on-surface">
            <span className="material-symbols-outlined text-primary">local_shipping</span>
            رسوم الشحن
          </h2>
          <p className="text-sm text-on-surface-variant">
            رسوم الشحن مش بتتحدد من هنا — بيتم تحديدها لكل طلب على حدة من داخل صفحة
            "تفاصيل الطلب" بعد ما شركة الشحن تأكد التكلفة الفعلية حسب منطقة العميل.
          </p>
        </section>
      </div>
    </div>
  )
}
