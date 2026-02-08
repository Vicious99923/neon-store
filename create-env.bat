@echo off
REM ===================================================================
REM NEON Store - Create .env File
REM سكريبت إنشاء ملف .env
REM ===================================================================

echo ========================================
echo   NEON Store - Create .env File
echo   انشاء ملف .env
echo ========================================
echo.

REM Check if .env exists
if exist .env (
    echo WARNING: .env file already exists!
    echo تحذير: ملف .env موجود بالفعل!
    set /p "answer=Do you want to overwrite it? (y/n): "
    if /i not "%answer%"=="y" (
        echo Cancelled.
        pause
        exit /b
    )
)

echo Creating .env file...
echo انشاء ملف .env...
echo.

REM Create .env file
(
echo DATABASE_URL="postgresql://neondb_owner:npg_T3cEGwMb7vRm@ep-icy-field-aifrnjlz-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
echo SESSION_SECRET="neon-store-super-secret-key-2025-change-in-production"
echo NODE_ENV=development
echo PORT=5000
echo.
echo # Optional: Redis for sessions
echo # REDIS_URL=redis://localhost:6379
echo.
echo # Optional: File Upload Settings
echo # MAX_FILE_SIZE=5242880
echo # UPLOAD_DIR=./uploads
) > .env

if exist .env (
    echo.
    echo ======================================== 
    echo SUCCESS! .env file created!
    echo نجح! تم انشاء ملف .env!
    echo ========================================
    echo.
    echo File contents:
    echo محتوى الملف:
    echo.
    type .env
    echo.
    echo ========================================
    echo Ready to run: npm run dev
    echo جاهز للتشغيل: npm run dev
    echo ========================================
) else (
    echo.
    echo ERROR: Failed to create .env file!
    echo خطأ: فشل انشاء ملف .env!
)

echo.
pause
