// إضافة/تعديل منتج — فورم كامل مع حفظ دائم في localStorage
// TODO: ربط هذا بالـ API عند توفر الباك إند — استبدال منطق الحفظ المحلي بطلبات حقيقية (POST/PUT /products)
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Product } from '@/types'
import { getCategories } from '@/utils/categoryStorage'
import {
  generateProductId,
  generateProductSlug,
  getProductById,
  getProducts,
  saveProducts,
} from '@/utils/productStorage'

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

  // في وضع التعديل: نبحث عن المنتج الحالي من التخزين المحلي
  const existingProduct = isEdit && id ? getProductById(id) : undefined

  // === حالة الفورم ===
  const [name, setName] = useState(existingProduct?.name ?? '')
  const [categoryId, setCategoryId] = useState(
    existingProduct?.categoryId ?? getCategories()[0]?.id ?? '',
  )
  const [brand, setBrand] = useState(existingProduct?.brand ?? '')
  const [price, setPrice] = useState(existingProduct?.price.toString() ?? '')
  const [originalPrice, setOriginalPrice] = useState(
    existingProduct?.originalPrice?.toString() ?? '',
  )
  const [stockCount, setStockCount] = useState(existingProduct?.stockCount.toString() ?? '')
  const [inStock, setInStock] = useState(existingProduct?.inStock ?? true)
  const [description, setDescription] = useState(existingProduct?.description ?? '')
  const [specs, setSpecs] = useState<SpecRow[]>(
    existingProduct?.specs.map((s, i) => ({ id: `spec-${i}`, label: s.label, value: s.value })) ?? [
      { id: 'spec-0', label: '', value: '' },
    ],
  )
  const [images, setImages] = useState<string[]>(existingProduct?.images ?? [])
  const [newImageUrl, setNewImageUrl] = useState('')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  // === حالة: تعديل منتج غير موجود ===
  if (isEdit && !existingProduct) {
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
  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index))
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

  /** بناء كائن المنتج من بيانات الفورم ثم حفظه في localStorage */
  const handleSubmit = (e: FormEvent, publish: boolean) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setErrors({})

    const categories = getCategories()
    const category = categories.find((cat) => cat.id === categoryId)
    const allProducts = getProducts()
    const productImages =
      images.length > 0 ? images : existingProduct?.images ?? [DEFAULT_PRODUCT_IMAGE]

    const productData: Product = {
      id: existingProduct?.id ?? generateProductId(),
      name: name.trim(),
      slug:
        existingProduct?.slug ??
        generateProductSlug(
          name,
          allProducts.filter((product) => product.id !== existingProduct?.id),
        ),
      categoryId,
      categoryName: category?.name ?? '',
      brand: brand.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      image: productImages[0],
      images: productImages,
      description: description.trim(),
      specs: specs
        .filter((row) => row.label.trim() && row.value.trim())
        .map((row) => ({ label: row.label.trim(), value: row.value.trim() })),
      inStock,
      stockCount: Number(stockCount),
      rating: existingProduct?.rating ?? 0,
      reviewCount: existingProduct?.reviewCount ?? 0,
      isFeatured: existingProduct?.isFeatured ?? false,
      isNew: existingProduct?.isNew ?? !isEdit,
      status: publish ? 'published' : 'draft',
    }

    const updatedProducts = isEdit
      ? allProducts.map((product) => (product.id === productData.id ? productData : product))
      : [...allProducts, productData]

    saveProducts(updatedProducts)

    setSaveMessage(
      publish ? 'تم نشر المنتج بنجاح' : 'تم حفظ المسودة بنجاح',
    )
    setTimeout(() => navigate('/admin/products'), 1200)
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
          {isEdit ? `تعديل: ${existingProduct?.name}` : 'إضافة منتج جديد'}
        </h1>
      </div>

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
                    {getCategories().map((cat) => (
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
                    <img src={img} alt={`صورة ${index + 1}`} className="aspect-square w-full object-contain p-2" />
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

            {/* إضافة صورة برابط — بديل مؤقت لرفع ملفات حقيقي */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="الصق رابط صورة هنا..."
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
              {/* TODO: ربط هذا بالـ API عند توفر الباك إند — استبدال هذا برفع ملفات حقيقي */}
              حالياً يتم إضافة الصور عبر روابط مباشرة، وسيُستبدل هذا برفع ملفات فعلي عند ربط الباك إند
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
              onClick={(e) => handleSubmit(e, true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-on-primary shadow-[0_8px_20px_rgba(187,0,16,0.2)] transition-all hover:bg-primary-container active:scale-[0.98]"
            >
              <span className="material-symbols-outlined">publish</span>
              نشر المنتج
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-outline-variant py-3.5 text-sm font-bold text-on-surface hover:border-outline"
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
