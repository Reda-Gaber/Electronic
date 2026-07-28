-- ============================================================================
-- Migration 002 — إضافة عمود public_id الناقص لجدول orders
-- ============================================================================
-- بيحل تحديدًا الخطأ: Unknown column 'public_id' in 'field list'
-- آمن يتشغّل أكتر من مرة (بيتحقق قبل كل خطوة).
--
-- الاستخدام:
--   mysql --default-character-set=utf8mb4 -u root -p abdelnabi_pctech < migrations/002_add_order_public_id.sql
-- ============================================================================

USE `abdelnabi_pctech`;

-- 1) إضافة العمود لو مش موجود
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

-- 2) تعبئة قيمة لأي صفوف قديمة كان عندها public_id فاضي
UPDATE orders SET public_id = UUID() WHERE public_id IS NULL;

-- 3) تثبيت العمود NOT NULL بعد ما اتأكدنا إن كل الصفوف اتعبّت
SET @sql = IF(
  @col_exists = 0,
  'ALTER TABLE orders MODIFY COLUMN public_id CHAR(36) NOT NULL',
  'SELECT "already NOT NULL" AS note'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 4) فهرس فريد على public_id لو مش موجود
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

SELECT 'تم إضافة عمود public_id بنجاح ✅' AS result;