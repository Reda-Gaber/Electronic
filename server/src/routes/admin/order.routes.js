// مسارات إدارة الطلبات — محمية بالكامل، لوحة تحكم الأدمن بس
const express = require('express')
const {
  adminListOrders,
  adminGetOrderById,
  adminUpdateOrder,
} = require('../../controllers/order.controller')
const { protect } = require('../../middleware/auth.middleware')

const router = express.Router()

router.use(protect)

router.get('/', adminListOrders)
router.get('/:id', adminGetOrderById)
router.put('/:id', adminUpdateOrder)

module.exports = router
