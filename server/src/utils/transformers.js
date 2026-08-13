// تحويل صفوف قاعدة البيانات (snake_case، IDs أرقام) لنفس شكل الـ types
// المستخدمة في الفرونت بالظبط (camelCase، IDs نصوص) — عشان الـ API يرجع
// بيانات جاهزة للاستخدام المباشر من غير أي تعديل في الفرونت

/** تحويل صف تصنيف من القاعدة لشكل Category في الفرونت */
function toCategoryDTO(row) {
  return {
    id: String(row.id),
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    image: row.image || '',
    productCount: row.productCount !== undefined ? Number(row.productCount) : 0,
    icon: row.icon || '',
    isCustomIcon: Boolean(row.is_custom_icon),
    featuredOnHomepage: Boolean(row.featured_on_homepage),
  }
}

/** تحويل صف منتج (+ صفوفه الفرعية: صور ومواصفات) لشكل Product في الفرونت */
function toProductDTO(row, images = [], specs = []) {
  const sortedImages = [...images].sort((a, b) => a.sort_order - b.sort_order)
  const imageUrls = sortedImages.map((img) => img.image_url)

  return {
    id: String(row.id),
    name: row.name,
    slug: row.slug,
    categoryId: String(row.category_id),
    categoryName: row.category_name || '',
    brand: row.brand || '',
    price: Number(row.price),
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    image: imageUrls[0] || '',
    images: imageUrls,
    description: row.description || '',
    specs: [...specs]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((s) => ({ label: s.label, value: s.value })),
    inStock: Boolean(row.in_stock),
    stockCount: Number(row.stock_count),
    rating: Number(row.rating),
    reviewCount: Number(row.review_count),
    isFeatured: Boolean(row.is_featured),
    isNew: Boolean(row.is_new),
    status: row.status,
  }
}

/**
 * تحويل صف طلب (+ عناصره) لشكل Order في الفرونت
 * كل عنصر بيتحول لكائن Product كامل الشكل (مطابق للـ type) لكن بالبيانات
 * المحفوظة وقت الشراء (اسم/صورة/سعر) بس — باقي الحقول (المواصفات، الفئة...)
 * مش محفوظة في الطلب نفسه فبترجع فاضية، لأن واجهة الطلب مش محتاجاها أصلاً
 */
function toOrderDTO(row, itemRows = []) {
  return {
    id: row.public_id,
    referenceNumber: row.reference_number,
    customerName: row.customer_name,
    phone: row.phone,
    address: {
      governorate: row.governorate,
      city: row.city,
      district: row.district,
      street: row.street,
      buildingNumber: row.building_number,
      floor: row.floor || '',
      apartment: row.apartment || '',
    },
    paymentMethod: row.payment_method,
    items: itemRows.map((item) => ({
      product: {
        id: item.product_id != null ? String(item.product_id) : '',
        name: item.product_name,
        slug: '',
        categoryId: '',
        categoryName: '',
        brand: '',
        price: Number(item.unit_price),
        image: item.product_image || '',
        images: item.product_image ? [item.product_image] : [],
        description: '',
        specs: [],
        inStock: true,
        stockCount: 0,
        rating: 0,
        reviewCount: 0,
      },
      quantity: Number(item.quantity),
    })),
    subtotal: Number(row.subtotal),
    shippingFee: row.shipping_fee != null ? Number(row.shipping_fee) : null,
    total: Number(row.total),
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    notes: row.notes || undefined,
    adminNotes: row.admin_notes || undefined,
  }
}

/** تحويل صف الإعدادات لشكل StoreSettings في الفرونت */
function toSettingsDTO(settingsRow) {
  let contactPhones = []
  try {
    contactPhones = settingsRow.contact_phones ? JSON.parse(settingsRow.contact_phones) : []
  } catch {
    // contact_phones ممكن يرجع Array جاهز من الـ driver مش نص JSON — نتعامل معاه زي ما هو
    contactPhones = Array.isArray(settingsRow.contact_phones) ? settingsRow.contact_phones : []
  }

  return {
    storeName: settingsRow.store_name,
    storePhone: settingsRow.store_phone,
    storeEmail: settingsRow.store_email || '',
    storeAddress: settingsRow.store_address || '',
    contactPhones: contactPhones.length > 0 ? contactPhones : [settingsRow.store_phone],
    instapayNumber: settingsRow.instapay_number,
    whatsappMessageTemplate: settingsRow.whatsapp_message_template ?? null,
  }
}

module.exports = { toCategoryDTO, toProductDTO, toOrderDTO, toSettingsDTO }
