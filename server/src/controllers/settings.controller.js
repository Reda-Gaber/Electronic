const { pool } = require('../config/db')
const ApiError = require('../utils/ApiError')
const asyncHandler = require('../utils/asyncHandler')
const { toSettingsDTO } = require('../utils/transformers')

/** جلب صف الإعدادات — يستخدمه GET و PUT (بعد التحديث) */
async function fetchSettings() {
  const [settingsRows] = await pool.query('SELECT * FROM settings WHERE id = 1 LIMIT 1')
  return toSettingsDTO(settingsRows[0])
}

/**
 * GET /api/settings
 * عام — إعدادات المتجر (بيستخدمها الفوتر وصفحة الـ Checkout)
 */
const getSettings = asyncHandler(async (req, res) => {
  const settings = await fetchSettings()
  res.json({ success: true, data: settings })
})

/**
 * PUT /api/admin/settings
 * محمي — تحديث بيانات المتجر (الاسم/الهاتف/رقم إنستاباي)
 * body: { storeName, storePhone, instapayNumber }
 */
const updateSettings = asyncHandler(async (req, res) => {
  const { storeName, storePhone, instapayNumber } = req.body

  if (!storeName || !storeName.trim()) throw new ApiError(400, 'اسم المتجر مطلوب')
  if (!storePhone || !storePhone.trim()) throw new ApiError(400, 'رقم تليفون المتجر مطلوب')
  if (!instapayNumber || !instapayNumber.trim()) throw new ApiError(400, 'رقم إنستاباي مطلوب')

  await pool.query(
    'UPDATE settings SET store_name = ?, store_phone = ?, instapay_number = ? WHERE id = 1',
    [storeName.trim(), storePhone.trim(), instapayNumber.trim()],
  )

  const settings = await fetchSettings()
  res.json({ success: true, data: settings })
})

module.exports = { getSettings, updateSettings }
