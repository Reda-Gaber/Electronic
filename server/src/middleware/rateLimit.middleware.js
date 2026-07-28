// حماية بسيطة من محاولات تخمين الباسورد (Brute Force) — بيحدّد عدد محاولات
// تسجيل الدخول المسموحة من نفس الـ IP خلال فترة زمنية معيّنة
const rateLimit = require('express-rate-limit')

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 10, // 10 محاولات كحد أقصى خلال الـ 15 دقيقة
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'محاولات تسجيل دخول كتير جدًا، حاول تاني بعد شوية',
  },
})

module.exports = { loginLimiter }
