# 🚀 دليل تشغيل متجر NEON - إصدار Node.js النظيف

## ✅ التحويل من Replit إلى Node.js

تم تنظيف المشروع بالكامل من أي dependencies خاصة بـ Replit، والآن المشروع جاهز للعمل على أي جهاز أو سيرفر!

### ✨ التعديلات المنفذة:
- ✅ حذف جميع `@replit/*` plugins
- ✅ تنظيف `vite.config.ts`
- ✅ تحديث `package.json`
- ✅ إضافة ملف `.env.example`
- ✅ إضافة ملف `.gitignore` شامل

---

## 📋 المتطلبات الأساسية

### 1️⃣ Node.js (إصدار 18 أو أحدث)
```bash
# تحقق من وجود Node.js
node --version
# يجب أن يظهر: v18.x.x أو أحدث

# إذا لم يكن مثبتاً، حمّله من:
# https://nodejs.org/
```

### 2️⃣ PostgreSQL
```bash
# على Windows: حمّل من
# https://www.postgresql.org/download/windows/

# على macOS:
brew install postgresql@14
brew services start postgresql@14

# على Linux (Ubuntu/Debian):
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**بديل سهل: استخدم Docker**
```bash
docker run --name neon-postgres \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=neon_store \
  -p 5432:5432 \
  -d postgres:14
```

---

## 🔧 خطوات التثبيت والتشغيل

### الخطوة 1: تثبيت الحزم
```bash
cd NEON-Store
npm install
```

### الخطوة 2: إعداد قاعدة البيانات

#### أ. إنشاء قاعدة البيانات
```bash
# دخول PostgreSQL
psql -U postgres

# إنشاء قاعدة بيانات جديدة
CREATE DATABASE neon_store;

# إنشاء مستخدم (اختياري)
CREATE USER neon_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE neon_store TO neon_user;

# خروج
\q
```

#### ب. إنشاء ملف `.env`
```bash
# انسخ ملف المثال
cp .env.example .env

# ثم عدّل الملف:
nano .env
# أو استخدم أي محرر نصوص
```

**محتوى ملف `.env`:**
```env
# معلومات قاعدة البيانات
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/neon_store

# مفتاح الجلسة (غيّره لمفتاح عشوائي قوي!)
SESSION_SECRET=super-secret-key-change-this-now-1234567890

# البيئة
NODE_ENV=development

# المنفذ
PORT=5000
```

⚠️ **مهم جداً**: غيّر `SESSION_SECRET` لقيمة عشوائية قوية!

### الخطوة 3: إنشاء جداول قاعدة البيانات
```bash
npm run db:push
```

يجب أن ترى رسالة نجاح مثل:
```
✓ Database tables created successfully
```

### الخطوة 4: تشغيل المشروع

#### وضع التطوير 🛠️
```bash
npm run dev
```

سيعمل على: `http://localhost:5000`

#### وضع الإنتاج 🚀
```bash
# بناء المشروع
npm run build

# تشغيل المشروع المبني
npm start
```

---

## 📂 هيكل المشروع

```
NEON-Store/
│
├── 📁 client/                      # الواجهة الأمامية (React + Vite)
│   ├── src/
│   │   ├── pages/                  # صفحات التطبيق
│   │   │   ├── Home.tsx           # الصفحة الرئيسية
│   │   │   ├── Admin.tsx          # لوحة التحكم (17+ ميزة)
│   │   │   ├── Products.tsx       # صفحة المنتجات
│   │   │   ├── Cart.tsx           # سلة التسوق
│   │   │   └── Checkout.tsx       # إتمام الطلب
│   │   ├── components/
│   │   │   └── ui/                # مكونات shadcn/ui
│   │   ├── hooks/                 # React Hooks
│   │   └── lib/                   # دوال مساعدة
│   ├── index.html
│   └── public/
│
├── 📁 server/                      # الخادم (Node.js + Express)
│   ├── index.ts                   # نقطة البداية الرئيسية
│   ├── routes.ts                  # مسارات API
│   ├── db.ts                      # اتصال قاعدة البيانات
│   ├── storage.ts                 # إدارة الملفات
│   ├── vite.ts                    # Vite middleware للتطوير
│   └── static.ts                  # خدمة الملفات الثابتة
│
├── 📁 shared/                      # ملفات مشتركة بين Server و Client
│   ├── schema.ts                  # مخطط قاعدة البيانات (Drizzle)
│   ├── routes.ts                  # تعريفات المسارات
│   └── models/                    # نماذج البيانات
│
├── 📁 script/                      # سكريبتات البناء
│   └── build.ts                   # سكريبت البناء للإنتاج
│
├── 📄 package.json                # حزم Node.js (نظيف بدون Replit)
├── 📄 tsconfig.json               # إعدادات TypeScript
├── 📄 vite.config.ts              # إعدادات Vite (نظيف)
├── 📄 drizzle.config.ts           # إعدادات Drizzle ORM
├── 📄 tailwind.config.ts          # إعدادات Tailwind CSS
├── 📄 .env.example                # مثال لملف البيئة
└── 📄 .gitignore                  # ملفات مستبعدة من Git
```

---

## 🌐 المسارات (Routes)

### الواجهة الأمامية:
| المسار | الوصف |
|--------|-------|
| `/` | الصفحة الرئيسية |
| `/products` | عرض جميع المنتجات |
| `/cart` | سلة التسوق |
| `/checkout` | إتمام الطلب |
| `/admin` | لوحة التحكم الإدارية ⭐ |

### API الخلفية:
| المسار | Method | الوصف |
|--------|--------|-------|
| `/api/products` | GET | جلب جميع المنتجات |
| `/api/products` | POST | إضافة منتج جديد |
| `/api/products/:id` | DELETE | حذف منتج |
| `/api/orders` | GET | جلب جميع الطلبات |
| `/api/orders` | POST | إنشاء طلب جديد |
| `/api/login` | POST | تسجيل الدخول |
| `/api/logout` | POST | تسجيل الخروج |
| `/api/user` | GET | معلومات المستخدم |

---

## 🔐 حساب الأدمن الافتراضي

```
👤 Username: admin
🔑 Password: admin123
```

⚠️ **تحذير أمني**: 
- يُرجى تغيير كلمة المرور فوراً في بيئة الإنتاج!
- استخدم كلمة مرور قوية ومعقدة

### تغيير كلمة المرور:
افتح ملف `server/routes.ts` وابحث عن دالة `registerRoutes` ثم عدّل بيانات المستخدم الافتراضي.

---

## 📊 قاعدة البيانات (Schema)

### جدول Products (المنتجات)
```typescript
{
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: real('price').notNull(),
  category: text('category').notNull(),
  imageUrl: text('image_url').notNull(),
  stock: integer('stock').notNull().default(0),
  tags: text('tags').array(),        // مصفوفة نصوص
  sizes: text('sizes').array(),      // مصفوفة مقاسات
  colors: text('colors').array(),    // مصفوفة ألوان
  createdAt: timestamp('created_at').defaultNow()
}
```

### جدول Orders (الطلبات)
```typescript
{
  id: serial('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  address: text('address').notNull(),
  totalAmount: real('total_amount').notNull(),
  status: text('status').notNull(),  // pending, processing, shipped, delivered, cancelled
  paymentMethod: text('payment_method'), // cash, card
  createdAt: timestamp('created_at').defaultNow()
}
```

### جدول Users (المستخدمين)
```typescript
{
  id: serial('id').primaryKey(),
  username: text('username').unique().notNull(),
  password: text('password').notNull(), // مشفر بـ bcrypt
  role: text('role').default('user')    // admin, user
}
```

---

## 🛠️ الأوامر المتاحة

```bash
# التطوير
npm run dev              # تشغيل وضع التطوير
npm run check            # فحص أخطاء TypeScript

# البناء والإنتاج
npm run build            # بناء المشروع للإنتاج
npm start                # تشغيل الإنتاج

# قاعدة البيانات
npm run db:push          # تحديث مخطط قاعدة البيانات
npm run db:studio        # فتح واجهة إدارة قاعدة البيانات
```

---

## 🎨 المميزات الجديدة (17+ ميزة)

### ✅ لوحة التحكم الإدارية المتقدمة

#### 1. 📊 بطاقات الإحصائيات (4 بطاقات)
- 💰 **الإيرادات**: إجمالي الإيرادات + متوسط قيمة الطلب
- 🛒 **الطلبات**: إجمالي الطلبات + الطلبات المعلقة
- 📦 **المنتجات**: إجمالي المنتجات + غير المتوفرة
- ⚠️ **تنبيه المخزون**: عدد المنتجات ذات المخزون المنخفض

#### 2. 🔍 البحث والتصفية المتقدمة
- البحث بالاسم أو الوصف
- فلترة حسب الفئة
- إظهار المنتجات ذات المخزون المنخفض فقط
- فلترة الطلبات حسب الحالة

#### 3. 📈 خيارات الترتيب
- ترتيب المنتجات: اسم، سعر، مخزون
- ترتيب الطلبات: تاريخ، مبلغ، حالة
- عكس اتجاه الترتيب بضغطة واحدة

#### 4. ✅ الإدارة الجماعية
- اختيار/إلغاء اختيار الكل
- حذف جماعي للمنتجات
- تأكيد قبل الحذف

#### 5. 📤 تصدير البيانات (CSV)
- تصدير المنتجات
- تصدير الطلبات
- اسم الملف يحتوي على التاريخ

#### 6. 🎯 نموذج إضافة منتج محسّن
- حقول جديدة: Tags, Sizes, Colors
- التحقق الفوري من صحة البيانات
- أمثلة توضيحية

#### 7. 📦 شارات حالة المخزون
- 🔴 نفذ من المخزون (0)
- 🟠 مخزون منخفض (<10)
- 🟢 متوفر (≥10)

#### 8. 📋 جدول الطلبات المحسّن
- رقم الهاتف
- طريقة الدفع
- أيقونات الحالة الملونة

#### 9. 🔔 نظام التنبيهات
- تنبيه تلقائي للمخزون المنخفض
- بانر برتقالي مميز

#### 10. 🖼️ معاينة صور المنتجات
- صور مصغرة في الجدول
- حواف مستديرة جميلة

وغيرها من المميزات... (راجع `ARABIC_README.md` للتفاصيل الكاملة)

---

## 🐛 حل المشاكل الشائعة

### ❌ خطأ: Cannot find module 'express'
```bash
# احذف node_modules وأعد التثبيت
rm -rf node_modules package-lock.json
npm install
```

### ❌ خطأ: ECONNREFUSED - PostgreSQL
```bash
# تأكد من تشغيل PostgreSQL
# على macOS:
brew services restart postgresql@14

# على Linux:
sudo systemctl restart postgresql

# على Windows: افتح Services وابحث عن PostgreSQL
```

### ❌ خطأ: Port 5000 is already in use
```bash
# غيّر المنفذ في ملف .env
PORT=3000

# أو أوقف العملية المستخدمة للمنفذ:
# على macOS/Linux:
lsof -ti:5000 | xargs kill -9

# على Windows:
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### ❌ خطأ: Database connection failed
تحقق من:
1. PostgreSQL يعمل بشكل صحيح
2. `DATABASE_URL` في ملف `.env` صحيح
3. قاعدة البيانات موجودة
4. الصلاحيات صحيحة

```bash
# اختبر الاتصال:
psql -U postgres -d neon_store
```

### ❌ خطأ: npm run build fails
```bash
# تأكد من عدم وجود أخطاء TypeScript
npm run check

# إذا كان هناك أخطاء، قم بإصلاحها أولاً
```

---

## 🚀 النشر على الإنترنت

### خيارات النشر الموصى بها:

#### 1. 🟣 Render.com (مجاني - موصى به)
```bash
1. سجّل في render.com
2. اربط repo من GitHub
3. اختر "Web Service"
4. Build Command: npm install && npm run build
5. Start Command: npm start
6. أضف Environment Variables من .env
```

#### 2. 🔵 Railway.app (مجاني - سهل)
```bash
1. سجّل في railway.app
2. New Project → Deploy from GitHub
3. أضف PostgreSQL من Plugins
4. Environment Variables تلقائية!
```

#### 3. ⚫ Vercel (للواجهة فقط)
```bash
# الخادم + قاعدة البيانات يحتاجون منصة أخرى
npm i -g vercel
vercel
```

#### 4. 🟠 DigitalOcean (VPS - مدفوع)
```bash
# إنشاء Droplet Ubuntu
# تثبيت Node.js و PostgreSQL
# نقل المشروع وتشغيله
```

### متغيرات البيئة للنشر:
```env
NODE_ENV=production
DATABASE_URL=<your-production-database-url>
SESSION_SECRET=<strong-random-secret>
PORT=<assigned-by-platform>
```

---

## 🔒 نصائح الأمان

### ✅ للإنتاج (Production):
1. **غيّر SESSION_SECRET** لمفتاح عشوائي قوي جداً
2. **غيّر بيانات الأدمن** من admin/admin123
3. **استخدم HTTPS** دائماً
4. **فعّل Rate Limiting** للـ API
5. **استخدم Helmet.js** لحماية Express
6. **راجع CORS Settings**
7. **لا ترفع ملف .env** على Git أبداً!

### إضافة Helmet و Rate Limiting:
```bash
npm install helmet express-rate-limit
```

```typescript
// في server/index.ts
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100 // حد أقصى 100 طلب
});
app.use('/api/', limiter);
```

---

## ⚡ تحسينات الأداء

### للإنتاج:
```bash
# استخدم PM2 لإدارة العملية
npm install -g pm2
pm2 start dist/index.cjs --name neon-store
pm2 startup
pm2 save
```

### استخدم Redis للجلسات:
```bash
npm install connect-redis redis
```

### تفعيل Compression:
```bash
npm install compression
```

```typescript
import compression from 'compression';
app.use(compression());
```

---

## 📚 الموارد المفيدة

### الوثائق:
- [Node.js](https://nodejs.org/docs/)
- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

### دروس فيديو (YouTube):
- "Node.js Full Course" - FreeCodeCamp
- "React TypeScript Tutorial" - Net Ninja
- "PostgreSQL Tutorial" - Traversy Media
- "Express.js Crash Course" - Academind

---

## 🎯 الخطوات التالية

### بعد تشغيل المشروع:

1. ✅ **جرّب المشروع محلياً**
2. ✅ **أضف منتجات تجريبية**
3. ✅ **اختبر سلة التسوق**
4. ✅ **جرّب لوحة التحكم الإدارية**
5. ✅ **صدّر البيانات كـ CSV**

### التطويرات المقترحة:

- [ ] نظام تعليقات ومراجعات
- [ ] نظام الخصومات والكوبونات
- [ ] رفع صور متعددة للمنتج
- [ ] تتبع الشحنات
- [ ] رسوم بيانية للمبيعات
- [ ] تطبيق موبايل (React Native)
- [ ] نظام إشعارات
- [ ] دعم متعدد اللغات
- [ ] نظام دفع إلكتروني (Stripe/PayPal)

---

## 📞 المساعدة والدعم

### إذا واجهت مشكلة:
1. راجع قسم "حل المشاكل الشائعة" أعلاه
2. تحقق من ملف `ARABIC_README.md`
3. ابحث على Google عن رسالة الخطأ
4. اسأل على Stack Overflow
5. راجع Issues في GitHub

---

## 📝 ملاحظات الإصدار

### الإصدار 2.0.0 (Node.js Clean Version)
- ✅ إزالة جميع dependencies خاصة بـ Replit
- ✅ تنظيف `vite.config.ts`
- ✅ تحديث `package.json`
- ✅ إضافة `.env.example`
- ✅ إضافة `.gitignore` شامل
- ✅ 17+ ميزة جديدة في لوحة التحكم
- ✅ تصميم عصري بتدرجات لونية
- ✅ دعم كامل لـ TypeScript
- ✅ متجاوب مع جميع الأجهزة

---

## 🙏 شكر وتقدير

المشروع مبني باستخدام:
- **Node.js** - بيئة التشغيل
- **Express** - إطار الخادم
- **React** - مكتبة الواجهة
- **TypeScript** - أمان الأنواع
- **PostgreSQL** - قاعدة البيانات
- **Drizzle ORM** - إدارة قاعدة البيانات
- **Vite** - أداة البناء
- **Tailwind CSS** - التنسيق
- **shadcn/ui** - مكونات الواجهة
- **Lucide React** - الأيقونات

---

## 📜 الترخيص

MIT License - استخدم وعدّل بحرية ❤️

---

## 🌟 نصيحة أخيرة

**المشروع الآن جاهز تماماً للعمل على أي بيئة!**

ابدأ بـ:
```bash
npm install
npm run dev
```

واستمتع بإدارة متجرك الإلكتروني! 🎉

---

**صُنع بـ ❤️ للمطورين العرب**
