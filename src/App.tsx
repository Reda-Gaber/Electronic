// App — تعريف كل مسارات التطبيق (المتجر + الأدمن)
import { Routes, Route, Navigate } from 'react-router-dom'
import StoreLayout from '@/components/layouts/StoreLayout'
import AdminLayout from '@/admin/components/AdminLayout'

// صفحات المتجر
import HomePage from '@/pages/HomePage'
import CategoryPage from '@/pages/CategoryPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import CheckoutPage from '@/pages/CheckoutPage'
import OrderConfirmationPage from '@/pages/OrderConfirmationPage'
import OrderTrackingPage from '@/pages/OrderTrackingPage'
import SearchResultsPage from '@/pages/SearchResultsPage'
import OffersPage from '@/pages/OffersPage'
import NewArrivalsPage from '@/pages/NewArrivalsPage'
import AboutPage from '@/pages/AboutPage'
import FaqPage from '@/pages/FaqPage'
import ContactPage from '@/pages/ContactPage'

// صفحات الأدمن
import AdminLoginPage from '@/admin/pages/AdminLoginPage'
import AdminDashboardPage from '@/admin/pages/AdminDashboardPage'
import AdminOrdersPage from '@/admin/pages/AdminOrdersPage'
import AdminOrderDetailPage from '@/admin/pages/AdminOrderDetailPage'
import AdminProductsPage from '@/admin/pages/AdminProductsPage'
import AdminProductFormPage from '@/admin/pages/AdminProductFormPage'
import AdminCategoriesPage from '@/admin/pages/AdminCategoriesPage'
import AdminSettingsPage from '@/admin/pages/AdminSettingsPage'

export default function App() {
  return (
    <Routes>
      {/* مسارات المتجر — تستخدم StoreLayout (Header + Footer + CartDrawer) */}
      <Route element={<StoreLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
        <Route path="/track-order" element={<OrderTrackingPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/new-arrivals" element={<NewArrivalsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* تسجيل دخول الأدمن — بدون Layout (صفحة مستقلة) */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* مسارات الأدمن — تستخدم AdminLayout (Sidebar) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="orders/:id" element={<AdminOrderDetailPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<AdminProductFormPage />} />
        <Route path="products/:id/edit" element={<AdminProductFormPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* أي مسار غير معروف — إعادة توجيه للرئيسية */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
