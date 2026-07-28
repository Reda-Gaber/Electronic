// مسارات المنتجات العامة — لواجهة المتجر (بدون حماية، منتجات منشورة بس)
const express = require('express')
const { listProducts, getProductBySlug } = require('../controllers/product.controller')

const router = express.Router()

router.get('/', listProducts)
router.get('/:slug', getProductBySlug)

module.exports = router
