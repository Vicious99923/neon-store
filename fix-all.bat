@echo off
echo ========================================
echo   NEON Store - اصلاح جميع المشاكل
echo   NEON Store - Fix All Issues
echo ========================================
echo.

echo [1/7] Checking files...
echo [1/7] التحقق من الملفات...
if not exist "_env" (
    echo ERROR: File _env not found!
    echo خطأ: ملف _env غير موجود!
    pause
    exit /b 1
)

echo [2/7] Creating .env file...
echo [2/7] إنشاء ملف .env...
copy /Y _env .env >nul
if exist .env (
    echo SUCCESS: .env file created!
    echo نجح: تم إنشاء ملف .env!
) else (
    echo ERROR: Failed to create .env file!
    echo خطأ: فشل إنشاء ملف .env!
    pause
    exit /b 1
)

echo.
echo [3/7] Adding SESSION_SECRET to .env...
echo [3/7] إضافة SESSION_SECRET إلى ملف .env...
echo SESSION_SECRET="neon-store-super-secret-key-2025-change-in-production" >> .env
echo SUCCESS: SESSION_SECRET added!
echo نجح: تمت إضافة SESSION_SECRET!

echo.
echo [4/7] Cleaning old files...
echo [4/7] حذف الملفات القديمة...
if exist node_modules (
    echo Deleting node_modules...
    echo حذف node_modules...
    rmdir /s /q node_modules
)
if exist package-lock.json (
    echo Deleting package-lock.json...
    echo حذف package-lock.json...
    del package-lock.json
)
echo SUCCESS: Old files cleaned!
echo نجح: تم حذف الملفات القديمة!

echo.
echo [5/7] Installing packages (this may take a few minutes)...
echo [5/7] تثبيت الحزم (قد يستغرق بضع دقائق)...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install packages!
    echo خطأ: فشل تثبيت الحزم!
    pause
    exit /b 1
)
echo SUCCESS: Packages installed!
echo نجح: تم تثبيت الحزم!

echo.
echo [6/7] Setting up database...
echo [6/7] إعداد قاعدة البيانات...
call npm run db:push
if errorlevel 1 (
    echo WARNING: Database setup may have failed
    echo تحذير: قد يكون إعداد قاعدة البيانات قد فشل
    echo This might be OK if tables already exist
    echo قد يكون هذا طبيعياً إذا كانت الجداول موجودة
)

echo.
echo ========================================
echo   Setup Complete! / الإعداد كامل!
echo ========================================
echo.
echo To start the server, run:
echo لتشغيل الخادم، نفذ:
echo.
echo   npm run dev
echo.
echo Then open: http://localhost:5000
echo ثم افتح: http://localhost:5000
echo.
echo Admin Login / تسجيل دخول الأدمن:
echo   Username: admin
echo   Password: admin123
echo.
echo ========================================
pause
