// إعداد Multer لاستقبال صور المنتجات كـ multipart/form-data بدل Base64
// بنستخدم Memory Storage (مش Disk) عشان الملف يفضل في الذاكرة كـ Buffer
// ونمرره مباشرة لـ Sharp للمعالجة، من غير ما نكتب نسخة خام على الهارد الأول
const multer = require('multer')
const ApiError = require('../utils/ApiError')

const MAX_FILE_SIZE_MB = 10
const MAX_FILES_PER_REQUEST = 20

const storage = multer.memoryStorage()

function fileFilter(req, file, cb) {
  if (!file.mimetype.startsWith('image/')) {
    cb(new ApiError(400, `الملف "${file.originalname}" مش صورة`))
    return
  }
  cb(null, true)
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    files: MAX_FILES_PER_REQUEST,
  },
})

/** middleware لرفع عدة صور دفعة واحدة تحت اسم الحقل "images" */
const uploadProductImages = upload.array('images', MAX_FILES_PER_REQUEST)

module.exports = { uploadProductImages }