// إعدادات Vite: تفعيل React و Tailwind CSS ومسار alias للمجلد src
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        proxy: {
            // الصور بترجع من الـ API كمسار نسبي (/uploads/...)، وده بيتفتح غلط في
            // وضع التطوير المنفصل (فرونت على 5173، باك اند على 5000) لأن المتصفح
            // بيدوّر عليه في نفس بورت الفرونت. الـ proxy ده بيمرره لباك اند فعلي.
            '/uploads': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
        },
    },
});
