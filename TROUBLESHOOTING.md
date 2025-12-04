# Troubleshooting Guide

## مشكلة "An error occurred. Please try again" في Register

### السبب:
المشكلة كانت بسبب:
1. عدم وجود CORS middleware في Laravel
2. عدم معالجة الأخطاء بشكل صحيح في React

### الحل:

#### 1. في Laravel (Backend):
- تم إضافة `config/cors.php` مع السماح لـ `localhost:5173`
- تم إضافة CORS middleware في `bootstrap/app.php`
- تم تشغيل `php artisan config:clear`

#### 2. في React (Frontend):
- تم تحسين معالجة الأخطاء في `RegisterForm.jsx`
- تم إضافة `credentials: 'include'` في `api.js`
- تم إضافة `console.log` لعرض الأخطاء في الـ Console

### كيف تختبر:
1. افتح Developer Console في المتصفح (F12)
2. اذهب لتبويب Network
3. حاول التسجيل مرة أخرى
4. انظر للـ Request/Response في Network tab
5. انظر للأخطاء في Console tab

### الأخطاء الشائعة:

#### "The email has already been taken"
- **السبب**: الإيميل مستخدم من قبل
- **الحل**: استخدم إيميل آخر أو احذف المستخدم من قاعدة البيانات

#### "CORS policy error"
- **السبب**: Laravel لا يسمح بطلبات من `localhost:5173`
- **الحل**: تأكد من `config/cors.php` يحتوي على `http://localhost:5173`

#### "Network Error"
- **السبب**: Laravel server غير شغال
- **الحل**: تأكد أن `http://hotel-server.test` يعمل

### تحقق من الـ API يدوياً:
```bash
curl -X POST http://hotel-server.test/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123!",
    "password_confirmation": "Password123!"
  }'
```

يجب أن ترى:
```json
{
  "status": true,
  "data": {
    "email": "test@example.com"
  },
  "messages": [
    "Registration successful. Please check your email for verification code."
  ],
  "code": 201
}
```


