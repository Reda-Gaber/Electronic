// معالجة صور المنتجات بـ Sharp — بتحوّل أي صورة مرفوعة لـ WebP مضغوط، بتصغّرها
// لو أكبر من 1600px مع الحفاظ على أبعادها، وبتعمل نسخة Thumbnail بعرض 400px
const fs = require('fs/promises')
const path = require('path')
const crypto = require('crypto')
const sharp = require('sharp')

const MAX_WIDTH = 1600
const THUMBNAIL_WIDTH = 400
const WEBP_QUALITY = 85
const THUMBNAIL_QUALITY = 80

const UPLOADS_ROOT = path.join(__dirname, '..', '..', 'uploads')
const PRODUCTS_DIR = path.join(UPLOADS_ROOT, 'products')
const THUMBS_DIR = path.join(PRODUCTS_DIR, 'thumbs')

/** التأكد من وجود مجلدات الرفع قبل أي كتابة عليها */
async function ensureUploadDirs() {
  await fs.mkdir(PRODUCTS_DIR, { recursive: true })
  await fs.mkdir(THUMBS_DIR, { recursive: true })
}

/**
 * معالجة صورة واحدة (Buffer من Multer): تحويل لـ WebP + تصغير لو لازم + Thumbnail
 * بترجع المسارات النسبية (اللي بتتخزن في القاعدة وتتقرأ من الفرونت عبر /uploads/...)
 */
async function processProductImage(buffer) {
  await ensureUploadDirs()

  const id = crypto.randomUUID()
  const filename = `${id}.webp`
  const thumbFilename = `${id}-thumb.webp`

  // الصورة الرئيسية: تصغير لحد 1600px عرض بس لو أكبر من كده (مفيش تكبير للصور الصغيرة)
  await sharp(buffer)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(path.join(PRODUCTS_DIR, filename))

  // نسخة Thumbnail بعرض 400px
  await sharp(buffer)
    .resize({ width: THUMBNAIL_WIDTH, withoutEnlargement: true })
    .webp({ quality: THUMBNAIL_QUALITY })
    .toFile(path.join(THUMBS_DIR, thumbFilename))

  return {
    url: `/uploads/products/${filename}`,
    thumbnailUrl: `/uploads/products/thumbs/${thumbFilename}`,
  }
}

/** حذف صورة (ونسختها المصغّرة) من على الهارد — بيتجاهل بهدوء لو الملف مش موجود أصلاً */
async function deleteProductImageFiles(imageUrl) {
  const filename = path.basename(imageUrl)
  const thumbFilename = filename.replace(/\.webp$/, '-thumb.webp')

  const targets = [
    path.join(PRODUCTS_DIR, filename),
    path.join(THUMBS_DIR, filename),
    path.join(THUMBS_DIR, thumbFilename),
  ]

  await Promise.all(
    targets.map((filePath) =>
      fs.unlink(filePath).catch(() => {
        /* الملف مش موجود أصلاً — تجاهل، مش خطأ يوقف العملية */
      }),
    ),
  )
}

module.exports = { processProductImage, deleteProductImageFiles }