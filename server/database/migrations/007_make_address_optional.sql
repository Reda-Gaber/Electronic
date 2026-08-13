-- ============================================================================
-- Migration 007 — خلي كل حقول عنوان التوصيل اختيارية (تقبل NULL)
-- ============================================================================
-- ده بيسمح للعميل يأكد الطلب من غير ما يدخل عنوان كامل، والمتجر يتواصل معاه
-- تليفونيًا بعدين لتحديد تفاصيل التوصيل. الأمر آمن يتشغّل على قاعدة بيانات فيها
-- بيانات فعلاً — مش بيمسح أو يلمس أي صف موجود، بس بيغيّر تعريف الأعمدة.
--
-- الاستخدام:
--   من phpMyAdmin: افتح قاعدة البيانات → تبويب SQL → الصق الملف كامل → Go
--   أو من سطر الأوامر:
--   mysql --default-character-set=utf8mb4 -u <user> -p <database> < migrations/007_make_address_optional.sql
-- ============================================================================

USE `u543521377_abdelnaby`;

ALTER TABLE `orders`
  MODIFY COLUMN `governorate`     VARCHAR(100) NULL,
  MODIFY COLUMN `city`            VARCHAR(100) NULL,
  MODIFY COLUMN `district`        VARCHAR(100) NULL,
  MODIFY COLUMN `street`          VARCHAR(200) NULL,
  MODIFY COLUMN `building_number` VARCHAR(20)  NULL;

-- floor و apartment كانوا أصلاً NULL من الأول، مفيش داعي نلمسهم.

SELECT 'تم تحديث أعمدة العنوان بنجاح — كلها بقت اختيارية' AS result;
