// مسارات إدارة المنتجات — محمية بالكامل، لوحة تحكم الأدمن بس (بتشمل المسودات)
const express = require('express')
const {
  adminListProducts,
  adminGetProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../../controllers/product.controller')
const { protect } = require('../../middleware/auth.middleware')

const router = express.Router()

router.use(protect)

router.get('/', adminListProducts)
router.get('/:id', adminGetProductById)
router.post('/', createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

module.exports = router
