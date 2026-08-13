// نقطة تشغيل السيرفر — بيتأكد إن قاعدة البيانات متاحة الأول، وبعدين يبدأ يستقبل طلبات
// المسار هنا محدد صراحةً (../.env) عشان يشتغل صح مهما كان الـ cwd اللي الاستضافة بتشغّل منه السيرفر
// (لو سيبناها فاضية زي الأول، dotenv بيدور على .env في process.cwd() بس، ولو ده مش مجلد server هيفشل يلاقيه)
require('dotenv').config({ path: require('path').join(__dirname, '../.env') })
const app = require('./app')
const { testConnection } = require('./config/db')

const PORT = process.env.PORT || 5000

async function start() {
  try {
    await testConnection()
    console.log('✅ الاتصال بقاعدة البيانات نجح')
  } catch (err) {
    console.error('❌ فشل الاتصال بقاعدة البيانات — تأكد من بيانات .env')
    console.error(err.message)
    process.exit(1)
  }

  app.listen(PORT, () => {
    console.log(`🚀 السيرفر شغال على http://localhost:${PORT}`)
  })
}

start()
