// توليد slug من اسم عربي أو إنجليزي — نفس منطق توليد الـ slug في الفرونت
// (client/src/utils/productStorage.ts) عشان الاثنين يطلعوا بنفس الشكل بالظبط

/** تطبيع النص لـ slug: مسافات لشرطات، إزالة أي رمز غير مسموح، عربي/إنجليزي مسموحين */
function normalizeToSlug(text) {
  return (
    text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u0600-\u06FF-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || `item-${Date.now()}`
  )
}

/**
 * توليد slug فريد — بيجرّب الاسم الأساسي الأول، ولو موجود بالفعل بيضيف رقم
 * تسلسلي (-2, -3, ...) لحد ما يلاقي واحد مش مستخدم
 * @param {string} name الاسم اللي هيتحول لـ slug
 * @param {(slug: string) => Promise<boolean>} existsFn دالة بترجع true لو الـ slug ده مستخدم بالفعل
 */
async function generateUniqueSlug(name, existsFn) {
  const base = normalizeToSlug(name)
  let slug = base
  let counter = 2

  while (await existsFn(slug)) {
    slug = `${base}-${counter}`
    counter += 1
  }

  return slug
}

module.exports = { normalizeToSlug, generateUniqueSlug }
