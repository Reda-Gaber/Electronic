# هيكلة مشروع PC-TECH ARABIA

> متجر إلكتروني لمكونات الحاسوب — واجهة أمامية React + Vite + Tailwind CSS  
> **الحالة الحالية:** 🎉 **المرحلة 9 — كل الصفحات الـ14 مكتملة!** | المتبقي: مصادقة تسجيل دخول فعلية بسيطة + ربط الباك إند الحقيقي

---

## هيكلة المجلدات

```
Electronic/
├── public/                    # ملفات ثابتة (الشعار...)
├── src/
│   ├── admin/                 # لوحة تحكم الأدمن — منفصلة عن المتجر
│   │   ├── components/        # AdminLayout, AdminSidebar
│   │   └── pages/             # صفحات الأدمن (14 صفحة)
│   ├── components/            # مكونات مشتركة للمتجر
│   │   └── layouts/           # StoreLayout
│   ├── context/               # CartContext — إدارة السلة
│   ├── data/                  # بيانات وهمية (mockData)
│   ├── pages/                 # صفحات المتجر (6 صفحات)
│   ├── types/                 # أنواع TypeScript
│   ├── utils/                 # دوال مساعدة
│   ├── App.tsx                # تعريف المسارات (Routes)
│   ├── main.tsx               # نقطة الدخول
│   └── index.css              # Tailwind + نظام الألوان Silicon Sapphire
├── design-reference/          # ملفات التصميم المستخرجة من ZIP
├── index.html
├── package.json
├── vite.config.ts
└── STRUCTURE.md               # هذا الملف
```

### وظيفة كل مجلد

| المجلد | الوظيفة |
|--------|---------|
| `src/components/` | مكونات UI مشتركة: Header, Footer, CartDrawer, PagePlaceholder |
| `src/components/layouts/` | هياكل الصفحات: StoreLayout للمتجر |
| `src/pages/` | صفحات واجهة العميل — كل صفحة في ملف منفصل |
| `src/admin/` | كل ما يخص لوحة الأدمن — معزول عن المتجر |
| `src/context/` | React Context لحالة السلة (localStorage) |
| `src/data/` | بيانات وهمية مؤقتة — ستُستبدل بـ API |
| `src/utils/` | دوال مساعدة: تنسيق الأسعار، نسخ النص، إلخ |
| `src/types/` | تعريفات TypeScript: Product, Order, CartItem... |

---

## قائمة الصفحات ومواقع الملفات

### واجهة المتجر

| # | الصفحة | المسار | الملف | الحالة |
|---|--------|--------|-------|--------|
| 1 | الرئيسية | `/` | `src/pages/HomePage.tsx` | ✅ مكتملة |
| 2 | تصنيف المنتجات | `/category/:slug` | `src/pages/CategoryPage.tsx` | ✅ مكتملة |
| 3 | تفاصيل المنتج | `/product/:slug` | `src/pages/ProductDetailPage.tsx` | ✅ مكتملة |
| 4 | درج السلة | — (مكون) | `src/components/CartDrawer.tsx` | ✅ مكتمل (كمية + حذف) |
| 5 | إتمام الشراء | `/checkout` | `src/pages/CheckoutPage.tsx` | ✅ مكتملة |
| 6 | تأكيد الطلب | `/order-confirmation/:orderId` | `src/pages/OrderConfirmationPage.tsx` | ✅ مكتملة |

### لوحة الأدمن

| # | الصفحة | المسار | الملف | الحالة |
|---|--------|--------|-------|--------|
| 7 | تسجيل الدخول | `/admin/login` | `src/admin/pages/AdminLoginPage.tsx` | واجهة أساسية |
| 8 | لوحة التحكم | `/admin/dashboard` | `src/admin/pages/AdminDashboardPage.tsx` | ✅ مكتملة |
| 9 | إدارة الطلبات | `/admin/orders` | `src/admin/pages/AdminOrdersPage.tsx` | ✅ مكتملة |
| 10 | تفاصيل طلب | `/admin/orders/:id` | `src/admin/pages/AdminOrderDetailPage.tsx` | ✅ مكتملة |
| 11 | إدارة المنتجات | `/admin/products` | `src/admin/pages/AdminProductsPage.tsx` | ✅ مكتملة |
| 12 | إضافة/تعديل منتج | `/admin/products/new` أو `/:id/edit` | `src/admin/pages/AdminProductFormPage.tsx` | ✅ مكتملة |
| 13 | إدارة التصنيفات | `/admin/categories` | `src/admin/pages/AdminCategoriesPage.tsx` | ✅ مكتملة |
| 14 | الإعدادات | `/admin/settings` | `src/admin/pages/AdminSettingsPage.tsx` | ✅ مكتملة |

---

## المكونات الرئيسية

### CartContext (`src/context/CartContext.tsx`)
- **الوظيفة:** إدارة سلة التسوق على مستوى التطبيق
- **التخزين:** `localStorage` بمفتاح `pc-tech-cart`
- **الدوال:** `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `openCart`, `closeCart`
- **الاستخدام:** Header (عداد السلة), CartDrawer, ProductDetail, Checkout

### StoreLayout (`src/components/layouts/StoreLayout.tsx`)
- **الوظيفة:** Header ثابت + `<Outlet />` + Footer + CartDrawer
- **الاستخدام:** wrapper لكل مسارات المتجر

### AdminLayout (`src/admin/components/AdminLayout.tsx`)
- **الوظيفة:** سايد بار على اليمين + منطقة محتوى — هيكل مختلف عن المتجر
- **الاستخدام:** wrapper لمسارات `/admin/*` (ما عدا login)

### Header / Footer / CartDrawer
- **Header:** شعار، روابط تنقل، أيقونة سلة مع عداد
- **Footer:** معلومات المتجر، روابط سريعة، تواصل
- **CartDrawer:** درج جانبي — أساسي (عرض + رابط checkout)

### productHelpers (`src/utils/productHelpers.ts`)
- **الوظيفة:** جلب منتج واحد بالـ slug (`getProductBySlug`)، وجلب منتجات ذات صلة من نفس التصنيف (`getRelatedProducts`)
- **الاستخدام:** `ProductDetailPage`

### orderStorage (`src/utils/orderStorage.ts`)
- **الوظيفة:** حفظ واسترجاع الطلبات محلياً في `localStorage` (مفتاح `pc-tech-orders`) — بديل مؤقت لقاعدة البيانات
- **الدوال:** `saveOrder`, `getOrderById`, `getAllOrders`, `updateOrder`
- **ملاحظة مهمة:** `getAllOrders` تعرض طلبات تجريبية (`mockOrders` في `mockData.ts`) تلقائياً إذا لم توجد طلبات حقيقية بعد، حتى لا تظهر لوحة التحكم فارغة قبل استقبال أول طلب فعلي. بمجرد حفظ أول طلب حقيقي، تختفي الطلبات التجريبية تلقائياً. كما أن `updateOrder` ترجع `false` عند محاولة تعديل طلب تجريبي (لأنه غير موجود فعلياً في `localStorage`)، وتعرض صفحة تفاصيل الطلب رسالة توضح ذلك للأدمن
- **الاستخدام:** `CheckoutPage` (حفظ)، `OrderConfirmationPage`, `AdminDashboardPage`, `AdminOrdersPage` (قراءة)، `AdminOrderDetailPage` (تحديث)
- **TODO:** استبدال بطلبات API حقيقية (`POST /orders`, `GET /orders/:id`, `PATCH /orders/:id`) عند ربط الباك إند، وإزالة الرجوع لـ `mockOrders`

### AdminProductsPage (`src/admin/pages/AdminProductsPage.tsx`)
- **الوظيفة:** جدول كل المنتجات مع بحث (اسم/ماركة) وفلترة حسب التصنيف، وأزرار تعديل/حذف لكل منتج، ونافذة تأكيد قبل الحذف
- **مصدر البيانات:** `mockProducts` — منسوخة لحالة محلية (`useState`) حتى يظهر تأثير الحذف فوراً في الواجهة
- **TODO:** استبدال بطلبات API حقيقية (`GET /products`, `DELETE /products/:id`) عند ربط الباك إند — الحذف حالياً يؤثر على الواجهة فقط ولا يُحفظ بشكل دائم

### AdminProductFormPage (`src/admin/pages/AdminProductFormPage.tsx`)
- **الوظيفة:** فورم إضافة/تعديل منتج واحد — بيانات أساسية، مواصفات ديناميكية (إضافة/حذف صفوف)، صور (إضافة برابط + حذف + إعادة ترتيب)، سعر ومخزون، وزرّي "نشر" و"حفظ كمسودة"
- **يفرّق بين الوضعين** عبر وجود `id` في الرابط (`/admin/products/new` مقابل `/admin/products/:id/edit`) ويعبّئ البيانات تلقائياً في وضع التعديل من `mockProducts`
- **TODO:** استبدال منطق الحفظ المحلي بطلبات حقيقية (`POST`/`PUT /products`)، واستبدال إدخال روابط الصور برفع ملفات فعلي

### AdminCategoriesPage (`src/admin/pages/AdminCategoriesPage.tsx`)
- **الوظيفة:** شبكة بطاقات تصنيفات (أيقونة + اسم + عدد منتجات محسوب فعلياً من `mockProducts`)، مع نافذة منبثقة موحّدة للإضافة والتعديل، ونافذة تأكيد قبل الحذف
- **نظام التحكم الكامل بالرئيسية:** كل تصنيف له:
  - **أيقونة** — إما مختارة من مكتبة `iconLibrary.ts` (~50 أيقونة Material جاهزة معروضة كشبكة قابلة للتمرير)، أو **مرفوعة من الجهاز** (تُحوَّل لـ Data URL وتُحفظ في `icon` مع `isCustomIcon: true`)
  - **صورة** — رابط مباشر أو رفع من الجهاز (نفس آلية الأيقونة)، تُستخدم كخلفية البوكس الكبير
  - **وصف** — نص فرعي يظهر داخل البوكس الكبير
  - **مفتاح "اعرض كبوكس كبير في الرئيسية"** (`featuredOnHomepage`) — يتحكم في ظهور التصنيف ضمن `FeaturedCategoryBoxes` بالصفحة الرئيسية
- **الحفظ:** عبر `categoryStorage.ts` (`localStorage`) — أي تعديل هنا ينعكس فوراً على `CategorySwiper` و`FeaturedCategoryBoxes` بالمتجر بعد إعادة تحميل الصفحة
- **TODO:** استبدال بطلبات API حقيقية (`POST`/`PUT`/`DELETE /categories`) عند ربط الباك إند، ورفع الصور لخادم فعلي بدل Data URL محلي (الصور الكبيرة قد تُبطئ `localStorage`)

### AdminSettingsPage (`src/admin/pages/AdminSettingsPage.tsx`)
- **الوظيفة:** 3 أقسام مستقلة: بيانات المتجر (الاسم، الهاتف)، طرق الدفع (رقم إنستاباي)، مناطق الشحن (إضافة/تعديل/حذف منطقة مع رسوم ومدة توصيل)
- **مصدر البيانات:** `mockStoreSettings`
- **TODO:** ربط بطلب `PUT /settings` حقيقي عند توفر الباك إند، وتفعيل رفع شعار حقيقي

### AdminOrdersPage (`src/admin/pages/AdminOrdersPage.tsx`)
- **الوظيفة:** جدول كل الطلبات مع بحث نصي (اسم/رقم طلب/هاتف)، فلترة حسب الحالة (مع عداد عدد الطلبات لكل حالة)، وفلتر مدى زمني (من/إلى)، وعمود عنوان مختصر بجانب اسم العميل
- **الطباعة:** زر "طباعة الطلبات المؤكدة" يطبع فقط الطلبات بحالة "مؤكد" (بغض النظر عن الفلاتر الحالية) — كل طلب في التقرير يعرض اسم العميل، العنوان الكامل، الهاتف، المنتجات وأسعارها، وحالة الدفع (مدفوع مسبقاً عبر إنستاباي / غير مدفوع كاش). يعتمد على قسم مخفي (`print:hidden` / `print:block`) يظهر فقط عند الطباعة عبر `window.print()`
- **مصدر البيانات:** `getAllOrders()`

### getShortOrderCode (`src/utils/helpers.ts`)
- **الوظيفة:** توليد كود مختصر للطلب (مثال: `ORD-24`) بدل الرقم المرجعي الطويل (`ORD-MRPEOTUQ-L80A`)، مبني على ترتيب الطلب زمنياً بين كل الطلبات
- **الاستخدام:** `AdminOrdersPage`, `AdminOrderDetailPage`, `AdminDashboardPage` — الرقم المرجعي الكامل يبقى معروضاً كتفاصيل ثانوية لأغراض الدعم الفني
- **TODO:** عند ربط الباك إند، الأفضل أن يولّد السيرفر رقماً تسلسلياً حقيقياً بدل الاعتماد على الترتيب الزمني للطلبات المحلية

### AdminOrderDetailPage (`src/admin/pages/AdminOrderDetailPage.tsx`)
- **الوظيفة:** عرض كامل بيانات طلب واحد (العميل، العنوان، المنتجات، الدفع) + تغيير الحالة + ملاحظات داخلية للأدمن (`adminNotes`) + زر حفظ يستدعي `updateOrder`
- **مصدر البيانات:** `getOrderById(id)` من رابط الصفحة `/admin/orders/:id`

### AdminDashboardPage (`src/admin/pages/AdminDashboardPage.tsx`)
- **الوظيفة:** نظرة عامة على أداء المتجر — بطاقات إحصائيات (الطلبات، الإيرادات، تنبيهات المخزون)، رسم بياني بسيط للمبيعات آخر 7 أيام (مبني بـ CSS بدون مكتبة خارجية)، وجدول آخر 6 طلبات
- **مصدر البيانات:** `getAllOrders()` و `mockProducts` — كل الحسابات (الإيرادات، المخزون المنخفض) تُشتق منها مباشرة، وليست أرقاماً ثابتة

### روابط الهيدر (`mainNavLinks` في `mockData.ts`)
- **تحديث:** 5 روابط عامة في الهيدر: الرئيسية، العروض، المضاف حديثاً، من نحن، تواصل معنا — رابط "الأسئلة الشائعة" اتشال من الهيدر بناءً على طلب صريح، وأُضيف بدلاً من ذلك في قسم "روابط سريعة" بالفوتر (`Footer.tsx`)
- **صفحات جديدة مرتبطة:**
  - `OffersPage.tsx` (`/offers`) — كل المنتجات التي عليها خصم (`originalPrice > price`)
  - `NewArrivalsPage.tsx` (`/new-arrivals`) — كل المنتجات المعلَّمة `isNew`
  - `AboutPage.tsx` (`/about`) — هيرو مصغّر بنفس أسلوب `hero-gradient`، بطاقات إحصائيات (عدد العملاء، المنتجات...)، قسم "قصتنا" نص+صورة، وبطاقات "ليه تختارنا" بأيقونات دائرية
  - `FaqPage.tsx` (`/faq`) — أكورديون أسئلة شائعة ثابتة
  - `ContactPage.tsx` (`/contact`) — هيرو مصغّر، بطاقات طرق تواصل (تليفون/واتساب/مواعيد العمل)، وفورم رسالة بتخطيط عمودين (فورم + بطاقة جانبية) بنفس أسلوب صفحة الـ Checkout — لا يرسل فعلياً بعد
- **TODO:** ربط `ContactPage` بخدمة إرسال بريد/تذاكر دعم حقيقية عند توفر الباك إند

### SearchOverlay (`src/components/SearchOverlay.tsx`)
- **الوظيفة:** نافذة بحث منبثقة تظهر عند الضغط على أيقونة البحث بالهيدر، مع نتائج فورية (أول 6 نتائج) أثناء الكتابة، ورابط "عرض كل النتائج" يوجّه لصفحة `/search`
- **مصدر البيانات:** `searchProducts()` من `productHelpers.ts` — بحث محلي فوري بالاسم/الماركة/التصنيف، يعمل بالكامل بدون باك إند حالياً
- **الاستخدام:** `Header.tsx`

### SearchResultsPage (`src/pages/SearchResultsPage.tsx`)
- **الوظيفة:** صفحة نتائج بحث كاملة على الرابط `/search?q=...`، بها حقل بحث قابل للتعديل وشبكة نتائج بنفس `ProductCard` المستخدم بباقي الموقع
- **TODO:** استبدال `searchProducts()` بطلب بحث حقيقي للسيرفر عند ربط الباك إند (يدعم بحثاً أدق وفهرسة أفضل)

### Logo (`src/components/Logo.tsx`) — **غير مستخدَم حالياً**
- **الحالة:** الهيدر والفوتر رجعوا يستخدموا صورة `public/logo.jpg` الحقيقية مباشرة بدل هذا المكون (بناءً على طلب صريح)، تُرك الملف في المشروع كمرجع فقط ويمكن حذفه

### HeroBanner (`src/components/home/HeroBanner.tsx`)
- **الوظيفة:** بانر عريض بعرض الصفحة بالكامل بنفس نص وتصميم Stitch النهائي ("قوة الأداء بين يديك")
- **الصورة:** تُقرأ من `public/hero.jpg` (مسار محلي ثابت `/hero.jpg` في `mockHeroBanner.image`) — **يجب إضافة ملف `hero.jpg` فعلياً داخل مجلد `public/` وإلا ستظهر الصورة مكسورة**
- **الاستخدام:** `HomePage` — أعلى الصفحة

### CategorySwiper (`src/components/home/CategorySwiper.tsx`)
- **الوظيفة:** شبكة تصنيفات بتصميم Bento Grid (أول تصنيف أكبر حجماً)، بدل الشريط الأفقي القديم
- **مصدر البيانات:** `categoryStorage.getCategories()` — يعكس أي تعديل من `AdminCategoriesPage` (الاسم، الأيقونة المخصصة أو الجاهزة)
- **الاستخدام:** `HomePage` — قسم "تسوق حسب الفئة"

### FeaturedCategoryBoxes (`src/components/home/FeaturedCategoryBoxes.tsx`)
- **الوظيفة:** بطاقتان (أو أكثر) كبيرتان تعرضان أي تصنيف حدده الأدمن بمفتاح "اعرض كبوكس كبير في الرئيسية" — **حلّت محل `PromoCards.tsx` الثابت سابقاً**
- **مصدر البيانات:** `categoryStorage.getFeaturedCategories()` — تستخدم صورة ووصف التصنيف نفسه، ولا تُعرض القسم إطلاقاً لو محدش تصنيف متفعّل عليه الخيار
- **الاستخدام:** `HomePage`

### categoryStorage (`src/utils/categoryStorage.ts`)
- **الوظيفة:** حفظ واسترجاع التصنيفات من `localStorage` (مفتاح `pc-tech-categories`) — بديل مؤقت لقاعدة البيانات، يسمح بانعكاس تعديلات الأدمن (الأيقونة، الصورة، الظهور بالرئيسية) على المتجر مباشرة
- **الدوال:** `getCategories`, `saveCategories`, `getCategoryBySlug`, `getFeaturedCategories`
- **الاستخدام:** `CategorySwiper`, `FeaturedCategoryBoxes`, `AdminCategoriesPage`, `AdminProductsPage`, `AdminProductFormPage`, `categoryFilters.ts` (صفحة التصنيف بالمتجر)
- **TODO:** استبدال بطلبات API حقيقية (`GET`/`PUT /categories`) عند ربط الباك إند

### iconLibrary (`src/data/iconLibrary.ts`)
- **الوظيفة:** قائمة ~50 اسم أيقونة Material Symbols جاهزة (مكونات، إكسسوارات، شحن، عروض) يختار الأدمن منها عند إعداد أي تصنيف، بديلاً عن رفع أيقونة مخصصة

### PromoCards (`src/components/home/PromoCards.tsx`) — **غير مستخدَم حالياً**
- **الحالة:** استُبدل بـ `FeaturedCategoryBoxes.tsx` المرتبط بالتصنيفات، تُرك الملف في المشروع كمرجع فقط ويمكن حذفه

### PartnerLogos (`src/components/home/PartnerLogos.tsx`)
- **الوظيفة:** قسم "شركاء النجاح" — أسماء ماركات نصية (تفادياً لاستخدام شعارات حقيقية محمية بحقوق ملكية دون إذن)
- **الاستخدام:** `HomePage` — أسفل الصفحة

### ProductCard (`src/components/ProductCard.tsx`)
- **الوظيفة:** بطاقة منتج قابلة لإعادة الاستخدام — `variant: grid | deal`
- **السلة:** `addToCart` من CartContext فقط
- **الاستخدام:** HomePage، CategoryPage (لاحقاً)، ProductDetail (لاحقاً)

### مكونات HomePage (`src/components/home/`)
- **مستخدَمة في `HomePage` حالياً:** `HeroBanner`, `CategorySwiper`, `FeaturedProducts`, `PromoCards`, `PartnerLogos`
- **موجودة لكن غير مستخدَمة حالياً** (أُزيلت من الصفحة الرئيسية لمطابقة تصميم Stitch النهائي بدقة، ويمكن استخدامها لاحقاً في صفحات أخرى أو حملات ترويجية): `FeaturedDeals` (عروض بعدّاد تنازلي), `TrustBadges` (شارات الثقة), `NewsletterSection` (بانر الاشتراك)

### MobileBottomNav
- **الوظيفة:** تنقل سفلي للموبايل — السلة تفتح CartDrawer

---

## حالة السلة (Cart State)

```
┌─────────────┐     addToCart()      ┌──────────────┐
│ ProductDetail│ ──────────────────► │  CartContext │
└─────────────┘                      │  (localStorage)│
                                     └──────┬───────┘
┌─────────────┐     openCart()              │
│   Header    │ ◄───────────────────────────┤
└─────────────┘                             │
┌─────────────┐     items/total             │
│ CartDrawer  │ ◄───────────────────────────┤
└─────────────┘                             │
┌─────────────┐     clearCart()             │
│  Checkout   │ ◄───────────────────────────┘
└─────────────┘
```

1. العميل يتصفح بدون تسجيل دخول
2. عند `addToCart` → يُحفظ في Context + localStorage
3. CartDrawer يعرض المحتويات — Checkout يقرأ من Context
4. بعد تأكيد الطلب → `clearCart()` يفرغ السلة

---

## نقاط TODO — ربط API لاحقاً

| الملف | الموقع | ماذا يحتاج |
|-------|--------|-----------|
| `src/data/mockData.ts` | أعلى الملف | استبدال كل البيانات الوهمية بـ API endpoints |
| `src/context/CartContext.tsx` | `loadCartFromStorage` catch | مزامنة السلة مع السيرفر للمستخدمين المسجلين (مستقبلاً) |
| `src/utils/helpers.ts` | `generateOrderReference` | رقم طلب حقيقي من API |
| `src/utils/orderStorage.ts` | كل الملف | استبدال `localStorage` بطلبات API حقيقية للطلبات |
| `src/data/mockData.ts` | `mockOrders` | إزالة الطلبات التجريبية نهائياً بعد ربط الباك إند |
| `src/pages/ProductDetailPage.tsx` | قسم التقييمات | عرض تقييمات حقيقية من العملاء بدل الرسالة الافتراضية |
| `src/admin/pages/AdminLoginPage.tsx` | النموذج | مصادقة JWT/Session |
| صفحات الأدمن (8 صفحات) | عند البناء | fetch من API بدل mockData/orderStorage |

---

## التشغيل

```bash
npm install
npm run dev
```

- المتجر: `http://localhost:5173/`
- الأدمن: `http://localhost:5173/admin/login`

---

## المرحلة التالية (بانتظار الموافقة)

🎉 **كل صفحات المتجر والأدمن الـ14 مكتملة بصرياً ووظيفياً (بيانات محلية/تجريبية).** المتبقي فعلياً لتحويل المشروع من "واجهة أمامية كاملة" إلى "منتج حقيقي جاهز للإطلاق":

1. **مصادقة حقيقية بسيطة** لصفحة تسجيل دخول الأدمن (حالياً أي بيانات تدخل تعدي — راجع القسم أعلاه)
2. **بناء الباك إند** (Node.js + Express + MySQL كما اتفقنا) وربط كل نقاط الـ TODO المذكورة في هذا الملف بطلبات API حقيقية بدل `mockData`/`localStorage`
3. **رفع ملفات حقيقي** للصور (منتجات + شعار المتجر) بدل إدخال الروابط يدوياً
4. **تقنية SEO** (عناوين ديناميكية، Sitemap، Schema Markup) — مرحلة تنفيذ منفصلة كما اتفقنا سابقاً
