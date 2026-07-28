-- ============================================================================
-- Migration 001 — تحديث قاعدة بيانات موجودة بالفعل لآخر نسخة من الـ schema
-- ============================================================================
-- شغّل الملف ده مرة واحدة بس على قاعدة البيانات الحالية بتاعتك (اللي فيها
-- بيانات فعلاً وميصحش تتعمل عليها DROP/CREATE من جديد). آمن يتشغّل حتى لو
-- بعض الأعمدة موجودة بالفعل — كل خطوة متأكد منها الأول قبل ما تنفّذها.
--
-- الاستخدام (من Workbench أو الـ Terminal):
--   mysql --default-character-set=utf8mb4 -u root -p abdelnabi_pctech < migrations/001_sync_latest_schema.sql
-- ============================================================================

USE `abdelnabi_pctech`;

-- ----------------------------------------------------------------------------
-- 1) إضافة عمود public_id لجدول orders (لو مش موجود) — ده سبب الخطأ اللي ظهرلك
-- ----------------------------------------------------------------------------
SET @col_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'orders' AND COLUMN_NAME = 'public_id'
);

SET @sql = IF(
  @col_exists = 0,
  'ALTER TABLE orders ADD COLUMN public_id CHAR(36) NULL AFTER id',
  'SELECT "public_id already exists" AS note'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- تعبئة قيمة عشوائية لأي طلبات قديمة كان عندها public_id فاضي
UPDATE orders SET public_id = UUID() WHERE public_id IS NULL;

-- تثبيت العمود كـ NOT NULL + فريد (بعد ما اتأكدنا إن كل الصفوف اتعبّت)
SET @sql = IF(
  @col_exists = 0,
  'ALTER TABLE orders MODIFY COLUMN public_id CHAR(36) NOT NULL',
  'SELECT "already NOT NULL" AS note'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
  SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'orders' AND INDEX_NAME = 'idx_orders_public_id'
);
SET @sql = IF(
  @index_exists = 0,
  'ALTER TABLE orders ADD UNIQUE INDEX idx_orders_public_id (public_id)',
  'SELECT "index already exists" AS note'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ----------------------------------------------------------------------------
-- 2) رسوم الشحن بقت اختيارية (بتتحدد لاحقاً من الأدمن بعد ما شركة الشحن تأكد
--    التكلفة) بدل ما تكون مربوطة بمنطقة شحن ثابتة برسوم محددة مسبقاً
-- ----------------------------------------------------------------------------
ALTER TABLE orders MODIFY COLUMN shipping_fee DECIMAL(10,2) NULL DEFAULT NULL;

-- أي طلبات قديمة كانت برسوم شحن = 0 (القيمة الافتراضية القديمة) نخليها NULL
-- بدل ما تفضل يبانلك 0 ج.م ثابتة كأنها اتحددت فعلاً
UPDATE orders SET shipping_fee = NULL WHERE shipping_fee = 0;

-- ----------------------------------------------------------------------------
-- 3) حذف جدول shipping_zones (مش هيتستخدم تاني — المحافظات بقت قائمة ثابتة
--    في الفرونت، ورسوم الشحن بتتحدد يدوياً لكل طلب من الأدمن)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS shipping_zones;

-- ----------------------------------------------------------------------------
-- 4) توسيع عمود صور المنتج عشان يستحمل صور مرفوعة من الجهاز (Data URL طويل)
--    بدل ما يكون رابط قصير بس
-- ----------------------------------------------------------------------------
ALTER TABLE product_images MODIFY COLUMN image_url MEDIUMTEXT NOT NULL;

SELECT 'تم تحديث قاعدة البيانات بنجاح ✅' AS result;
