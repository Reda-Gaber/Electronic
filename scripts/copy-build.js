// بيمسح مجلد server/public القديم (لو موجود) وبينسخ ناتج بناء الفرونت
// (client/dist) مكانه. Node.js عادي بدون أي مكتبات خارجية، عشان يشتغل
// على أي نظام تشغيل (Windows/Mac/Linux) من غير مشاكل توافق
const fs = require('fs')
const path = require('path')

const source = path.join(__dirname, '..', 'client', 'dist')
const destination = path.join(__dirname, '..', 'server', 'public')

if (!fs.existsSync(source)) {
  console.error('❌ مجلد client/dist مش موجود — شغّل "npm run build --prefix client" الأول')
  process.exit(1)
}

fs.rmSync(destination, { recursive: true, force: true })
fs.cpSync(source, destination, { recursive: true })

console.log('✅ تم نسخ ناتج بناء الفرونت إلى server/public')
