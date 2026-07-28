// middleware حماية المسارات — يتحقق إن فيه توكن JWT صحيح قبل ما يسمح بالدخول
// يُستخدم على أي Route محتاج تسجيل دخول أدمن (كل مسارات الأدمن ما عدا /login)
const jwt = require('jsonwebtoken')
const ApiError = require('../utils/ApiError')
const asyncHandler = require('../utils/asyncHandler')
const { pool } = require('../config/db')

const protect = asyncHandler(async function (req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'لازم تسجّل دخول للوصول لده')
  }

  const token = authHeader.split(' ')[1]

  let payload
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    throw new ApiError(401, 'الجلسة منتهية أو غير صالحة، سجّل دخول تاني')
  }

  // نتأكد إن الأدمن لسه موجود فعلاً في القاعدة (مثلاً لو اتحذف بعد ما التوكن اتولّد)
  const [rows] = await pool.query(
    'SELECT id, name, email FROM admin_users WHERE id = ? LIMIT 1',
    [payload.sub],
  )

  if (rows.length === 0) {
    throw new ApiError(401, 'الحساب غير موجود')
  }

  // نحط بيانات الأدمن على الـ request عشان أي controller بعد كده يقدر يستخدمها
  req.admin = rows[0]
  next()
})

module.exports = { protect }
