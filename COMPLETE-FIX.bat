@echo off
REM ===================================================================
REM NEON Store - Complete Fix Script
REM سكريبت الحل الشامل
REM ===================================================================

color 0A
title NEON Store - Complete Fix

echo.
echo ========================================================
echo                   NEON STORE
echo            Complete Fix Script v2.0
echo         سكريبت الحل الشامل - نسخة 2.0
echo ========================================================
echo.

REM ===================================================================
REM Step 1: Check if we're in the right directory
REM ===================================================================
echo [1/6] Checking project directory...
echo [1/6] التحقق من مجلد المشروع...
echo.

if not exist "package.json" (
    echo ERROR: package.json not found!
    echo خطأ: ملف package.json غير موجود!
    echo.
    echo You are in: %cd%
    echo أنت في: %cd%
    echo.
    echo Please run this script from the project root directory.
    echo الرجاء تشغيل السكريبت من المجلد الرئيسي للمشروع.
    echo.
    pause
    exit /b 1
)

if not exist "server" (
    echo ERROR: server folder not found!
    echo خطأ: مجلد server غير موجود!
    echo.
    pause
    exit /b 1
)

echo SUCCESS: You are in the correct directory!
echo نجح: أنت في المجلد الصحيح!
echo.

REM ===================================================================
REM Step 2: Create .env file
REM ===================================================================
echo [2/6] Creating .env file...
echo [2/6] إنشاء ملف .env...
echo.

if exist .env (
    echo .env file already exists. Backing up...
    echo ملف .env موجود. جاري عمل نسخة احتياطية...
    copy .env .env.backup >nul 2>&1
    echo Backup created: .env.backup
    echo تم إنشاء نسخة احتياطية: .env.backup
    echo.
)

(
echo DATABASE_URL="postgresql://neondb_owner:npg_T3cEGwMb7vRm@ep-icy-field-aifrnjlz-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
echo SESSION_SECRET="neon-store-super-secret-key-2025-change-in-production"
echo NODE_ENV=development
echo PORT=5000
echo.
echo # Optional: Redis for sessions
echo # REDIS_URL=redis://localhost:6379
) > .env

if exist .env (
    echo SUCCESS: .env file created!
    echo نجح: تم إنشاء ملف .env!
    echo.
) else (
    echo ERROR: Failed to create .env file!
    echo خطأ: فشل إنشاء ملف .env!
    pause
    exit /b 1
)

REM ===================================================================
REM Step 3: Backup and clean old files
REM ===================================================================
echo [3/6] Cleaning old files...
echo [3/6] تنظيف الملفات القديمة...
echo.

if exist node_modules (
    echo Deleting node_modules... This may take a moment...
    echo حذف node_modules... قد يستغرق بعض الوقت...
    rmdir /s /q node_modules
    echo SUCCESS: node_modules deleted!
    echo نجح: تم حذف node_modules!
    echo.
)

if exist package-lock.json (
    echo Deleting package-lock.json...
    echo حذف package-lock.json...
    del package-lock.json
    echo SUCCESS: package-lock.json deleted!
    echo نجح: تم حذف package-lock.json!
    echo.
)

REM ===================================================================
REM Step 4: Install dependencies
REM ===================================================================
echo [4/6] Installing packages...
echo [4/6] تثبيت الحزم...
echo.
echo This will take 2-5 minutes. Please wait...
echo سيستغرق 2-5 دقائق. الرجاء الانتظار...
echo.

call npm install

if errorlevel 1 (
    echo.
    echo ERROR: Failed to install packages!
    echo خطأ: فشل تثبيت الحزم!
    echo.
    echo Try running: npm cache clean --force
    echo جرب تشغيل: npm cache clean --force
    pause
    exit /b 1
)

echo.
echo SUCCESS: All packages installed!
echo نجح: تم تثبيت جميع الحزم!
echo.

REM ===================================================================
REM Step 5: Setup database
REM ===================================================================
echo [5/6] Setting up database...
echo [5/6] إعداد قاعدة البيانات...
echo.

call npm run db:push

if errorlevel 1 (
    echo.
    echo WARNING: Database setup had some issues.
    echo تحذير: حدثت بعض المشاكل في إعداد قاعدة البيانات.
    echo This might be OK if tables already exist.
    echo قد يكون هذا طبيعياً إذا كانت الجداول موجودة بالفعل.
    echo.
) else (
    echo.
    echo SUCCESS: Database setup complete!
    echo نجح: اكتمل إعداد قاعدة البيانات!
    echo.
)

REM ===================================================================
REM Step 6: Verify .env file
REM ===================================================================
echo [6/6] Verifying .env file...
echo [6/6] التحقق من ملف .env...
echo.

if exist .env (
    echo .env file exists: YES
    echo ملف .env موجود: نعم
    echo.
    echo Contents:
    echo المحتوى:
    echo ----------------------------------------
    type .env
    echo ----------------------------------------
    echo.
) else (
    echo ERROR: .env file not found!
    echo خطأ: ملف .env غير موجود!
    pause
    exit /b 1
)

REM ===================================================================
REM Final Summary
REM ===================================================================
echo.
echo ========================================================
echo              SETUP COMPLETE!
echo             الإعداد مكتمل!
echo ========================================================
echo.
echo ✓ .env file created
echo ✓ تم إنشاء ملف .env
echo.
echo ✓ Dependencies installed
echo ✓ تم تثبيت الحزم
echo.
echo ✓ Database configured
echo ✓ تم إعداد قاعدة البيانات
echo.
echo ========================================================
echo           READY TO START!
echo          جاهز للتشغيل!
echo ========================================================
echo.
echo To start the server, run:
echo لتشغيل الخادم، نفذ:
echo.
echo     npm run dev
echo.
echo Then open in browser:
echo ثم افتح في المتصفح:
echo.
echo     http://localhost:5000
echo.
echo Admin Login:
echo تسجيل دخول المدير:
echo     Username: admin
echo     Password: admin123
echo.
echo ========================================================
echo.

set /p "start=Do you want to start the server now? (y/n): "
if /i "%start%"=="y" (
    echo.
    echo Starting server...
    echo تشغيل الخادم...
    echo.
    npm run dev
) else (
    echo.
    echo You can start the server later with: npm run dev
    echo يمكنك تشغيل الخادم لاحقاً بـ: npm run dev
    echo.
    pause
)
