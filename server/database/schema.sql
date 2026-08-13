-- ============================================================================
-- قاعدة بيانات متجر "عبدالنبي للإلكترونيات" — MySQL
-- ============================================================================
-- مصمّمة لتطابق بالضبط الـ types الموجودة في الفرونت (src/types/index.ts)
-- ومتوافقة مع استضافة Hostinger (MySQL فقط على الخطط المشتركة/المُدارة).
--
-- ملاحظات عامة:
--   - كل الجداول بـ InnoDB (يدعم Foreign Keys والمعاملات Transactions)
--   - الترميز utf8mb4 عشان يدعم العربي والإيموجي بدون مشاكل
--   - مفيش جدول "users/customers" لأن الموقع Guest Checkout بالكامل،
--     مفيش تسجيل دخول عملاء إطلاقاً (اتأكدنا من الفرونت الحالي)
--   - الأدمن فقط له جدول دخول (admin_users)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `abdelnabi_pctech`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `abdelnabi_pctech`;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- 1) admin_users — حساب/حسابات الأدمن فقط (مفيش حسابات عملاء)
-- ============================================================================
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id`            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`          VARCHAR(100) NOT NULL,
  `email`         VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 2) categories — التصنيفات (Category type)
-- ============================================================================
CREATE TABLE IF NOT EXISTS `categories` (
  `id`                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`                  VARCHAR(120) NOT NULL,
  `slug`                  VARCHAR(140) NOT NULL UNIQUE,
  `description`           TEXT NULL,
  -- رابط صورة عادي، أو Data URL لصورة مرفوعة من جهاز الأدمن مباشرة (TEXT لاحتمال طول الـ Data URL)
  `image`                 TEXT NULL,
  -- اسم أيقونة Material جاهزة، أو Data URL لأيقونة مرفوعة (TEXT لاحتمال طول الـ Data URL)
  `icon`                  TEXT NULL,
  `is_custom_icon`        TINYINT(1) NOT NULL DEFAULT 0,
  `featured_on_homepage`  TINYINT(1) NOT NULL DEFAULT 0,
  `sort_order`            INT NOT NULL DEFAULT 0,
  `created_at`            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_categories_featured` (`featured_on_homepage`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ملحوظة: عدد المنتجات في كل تصنيف (productCount في الفرونت) لا يُخزَّن هنا،
-- بل يُحسب وقت الطلب بـ: SELECT COUNT(*) FROM products WHERE category_id = ? AND status = 'published'
-- عشان يفضل دايمًا مطابق للواقع من غير الحاجة لتحديثه يدويًا كل مرة.

-- ============================================================================
-- 3) products — المنتجات (Product type)
-- ============================================================================
CREATE TABLE IF NOT EXISTS `products` (
  `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name`           VARCHAR(200) NOT NULL,
  `slug`           VARCHAR(220) NOT NULL UNIQUE,
  `category_id`    INT UNSIGNED NOT NULL,
  `brand`          VARCHAR(100) NULL,
  `price`          DECIMAL(10,2) NOT NULL,
  `original_price` DECIMAL(10,2) NULL,
  `description`    TEXT NULL,
  `in_stock`       TINYINT(1) NOT NULL DEFAULT 1,
  `stock_count`    INT NOT NULL DEFAULT 0,
  `rating`         DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  `review_count`   INT NOT NULL DEFAULT 0,
  `is_featured`    TINYINT(1) NOT NULL DEFAULT 0,
  `is_new`         TINYINT(1) NOT NULL DEFAULT 0,
  `status`         ENUM('published','draft') NOT NULL DEFAULT 'published',
  `created_at`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_products_category`
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX `idx_products_category` (`category_id`),
  INDEX `idx_products_status` (`status`),
  INDEX `idx_products_featured` (`is_featured`),
  INDEX `idx_products_new` (`is_new`),
  FULLTEXT INDEX `ft_products_search` (`name`, `description`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 4) product_images — صور المنتج (Product.images[])
-- ============================================================================
CREATE TABLE IF NOT EXISTS `product_images` (
  `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `product_id`     INT UNSIGNED NOT NULL,
  -- مسار الصورة (بعد معالجتها بـ Sharp وتحويلها WebP، مثلاً /uploads/products/xxx.webp)
  -- سايبينه MEDIUMTEXT (مش VARCHAR) عشان لو فيه منتجات قديمة لسه فيها Data URL
  -- (Base64) تفضل شغالة زي ما هي بدون أي تعديل أو فقدان بيانات
  `image_url`      MEDIUMTEXT NOT NULL,
  -- نسخة مصغّرة (400px) من نفس الصورة — NULL للصور القديمة قبل التحديث ده
  `thumbnail_url`  VARCHAR(500) NULL,
  -- أول صورة بالترتيب (sort_order=0) هي الصورة الرئيسية = product.image في الفرونت
  `sort_order`     INT NOT NULL DEFAULT 0,
  CONSTRAINT `fk_product_images_product`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_product_images_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 5) product_specs — المواصفات التقنية (ProductSpec type)
-- ============================================================================
CREATE TABLE IF NOT EXISTS `product_specs` (
  `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT UNSIGNED NOT NULL,
  `label`      VARCHAR(120) NOT NULL,
  `value`      VARCHAR(255) NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  CONSTRAINT `fk_product_specs_product`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_product_specs_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 6) settings — إعدادات المتجر (StoreSettings type) — صف واحد بس دايمًا (id=1)
-- ============================================================================
CREATE TABLE IF NOT EXISTS `settings` (
  `id`               TINYINT UNSIGNED NOT NULL PRIMARY KEY DEFAULT 1,
  `store_name`       VARCHAR(150) NOT NULL,
  `store_phone`      VARCHAR(20) NOT NULL,
  `store_email`      VARCHAR(150) NULL,
  `store_address`    VARCHAR(255) NULL,
  `contact_phones`   JSON NULL,
  `instapay_number`  VARCHAR(20) NOT NULL,
  -- قالب رسالة واتساب المخصّص للطلبات — NULL يعني استخدام القالب الافتراضي
  `whatsapp_message_template` TEXT NULL,
  `updated_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `chk_settings_single_row` CHECK (`id` = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 7) orders — الطلبات (Order + ShippingAddress types)
-- ============================================================================
CREATE TABLE IF NOT EXISTS `orders` (
  `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  -- معرّف عام عشوائي (UUID) يُستخدم في رابط "تأكيد الطلب" بدل الـ id الداخلي
  -- المتسلسل، عشان محدش يقدر يخمن أرقام طلبات تانية بمجرد تغيير رقم في الرابط
  `public_id`        CHAR(36) NOT NULL,
  `reference_number` VARCHAR(40) NOT NULL UNIQUE,
  `customer_name`    VARCHAR(150) NOT NULL,
  `phone`            VARCHAR(20) NOT NULL,
  -- عنوان الشحن التفصيلي (ShippingAddress) — أعمدة منفصلة عشان سهل البحث والفلترة
  -- governorate: اسم محافظة من قائمة الـ 27 محافظة الثابتة (مش مرتبطة بجدول رسوم)
  `governorate`      VARCHAR(100) NOT NULL,
  `city`             VARCHAR(100) NOT NULL,
  `district`         VARCHAR(100) NOT NULL,
  `street`           VARCHAR(200) NOT NULL,
  `building_number`  VARCHAR(20)  NOT NULL,
  `floor`            VARCHAR(20)  NULL,
  `apartment`        VARCHAR(20)  NULL,
  `payment_method`   ENUM('cash','instapay') NOT NULL,
  `subtotal`         DECIMAL(10,2) NOT NULL,
  -- NULL = لسه ما اتحددتش (بتتحدد لما شركة الشحن تأكد التكلفة)، الأدمن بيحطها يدوياً بعدين
  `shipping_fee`     DECIMAL(10,2) NULL DEFAULT NULL,
  -- عند الإنشاء = subtotal (لحد ما رسوم الشحن تتحدد وتتضاف من الأدمن)
  `total`            DECIMAL(10,2) NOT NULL,
  `status`           ENUM('pending','confirmed','shipped','delivered','cancelled')
                      NOT NULL DEFAULT 'pending',
  -- ملاحظات العميل وقت الطلب
  `notes`            TEXT NULL,
  -- ملاحظات داخلية يضيفها الأدمن — لا تظهر للعميل أبداً
  `admin_notes`      TEXT NULL,
  `created_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_orders_reference` (`reference_number`),
  UNIQUE INDEX `idx_orders_public_id` (`public_id`),
  -- يخدم صفحة "تتبع الطلب" اللي بتبحث برقم الهاتف + الرقم المرجعي معاً
  INDEX `idx_orders_phone_reference` (`phone`, `reference_number`),
  INDEX `idx_orders_status` (`status`),
  INDEX `idx_orders_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 8) order_items — منتجات كل طلب (CartItem[] داخل Order)
-- ============================================================================
-- بنحفظ "لقطة" (snapshot) من اسم/صورة/سعر المنتج وقت الشراء، عشان لو المنتج
-- اتعدّل أو اتحذف بعدين، تفاصيل الطلب القديم تفضل زي ما كانت وقت الشراء بالظبط.
CREATE TABLE IF NOT EXISTS `order_items` (
  `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id`       INT UNSIGNED NOT NULL,
  -- NULL لو المنتج الأصلي اتحذف بعدين — بيانات الطلب نفسها بتفضل موجودة برضو
  `product_id`     INT UNSIGNED NULL,
  `product_name`   VARCHAR(200) NOT NULL,
  `product_image`  VARCHAR(500) NULL,
  `unit_price`     DECIMAL(10,2) NOT NULL,
  `quantity`       INT UNSIGNED NOT NULL DEFAULT 1,
  CONSTRAINT `fk_order_items_order`
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_order_items_product`
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_order_items_order` (`order_id`),
  INDEX `idx_order_items_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;