/**
 * Footer — تذييل الصفحة للمتجر
 *
 * الوظيفة: عرض معلومات المتجر، روابط سريعة، وحقوق النشر
 * Props: لا يوجد
 * الاستخدام: أسفل StoreLayout في كل صفحات المتجر
 */
import { Link } from 'react-router-dom'
import { getSettings } from '@/utils/settingsStorage'

export default function Footer() {
  const settings = getSettings()

  return (
    <footer className="mt-auto border-t border-outline-variant bg-surface-container-low">
      <div className="container-main py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* معلومات المتجر */}
          <div>
            <div className="mb-4">
              <img src="/logo.jpg" alt={settings.storeName} className="h-12 w-auto object-contain" />
            </div>
            <p className="text-sm leading-relaxed text-on-surface-variant">
              متجرك الأول لمكونات الحاسوب عالية الأداء. كروت شاشة، معالجات،
              ذاكرة، وتخزين بأفضل الأسعار.
            </p>
          </div>

          {/* روابط سريعة */}
          <div>
            <h3 className="mb-4 font-display text-lg font-bold text-on-surface">
              روابط سريعة
            </h3>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li>
                <Link to="/" className="transition-colors hover:text-primary">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/offers" className="transition-colors hover:text-primary">
                  العروض
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors hover:text-primary">
                  من نحن
                </Link>
              </li>
              <li>
                <Link to="/faq" className="transition-colors hover:text-primary">
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="transition-colors hover:text-primary">
                  إتمام الشراء
                </Link>
              </li>
            </ul>
          </div>

          {/* تواصل */}
          <div>
            <h3 className="mb-4 font-display text-lg font-bold text-on-surface">
              تواصل معنا
            </h3>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">call</span>
                {settings.storePhone}
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">mail</span>
                info@pc-tech-arabia.com
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                القاهرة، مصر
              </li>
            </ul>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="mt-8 border-t border-outline-variant pt-6 text-center text-sm text-on-surface-variant">
          © {new Date().getFullYear()} {settings.storeName}. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  )
}
