-- ============================================================================
-- بيانات تجريبية أولية — مطابقة لنفس البيانات الوهمية الموجودة حاليًا في الفرونت
-- (src/data/mockData.ts) عشان الموقع يشتغل بنفس الشكل لحظة ما نربطه بالـ API
-- ============================================================================

USE `abdelnabi_pctech`;

-- ----------------------------------------------------------------------------
-- إعدادات المتجر (صف واحد بس)
-- ----------------------------------------------------------------------------
INSERT INTO `settings` (`id`, `store_name`, `store_phone`, `store_email`, `store_address`, `contact_phones`, `instapay_number`)
VALUES (
  1,
  'عبدالنبي للإلكترونيات',
  '01098765432',
  'info@abdelnabi-pctech.com',
  'القاهرة، مصر',
  JSON_ARRAY('01098765432'),
  '01012345678'
)
ON DUPLICATE KEY UPDATE
  `store_name` = VALUES(`store_name`),
  `store_phone` = VALUES(`store_phone`),
  `instapay_number` = VALUES(`instapay_number`);

-- ----------------------------------------------------------------------------
-- التصنيفات
-- ----------------------------------------------------------------------------
INSERT INTO `categories`
  (`name`, `slug`, `description`, `image`, `icon`, `is_custom_icon`, `featured_on_homepage`, `sort_order`)
VALUES
  ('كروت الشاشة', 'graphics-cards',
   'أحدث كروت NVIDIA و AMD للألعاب والعمل الاحترافي',
   'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400',
   'aspect_ratio', 0, 0, 1),

  ('المعالجات', 'processors',
   'معالجات Intel و AMD بأحدث الأجيال',
   'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400',
   'memory', 0, 0, 2),

  ('الذاكرة RAM', 'memory',
   'ذاكرة DDR4 و DDR5 بسرعات عالية',
   'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400',
   'sd_card', 0, 0, 3),

  ('التخزين', 'storage',
   'SSD و HDD بسعات مختلفة',
   'https://images.unsplash.com/photo-1597872200963-2b35d8ebde39?w=400',
   'save', 0, 0, 4),

  ('اللوحات الأم', 'motherboards',
   'لوحات أم متوافقة مع أحدث المعالجات، بدعم كامل لمنافذ الجيل القادم',
   'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
   'developer_board', 0, 1, 5),

  ('مزودات الطاقة', 'power-supplies',
   'خصومات تصل إلى 30% على جميع مزودات الطاقة عالية الكفاءة',
   'https://images.unsplash.com/photo-1587202372775-e229f172b9a9?w=400',
   'bolt', 0, 1, 6);

-- ----------------------------------------------------------------------------
-- حساب أدمن افتراضي واحد للاختبار
-- الإيميل: admin@abdelnabi-pctech.com
-- الباسورد المؤقت: ChangeMe123!  (غيّره فورًا بعد أول تسجيل دخول)
-- ----------------------------------------------------------------------------
INSERT INTO `admin_users` (`name`, `email`, `password_hash`)
VALUES (
  'أدمن المتجر',
  'admin@abdelnabi-pctech.com',
  '$2b$10$ZnOm3mthUwn0gtrxjdcGfuHrSoBcGb88haaDx4KJjlxiO2q5G5ip.'
);

-- حساب أدمن تجريبي إضافي للاختبار السريع أثناء التطوير
-- الإيميل: admin@gmail.com — الباسورد: 000000
-- ⚠️ باسورد ضعيف قصدًا للاختبار بس — لازم يتحذف أو يتغيّر قبل أي رفع فعلي حقيقي
INSERT INTO `admin_users` (`name`, `email`, `password_hash`)
VALUES (
  'أدمن تجريبي',
  'admin@gmail.com',
  '$2b$10$bCrVoT8JenXoRN1YR5/awuKbPZRVoJLvxrXBeBWd2dvGNc/RICMMi'
);

-- ----------------------------------------------------------------------------
-- منتجات تجريبية (نموذج فقط للاختبار — الباقي يُضاف من لوحة تحكم الأدمن)
-- ----------------------------------------------------------------------------
INSERT INTO `products`
  (`id`, `name`, `slug`, `category_id`, `brand`, `price`, `original_price`,
   `description`, `in_stock`, `stock_count`, `rating`, `review_count`,
   `is_featured`, `is_new`, `status`)
VALUES
  (1, 'NVIDIA GeForce RTX 4090', 'nvidia-geforce-rtx-4090', 1, 'NVIDIA',
   65000.00, 72000.00,
   'أقوى كرت شاشة في العالم للألعاب وصناعة المحتوى بدقة 4K',
   1, 12, 4.9, 156, 1, 0, 'published'),

  (2, 'AMD Radeon RX 7900 XTX', 'amd-radeon-rx-7900-xtx', 1, 'AMD',
   42000.00, 46500.00,
   'كرت AMD الأقوى مع 24GB GDDR6',
   1, 8, 4.8, 72, 1, 1, 'published'),

  (3, 'Samsung 990 Pro 2TB', 'samsung-990-pro-2tb', 4, 'Samsung',
   8900.00, 10200.00,
   'SSD NVMe Gen4 بسرعة قراءة 7450 MB/s',
   1, 15, 4.9, 210, 1, 1, 'published');

INSERT INTO `product_images` (`product_id`, `image_url`, `sort_order`) VALUES
  (1, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600', 0),
  (2, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600', 0),
  (3, 'https://images.unsplash.com/photo-1597872200963-2b35d8ebde39?w=600', 0);

INSERT INTO `product_specs` (`product_id`, `label`, `value`, `sort_order`) VALUES
  (1, 'الذاكرة', '24GB GDDR6X', 1),
  (1, 'سرعة النواة', '2520 MHz', 2),
  (3, 'السعة', '2TB', 1),
  (3, 'الواجهة', 'M.2 NVMe Gen4', 2),
  (3, 'القراءة', '7450 MB/s', 3);
