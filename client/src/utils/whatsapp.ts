// بناء رسالة واتساب جاهزة بتفاصيل الطلب — بتفتح واتساب مع رسالة معبّاة في
// مربع الكتابة، والأدمن هو اللي بيدوس "إرسال" يدوي (مفيش إرسال تلقائي)
// الرسالة قابلة للتخصيص بالكامل من لوحة التحكم (صفحة واتساب) عن طريق قالب
// نصي فيه متغيّرات زي {{customerName}} — لو الأدمن مغيّرش حاجة، بيتستخدم
// القالب الافتراضي تحت
import type { Order } from '@/types'
import { formatAddress, formatPrice, getPaymentMethodLabel } from '@/utils/helpers'

/** كل المتغيّرات المتاحة للاستخدام جوه قالب الرسالة، مع وصف كل واحد */
export const WHATSAPP_TEMPLATE_PLACEHOLDERS = [
  { token: '{{customerName}}', label: 'اسم العميل' },
  { token: '{{referenceNumber}}', label: 'الرقم المرجعي للطلب' },
  { token: '{{items}}', label: 'قائمة المنتجات (اسم × كمية — سعر) كل واحد في سطر' },
  { token: '{{subtotal}}', label: 'المجموع الفرعي' },
  { token: '{{shippingFee}}', label: 'رسوم الشحن (أو رسالة "هتتأكد لاحقًا" لو لسه ما اتحددتش)' },
  { token: '{{total}}', label: 'الإجمالي' },
  { token: '{{address}}', label: 'عنوان التوصيل كامل' },
  { token: '{{paymentMethod}}', label: 'طريقة الدفع' },
] as const

/** القالب الافتراضي — بيتستخدم لو الأدمن ماكتبش قالب مخصّص من صفحة واتساب */
export const DEFAULT_WHATSAPP_TEMPLATE = `مرحبًا {{customerName}} 👋

تم استلام طلبك بنجاح من متجرنا ✅
رقم الطلب: {{referenceNumber}}

🛒 تفاصيل الطلب:
{{items}}

💰 المجموع الفرعي: {{subtotal}}
🚚 رسوم الشحن: {{shippingFee}}
✅ الإجمالي: {{total}}

📍 عنوان التوصيل:
{{address}}

💳 طريقة الدفع: {{paymentMethod}}

هنتواصل معاك قريبًا لتأكيد الطلب وميعاد التوصيل. شكرًا لثقتك بينا 🙏`

/** تطبيع رقم الهاتف المصري لصيغة wa.me (كود الدولة 20 بدل الصفر الأول) */
function toWhatsAppPhone(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, '')
  return digitsOnly.startsWith('0') ? `20${digitsOnly.slice(1)}` : digitsOnly
}

/** استبدال كل متغيّرات القالب ببيانات الطلب الفعلية */
function fillTemplate(template: string, order: Order): string {
  // توحيد رموز نهاية السطر أولاً — لو القالب اتلصق من برنامج زي Word أو
  // Notepad على ويندوز، بيستخدم أحيانًا \r\n بدل \n، وده ممكن يسبب مشاكل
  // في عرض الأسطر على واتساب
  const normalizedTemplate = template.replace(/\r\n/g, '\n')

  const itemsList = order.items
    .map(
      (item) =>
        `• ${item.product.name} × ${item.quantity} — ${formatPrice(item.product.price * item.quantity)}`,
    )
    .join('\n')

  const shippingFeeText =
    order.shippingFee != null
      ? formatPrice(order.shippingFee)
      : 'هنأكدها معاك تليفونيًا حسب منطقتك'

  const addressText = formatAddress(order.address)

  const values: Record<string, string> = {
    customerName: order.customerName,
    referenceNumber: order.referenceNumber,
    items: itemsList,
    subtotal: formatPrice(order.subtotal),
    shippingFee: shippingFeeText,
    total: formatPrice(order.total) + (order.shippingFee == null ? ' (بدون الشحن)' : ''),
    address: addressText,
    paymentMethod: getPaymentMethodLabel(order.paymentMethod),
  }

  return normalizedTemplate.replace(/\{\{(\w+)\}\}/g, (match, key) => values[key] ?? match)
}

/** بناء نص رسالة واتساب من قالب مخصّص (أو الافتراضي لو مفيش قالب) */
export function buildOrderWhatsAppMessage(order: Order, template?: string | null): string {
  return fillTemplate(template?.trim() || DEFAULT_WHATSAPP_TEMPLATE, order)
}

/** رابط واتساب جاهز — بيفتح محادثة العميل مع الرسالة معبّاة في مربع الكتابة */
export function buildOrderWhatsAppLink(order: Order, template?: string | null): string {
  const phone = toWhatsAppPhone(order.phone)
  const message = buildOrderWhatsAppMessage(order, template)
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}