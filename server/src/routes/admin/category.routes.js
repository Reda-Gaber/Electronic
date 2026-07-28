// مسارات إدارة التصنيفات — محمية بالكامل، لوحة تحكم الأدمن بس
const express = require('express')
const {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../../controllers/category.controller')
const { protect } = require('../../middleware/auth.middleware')

const router = express.Router()

router.use(protect)

// نفس منطق القائمة العامة (بما فيها productCount) — الأدمن محتاج نفس البيانات
router.get('/', listCategories)
router.post('/', createCategory)
router.put('/:id', updateCategory)
router.delete('/:id', deleteCategory)

module.exports = router
