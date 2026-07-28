const { pool } = require('../config/db')
const ApiError = require('../utils/ApiError')
const asyncHandler = require('../utils/asyncHandler')
const { toCategoryDTO } = require('../utils/transformers')
const { generateUniqueSlug } = require('../utils/slugify')

/** استعلام SQL موحّد بيحسب عدد المنتجات المنشورة لكل تصنيف (بدل تخزينه كرقم ثابت) */
const SELECT_CATEGORIES_WITH_COUNT = `
  SELECT c.*, COUNT(p.id) AS productCount
  FROM categories c
  LEFT JOIN products p ON p.category_id = c.id AND p.status = 'published'
  GROUP BY c.id
  ORDER BY c.sort_order ASC, c.id ASC
`

/**
 * GET /api/categories
 * عام — كل التصنيفات مع عدد المنتجات المنشورة في كل واحد
 */
const listCategories = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(SELECT_CATEGORIES_WITH_COUNT)
  res.json({ success: true, data: rows.map(toCategoryDTO) })
})

/**
 * GET /api/categories/:slug
 * عام — تصنيف واحد بالـ slug
 */
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.*, COUNT(p.id) AS productCount
     FROM categories c
     LEFT JOIN products p ON p.category_id = c.id AND p.status = 'published'
     WHERE c.slug = ?
     GROUP BY c.id`,
    [req.params.slug],
  )

  if (rows.length === 0) {
    throw new ApiError(404, 'التصنيف غير موجود')
  }

  res.json({ success: true, data: toCategoryDTO(rows[0]) })
})

/**
 * POST /api/admin/categories
 * محمي — إنشاء تصنيف جديد
 */
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image, icon, isCustomIcon, featuredOnHomepage } = req.body

  if (!name || !name.trim()) {
    throw new ApiError(400, 'اسم التصنيف مطلوب')
  }

  const slug = await generateUniqueSlug(name, async (candidate) => {
    const [rows] = await pool.query('SELECT id FROM categories WHERE slug = ? LIMIT 1', [
      candidate,
    ])
    return rows.length > 0
  })

  const [result] = await pool.query(
    `INSERT INTO categories (name, slug, description, image, icon, is_custom_icon, featured_on_homepage)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      name.trim(),
      slug,
      description?.trim() || null,
      image || null,
      icon || null,
      Boolean(isCustomIcon),
      Boolean(featuredOnHomepage),
    ],
  )

  const [rows] = await pool.query(
    `SELECT c.*, 0 AS productCount FROM categories c WHERE c.id = ?`,
    [result.insertId],
  )

  res.status(201).json({ success: true, data: toCategoryDTO(rows[0]) })
})

/**
 * PUT /api/admin/categories/:id
 * محمي — تعديل تصنيف موجود (الاسم/الـ slug ثابتين بعد الإنشاء لتفادي كسر الروابط)
 */
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { name, description, image, icon, isCustomIcon, featuredOnHomepage } = req.body

  const [existingRows] = await pool.query('SELECT id FROM categories WHERE id = ? LIMIT 1', [id])
  if (existingRows.length === 0) {
    throw new ApiError(404, 'التصنيف غير موجود')
  }

  if (!name || !name.trim()) {
    throw new ApiError(400, 'اسم التصنيف مطلوب')
  }

  await pool.query(
    `UPDATE categories
     SET name = ?, description = ?, image = ?, icon = ?, is_custom_icon = ?, featured_on_homepage = ?
     WHERE id = ?`,
    [
      name.trim(),
      description?.trim() || null,
      image || null,
      icon || null,
      Boolean(isCustomIcon),
      Boolean(featuredOnHomepage),
      id,
    ],
  )

  const [rows] = await pool.query(
    `SELECT c.*, COUNT(p.id) AS productCount
     FROM categories c
     LEFT JOIN products p ON p.category_id = c.id AND p.status = 'published'
     WHERE c.id = ?
     GROUP BY c.id`,
    [id],
  )

  res.json({ success: true, data: toCategoryDTO(rows[0]) })
})

/**
 * DELETE /api/admin/categories/:id
 * محمي — حذف تصنيف (مرفوض لو لسه فيه منتجات مرتبطة به، عشان نحافظ على سلامة البيانات)
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params

  const [productRows] = await pool.query(
    'SELECT COUNT(*) AS count FROM products WHERE category_id = ?',
    [id],
  )
  if (productRows[0].count > 0) {
    throw new ApiError(
      400,
      `لا يمكن حذف هذا التصنيف لوجود ${productRows[0].count} منتج مرتبط به — انقل المنتجات لتصنيف آخر أولاً`,
    )
  }

  const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id])
  if (result.affectedRows === 0) {
    throw new ApiError(404, 'التصنيف غير موجود')
  }

  res.json({ success: true, message: 'تم حذف التصنيف بنجاح' })
})

module.exports = {
  listCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
}
