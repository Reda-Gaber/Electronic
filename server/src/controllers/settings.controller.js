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
 * محمي — تحديث بيانات المتجر (الاسم/الهاتف/الإيميل/العنوان/أرقام التواصل/رقم إنستاباي/قالب واتساب)
 * body: { storeName, storePhone, storeEmail?, storeAddress?, contactPhones?, instapayNumber, whatsappMessageTemplate? }
 */
const updateSettings = asyncHandler(async (req, res) => {
  const {
    storeName,
    storePhone,
    storeEmail,
    storeAddress,
    contactPhones,
    instapayNumber,
    whatsappMessageTemplate,
  } = req.body

  if (!storeName || !storeName.trim()) throw new ApiError(400, 'اسم المتجر مطلوب')
  if (!storePhone || !storePhone.trim()) throw new ApiError(400, 'رقم تليفون المتجر مطلوب')
  if (!instapayNumber || !instapayNumber.trim()) throw new ApiError(400, 'رقم إنستاباي مطلوب')

  // نجيب الصف الحالي الأول عشان أي حقل غير مُرسَل يحافظ على قيمته القديمة بدل ما يتصفر
  const [currentRows] = await pool.query('SELECT * FROM settings WHERE id = 1 LIMIT 1')
  const current = currentRows[0] || {}

  // أرقام التواصل المتعددة (للفوتر وصفحة تواصل معنا) — لازم تكون قائمة نصوص غير فارغة لو اتبعتت
  let contactPhonesJson = current.contact_phones ?? null
  if (contactPhones !== undefined) {
    if (!Array.isArray(contactPhones)) {
      throw new ApiError(400, 'أرقام التواصل لازم تكون قائمة')
    }
    const normalizedPhones = contactPhones
      .map((phone) => String(phone).trim())
      .filter((phone) => phone.length > 0)
    if (normalizedPhones.length === 0) {
      throw new ApiError(400, 'لازم رقم تواصل واحد على الأقل')
    }
    contactPhonesJson = JSON.stringify(normalizedPhones)
  } else if (typeof contactPhonesJson !== 'string' && contactPhonesJson !== null) {
    // mysql2 بترجع عمود JSON كـ Array جاهز، فلو محتاجين نعيد كتابته لازم نحوّله نص أول
    contactPhonesJson = JSON.stringify(contactPhonesJson)
  }

  // قالب رسالة واتساب — نص طويل اختياري، بيحافظ على القيمة القديمة لو الحقل مش مرسل في الطلب
  const whatsappTemplateValue =
    whatsappMessageTemplate !== undefined
      ? whatsappMessageTemplate
        ? String(whatsappMessageTemplate).trim() || null
        : null
      : current.whatsapp_message_template

  await pool.query(
    `UPDATE settings SET
       store_name = ?,
       store_phone = ?,
       store_email = ?,
       store_address = ?,
       contact_phones = ?,
       instapay_number = ?,
       whatsapp_message_template = ?
     WHERE id = 1`,
    [
      storeName.trim(),
      storePhone.trim(),
      storeEmail !== undefined ? (storeEmail ? storeEmail.trim() : null) : current.store_email,
      storeAddress !== undefined
        ? storeAddress
          ? storeAddress.trim()
          : null
        : current.store_address,
      contactPhonesJson,
      instapayNumber.trim(),
      whatsappTemplateValue,
    ],
  )

  const settings = await fetchSettings()
  res.json({ success: true, data: settings })
})

module.exports = { getSettings, updateSettings }
