// إضافة/تعديل منتج — فورم كامل مربوط بالباك اند الحقيقي
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Category } from '@/types'
import { fetchCategories } from '@/services/categories'
import {
  adminFetchProductById,
  createProduct,
  deleteProductImage,
  updateProduct,
  uploadProductImages,
  type ProductInput,
} from '@/services/products'
import { ApiClientError } from '@/lib/apiClient'

/** صف مواصفة واحدة (مفتاح/قيمة) قابل للإضافة والحذف ديناميكياً */
interface SpecRow {
  id: string
  label: string
  value: string
}

/** صورة افتراضية عند عدم إرفاق صور للمنتج الجديد */
const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600'

export default function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // بيانات إضافية من المنتج الحالي (وقت التعديل) مش موجودة كحقول في الفورم
  // لكن لازم تتحفظ زي ما هي عند إعادة الحفظ (rating, reviewCount, isFeatured, isNew)
  const [preservedFields, setPreservedFields] = useState({
    rating: 0,
    reviewCount: 0,
    isFeatured: false,
    isNew: true,
  })

  // === حالة الفورم ===
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [brand, setBrand] = useState('')
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [stockCount, setStockCount] = useState('')
  const [inStock, setInStock] = useState(true)
  const [description, setDescription] = useState('')
  const [specs, setSpecs] = useState<SpecRow[]>([{ id: 'spec-0', label: '', value: '' }])
  const [images, setImages] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)
  const mainImageInputRef = useRef<HTMLInputElement>(null)
  const extraImageInputRef = useRef<HTMLInputElement>(null)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // جلب التصنيفات، وجلب المنتج الحالي وقت التعديل
  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    Promise.all([
      fetchCategories(),
      isEdit && id ? adminFetchProductById(id) : Promise.resolve(null),
    ])
      .then(([categoriesData, product]) => {
        if (!isMounted) return
        setCategories(categoriesData)

        if (isEdit && !product) {
          setNotFound(true)
          return
        }

        if (product) {
          setName(product.name)
          setCategoryId(product.categoryId)
          setBrand(product.brand)
          setPrice(String(product.price))
          setOriginalPrice(product.originalPrice ? String(product.originalPrice) : '')
          setStockCount(String(product.stockCount))
          setInStock(product.inStock)
          setDescription(product.description)
          setSpecs(
            product.specs.length > 0
              ? product.specs.map((s, i) => ({ id: `spec-${i}`, label: s.label, value: s.value }))
              : [{ id: 'spec-0', label: '', value: '' }],
          )
          setImages(product.images)
          setPreservedFields({
            rating: product.rating,
            reviewCount: product.reviewCount,
            isFeatured: product.isFeatured ?? false,
            isNew: product.isNew ?? false,
          })
        } else if (categoriesData.length > 0) {
          setCategoryId(categoriesData[0].id)
          setPreservedFields((prev) => ({ ...prev, isNew: true }))
        }
      })
      .catch(() => {
        if (isMounted) setNotFound(true)
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [id, isEdit])

  // --- إدارة صفوف المواصفات ---
  const addSpecRow = () =>
    setSpecs((prev) => [...prev, { id: `spec-${Date.now()}`, label: '', value: '' }])
  const updateSpecRow = (rowId: string, field: 'label' | 'value', value: string) =>
    setSpecs((prev) => prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)))
  const removeSpecRow = (rowId: string) =>
    setSpecs((prev) => (prev.length > 1 ? prev.filter((row) => row.id !== rowId) : prev))

  // --- إدارة الصور ---
  const addImage = () => {
    if (newImageUrl.trim()) {
      setImages((prev) => [...prev, newImageUrl.trim()])
      setNewImageUrl('')
    }
  }

  /** رفع الصورة الرئيسية من الجهاز — بتحل محل أول صورة في القائمة (أو تُضاف لو القائمة فاضية) */
  const handleMainImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageUploadError(null)
    setIsUploadingImages(true)
    try {
      const [uploaded] = await uploadProductImages([file])
      setImages((prev) => (prev.length > 0 ? [uploaded.url, ...prev.slice(1)] : [uploaded.url]))
    } catch (err) {
      setImageUploadError(
        err instanceof ApiClientError ? err.message : 'تعذر رفع الصورة، جرب تاني',
      )
    } finally {
      setIsUploadingImages(false)
      e.target.value = ''
    }
  }

  /** رفع صورة/صور إضافية من الجهاز — بتتضاف في آخر القائمة، ومعالجتها بتتم على السيرفر */
  const handleExtraImagesUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setImageUploadError(null)
    setIsUploadingImages(true)
    try {
      const uploaded = await uploadProductImages(Array.from(files))
      setImages((prev) => [...prev, ...uploaded.map((img) => img.url)])
    } catch (err) {
      setImageUploadError(
        err instanceof ApiClientError ? err.message : 'تعذر رفع بعض الصور، جرب تاني',
      )
    } finally {
      setIsUploadingImages(false)
      e.target.value = ''
    }
  }

  /** حذف صورة من الفورم — وبتتمسح فعليًا من السيرفر لو كانت مرفوعة من الجهاز (مش رابط خارجي) */
  const removeImage = (index: number) => {
    const url = images[index]
    setImages((prev) => prev.filter((_, i) => i !== index))
    if (url.startsWith('/uploads/')) {
      deleteProductImage(url).catch(() => {
        /* حذف الملف من السيرفر فشل — مش هيوقف تعديل الفورم، الصورة اتشالت من القائمة برضو */
      })
    }
  }
  const moveImage = (index: number, direction: -1 | 1) => {
    setImages((prev) => {
      const newIndex = index + direction
      if (newIndex < 0 || newIndex >= prev.length) return prev
      const updated = [...prev]
      ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]
      return updated
    })
  }

  // --- التحقق والحفظ ---
  const validate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = 'اسم المنتج مطلوب'
    if (!categoryId) newErrors.categoryId = 'اختر التصنيف'
    if (!brand.trim()) newErrors.brand = 'الماركة مطلوبة'
    if (!price || Number(price) <= 0) newErrors.price = 'أدخل سعراً صحيحاً'
    if (!stockCount || Number(stockCount) < 0) newErrors.stockCount = 'أدخل كمية مخزون صحيحة'
    return newErrors
  }

  /** بناء بيانات المنتج من الفورم وإرسالها فعلياً للباك اند */
  const handleSubmit = async (e: FormEvent, publish: boolean) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setErrors({})
    setSaveMessage(null)
    setIsSaving(true)

    const productImages = images.length > 0 ? images : [DEFAULT_PRODUCT_IMAGE]

    const input: ProductInput = {
      name: name.trim(),
      categoryId,
      brand: brand.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      description: description.trim(),
      images: productImages,
      specs: specs
        .filter((row) => row.label.trim() && row.value.trim())
        .map((row) => ({ label: row.label.trim(), value: row.value.trim() })),
      inStock,
      stockCount: Number(stockCount),
      isFeatured: preservedFields.isFeatured,
      isNew: preservedFields.isNew,
      status: publish ? 'published' : 'draft',
    }

    try {
      if (isEdit && id) {
        await updateProduct(id, input)
      } else {
        await createProduct(input)
      }
      setSaveMessage(publish ? 'تم نشر المنتج بنجاح' : 'تم حفظ المسودة بنجاح')
      setTimeout(() => navigate('/admin/products'), 1200)
    } catch (err) {
      setErrors({
        general:
          err instanceof ApiClientError ? err.message : 'تعذر حفظ المنتج، حاول تاني',
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSaving(false)
    }
  }

  // === حالة: جاري التحميل ===
  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
      </div>
    )
  }

  // === حالة: تعديل منتج غير موجود ===
  if (notFound) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <span className="material-symbols-outlined mb-4 text-5xl text-outline">
          inventory_2
        </span>
        <h1 className="mb-2 font-display text-xl font-bold text-on-surface">
          المنتج غير موجود
        </h1>
        <Link
          to="/admin/products"
          className="mt-4 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-on-primary hover:bg-primary-container"
        >
          العودة لإدارة المنتجات
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* رأس الصفحة */}
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container-high"
          aria-label="العودة"
        >
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
        <h1 className="font-display text-2xl font-extrabold text-on-surface">
          {isEdit ? `تعديل: ${name}` : 'إضافة منتج جديد'}
        </h1>
      </div>

      {errors.general && (
        <p className="mb-4 rounded-xl bg-error-container/50 px-4 py-2.5 text-sm font-bold text-error">
          {errors.general}
        </p>
      )}

      <form className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* === العمود الرئيسي === */}
        <div className="space-y-6 lg:col-span-2">
          {/* بيانات أساسية */}
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5">
            <h2 className="mb-4 font-display text-lg font-bold text-on-surface">
              البيانات الأساسية
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                  اسم المنتج
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-sm outline-none focus:border-primary ${
                    errors.name ? 'border-error' : 'border-outline-variant'
                  }`}
                />
                {errors.name && <p className="mt-1 text-xs font-bold text-error">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                    التصنيف
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className={`w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-sm outline-none focus:border-primary ${
                      errors.categoryId ? 'border-error' : 'border-outline-variant'
                    }`}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                    الماركة
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className={`w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-sm outline-none focus:border-primary ${
                      errors.brand ? 'border-error' : 'border-outline-variant'
                    }`}
                  />
                  {errors.brand && (
                    <p className="mt-1 text-xs font-bold text-error">{errors.brand}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                  الوصف
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* المواصفات التقنية الديناميكية */}
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5">
            <h2 className="mb-4 font-display text-lg font-bold text-on-surface">
              المواصفات التقنية
            </h2>
            <div className="space-y-3">
              {specs.map((row) => (
                <div key={row.id} className="flex gap-2">
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) => updateSpecRow(row.id, 'label', e.target.value)}
                    placeholder="مثال: الذاكرة"
                    className="w-1/3 rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    value={row.value}
                    onChange={(e) => updateSpecRow(row.id, 'value', e.target.value)}
                    placeholder="مثال: 24GB GDDR6X"
                    className="flex-1 rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecRow(row.id)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-on-surface-variant hover:bg-error-container hover:text-on-error-container"
                    aria-label="حذف المواصفة"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addSpecRow}
              className="mt-3 flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-container"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              إضافة مواصفة
            </button>
          </div>

          {/* الصور */}
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5">
            <h2 className="mb-4 font-display text-lg font-bold text-on-surface">صور المنتج</h2>

            {images.length > 0 && (
              <div className="mb-4 grid grid-cols-3 gap-3 md:grid-cols-4">
                {images.map((img, index) => (
                  <div
                    key={img + index}
                    className="group relative overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low"
                  >
                    {index === 0 && (
                      <span className="absolute right-1.5 top-1.5 z-10 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-on-primary">
                        الرئيسية
                      </span>
                    )}
                    <img
                      src={img}
                      alt={`صورة ${index + 1}`}
                      className="aspect-square w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-on-surface/50 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => moveImage(index, -1)}
                        className="flex h-6 w-6 items-center justify-center rounded text-white hover:bg-white/20"
                        aria-label="تحريك لليسار"
                      >
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="flex h-6 w-6 items-center justify-center rounded text-white hover:bg-error"
                        aria-label="حذف الصورة"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(index, 1)}
                        className="flex h-6 w-6 items-center justify-center rounded text-white hover:bg-white/20"
                        aria-label="تحريك لليمين"
                      >
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {imageUploadError && (
              <p className="mb-3 rounded-lg bg-error-container/50 px-3 py-2 text-xs font-bold text-error">
                {imageUploadError}
              </p>
            )}

            {/* رفع من الجهاز — الصورة الرئيسية + صور إضافية، بتترفع فعليًا للسيرفر ويتم معالجتها هناك (WebP + تصغير + Thumbnail) */}
            <div className="mb-3 flex flex-wrap gap-2">
              <input
                ref={mainImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleMainImageUpload}
              />
              <button
                type="button"
                disabled={isUploadingImages}
                onClick={() => mainImageInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-on-primary hover:bg-primary-container disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-lg">upload</span>
                {images.length > 0 ? 'تغيير الصورة الرئيسية' : 'اختيار الصورة الرئيسية'} من الجهاز
              </button>

              <input
                ref={extraImageInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleExtraImagesUpload}
              />
              <button
                type="button"
                disabled={isUploadingImages}
                onClick={() => extraImageInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-xl border-2 border-outline-variant px-4 py-2.5 text-sm font-bold text-on-surface hover:border-outline disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-lg">add_photo_alternate</span>
                إضافة صورة أخرى من الجهاز
              </button>

              {isUploadingImages && (
                <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined animate-spin text-lg">
                    progress_activity
                  </span>
                  جاري المعالجة...
                </span>
              )}
            </div>

            {/* إضافة صورة برابط — بديل اختياري لو الصورة أونلاين بالفعل */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="أو الصق رابط صورة هنا..."
                className="flex-1 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={addImage}
                className="shrink-0 rounded-xl bg-surface-container-high px-4 py-2.5 text-sm font-bold text-on-surface hover:bg-surface-container-highest"
              >
                إضافة
              </button>
            </div>
            <p className="mt-2 text-xs text-on-surface-variant">
              أول صورة في القائمة هي الصورة الرئيسية للمنتج — استخدم أزرار التحريك لتغيير
              ترتيبها. الصور المرفوعة من الجهاز بيتم ضغطها وتحويلها تلقائياً لصيغة WebP
              بأعلى جودة ممكنة.
            </p>
          </div>
        </div>

        {/* === العمود الجانبي: السعر والمخزون والنشر === */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5">
            <h2 className="mb-4 font-display text-lg font-bold text-on-surface">السعر والمخزون</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                  السعر (ج.م)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={`w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-sm outline-none focus:border-primary ${
                    errors.price ? 'border-error' : 'border-outline-variant'
                  }`}
                />
                {errors.price && <p className="mt-1 text-xs font-bold text-error">{errors.price}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                  السعر قبل الخصم (اختياري)
                </label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-on-surface-variant">
                  كمية المخزون
                </label>
                <input
                  type="number"
                  value={stockCount}
                  onChange={(e) => setStockCount(e.target.value)}
                  className={`w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-sm outline-none focus:border-primary ${
                    errors.stockCount ? 'border-error' : 'border-outline-variant'
                  }`}
                />
                {errors.stockCount && (
                  <p className="mt-1 text-xs font-bold text-error">{errors.stockCount}</p>
                )}
              </div>

              {/* مفتاح حالة التوفر */}
              <label className="flex cursor-pointer items-center justify-between rounded-xl bg-surface-container-high px-4 py-3">
                <span className="text-sm font-bold text-on-surface">متوفر للبيع</span>
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="h-5 w-5 accent-primary"
                />
              </label>
            </div>
          </div>

          {/* أزرار الحفظ */}
          <div className="space-y-2.5">
            <button
              type="button"
              disabled={isSaving}
              onClick={(e) => handleSubmit(e, true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-on-primary shadow-[0_8px_20px_rgba(187,0,16,0.2)] transition-all hover:bg-primary-container active:scale-[0.98] disabled:opacity-60"
            >
              <span className="material-symbols-outlined">publish</span>
              نشر المنتج
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={(e) => handleSubmit(e, false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-outline-variant py-3.5 text-sm font-bold text-on-surface hover:border-outline disabled:opacity-60"
            >
              <span className="material-symbols-outlined">save</span>
              حفظ كمسودة
            </button>
            {saveMessage && (
              <p className="rounded-lg bg-surface-container-high px-3 py-2 text-center text-xs font-bold text-on-surface-variant">
                {saveMessage}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}