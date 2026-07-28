# متجر عبدالنبي بي سي تيك — مشروع مدموج (فرونت + باك اند)

الفرونت والباك اند لسه **كودين منفصلين** (ده طبيعي وصح)، بس اتنظّموا في
مشروع واحد بحيث في النهاية بيتحوّلوا لتطبيق Node.js واحد بس — نفس الدومين،
مفيش CORS، ورفعة واحدة بس على هوستنجر بدل اتنين.

```
abdelnabi-pctech/
├── client/          ← الفرونت (React + Vite) — الكود المصدري
├── server/          ← الباك اند (Express + MySQL)
│   ├── src/
│   ├── database/    ← schema.sql + seed.sql
│   └── public/      ← (بيتولّد تلقائي) ناتج بناء الفرونت — مش من ضمن الكود المصدري
├── scripts/
│   └── copy-build.js
└── package.json     ← بيشغّل الاتنين مع بعض بأمر واحد
```

## أول مرة تشتغل بيها

```bash
npm run install:all
```

ده بيثبّت مكتبات الفرونت والباك اند مع بعض بأمر واحد.

بعد كده اعمل نسخة من `server/.env.example` باسم `server/.env` وحط فيها بيانات
قاعدة البيانات بتاعتك (راجع `server/database/README.md` لو لسه معملتهاش
القاعدة أصلاً).

## التطوير (وانت بتكوّد وبتجرّب)

أسهل حاجة أمر واحد بس بيشغّل الفرونت والباك اند مع بعض (كل واحد في عمليته
الخاصة، بس من نفس الـ Terminal):

```bash
npm run dev
```

هيديك لوجات الاتنين مع بعض ملوّنة (`SERVER` بالأزرق، `CLIENT` بالأخضر) عشان
تفرّق بينهم بسهولة.

لو حابب تشغّلهم منفصلين (مثلاً عايز تقفل واحد وتسيب التاني شغال):

```bash
# Terminal 1
npm run dev:server

# Terminal 2
npm run dev:client
```

في الحالتين، هتحتاج تعمل `client/.env` (من `client/.env.example`) فيها
`VITE_API_URL=http://localhost:5000/api`.

## قبل الرفع (بناء نسخة الإنتاج المدموجة)

```bash
npm run build
```

الأمر ده بيعمل:
1. بناء الفرونت (`npm run build` في `client/`) → بيطلع `client/dist`
2. نسخ الناتج ده لمجلد `server/public`

بعد الأمر ده، `server/` بقى تطبيق Node.js واحد كامل — لما تشغّله بـ
`npm start` (من جوه `server/` أو بـ `npm start` من هنا)، هيعرض الموقع نفسه
**و** الـ API من نفس البورت/الدومين مع بعض.

## الرفع على Hostinger (تطبيق Node.js واحد)

1. اعمل الخطوة اللي فوق (`npm run build`) على جهازك الأول
2. من hPanel: **Databases → MySQL Databases** — اعمل القاعدة وارفع
   `server/database/schema.sql` و `seed.sql` (التفاصيل في `server/database/README.md`)
3. من hPanel: **Websites → Node.js** → أنشئ تطبيق Node.js جديد
4. ارفع **مجلد `server/` بالكامل** (شامل مجلد `public/` اللي اتولّد) — إما
   برفع ملف مضغوط، أو GitHub، أو الطرق التانية المتاحة في hPanel
5. Startup file: `src/server.js`
6. من إعدادات التطبيق، ضيف متغيرات البيئة (Environment Variables) بنفس
   أسماء `server/.env.example`: `DB_HOST`, `DB_PORT`, `DB_USER`,
   `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `JWT_EXPIRES_IN`
   (متغيّر `CLIENT_ORIGIN` و `PORT` مش هتحتاجهم فعليًا في الوضع المدموج، بس
   سيبهم موجودين مش هيأثروا)
7. شغّل التطبيق من hPanel — الموقع كله (الفرونت + الـ API) هيبقى شغال على
   نفس الدومين بتاعك

## ملحوظة مهمة

مجلد `server/public/` **بيتولّد تلقائي** من `npm run build`، فمش لازم
(ومفروضش) تعدّل فيه حاجة يدويًا — أي تعديل في التصميم أو الصفحات يبقى في
`client/src/` زي المعتاد، وبعدين تعمل `npm run build` تاني قبل الرفع.
