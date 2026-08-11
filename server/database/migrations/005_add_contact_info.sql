-- ============================================================================
-- Migration 005 — إضافة بيانات تواصل إضافية لجدول settings
-- ============================================================================
-- بيضيف: store_email (إيميل المتجر)، store_address (العنوان)،
-- contact_phones (مصفوفة JSON بأرقام تليفونات متعددة للتواصل، منفصلة عن
-- store_phone الأساسي ورقم إنستاباي الوحيد اللي مش بيتغيّر).
-- آمن يتشغّل أكتر من مرة (بيتحقق قبل كل خطوة).
--
-- الاستخدام:
--   mysql --default-character-set=utf8mb4 -u root -p abdelnabi_pctech < migrations/005_add_contact_info.sql
-- ============================================================================

USE `abdelnabi_pctech`;

-- 1) store_email
SET @col_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'settings' AND COLUMN_NAME = 'store_email'
);
SET @sql = IF(
  @col_exists = 0,
  'ALTER TABLE settings ADD COLUMN store_email VARCHAR(150) NULL AFTER store_phone',
  'SELECT "store_email already exists" AS note'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2) store_address
SET @col_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'settings' AND COLUMN_NAME = 'store_address'
);
SET @sql = IF(
  @col_exists = 0,
  'ALTER TABLE settings ADD COLUMN store_address VARCHAR(255) NULL AFTER store_email',
  'SELECT "store_address already exists" AS note'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3) contact_phones — مصفوفة JSON بأرقام تليفونات متعددة (مختلفة عن
--    store_phone الأساسي، عشان يقدر يضيف أكتر من رقم للتواصل في صفحة "تواصل معنا")
SET @col_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'settings' AND COLUMN_NAME = 'contact_phones'
);
SET @sql = IF(
  @col_exists = 0,
  'ALTER TABLE settings ADD COLUMN contact_phones JSON NULL AFTER store_address',
  'SELECT "contact_phones already exists" AS note'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 4) تعبئة قيمة افتراضية لأي صف عنده contact_phones فاضي (يبدأ برقم المتجر الأساسي)
--    الشرط على id = 1 مضاف عشان يشتغل مع "Safe Update Mode" في MySQL Workbench
--    (بيرفض أي UPDATE من غير شرط WHERE على عمود مفتاح)
UPDATE settings
SET contact_phones = JSON_ARRAY(store_phone)
WHERE id = 1 AND contact_phones IS NULL;

SELECT 'تم إضافة بيانات التواصل الإضافية بنجاح ✅' AS result;
