const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const { processProductImage, deleteProductImageFiles } = require('../utils/imageProcessor')

/**
 * POST /api/admin/uploads/product-images
 * محمي — بيستقبل صورة أو أكتر (multipart/form-data، حقل "images")، يعالجهم
 * بـ Sharp (WebP + تصغير + Thumbnail)، ويرجّع مسارات الصور الجاهزة للحفظ
 * (الفرونت بعد كده بيحط المسارات دي في مصفوفة images وقت إنشاء/تعديل المنتج)
 */
const uploadProductImages = asyncHandler(async (req, res) => {
  const files = req.files
  if (!files || files.length === 0) {
    throw new ApiError(400, 'لازم ترفع صورة واحدة على الأقل')
  }

  const results = await Promise.all(files.map((file) => processProductImage(file.buffer)))

  res.status(201).json({ success: true, data: results })
})

/**
 * DELETE /api/admin/uploads/product-images
 * محمي — بيمسح صورة (والـ Thumbnail بتاعها) من على السيرفر فعليًا
 * body: { url: string } — نفس المسار اللي رجع من الرفع
 */
const deleteProductImage = asyncHandler(async (req, res) => {
  const { url } = req.body
  if (!url || typeof url !== 'string') {
    throw new ApiError(400, 'رابط الصورة مطلوب')
  }

  await deleteProductImageFiles(url)
  res.json({ success: true, message: 'تم حذف الصورة' })
})

module.exports = { uploadProductImages, deleteProductImage }