# دليل تشخيص مشكلة Cookies

## خطوات التحقق:

### 1. تأكد من إعادة تشغيل الخوادم:

**الباك اند:**
```bash
# أوقف الخادم (Ctrl+C)
cd C:\Users\dell\Herd\hotel-server
php artisan config:clear
php artisan cache:clear
php artisan serve
```

**الفرونت اند:**
```bash
# أوقف الخادم (Ctrl+C)
cd C:\Users\dell\Desktop\Files\Hotel-client
npm run dev
```

### 2. امسح جميع Cookies و Local Storage:

1. افتح Developer Tools (F12)
2. اذهب إلى **Application** → **Cookies** → `http://localhost:5173`
3. احذف جميع Cookies
4. اذهب إلى **Local Storage** → `http://localhost:5173`
5. احذف جميع البيانات
6. أعد تحميل الصفحة (Ctrl+Shift+R)

### 3. سجّل الدخول:

1. اذهب إلى صفحة Login
2. سجّل الدخول
3. **بعد تسجيل الدخول مباشرة**، افتح Developer Tools → **Network**
4. ابحث عن طلب `/api/auth/login`
5. افتحه واذهب إلى **Response Headers**
6. تحقق من وجود `Set-Cookie: auth_token=...`

### 4. تحقق من Cookies:

1. بعد تسجيل الدخول، اذهب إلى **Application** → **Cookies** → `http://localhost:5173`
2. يجب أن ترى cookie باسم `auth_token`
3. تحقق من:
   - ✅ **Name**: `auth_token`
   - ✅ **Value**: يجب أن تحتوي على token
   - ✅ **Domain**: `localhost` أو فارغ
   - ✅ **Path**: `/`
   - ✅ **HttpOnly**: ✓ (checked)
   - ✅ **Secure**: غير محدد (unchecked)
   - ✅ **SameSite**: `Lax`

### 5. تحقق من الطلبات المصادقة:

1. بعد تسجيل الدخول، جرّب إضافة فندق إلى المفضلة
2. افتح Developer Tools → **Network**
3. ابحث عن طلب `/api/favorites`
4. افتحه واذهب إلى **Request Headers**
5. تحقق من وجود `Cookie: auth_token=...`

### 6. إذا لم تظهر Cookie في Request Headers:

**المشكلة**: Cookie لا يتم إرسالها مع الطلبات

**الحلول المحتملة**:
1. تأكد من أن `credentials: 'include'` موجود في جميع الطلبات (✅ تم بالفعل)
2. تأكد من أن Vite proxy يعمل بشكل صحيح
3. جرّب استخدام `localhost` بدلاً من `127.0.0.1` للباك اند

### 7. إذا ظهرت Cookie لكن الطلب فشل:

**المشكلة**: Cookie موجودة لكن middleware لا يقرأها

**الحل**:
- تحقق من logs الباك اند:
  ```bash
  tail -f storage/logs/laravel.log
  ```
- ابحث عن رسائل `AuthenticateWithCookie`

### 8. حل بديل (إذا لم يعمل Vite proxy):

إذا استمرت المشكلة، يمكنك استخدام URL كامل بدلاً من proxy:

1. في `vite.config.js`، احذف قسم `server.proxy`
2. في جميع API services، استخدم:
   ```javascript
   baseUrl: import.meta.env.VITE_API_URL + '/api'
   ```
3. في `.env` للفرونت اند، أضف:
   ```
   VITE_API_URL=http://localhost:8000
   ```
4. في `config/cors.php`، تأكد من:
   - `supports_credentials: true`
   - `allowed_origins` يحتوي على `http://localhost:5173`

### 9. التحقق من Logs:

افتح terminal الباك اند وتحقق من أي رسائل خطأ أو debug messages.

---

## ملاحظات:

- **Vite proxy** يجب أن يمرر cookies تلقائياً
- **Cookie domain** يجب أن يكون `null` أو `localhost`
- **SameSite** يجب أن يكون `Lax` للعمل مع same-origin (بفضل proxy)

