# Backend Setup Guide - Reviews API

هذا الدليل يشرح كيفية إضافة نظام التقييمات إلى مشروع Laravel الخاص بك.

## 📋 المتطلبات

- Laravel 10.x أو أحدث
- PHP 8.1 أو أحدث
- MySQL/MariaDB
- Laravel Sanctum (للمصادقة)

## 🚀 خطوات التثبيت

### 1. نسخ الملفات

انسخ جميع الملفات من مجلد `backend/` إلى مشروع Laravel الخاص بك:

```bash
# Migration
cp backend/database/migrations/* database/migrations/

# Models
cp backend/app/Models/Review.php app/Models/

# Controllers
cp backend/app/Http/Controllers/Api/* app/Http/Controllers/Api/

# Requests
cp backend/app/Http/Requests/* app/Http/Requests/

# Routes - أضف الروابط إلى routes/api.php
```

### 2. تشغيل Migration

```bash
php artisan migrate
```

هذا سينشئ جدول `reviews` في قاعدة البيانات.

### 3. تحديث Models الموجودة

#### Hotel Model
تأكد من إضافة العلاقة في `app/Models/Hotel.php`:

```php
use Illuminate\Database\Eloquent\Relations\MorphMany;

public function reviews(): MorphMany
{
    return $this->morphMany(Review::class, 'reviewable');
}
```

#### Room Model
تأكد من إضافة العلاقة في `app/Models/Room.php`:

```php
use Illuminate\Database\Eloquent\Relations\MorphMany;

public function reviews(): MorphMany
{
    return $this->morphMany(Review::class, 'reviewable');
}
```

### 4. تحديث جدول Hotels (اختياري)

إذا كنت تريد تخزين متوسط التقييمات في جدول الفنادق مباشرة:

```bash
php artisan make:migration add_rating_to_hotels_table
```

```php
public function up(): void
{
    Schema::table('hotels', function (Blueprint $table) {
        $table->decimal('rating', 3, 2)->default(0)->after('description');
        $table->integer('reviews_count')->default(0)->after('rating');
    });
}
```

```bash
php artisan migrate
```

### 5. تحديث جدول Rooms (اختياري)

إذا كنت تريد تخزين متوسط التقييمات في جدول الغرف:

```bash
php artisan make:migration add_rating_to_rooms_table
```

```php
public function up(): void
{
    Schema::table('rooms', function (Blueprint $table) {
        $table->decimal('rating', 3, 2)->default(0)->after('description');
        $table->integer('reviews_count')->default(0)->after('rating');
    });
}
```

```bash
php artisan migrate
```

### 6. إضافة Routes

افتح `routes/api.php` وأضف الروابط (أو استبدل الملف الموجود في `backend/routes/api.php`).

### 7. التأكد من Laravel Sanctum

تأكد من أن Laravel Sanctum مثبت ومهيأ:

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

## 🧪 الاختبار

### اختبار الـ API باستخدام Postman أو curl:

#### 1. الحصول على تقييمات فندق (Public)
```bash
curl -X GET "http://127.0.0.1:8000/api/hotels/1/reviews"
```

#### 2. الحصول على إحصائيات التقييمات (Public)
```bash
curl -X GET "http://127.0.0.1:8000/api/hotels/1/reviews/stats"
```

#### 3. إنشاء تقييم (يحتاج Token)
```bash
curl -X POST "http://127.0.0.1:8000/api/hotels/1/reviews" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "title": "Great hotel!",
    "comment": "Had an amazing stay, highly recommended."
  }'
```

#### 4. التحقق من التقييم (يحتاج Token)
```bash
curl -X GET "http://127.0.0.1:8000/api/hotels/1/reviews/check" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 5. تحديث تقييم (يحتاج Token)
```bash
curl -X PUT "http://127.0.0.1:8000/api/reviews/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 4,
    "comment": "Updated comment..."
  }'
```

#### 6. حذف تقييم (يحتاج Token)
```bash
curl -X DELETE "http://127.0.0.1:8000/api/reviews/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📝 ملاحظات مهمة

1. **Authorization**: جميع الـ endpoints للإنشاء/التحديث/الحذف تحتاج إلى Bearer Token
2. **Unique Constraint**: كل مستخدم يمكنه كتابة تقييم واحد فقط لكل فندق/غرفة
3. **Rating Update**: يتم تحديث متوسط التقييمات تلقائياً في جدول الفنادق/الغرف عند إضافة/تعديل/حذف تقييم
4. **Validation**: جميع المدخلات يتم التحقق منها قبل الحفظ

## 🔧 استكشاف الأخطاء

### خطأ: "Class 'App\Models\Review' not found"
- تأكد من نسخ ملف `Review.php` إلى `app/Models/`

### خطأ: "Table 'reviews' doesn't exist"
- قم بتشغيل `php artisan migrate`

### خطأ: "Route [reviews] not defined"
- تأكد من إضافة الروابط في `routes/api.php`

### خطأ: "Unauthenticated"
- تأكد من إرسال Bearer Token في الـ header
- تأكد من أن Laravel Sanctum مثبت ومهيأ

## 📚 الوثائق الكاملة

راجع ملف `REVIEWS_API_DOCUMENTATION.md` للحصول على توثيق كامل لجميع الـ endpoints.

## ✅ Checklist

- [ ] نسخ جميع الملفات
- [ ] تشغيل Migration
- [ ] إضافة العلاقات في Models
- [ ] إضافة Routes
- [ ] تحديث جداول Hotels/Rooms (اختياري)
- [ ] اختبار الـ API endpoints
- [ ] التأكد من عمل المصادقة

## 🎉 جاهز!

الآن نظام التقييمات جاهز للاستخدام! يمكنك البدء في إرسال واستقبال التقييمات من الـ Frontend.
