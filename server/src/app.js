// إعداد تطبيق Express — الـ middlewares العامة وربط كل الـ routes
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const fs = require('fs')

const authRoutes = require('./routes/auth.routes')
const categoryRoutes = require('./routes/category.routes')
const productRoutes = require('./routes/product.routes')
const orderRoutes = require('./routes/order.routes')
const settingsRoutes = require('./routes/settings.routes')
const adminCategoryRoutes = require('./routes/admin/category.routes')
const adminProductRoutes = require('./routes/admin/product.routes')
const adminOrderRoutes = require('./routes/admin/order.routes')
const adminSettingsRoutes = require('./routes/admin/settings.routes')
const adminDashboardRoutes = require('./routes/admin/dashboard.routes')
const adminUploadRoutes = require('./routes/admin/upload.routes')
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware')

const app = express()

// السماح بالاتصال من الفرونت وقت التطوير المحلي (لما يبقوا شغالين على بورتين
// منفصلين). في الإنتاج بعد الدمج، الفرونت والباك اند بيبقوا على نفس الدومين
// فمش محتاجين CORS خالص، بس بنسيبه شغال براحة عشان ميعملش مشاكل لو حد شغّلهم منفصلين
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5000',
  }),
)

app.use(express.json())

// طباعة كل Request في الـ Console وقت التطوير — يساعد في تتبع المشاكل
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

// فحص سريع إن السيرفر شغال
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'السيرفر شغال 👍' })
})

// ملفات صور المنتجات المرفوعة (uploads/products/...) — مجلد منفصل تمامًا عن
// public/ (اللي هو ناتج بناء الفرونت وبيتمسح ويتجدد كل build)، عشان الصور
// المرفوعة تفضل موجودة دايمًا مهما اتعمل build جديد للفرونت
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/admin/categories', adminCategoryRoutes)
app.use('/api/admin/products', adminProductRoutes)
app.use('/api/admin/orders', adminOrderRoutes)
app.use('/api/admin/settings', adminSettingsRoutes)
app.use('/api/admin/dashboard', adminDashboardRoutes)
app.use('/api/admin/uploads', adminUploadRoutes)

// أي مسار غير معروف يبدأ بـ /api يرجع 404 JSON (مش صفحة HTML)
app.use('/api', notFoundHandler)

// ============================================================================
// تقديم الفرونت المبني (public/ = ناتج "npm run build" بتاع مجلد client)
// ============================================================================
const clientBuildPath = path.join(__dirname, '..', 'public')

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath))

  // أي رابط مش /api (مثلاً /checkout أو /admin/dashboard) — نرجّع index.html
  // ونسيب React Router هو اللي يحدد الصفحة المطلوبة على المتصفح (SPA fallback)
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'))
  })
}

// المعالج المركزي للأخطاء — لازم يكون آخر حاجة في السلسلة
app.use(errorHandler)

module.exports = app