# ⚡ البدء السريع - NEON Store

## 🚀 تشغيل المشروع في 5 خطوات

### 1️⃣ تثبيت الحزم
```bash
npm install
```

### 2️⃣ إعداد قاعدة البيانات
```bash
# أنشئ قاعدة بيانات PostgreSQL
createdb neon_store

# أو باستخدام Docker:
docker run --name neon-postgres -e POSTGRES_PASSWORD=pass123 -e POSTGRES_DB=neon_store -p 5432:5432 -d postgres
```

### 3️⃣ إعداد ملف البيئة
```bash
# انسخ ملف المثال
cp .env.example .env

# عدّل المعلومات:
# DATABASE_URL=postgresql://postgres:pass123@localhost:5432/neon_store
# SESSION_SECRET=your-secret-key
```

### 4️⃣ إنشاء الجداول
```bash
npm run db:push
```

### 5️⃣ تشغيل المشروع
```bash
npm run dev
```

## ✅ جاهز!

افتح المتصفح: `http://localhost:5000`

### 🔐 تسجيل الدخول كأدمن:
```
Username: admin
Password: admin123
```

---

## 📋 الأوامر المهمة

```bash
npm run dev         # تشغيل التطوير
npm run build       # بناء للإنتاج
npm start           # تشغيل الإنتاج
npm run db:push     # تحديث قاعدة البيانات
npm run db:studio   # واجهة إدارة قاعدة البيانات
```

---

## 🔧 إذا واجهت مشكلة

### PostgreSQL لا يعمل:
```bash
# على macOS:
brew services start postgresql@14

# على Linux:
sudo systemctl start postgresql

# أو استخدم Docker (أسهل):
docker start neon-postgres
```

### المنفذ 5000 مشغول:
```bash
# غيّر PORT في ملف .env
PORT=3000
```

### خطأ في تثبيت الحزم:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 للمزيد من التفاصيل
راجع ملف `README_AR_FULL.md` للدليل الكامل!

---

**صُنع بـ ❤️ - استمتع!**
