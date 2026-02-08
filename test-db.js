#!/usr/bin/env node
/**
 * سكريبت اختبار الاتصال بقاعدة البيانات
 * Test Database Connection Script
 */

import { config } from 'dotenv';
import pg from 'pg';

// تحميل متغيرات البيئة
config();

const { Pool } = pg;

async function testConnection() {
  console.log('🔍 اختبار الاتصال بقاعدة البيانات...');
  console.log('Testing database connection...\n');

  // التحقق من وجود DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error('❌ خطأ: DATABASE_URL غير موجود في ملف .env');
    console.error('❌ Error: DATABASE_URL not found in .env file');
    console.log('\n💡 تلميح: انسخ ملف .env.example إلى .env وعدّل القيم');
    console.log('💡 Hint: Copy .env.example to .env and update values');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // محاولة الاتصال
    const client = await pool.connect();
    
    // تنفيذ استعلام بسيط
    const result = await client.query('SELECT NOW() as current_time, version() as version');
    
    console.log('✅ نجح الاتصال بقاعدة البيانات!');
    console.log('✅ Database connection successful!\n');
    
    console.log('📊 معلومات الخادم:');
    console.log('📊 Server Info:');
    console.log(`   الوقت الحالي / Current Time: ${result.rows[0].current_time}`);
    console.log(`   إصدار PostgreSQL / Version: ${result.rows[0].version.split(' ').slice(0, 2).join(' ')}`);
    
    // الحصول على قائمة الجداول
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\n📋 الجداول الموجودة:');
    console.log('📋 Existing Tables:');
    
    if (tablesResult.rows.length === 0) {
      console.log('   ⚠️  لا توجد جداول - قم بتشغيل: npm run db:push');
      console.log('   ⚠️  No tables found - run: npm run db:push');
    } else {
      tablesResult.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.table_name}`);
      });
    }
    
    client.release();
    
    console.log('\n✅ كل شيء يعمل بشكل صحيح!');
    console.log('✅ Everything is working correctly!');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ فشل الاتصال بقاعدة البيانات!');
    console.error('❌ Database connection failed!\n');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 السبب المحتمل: PostgreSQL غير مشتغل');
      console.error('💡 Likely cause: PostgreSQL is not running\n');
      console.log('🔧 الحلول المقترحة:');
      console.log('🔧 Suggested Solutions:');
      console.log('   1. ابدأ PostgreSQL:');
      console.log('      Start PostgreSQL:');
      console.log('      - macOS: brew services start postgresql@14');
      console.log('      - Linux: sudo systemctl start postgresql');
      console.log('      - Docker: docker start neon-postgres');
      console.log('\n   2. أو استخدم Docker:');
      console.log('      Or use Docker:');
      console.log('      docker run --name neon-postgres \\');
      console.log('        -e POSTGRES_PASSWORD=pass123 \\');
      console.log('        -e POSTGRES_DB=neon_store \\');
      console.log('        -p 5432:5432 -d postgres');
    } else if (error.code === '28P01') {
      console.error('💡 السبب: اسم المستخدم أو كلمة المرور خاطئة');
      console.error('💡 Cause: Wrong username or password');
      console.log('\n🔧 تحقق من DATABASE_URL في ملف .env');
      console.log('🔧 Check DATABASE_URL in .env file');
    } else if (error.code === '3D000') {
      console.error('💡 السبب: قاعدة البيانات غير موجودة');
      console.error('💡 Cause: Database does not exist');
      console.log('\n🔧 أنشئ قاعدة البيانات:');
      console.log('🔧 Create the database:');
      console.log('   createdb neon_store');
      console.log('   أو / or: psql -U postgres -c "CREATE DATABASE neon_store"');
    } else {
      console.error('تفاصيل الخطأ / Error details:', error.message);
    }
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// تشغيل الاختبار
testConnection();
