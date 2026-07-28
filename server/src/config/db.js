// إعداد الاتصال بقاعدة البيانات — Pool بدل اتصال واحد عشان يتحمّل أكتر من طلب
// في نفس الوقت من غير ما يبطئ (كل Request بياخد اتصال من الـ Pool ويرجّعه بعد ما يخلص)
const mysql = require('mysql2/promise')
require('dotenv').config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // بيرجّع DECIMAL كـ Number بدل String — أسهل في التعامل معاه في الـ API
  decimalNumbers: true,
  // ضروري عشان النصوص العربية ترجع سليمة (بدون الترميز ده بترجع Mojibake)
  charset: 'utf8mb4',
})

/** اختبار سريع للاتصال — يُستدعى عند تشغيل السيرفر عشان نتأكد إن القاعدة متاحة */
async function testConnection() {
  const connection = await pool.getConnection()
  await connection.ping()
  connection.release()
}

module.exports = { pool, testConnection }
