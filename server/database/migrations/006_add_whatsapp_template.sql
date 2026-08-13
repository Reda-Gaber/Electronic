-- ============================================================================
-- Migration 006 — إضافة قالب رسالة واتساب مخصّص لجدول settings
-- ============================================================================
-- بيضيف: whatsapp_message_template (TEXT NULL) — قالب رسالة واتساب اللي
-- بيتجهّز تلقائيًا لكل عميل من صفحات الطلبات، قابل للتعديل من لوحة التحكم
-- (صفحة واتساب). NULL يعني استخدام القالب الافتراضي المدمج في الفرونت إند.
-- آمن يتشغّل أكتر من مرة (بيتحقق قبل كل خطوة).
--
-- الاستخدام:
--   mysql --default-character-set=utf8mb4 -u root -p abdelnabi_pctech < migrations/006_add_whatsapp_template.sql
-- ============================================================================

USE `abdelnabi_pctech`;

SET @col_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'settings' AND COLUMN_NAME = 'whatsapp_message_template'
);
SET @sql = IF(
  @col_exists = 0,
  'ALTER TABLE settings ADD COLUMN whatsapp_message_template TEXT NULL AFTER instapay_number',
  'SELECT "whatsapp_message_template already exists" AS note'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT 'تم إضافة قالب رسالة واتساب بنجاح ✅' AS result;
