const ApiError = require('../utils/ApiError')

/** لأي مسار غير موجود أصلاً (404) */
function notFoundHandler(req, res, next) {
  next(new ApiError(404, `المسار غير موجود: ${req.originalUrl}`))
}

/** المعالج المركزي لكل الأخطاء — آخر middleware في السلسلة (له 4 معاملات فده اللي بيخلي Express يتعرف عليه كـ error handler) */
function errorHandler(err, req, res, next) {
  // أخطاء Multer (حجم/عدد الملفات) — رسالة واضحة 400 بدل 500 عام
  if (err.name === 'MulterError') {
    const messages = {
      LIMIT_FILE_SIZE: 'حجم الصورة أكبر من الحد المسموح (10 ميجا)',
      LIMIT_FILE_COUNT: 'عدد الصور في الطلب الواحد أكبر من الحد المسموح',
      LIMIT_UNEXPECTED_FILE: 'حقل الصورة غير متوقع',
    }
    return res.status(400).json({
      success: false,
      message: messages[err.code] || 'حصل خطأ أثناء رفع الصورة',
    })
  }

  const statusCode = err instanceof ApiError ? err.statusCode : 500
  const message = statusCode === 500 ? 'حصل خطأ غير متوقع في السيرفر' : err.message

  if (statusCode === 500) {
    // نطبع الخطأ الحقيقي في الـ logs عشان نقدر نصلحه، بدون ما نكشفه للعميل
    console.error(err)
  }

  res.status(statusCode).json({
    success: false,
    message,
  })
}

module.exports = { notFoundHandler, errorHandler }