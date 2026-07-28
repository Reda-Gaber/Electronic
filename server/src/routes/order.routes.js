// مسارات الطلبات العامة — Checkout وتتبع الطلب (بدون أي تسجيل دخول، Guest بالكامل)
const express = require('express')
const { createOrder, getOrderByPublicId, trackOrder } = require('../controllers/order.controller')

const router = express.Router()

router.post('/', createOrder)
router.get('/track', trackOrder)
router.get('/confirmation/:publicId', getOrderByPublicId)

module.exports = router
