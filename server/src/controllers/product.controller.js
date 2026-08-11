const { pool } = require('../config/db')
const ApiError = require('../utils/ApiError')
const asyncHandler = require('../utils/asyncHandler')
const { toProductDTO } = require('../utils/transformers')
const { generateUniqueSlug } = require('../utils/slugify')

const BASE_SELECT = `
  SELECT p.*, c.name AS category_name
  FROM products p
  JOIN categories c ON c.id = p.category_id
`

/** جلب صور ومواصفات مجموعة منتجات دفعة واحدة (بدل استعلام لكل منتج لوحده) */
async function attachImagesAndSpecs(productRows) {
  if (productRows.length === 0) return []

  const ids = productRows.map((p) => p.id)
  const [images] = await pool.query(
    `SELECT * FROM product_images WHERE product_id IN (?) ORDER BY sort_order ASC`,
    [ids],
  )
  const [specs] = await pool.query(
    `SELECT * FROM product_specs WHERE product_id IN (?) ORDER BY sort_order ASC`,
    [ids],
  )

  return productRows.map((row) =>
    toProductDTO(
      row,
      images.filter((img) => img.product_id === row.id),
      specs.filter((s) => s.product_id === row.id),
    ),
  )
}

// ============================================================================
// عام — واجهة المتجر
// ============================================================================

/**
 * GET /api/products
 * عام — قائمة المنتجات المنشورة فقط، مع دعم فلاتر وترتيب اختيارية عبر query params:
 *   category, search, brands (comma-separated), minPrice, maxPrice, inStock,
 *   isNew, isFeatured, sort (newest|price-asc|price-desc|popular), limit
 */
const listProducts = asyncHandler(async (req, res) => {
  const { category, search, brands, minPrice, maxPrice, inStock, isNew, isFeatured, sort, limit } =
    req.query

  const conditions = [`p.status = 'published'`]
  const params = []

  if (category) {
    conditions.push('c.slug = ?')
    params.push(category)
  }
  if (search) {
    conditions.push('(p.name LIKE ? OR p.brand LIKE ? OR p.description LIKE ?)')
    const term = `%${search}%`
    params.push(term, term, term)
  }
  if (brands) {
    const brandList = String(brands).split(',').filter(Boolean)
    if (brandList.length > 0) {
      conditions.push(`p.brand IN (?)`)
      params.push(brandList)
    }
  }
  if (minPrice) {
    conditions.push('p.price >= ?')
    params.push(Number(minPrice))
  }
  if (maxPrice) {
    conditions.push('p.price <= ?')
    params.push(Number(maxPrice))
  }
  if (inStock === 'true') {
    conditions.push('p.in_stock = 1')
  }
  if (isNew === 'true') {
    conditions.push('p.is_new = 1')
  }
  if (isFeatured === 'true') {
    conditions.push('p.is_featured = 1')
  }

  let orderBy = 'p.is_new DESC, p.created_at DESC' // newest (افتراضي)
  if (sort === 'price-asc') orderBy = 'p.price ASC'
  else if (sort === 'price-desc') orderBy = 'p.price DESC'
  else if (sort === 'popular') orderBy = 'p.review_count DESC'

  let sql = `${BASE_SELECT} WHERE ${conditions.join(' AND ')} ORDER BY ${orderBy}`
  if (limit && Number(limit) > 0) {
    sql += ' LIMIT ?'
    params.push(Number(limit))
  }

  const [rows] = await pool.query(sql, params)
  const products = await attachImagesAndSpecs(rows)

  res.json({ success: true, data: products })
})

/**
 * GET /api/products/:slug
 * عام — منتج واحد منشور بالـ slug (مع صوره ومواصفاته الكاملة)
 */
const getProductBySlug = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`${BASE_SELECT} WHERE p.slug = ? AND p.status = 'published'`, [
    req.params.slug,
  ])

  if (rows.length === 0) {
    throw new ApiError(404, 'المنتج غير موجود')
  }

  const products = await attachImagesAndSpecs(rows)
  res.json({ success: true, data: products[0] })
})

// ============================================================================
// محمي — لوحة تحكم الأدمن
// ============================================================================

/**
 * GET /api/admin/products
 * محمي — كل المنتجات (منشورة ومسودات)، مع دعم بحث بالاسم/الماركة وفلترة بالتصنيف
 */
const adminListProducts = asyncHandler(async (req, res) => {
  const { search, categoryId } = req.query
  const conditions = []
  const params = []

  if (search) {
    conditions.push('(p.name LIKE ? OR p.brand LIKE ?)')
    const term = `%${search}%`
    params.push(term, term)
  }
  if (categoryId) {
    conditions.push('p.category_id = ?')
    params.push(categoryId)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const [rows] = await pool.query(
    `${BASE_SELECT} ${whereClause} ORDER BY p.created_at DESC`,
    params,
  )
  const products = await attachImagesAndSpecs(rows)

  res.json({ success: true, data: products })
})

/**
 * GET /api/admin/products/:id
 * محمي — منتج واحد بالـ id (أي حالة نشر) — لصفحة تعديل المنتج
 */
const adminGetProductById = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`${BASE_SELECT} WHERE p.id = ?`, [req.params.id])
  if (rows.length === 0) {
    throw new ApiError(404, 'المنتج غير موجود')
  }
  const products = await attachImagesAndSpecs(rows)
  res.json({ success: true, data: products[0] })
})

/** التحقق من صحة بيانات المنتج المرسلة من فورم الأدمن */
function validateProductInput(body) {
  const errors = {}
  if (!body.name || !body.name.trim()) errors.name = 'اسم المنتج مطلوب'
  if (!body.categoryId) errors.categoryId = 'اختر التصنيف'
  if (!body.brand || !body.brand.trim()) errors.brand = 'الماركة مطلوبة'
  if (!body.price || Number(body.price) <= 0) errors.price = 'أدخل سعراً صحيحاً'
  return errors
}

/**
 * POST /api/admin/products
 * محمي — إنشاء منتج جديد (مع صوره ومواصفاته)
 */
const createProduct = asyncHandler(async (req, res) => {
  const errors = validateProductInput(req.body)
  if (Object.keys(errors).length > 0) {
    throw new ApiError(400, Object.values(errors)[0])
  }

  const {
    name,
    categoryId,
    brand,
    price,
    originalPrice,
    description,
    images,
    specs,
    inStock,
    isFeatured,
    isNew,
    status,
  } = req.body

  const slug = await generateUniqueSlug(name, async (candidate) => {
    const [rows] = await pool.query('SELECT id FROM products WHERE slug = ? LIMIT 1', [candidate])
    return rows.length > 0
  })

  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    const [result] = await connection.query(
      `INSERT INTO products
        (name, slug, category_id, brand, price, original_price, description,
         in_stock, is_featured, is_new, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        slug,
        categoryId,
        brand.trim(),
        Number(price),
        originalPrice ? Number(originalPrice) : null,
        description?.trim() || null,
        Boolean(inStock),
        Boolean(isFeatured),
        Boolean(isNew),
        status === 'draft' ? 'draft' : 'published',
      ],
    )
    const productId = result.insertId

    const imageList = Array.isArray(images) ? images.filter(Boolean) : []
    for (let i = 0; i < imageList.length; i++) {
      await connection.query(
        'INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)',
        [productId, imageList[i], i],
      )
    }

    const specList = Array.isArray(specs)
      ? specs.filter((s) => s.label?.trim() && s.value?.trim())
      : []
    for (let i = 0; i < specList.length; i++) {
      await connection.query(
        'INSERT INTO product_specs (product_id, label, value, sort_order) VALUES (?, ?, ?, ?)',
        [productId, specList[i].label.trim(), specList[i].value.trim(), i],
      )
    }

    await connection.commit()

    const [rows] = await pool.query(`${BASE_SELECT} WHERE p.id = ?`, [productId])
    const products = await attachImagesAndSpecs(rows)
    res.status(201).json({ success: true, data: products[0] })
  } catch (err) {
    await connection.rollback()
    throw err
  } finally {
    connection.release()
  }
})

/**
 * PUT /api/admin/products/:id
 * محمي — تعديل منتج موجود (الاسم والـ slug ثابتين بعد الإنشاء لتفادي كسر الروابط)
 */
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  const [existing] = await pool.query('SELECT id FROM products WHERE id = ? LIMIT 1', [id])
  if (existing.length === 0) {
    throw new ApiError(404, 'المنتج غير موجود')
  }

  const errors = validateProductInput(req.body)
  if (Object.keys(errors).length > 0) {
    throw new ApiError(400, Object.values(errors)[0])
  }

  const {
    name,
    categoryId,
    brand,
    price,
    originalPrice,
    description,
    images,
    specs,
    inStock,
    isFeatured,
    isNew,
    status,
  } = req.body

  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    await connection.query(
      `UPDATE products SET
        name = ?, category_id = ?, brand = ?, price = ?, original_price = ?,
        description = ?, in_stock = ?, is_featured = ?, is_new = ?, status = ?
       WHERE id = ?`,
      [
        name.trim(),
        categoryId,
        brand.trim(),
        Number(price),
        originalPrice ? Number(originalPrice) : null,
        description?.trim() || null,
        Boolean(inStock),
        Boolean(isFeatured),
        Boolean(isNew),
        status === 'draft' ? 'draft' : 'published',
        id,
      ],
    )

    // أسهل وأضمن طريقة لتحديث الصور والمواصفات: نمسح القديم ونضيف الجديد
    // من نفس القائمة اللي جاية من الفورم (بدل مقارنة تعديل/إضافة/حذف عنصر بعنصر)
    await connection.query('DELETE FROM product_images WHERE product_id = ?', [id])
    await connection.query('DELETE FROM product_specs WHERE product_id = ?', [id])

    const imageList = Array.isArray(images) ? images.filter(Boolean) : []
    for (let i = 0; i < imageList.length; i++) {
      await connection.query(
        'INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)',
        [id, imageList[i], i],
      )
    }

    const specList = Array.isArray(specs)
      ? specs.filter((s) => s.label?.trim() && s.value?.trim())
      : []
    for (let i = 0; i < specList.length; i++) {
      await connection.query(
        'INSERT INTO product_specs (product_id, label, value, sort_order) VALUES (?, ?, ?, ?)',
        [id, specList[i].label.trim(), specList[i].value.trim(), i],
      )
    }

    await connection.commit()

    const [rows] = await pool.query(`${BASE_SELECT} WHERE p.id = ?`, [id])
    const products = await attachImagesAndSpecs(rows)
    res.json({ success: true, data: products[0] })
  } catch (err) {
    await connection.rollback()
    throw err
  } finally {
    connection.release()
  }
})

/**
 * DELETE /api/admin/products/:id
 * محمي — حذف منتج (صوره ومواصفاته بتتحذف تلقائي معاه بسبب ON DELETE CASCADE)
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id])
  if (result.affectedRows === 0) {
    throw new ApiError(404, 'المنتج غير موجود')
  }
  res.json({ success: true, message: 'تم حذف المنتج بنجاح' })
})

module.exports = {
  listProducts,
  getProductBySlug,
  adminListProducts,
  adminGetProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}
