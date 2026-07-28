// ApiError — خطأ مخصص فيه statusCode واضح، عشان نفرّق بين أخطاء متوقعة
// (زي "بيانات دخول غلط" 401) وأخطاء غير متوقعة (خطأ برمجي في الكود نفسه 500)
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
  }
}

module.exports = ApiError
