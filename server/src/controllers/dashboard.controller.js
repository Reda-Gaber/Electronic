const { pool } = require('../config/db')
const asyncHandler = require('../utils/asyncHandler')
const { toOrderDTO, toProductDTO } = require('../utils/transformers')

/** آخر 7 أيام (شاملة اليوم) كتواريخ ISO بسيطة (YYYY-MM-DD) — الأقدم أولاً */
function getLast7Days() {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.push(date.toISOString().slice(0, 10))
  }
  return days
}

/**
 * GET /api/admin/dashboard
 * محمي — كل إحصائيات لوحة التحكم الرئيسية في استعلام واحد مجمّع، بدل ما
 * الفرونت يجيب كل الطلبات والمنتجات ويحسبهم بنفسه في المتصفح
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  // === بطاقات الإحصائيات ===
  const [[{ totalOrders }]] = await pool.query('SELECT COUNT(*) AS totalOrders FROM orders')
  const [[{ pendingOrders }]] = await pool.query(
    `SELECT COUNT(*) AS pendingOrders FROM orders WHERE status = 'pending'`,
  )
  const [[{ totalRevenue }]] = await pool.query(
    `SELECT COALESCE(SUM(total), 0) AS totalRevenue FROM orders WHERE status != 'cancelled'`,
  )

  // === المنتجات غير المتوفرة حالياً (الأدمن عطّلها يدوياً بعد نفاد الكمية) ===
  const [outOfStockRows] = await pool.query(
    `SELECT p.*, c.name AS category_name
     FROM products p
     JOIN categories c ON c.id = p.category_id
     WHERE p.in_stock = 0 AND p.status = 'published'
     ORDER BY p.updated_at DESC
     LIMIT 10`,
  )
  let outOfStockProducts = []
  if (outOfStockRows.length > 0) {
    const ids = outOfStockRows.map((r) => r.id)
    const [images] = await pool.query(
      'SELECT * FROM product_images WHERE product_id IN (?) ORDER BY sort_order ASC',
      [ids],
    )
    outOfStockProducts = outOfStockRows.map((row) =>
      toProductDTO(
        row,
        images.filter((img) => img.product_id === row.id),
        [],
      ),
    )
  }

  // === المبيعات آخر 7 أيام (كل الطلبات بغض النظر عن الحالة، زي الحساب الأصلي) ===
  const [salesRows] = await pool.query(
    `SELECT DATE(created_at) AS day, SUM(total) AS total
     FROM orders
     WHERE created_at >= (CURDATE() - INTERVAL 6 DAY)
     GROUP BY DATE(created_at)`,
  )
  const salesByDayMap = new Map(
    salesRows.map((r) => [r.day.toISOString().slice(0, 10), Number(r.total)]),
  )
  const salesByDay = getLast7Days().map((date) => ({
    date,
    total: salesByDayMap.get(date) || 0,
  }))

  // === آخر 6 طلبات + كود مختصر (ORD-<ترتيبه الزمني بين كل الطلبات>) ===
  const [recentRows] = await pool.query(
    `SELECT *, ROW_NUMBER() OVER (ORDER BY created_at ASC) AS position
     FROM orders
     ORDER BY created_at DESC
     LIMIT 6`,
  )
  let recentOrders = []
  if (recentRows.length > 0) {
    const orderIds = recentRows.map((r) => r.id)
    const [itemRows] = await pool.query('SELECT * FROM order_items WHERE order_id IN (?)', [
      orderIds,
    ])
    recentOrders = recentRows.map((row) => ({
      ...toOrderDTO(
        row,
        itemRows.filter((item) => item.order_id === row.id),
      ),
      shortCode: `ORD-${row.position}`,
    }))
  }

  res.json({
    success: true,
    data: {
      totalOrders,
      pendingOrders,
      totalRevenue: Number(totalRevenue),
      outOfStockProducts,
      salesByDay,
      recentOrders,
    },
  })
})

module.exports = { getDashboardStats }
