// مكوّن SEO عام — يستخدم في أي صفحة عشان يغيّر عنوان التاب ووصف الصفحة
// وبيانات المشاركة (Open Graph) ديناميكيًا وقت الرندر.
//
// ملحوظة مهمة: من React 19، أي <title> أو <meta> أو <link> أو <script>
// بيترندر في أي مكان في الشجرة، بيتم رفعه (hoist) تلقائيًا لـ <head> —
// بدون أي مكتبة خارجية زي react-helmet. عشان كده الكومبوننت ده بسيط
// وبيرجّع العناصر دي مباشرة.
const SITE_NAME = 'عبدالنبي للإلكترونيات'
const SITE_URL = 'https://abdelnaby.shop'
const DEFAULT_DESCRIPTION =
  'عبدالنبي للإلكترونيات — متجر إلكترونيات وقطع غيار وصوتيات بأفضل الأسعار وتوصيل سريع في مصر'
const DEFAULT_IMAGE = `${SITE_URL}/icon-192.png`

export interface SeoProductData {
  name: string
  description: string
  price: number
  image: string
  inStock: boolean
  brand?: string
}

export interface SeoProps {
  /** عنوان الصفحة — بيتضاف تلقائيًا اسم الموقع بعده */
  title: string
  /** وصف الصفحة لمحركات البحث (150-160 حرف تقريبًا الأفضل) */
  description?: string
  /** المسار النسبي للصفحة الحالية، مثال: /product/iphone-15 — يُستخدم للـ canonical وOpen Graph */
  path?: string
  /** رابط صورة مخصص للمشاركة (Open Graph) — لو مفيش بيتاخد اللوجو الافتراضي */
  image?: string
  /** لو الصفحة صفحة منتج، مرر بياناته هنا عشان يتضاف JSON-LD تلقائيًا */
  product?: SeoProductData
  /** امنع محركات البحث من فهرسة الصفحة دي (مفيد لصفحات زي السلة أو تأكيد الطلب) */
  noIndex?: boolean
}

export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
  image = DEFAULT_IMAGE,
  product,
  noIndex = false,
}: SeoProps) {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`
  const canonicalUrl = `${SITE_URL}${path}`

  // Structured Data لصفحة منتج — Schema.org/Product
  // يساعد جوجل يعرض السعر وحالة التوفر (Rich Results) تحت نتيجة البحث
  const productJsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.image,
        brand: product.brand
          ? { '@type': 'Brand', name: product.brand }
          : undefined,
        offers: {
          '@type': 'Offer',
          url: canonicalUrl,
          priceCurrency: 'EGP',
          price: product.price,
          availability: product.inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        },
      }
    : null

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph — شكل الرابط لما يتشارك على واتساب/فيسبوك */}
      <meta property="og:type" content={product ? 'product' : 'website'} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content="ar_EG" />

      {/* Twitter Card — نفس الفكرة لو اتشارك على تويتر/إكس */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {productJsonLd && (
        <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
      )}
    </>
  )
}