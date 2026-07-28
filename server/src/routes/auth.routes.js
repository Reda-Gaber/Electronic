const express = require('express')
const { login, getMe, changePassword } = require('../controllers/auth.controller')
const { protect } = require('../middleware/auth.middleware')
const { loginLimiter } = require('../middleware/rateLimit.middleware')

const router = express.Router()

// عام — مفتوح للجميع (ده أصلاً نموذج تسجيل الدخول نفسه)، محمي بـ rate limiter من محاولات التخمين
router.post('/login', loginLimiter, login)

// محمي — لازم توكن صحيح
router.get('/me', protect, getMe)
router.patch('/change-password', protect, changePassword)

module.exports = router
