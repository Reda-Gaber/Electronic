// إدارة التصنيفات — التحكم الكامل فيما يظهر بالصفحة الرئيسية (الأيقونة + البوكس الكبير)
// TODO: ربط هذا بالـ API عند توفر الباك إند — استبدال categoryStorage بطلبات حقيقية
import { useMemo, useRef, useState, type ChangeEvent } from 'react'
import { iconLibrary } from '@/data/iconLibrary'
import { getCategories, saveCategories } from '@/utils/categoryStorage'
import { getProducts } from '@/utils/productStorage'
import type { Category } from '@/types'

/** شكل بيانات نموذج إضافة/تعديل تصنيف */
interface CategoryFormState {
  name: string
  description: string
  icon: string
  isCustomIcon: boolean
  image: string
  featuredOnHomepage: boolean
}

const emptyForm: CategoryFormState = {
  name: '',
  description: '',
  icon: iconLibrary[0],
  isCustomIcon: false,
  image: '',
  featuredOnHomepage: false,
}

/** تحويل ملف صورة مرفوع إلى Data URL لعرضه وتخزينه محلياً */
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function AdminCategoriesPage() {
  // التصنيفات محفوظة عبر categoryStorage — أي تعديل هنا ينعكس فوراً على الصفحة الرئيسية
  const [categories, setCategories] = useState<Category[]>(() => getCategories())

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState<CategoryFormState>(emptyForm)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)

  const iconFileInputRef = useRef<HTMLInputElement>(null)
  const imageFileInputRef = useRef<HTMLInputElement>(null)

  // عدد المنتجات الفعلي لكل تصنيف (محسوب من بيانات المنتجات الحقيقية)
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const product of getProducts()) {
      counts[product.categoryId] = (counts[product.categoryId] ?? 0) + 1
    }
    return counts
  }, [categories])

  // حفظ أي تغيير في القائمة إلى localStorage + تحديث الحالة المحلية معاً
  const persistCategories = (updated: Category[]) => {
    setCategories(updated)
    saveCategories(updated)
  }

  const openAddModal = () => {
    setEditingCategoryId(null)
    setForm(emptyForm)
    setIsModalOpen(true)
  }

  const openEditModal = (category: Category) => {
    setEditingCategoryId(category.id)
    setForm({
      name: category.name,
      description: category.description,
      icon: category.icon,
      isCustomIcon: category.isCustomIcon,
      image: category.image,
      featuredOnHomepage: category.featuredOnHomepage,
    })
    setIsModalOpen(true)
  }

  // رفع أيقونة مخصصة من الجهاز
  const handleIconFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await readFileAsDataUrl(file)
    setForm((prev) => ({ ...prev, icon: dataUrl, isCustomIcon: true }))
  }

  // رفع صورة التصنيف (تُستخدم كخلفية البوكس الكبير في الرئيسية)
  const handleImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await readFileAsDataUrl(file)
    setForm((prev) => ({ ...prev, image: dataUrl }))
  }

  const handleSave = () => {
    if (!form.name.trim()) return

    if (editingCategoryId) {
      const updated = categories.map((c) =>
        c.id === editingCategoryId
          ? {
              ...c,
              name: form.name.trim(),
              description: form.description.trim(),
              icon: form.icon,
              isCustomIcon: form.isCustomIcon,
              image: form.image || c.image,
              featuredOnHomepage: form.featuredOnHomepage,
            }
          : c,
      )
      persistCategories(updated)
    } else {
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name: form.name.trim(),
        slug: form.name.trim().toLowerCase().replace(/\s+/g, '-'),
        description: form.description.trim(),
        image: form.image || 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400',
        productCount: 0,
        icon: form.icon,
        isCustomIcon: form.isCustomIcon,
        featuredOnHomepage: form.featuredOnHomepage,
      }
      persistCategories([...categories, newCategory])
    }
    setIsModalOpen(false)
  }

  const confirmDeleteCategory = () => {
    if (!categoryToDelete) return
    persistCategories(categories.filter((c) => c.id !== categoryToDelete))
    setCategoryToDelete(null)
  }

  return (
    <div>
      {/* عنوان الصفحة + زر إضافة */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-on-surface">
            إدارة التصنيفات
          </h1>
          <p className="text-sm text-on-surface-variant">
            {categories.length} تصنيف — {categories.filter((c) => c.featuredOnHomepage).length}{' '}
            منها معروض كبوكس كبير في الرئيسية
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary shadow-[0_8px_16px_rgba(187,0,16,0.2)] transition-all hover:bg-primary-container active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          إضافة تصنيف جديد
        </button>
      </div>

      {/* شبكة بطاقات التصنيفات */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="group relative flex flex-col items-center gap-3 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 text-center transition-shadow hover:shadow-lg"
          >
            {/* شارة "معروض بالرئيسية" */}
            {category.featuredOnHomepage && (
              <span className="absolute -top-2 right-1/2 translate-x-1/2 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-on-primary shadow">
                معروض بالرئيسية
              </span>
            )}

            {/* أزرار التعديل والحذف — تظهر عند الـ hover */}
            <div className="absolute left-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => openEditModal(category)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-container-high text-on-surface-variant hover:text-primary"
                aria-label={`تعديل ${category.name}`}
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
              <button
                type="button"
                onClick={() => setCategoryToDelete(category.id)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-container-high text-on-surface-variant hover:text-error"
                aria-label={`حذف ${category.name}`}
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>

            <div className="mt-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
              {category.isCustomIcon ? (
                <img src={category.icon} alt={category.name} className="h-full w-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-3xl">{category.icon}</span>
              )}
            </div>
            <span className="font-display text-sm font-bold text-on-surface">
              {category.name}
            </span>
            <span className="rounded-full bg-surface-container-high px-2.5 py-1 text-xs font-bold text-on-surface-variant">
              {productCounts[category.id] ?? 0} منتج
            </span>
          </div>
        ))}
      </div>

      {/* === نافذة إضافة/تعديل تصنيف === */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-on-surface/40 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-lg rounded-2xl bg-surface-container-lowest p-6 shadow-2xl">
            <h2 className="mb-5 font-display text-lg font-bold text-on-surface">
              {editingCategoryId ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
            </h2>

            <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
              اسم التصنيف
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="مثال: كروت الشاشة"
              className="mb-4 w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm outline-none focus:border-primary"
            />

            <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
              الوصف (يظهر كنص فرعي في بوكس الرئيسية المميز)
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={2}
              placeholder="مثال: خصومات تصل إلى 30% على جميع مزودات الطاقة"
              className="mb-4 w-full resize-none rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm outline-none focus:border-primary"
            />

            {/* --- اختيار الأيقونة --- */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-on-surface-variant">
                  أيقونة التصنيف
                </span>
                <button
                  type="button"
                  onClick={() => iconFileInputRef.current?.click()}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-container"
                >
                  <span className="material-symbols-outlined text-sm">upload</span>
                  رفع أيقونة من الجهاز
                </button>
                <input
                  ref={iconFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleIconFileChange}
                />
              </div>

              {/* معاينة الأيقونة المختارة حالياً */}
              <div className="mb-2 flex items-center gap-2 rounded-xl bg-surface-container-high p-2">
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-surface-container-lowest">
                  {form.isCustomIcon ? (
                    <img src={form.icon} alt="أيقونة مختارة" className="h-full w-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-lg text-primary">
                      {form.icon}
                    </span>
                  )}
                </div>
                <span className="text-xs text-on-surface-variant">
                  {form.isCustomIcon ? 'أيقونة مرفوعة من الجهاز' : `أيقونة جاهزة: ${form.icon}`}
                </span>
              </div>

              {/* مكتبة الأيقونات الجاهزة (~50 أيقونة) */}
              <div className="grid max-h-40 grid-cols-8 gap-1.5 overflow-y-auto rounded-xl border border-outline-variant p-2">
                {iconLibrary.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, icon, isCustomIcon: false }))}
                    className={`flex h-9 items-center justify-center rounded-lg border-2 transition-colors ${
                      !form.isCustomIcon && form.icon === icon
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-transparent text-on-surface-variant hover:border-outline-variant'
                    }`}
                    aria-label={icon}
                  >
                    <span className="material-symbols-outlined text-lg">{icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* --- صورة التصنيف (خلفية البوكس الكبير) --- */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-on-surface-variant">صورة التصنيف</span>
                <button
                  type="button"
                  onClick={() => imageFileInputRef.current?.click()}
                  className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-container"
                >
                  <span className="material-symbols-outlined text-sm">upload</span>
                  رفع صورة من الجهاز
                </button>
                <input
                  ref={imageFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFileChange}
                />
              </div>
              {form.image && (
                <img
                  src={form.image}
                  alt="معاينة صورة التصنيف"
                  className="mb-2 h-24 w-full rounded-xl object-cover"
                />
              )}
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
                placeholder="أو الصق رابط صورة مباشر..."
                className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* --- تفعيل الظهور كبوكس كبير بالرئيسية --- */}
            <label className="mb-6 flex cursor-pointer items-center justify-between rounded-xl bg-surface-container-high px-4 py-3">
              <span className="text-sm font-bold text-on-surface">
                اعرض هذا التصنيف كبوكس كبير في الصفحة الرئيسية
              </span>
              <input
                type="checkbox"
                checked={form.featuredOnHomepage}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, featuredOnHomepage: e.target.checked }))
                }
                className="h-5 w-5 accent-primary"
              />
            </label>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-xl border-2 border-outline-variant py-2.5 text-sm font-bold text-on-surface hover:border-outline"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-on-primary hover:bg-primary-container"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === نافذة تأكيد حذف تصنيف === */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-surface-container-lowest p-6 text-center shadow-2xl">
            <span className="material-symbols-outlined mb-3 text-4xl text-error">warning</span>
            <h2 className="mb-2 font-display text-lg font-bold text-on-surface">
              تأكيد حذف التصنيف
            </h2>
            <p className="mb-5 text-sm text-on-surface-variant">
              سيؤثر حذف هذا التصنيف على المنتجات المرتبطة به. هل أنت متأكد؟
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="flex-1 rounded-xl border-2 border-outline-variant py-2.5 text-sm font-bold text-on-surface hover:border-outline"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={confirmDeleteCategory}
                className="flex-1 rounded-xl bg-error py-2.5 text-sm font-bold text-on-error hover:opacity-90"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
