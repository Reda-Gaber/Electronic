// Controller تسجيل دخول الأدمن — تسجيل الدخول، جلب بيانات الأدمن الحالي، تغيير الباسورد
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { pool } = require('../config/db')
const ApiError = require('../utils/ApiError')
const asyncHandler = require('../utils/asyncHandler')

/** توليد توكن JWT للأدمن — sub = رقم الأدمن (subject) */
function generateToken(adminId) {
  return jwt.sign({ sub: adminId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

/**
 * POST /api/auth/login
 * body: { email, password }
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new ApiError(400, 'الإيميل وكلمة المرور مطلوبين')
  }

  const [rows] = await pool.query(
    'SELECT id, name, email, password_hash FROM admin_users WHERE email = ? LIMIT 1',
    [email.trim().toLowerCase()],
  )

  // رسالة الخطأ عامّة قصدًا (مش بنقول "الإيميل مش موجود" أو "الباسورد غلط" بالتحديد)
  // عشان محدش يقدر يتأكد إن إيميل معيّن مسجّل أو لأ (Enumeration attack)
  const genericError = 'الإيميل أو كلمة المرور غير صحيحة'

  if (rows.length === 0) {
    throw new ApiError(401, genericError)
  }

  const admin = rows[0]
  const isPasswordValid = await bcrypt.compare(password, admin.password_hash)

  if (!isPasswordValid) {
    throw new ApiError(401, genericError)
  }

  const token = generateToken(admin.id)

  res.json({
    success: true,
    data: {
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email },
    },
  })
})

/**
 * GET /api/auth/me
 * محمي — بيرجّع بيانات الأدمن المسجّل دخوله حاليًا (بيتقرا التوكن من middleware الحماية)
 */
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { admin: req.admin } })
})

/**
 * PATCH /api/auth/change-password
 * محمي — body: { currentPassword, newPassword }
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'لازم تدخل كلمة المرور الحالية والجديدة')
  }
  if (newPassword.length < 8) {
    throw new ApiError(400, 'كلمة المرور الجديدة لازم تكون 8 حروف/أرقام على الأقل')
  }

  const [rows] = await pool.query(
    'SELECT password_hash FROM admin_users WHERE id = ? LIMIT 1',
    [req.admin.id],
  )

  const isCurrentValid = await bcrypt.compare(currentPassword, rows[0].password_hash)
  if (!isCurrentValid) {
    throw new ApiError(401, 'كلمة المرور الحالية غير صحيحة')
  }

  const newHash = await bcrypt.hash(newPassword, 10)
  await pool.query('UPDATE admin_users SET password_hash = ? WHERE id = ?', [
    newHash,
    req.admin.id,
  ])

  res.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح' })
})

module.exports = { login, getMe, changePassword }
