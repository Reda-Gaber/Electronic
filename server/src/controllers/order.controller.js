const crypto = require('crypto')
const { pool } = require('../config/db')
const ApiError = require('../utils/ApiError')
const asyncHandler = require('../utils/asyncHandler')
const { toOrderDTO } = require('../utils/transformers')
const { EGYPT_GOVERNORATES } = require('../data/governorates')

const EGYPT_PHONE_REGEX = /^01[0125][0-9]{8}$/

/** توليد رقم مرجعي بشري لرقم الطلب — بنفس شكل الفرونت الحالي (ORD-<وقت>-<عشوائي>) */
function generateReferenceNumber() {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

/** جلب طلب واحد كامل (مع عناصره) بشرط SQL معيّن — يستخدمه كل الـ endpoints تحت */
async function findOrderByCondition(whereClause, params) {
  const [rows] = await pool.query(`SELECT * FROM orders WHERE ${whereClause} LIMIT 1`, params)
  if (rows.length === 0) return null

  const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [rows[0].id])
  return toOrderDTO(rows[0], items)
}

// ============================================================================
// عام — إتمام الشراء وتتبع الطلب (Guest بالكامل، بدون أي تسجيل دخول)
// ============================================================================

/**
 * POST /api/orders
 * عام — إنشاء طلب جديد من السلة (Checkout)
 * body: { customerName, phone, governorate, city, district, street, buildingNumber,
 *         floor, apartment, paymentMethod, notes, items: [{ productId, quantity }] }
 *
 * ملحوظة: رسوم الشحن مش بتتحدد وقت الطلب — بتتحدد بعدين من الأدمن لما شركة
 * الشحن تأكد التكلفة الفعلية (راجع adminUpdateOrder)
 */
const createOrder = asyncHandler(async (req, res) => {
  console.log('STEP 1 - req.body:', req.body)

  const {
    customerName,
    phone,
    governorate,
    city,
    district,
    street,
    buildingNumber,
    floor,
    apartment,
    paymentMethod,
    notes,
    items,
  } = req.body

  // === التحقق من البيانات ===
  if (!customerName || !customerName.trim()) {
    throw new ApiError(400, 'الاسم مطلوب')
  }
  if (!phone || !EGYPT_PHONE_REGEX.test(phone.trim())) {
    throw new ApiError(400, 'رقم هاتف مصري غير صحيح (مثال: 01012345678)')
  }
  if (!governorate || !EGYPT_GOVERNORATES.includes(governorate)) {
    throw new ApiError(400, 'اختر محافظة صحيحة')
  }
  if (!city || !city.trim()) throw new ApiError(400, 'المدينة مطلوبة')
  if (!district || !district.trim()) throw new ApiError(400, 'الحي/المنطقة مطلوب')
  if (!street || !street.trim()) throw new ApiError(400, 'الشارع مطلوب')
  if (!buildingNumber || !buildingNumber.trim()) throw new ApiError(400, 'رقم العمارة مطلوب')
  if (!floor || !floor.trim()) throw new ApiError(400, 'الدور مطلوب')
  if (!apartment || !apartment.trim()) throw new ApiError(400, 'رقم الشقة مطلوب')
  if (!['cash', 'instapay'].includes(paymentMethod)) {
    throw new ApiError(400, 'طريقة دفع غير صحيحة')
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'السلة فارغة')
  }

  console.log('STEP 2 - validation passed')

  // === أسعار المنتجات — بنجيبها من القاعدة الحالية، مش من اللي بعته العميل،
  // عشان محدش يقدر يغيّر السعر من الطلب نفسه ===
  const productIds = items.map((item) => item.productId)
  console.log('STEP 3 - productIds:', productIds)
  const [productRows] = await pool.query('SELECT * FROM products WHERE id IN (?)', [productIds])
  console.log('STEP 4 - productRows found:', productRows.length)

  if (productRows.length !== new Set(productIds).size) {
    throw new ApiError(400, 'بعض المنتجات في السلة غير موجودة')
  }

  const productsById = new Map(productRows.map((p) => [String(p.id), p]))
  const [imageRows] = await pool.query(
    'SELECT * FROM product_images WHERE product_id IN (?) ORDER BY sort_order ASC',
    [productIds],
  )
  const firstImageByProduct = new Map()
  for (const img of imageRows) {
    const key = String(img.product_id)
    if (!firstImageByProduct.has(key)) firstImageByProduct.set(key, img.image_url)
  }

  console.log('STEP 5 - images fetched')

  let subtotal = 0
  const orderItemsToInsert = items.map((item) => {
    const product = productsById.get(String(item.productId))
    const quantity = Number(item.quantity)
    if (!quantity || quantity <= 0) {
      throw new ApiError(400, `كمية غير صحيحة للمنتج: ${product?.name || item.productId}`)
    }
    subtotal += Number(product.price) * quantity
    return {
      productId: product.id,
      name: product.name,
      image: firstImageByProduct.get(String(product.id)) || null,
      unitPrice: Number(product.price),
      quantity,
    }
  })

  console.log('STEP 6 - subtotal:', subtotal, 'orderItemsToInsert:', orderItemsToInsert)

  // الإجمالي وقت الطلب = المجموع الفرعي بس (رسوم الشحن لسه مش معروفة)
  const total = subtotal
  const referenceNumber = generateReferenceNumber()
  const publicId = crypto.randomUUID()

  console.log('STEP 7 - before getConnection')
  const connection = await pool.getConnection()
  console.log('STEP 8 - got connection, before beginTransaction')
  try {
    await connection.beginTransaction()
    console.log('STEP 9 - transaction started, before INSERT orders')

    const [result] = await connection.query(
      `INSERT INTO orders
        (public_id, reference_number, customer_name, phone, governorate, city, district,
         street, building_number, floor, apartment, payment_method, subtotal,
         shipping_fee, total, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, 'pending', ?)`,
      [
        publicId,
        referenceNumber,
        customerName.trim(),
        phone.trim(),
        governorate,
        city.trim(),
        district.trim(),
        street.trim(),
        buildingNumber.trim(),
        floor.trim(),
        apartment.trim(),
        paymentMethod,
        subtotal,
        total,
        notes?.trim() || null,
      ],
    )
    console.log('STEP 10 - orders INSERT done, insertId:', result.insertId)
    const orderId = result.insertId

    for (const item of orderItemsToInsert) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_image, unit_price, quantity)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.productId, item.name, item.image, item.unitPrice, item.quantity],
      )
    }
    console.log('STEP 11 - order_items INSERT done, before commit')

    await connection.commit()
    console.log('STEP 12 - committed, before findOrderByCondition')

    const order = await findOrderByCondition('id = ?', [orderId])
    console.log('STEP 13 - order fetched, sending response')
    res.status(201).json({ success: true, data: order })
  } catch (err) {
    console.log('STEP ERROR - caught in createOrder:', err)
    await connection.rollback()
    throw err
  } finally {
    connection.release()
  }
})

/**
 * GET /api/orders/confirmation/:publicId
 * عام — لصفحة تأكيد الطلب مباشرة بعد الشراء (بدون حماية إضافية، الـ publicId
 * عشوائي غير قابل للتخمين أصلاً، فنفس مستوى أمان الرابط العشوائي في الفرونت الحالي)
 */
const getOrderByPublicId = asyncHandler(async (req, res) => {
  const order = await findOrderByCondition('public_id = ?', [req.params.publicId])
  if (!order) throw new ApiError(404, 'الطلب غير موجود')
  res.json({ success: true, data: order })
})

/**
 * GET /api/orders/track?referenceNumber=...&phone=...
 * عام — تتبع الطلب: لازم الرقم المرجعي ورقم الهاتف يتطابقوا مع بعض (حماية
 * إضافية تمنع أي حد من الاطلاع على طلب غيره بمجرد تخمين الرقم المرجعي)
 */
const trackOrder = asyncHandler(async (req, res) => {
  const { referenceNumber, phone } = req.query
  if (!referenceNumber || !phone) {
    throw new ApiError(400, 'الرقم المرجعي ورقم الهاتف مطلوبين')
  }

  const order = await findOrderByCondition('LOWER(reference_number) = LOWER(?) AND phone = ?', [
    String(referenceNumber).trim(),
    String(phone).trim(),
  ])

  if (!order) {
    throw new ApiError(404, 'لم يتم العثور على طلب بهذه البيانات')
  }

  res.json({ success: true, data: order })
})

// ============================================================================
// محمي — لوحة تحكم الأدمن
// ============================================================================

/**
 * GET /api/admin/orders
 * محمي — كل الطلبات، بيدعم فلاتر اختيارية: status, search (اسم/تليفون/رقم مرجعي), dateFrom, dateTo
 */
const adminListOrders = asyncHandler(async (req, res) => {
  const { status, search, dateFrom, dateTo } = req.query
  const conditions = []
  const params = []

  if (status && status !== 'all') {
    conditions.push('status = ?')
    params.push(status)
  }
  if (search) {
    conditions.push('(customer_name LIKE ? OR reference_number LIKE ? OR phone LIKE ?)')
    const term = `%${search}%`
    params.push(term, term, term)
  }
  if (dateFrom) {
    conditions.push('created_at >= ?')
    params.push(new Date(dateFrom))
  }
  if (dateTo) {
    conditions.push('created_at <= ?')
    const endOfDay = new Date(dateTo)
    endOfDay.setHours(23, 59, 59, 999)
    params.push(endOfDay)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const [rows] = await pool.query(
    `SELECT * FROM orders ${whereClause} ORDER BY created_at DESC`,
    params,
  )

  if (rows.length === 0) {
    return res.json({ success: true, data: [] })
  }

  const orderIds = rows.map((r) => r.id)
  const [allItems] = await pool.query('SELECT * FROM order_items WHERE order_id IN (?)', [
    orderIds,
  ])

  const orders = rows.map((row) =>
    toOrderDTO(
      row,
      allItems.filter((item) => item.order_id === row.id),
    ),
  )

  res.json({ success: true, data: orders })
})

/**
 * GET /api/admin/orders/:id
 * محمي — طلب واحد. الـ :id هنا هو نفسه public_id اللي بيرجع في حقل "id"
 * من أي استجابة طلب (نفس القيمة المستخدمة في رابط صفحة تأكيد الطلب للعميل) —
 * عشان الفرونت يستخدم order.id بشكل موحّد في كل مكان بدون تفرقة بين حالتين
 */
const adminGetOrderById = asyncHandler(async (req, res) => {
  const order = await findOrderByCondition('public_id = ?', [req.params.id])
  if (!order) throw new ApiError(404, 'الطلب غير موجود')
  res.json({ success: true, data: order })
})

/**
 * PUT /api/admin/orders/:id
 * محمي — تحديث حالة الطلب، رسوم الشحن (بعد ما شركة الشحن تأكد التكلفة)،
 * و/أو ملاحظات الأدمن الداخلية
 * body: { status?, adminNotes?, shippingFee? }
 *   shippingFee: رقم لتحديدها، أو null لإرجاعها لحالة "لسه ما اتحددتش"
 */
const adminUpdateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { status, adminNotes, shippingFee } = req.body

  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
  if (status && !validStatuses.includes(status)) {
    throw new ApiError(400, 'حالة طلب غير صحيحة')
  }
  if (shippingFee !== undefined && shippingFee !== null && Number(shippingFee) < 0) {
    throw new ApiError(400, 'رسوم الشحن غير صحيحة')
  }

  const [existing] = await pool.query('SELECT id, subtotal FROM orders WHERE public_id = ? LIMIT 1', [
    id,
  ])
  if (existing.length === 0) {
    throw new ApiError(404, 'الطلب غير موجود')
  }
  const internalId = existing[0].id
  const subtotal = Number(existing[0].subtotal)

  const fields = []
  const params = []
  if (status !== undefined) {
    fields.push('status = ?')
    params.push(status)
  }
  if (adminNotes !== undefined) {
    fields.push('admin_notes = ?')
    params.push(adminNotes || null)
  }
  if (shippingFee !== undefined) {
    const normalizedFee = shippingFee === null || shippingFee === '' ? null : Number(shippingFee)
    fields.push('shipping_fee = ?')
    params.push(normalizedFee)
    // الإجمالي بيتحدّث معاها: المجموع الفرعي + الشحن (أو المجموع الفرعي بس لو الشحن لسه مش محدد)
    fields.push('total = ?')
    params.push(subtotal + (normalizedFee || 0))
  }

  if (fields.length > 0) {
    params.push(internalId)
    await pool.query(`UPDATE orders SET ${fields.join(', ')} WHERE id = ?`, params)
  }

  const order = await findOrderByCondition('id = ?', [internalId])
  res.json({ success: true, data: order })
})

module.exports = {
  createOrder,
  getOrderByPublicId,
  trackOrder,
  adminListOrders,
  adminGetOrderById,
  adminUpdateOrder,
}