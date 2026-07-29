// مسارات رفع/حذف صور المنتجات — محمية بالكامل، أدمن بس
const express = require('express')
const { uploadProductImages, deleteProductImage } = require('../../controllers/upload.controller')
const { uploadProductImages: multerMiddleware } = require('../../middleware/upload.middleware')
const { protect } = require('../../middleware/auth.middleware')

const router = express.Router()

router.use(protect)

router.post('/product-images', multerMiddleware, uploadProductImages)
router.delete('/product-images', deleteProductImage)

module.exports = router