# دليل تجربة نظام المصادقة عبر Cookies

## خطوات التجربة:

### 1. تشغيل الباك اند والفرونت اند

**الباك اند (Laravel):**
```bash
cd C:\Users\dell\Herd\hotel-server
php artisan serve
# أو إذا كنت تستخدم Herd، تأكد أن الموقع يعمل على http://localhost:8000
```

**الفرونت اند (React):**
```bash
cd C:\Users\dell\Desktop\Files\Hotel-client
npm run dev
# يجب أن يعمل على http://localhost:5173
```

---

### 2. فتح Developer Tools

1. افتح المتصفح (Chrome أو Firefox)
2. اضغط `F12` أو `Ctrl+Shift+I` لفتح Developer Tools
3. اذهب إلى تبويب **Application** (أو **Storage** في Firefox)
4. في القائمة الجانبية، ابحث عن:
   - **Cookies** → `http://localhost:5173`
   - **Local Storage** → `http://localhost:5173`

---

### 3. التحقق قبل تسجيل الدخول

**في Developer Tools:**

1. **Cookies**: يجب أن تكون فارغة (أو تحتوي فقط على cookies أخرى غير `auth_token`)
2. **Local Storage**: افتح `http://localhost:5173` وتحقق من:
   - يجب أن **لا** يحتوي على `token`
   - قد يحتوي على `persist:root` لكن يجب أن **لا** يحتوي على `token` داخله

**في Console:**
- افتح تبويب **Console**
- يجب أن ترى رسالة `Failed to fetch CSRF cookie` أو لا شيء (هذا طبيعي إذا كان الباك اند لا يدعم `/sanctum/csrf-cookie`)

---

### 4. تجربة تسجيل الدخول

1. اذهب إلى صفحة Login: `http://localhost:5173/auth/login`
2. أدخل بيانات المستخدم (email + password)
3. اضغط **Log in**

**بعد تسجيل الدخول:**

**في Developer Tools → Application → Cookies:**
- يجب أن ترى cookie جديدة باسم `auth_token`
- يجب أن تكون `HttpOnly: true`
- يجب أن تكون `SameSite: Lax`
- يجب أن تحتوي على قيمة (token)

**في Developer Tools → Application → Local Storage:**
- يجب أن **لا** يحتوي على `token`
- قد يحتوي على `persist:root` مع بيانات المستخدم (`user`) لكن **بدون** `token`

**في Console:**
- يجب أن ترى رسالة نجاح: "Logged in successfully. Welcome back!"

---

### 5. تجربة الطلبات المصادقة

بعد تسجيل الدخول، جرب:

1. **فتح صفحة Profile**: `http://localhost:5173/profile`
   - يجب أن تظهر بيانات المستخدم
   - افتح **Network** tab في Developer Tools
   - ابحث عن طلب `/api/user`
   - تحقق من **Request Headers**: يجب أن **لا** يحتوي على `Authorization: Bearer ...`
   - تحقق من **Request Headers**: يجب أن يحتوي على `Cookie: auth_token=...`

2. **تحديث Profile**:
   - عدّل أي حقل في Profile
   - اضغط **Save**
   - يجب أن يعمل بنجاح

3. **إضافة إلى المفضلة**:
   - اذهب إلى أي فندق
   - اضغط على زر المفضلة
   - يجب أن يعمل بنجاح

---

### 6. التحقق من Network Requests

**في Developer Tools → Network:**

1. افتح أي طلب مصادق (مثل `/api/user`)
2. اذهب إلى **Headers**
3. تحقق من **Request Headers**:
   - ✅ يجب أن يحتوي على `Cookie: auth_token=...`
   - ❌ يجب أن **لا** يحتوي على `Authorization: Bearer ...`

---

### 7. تجربة Logout

1. اضغط على **Logout**
2. بعد تسجيل الخروج:

**في Cookies:**
- يجب أن تختفي cookie `auth_token` أو تصبح فارغة

**في Local Storage:**
- يجب أن تختفي بيانات المستخدم من `persist:root`

**في Console:**
- يجب أن ترى رسالة نجاح Logout

---

### 8. التحقق من Redux State

**في Developer Tools:**

1. اذهب إلى تبويب **Console**
2. اكتب:
```javascript
// للتحقق من Redux state
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__.connect()
```

أو استخدم Redux DevTools Extension:
- تحقق من `state.auth.token`: يجب أن يكون `null`
- تحقق من `state.auth.user`: يجب أن يحتوي على بيانات المستخدم بعد Login
- تحقق من `state.auth.isAuthenticated`: يجب أن يكون `true` بعد Login

---

## ما يجب أن تراه (✅) وما لا يجب أن تراه (❌):

### ✅ يجب أن تراه:
- Cookie `auth_token` في Application → Cookies
- Cookie `auth_token` في Network → Request Headers → Cookie
- بيانات المستخدم في Redux state (`state.auth.user`)
- `credentials: 'include'` في Network requests

### ❌ لا يجب أن تراه:
- `token` في Local Storage
- `Authorization: Bearer ...` في Request Headers
- `state.auth.token` في Redux state (يجب أن يكون `null` أو غير موجود)

---

## حل المشاكل الشائعة:

### المشكلة: Cookie لا يتم إرسالها
**الحل:**
- تأكد من أن `credentials: 'include'` موجود في جميع الطلبات
- تأكد من أن `supports_credentials: true` في `config/cors.php`
- تأكد من أن الباك اند والفرونت اند على نفس الـ domain (localhost)

### المشكلة: 401 Unauthorized
**الحل:**
- تحقق من أن cookie `auth_token` موجودة
- تحقق من أن middleware `AuthenticateWithCookie` يعمل
- تحقق من console للأخطاء

### المشكلة: CSRF cookie error
**الحل:**
- هذا طبيعي إذا كان الباك اند لا يدعم `/sanctum/csrf-cookie`
- يمكنك إزالة طلب CSRF cookie من `main.jsx` إذا لم يكن ضرورياً

---

## ملاحظات إضافية:

- **للتجربة على Production**: ستحتاج إلى تعديل `secure: true` في `AuthController.php` وإضافة domain الإنتاج إلى `config/cors.php`
- **للتجربة على Netlify**: ستحتاج إلى إضافة domain Netlify إلى `allowed_origins` في `config/cors.php`

