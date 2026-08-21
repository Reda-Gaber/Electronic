// توليد sitemap.xml بعد الـ build — سكريبت مستقل تمامًا عن كود التطبيق
//
// الفكرة: بيعمل fetch على الـ API العام الموجود بالفعل (GET /products
// وGET /categories، نفس الـ endpoints اللي الموقع نفسه بيستخدمها)، وبيطلع
// ملف sitemap.xml جاهز في مجلد dist. مبيلمسش الداتابيز ولا أي كنترولر —
// بيقرأ بس من الـ API زي أي عميل تاني.
//
// طريقة التشغيل:
//   node scripts/generate-sitemap.js
// أو أضفه في package.json بعد أمر البناء:
//   "build": "tsc -b && vite build && node scripts/generate-sitemap.js"
//
// لازم السيرفر (الباك اند) يكون شغّال وقت تنفيذ السكريبت ده عشان يقدر يجيب
// قائمة المنتجات والتصنيفات.

import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// دومين الموقع الفعلي بعد الرفع — عدّله هنا مرة واحدة بس
const SITE_URL = process.env.SITE_URL || 'https://abdelnaby.shop'
// رابط الـ API اللي هيتقرا منه المنتجات والتصنيفات وقت البناء
const API_URL = process.env.SITEMAP_API_URL || 'http://localhost:5000/api'
// مكان ملف الإخراج (مجلد الـ build الناتج من vite)
const OUTPUT_PATH = resolve(__dirname, '../dist/sitemap.xml')

/** روابط ثابتة معروفة مسبقًا (صفحات المحتوى العامة) */
const STATIC_PATHS = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/products', priority: '0.9', changefreq: 'daily' },
  { path: '/categories', priority: '0.8', changefreq: 'weekly' },
  { path: '/offers', priority: '0.8', changefreq: 'daily' },
  { path: '/new-arrivals', priority: '0.7', changefreq: 'daily' },
  { path: '/about', priority: '0.4', changefreq: 'monthly' },
  { path: '/faq', priority: '0.4', changefreq: 'monthly' },
  { path: '/contact', priority: '0.4', changefreq: 'monthly' },
]

async function fetchJson(path) {
  const res = await fetch(`${API_URL}${path}`)
  if (!res.ok) throw new Error(`فشل جلب ${path}: ${res.status}`)
  const json = await res.json()
  return json.data
}

function urlEntry({ path, priority, changefreq }) {
  return `  <url>
    <loc>${SITE_URL}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

async function main() {
  console.log('⏳ جاري جلب المنتجات والتصنيفات من', API_URL)

  const [products, categories] = await Promise.all([
    fetchJson('/products'),
    fetchJson('/categories'),
  ])

  const productEntries = products.map((p) =>
    urlEntry({ path: `/product/${p.slug}`, priority: '0.7', changefreq: 'weekly' }),
  )
  const categoryEntries = categories.map((c) =>
    urlEntry({ path: `/category/${c.slug}`, priority: '0.6', changefreq: 'weekly' }),
  )
  const staticEntries = STATIC_PATHS.map(urlEntry)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...categoryEntries, ...productEntries].join('\n')}
</urlset>
`

  writeFileSync(OUTPUT_PATH, xml, 'utf-8')
  console.log(
    `✅ تم إنشاء sitemap.xml بنجاح (${products.length} منتج + ${categories.length} تصنيف) في: ${OUTPUT_PATH}`,
  )
}

main().catch((err) => {
  console.error('❌ فشل توليد sitemap.xml:', err.message)
  // ميكسرش الـ build كله لو فشل الاتصال بالـ API وقت البناء — بس يبلّغ ويطلع بكود خطأ
  process.exit(1)
})