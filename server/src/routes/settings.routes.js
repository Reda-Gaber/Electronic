// مسارات الإعدادات العامة — يستخدمها الفوتر وصفحة الـ Checkout
const express = require('express')
const { getSettings } = require('../controllers/settings.controller')

const router = express.Router()

router.get('/', getSettings)

module.exports = router
