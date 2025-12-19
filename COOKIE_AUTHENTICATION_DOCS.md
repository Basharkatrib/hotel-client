# توثيق نظام المصادقة بالكوكي (Cookie-Based Authentication)

## نظرة عامة

تم تحويل نظام المصادقة من استخدام **Bearer Token** في `localStorage` إلى استخدام **HTTP-only Cookies** لتوفير أمان أفضل. هذا يعني أن التوكن لا يتم تخزينه في JavaScript ولا يمكن الوصول إليه من الكود، مما يمنع هجمات XSS.

---

## كيف يعمل النظام؟

### 1. تسجيل الدخول (Login Flow)

#### الخطوة 1: المستخدم يسجل الدخول
```
المستخدم → Frontend (React) → POST /api/auth/login
```

#### الخطوة 2: الباك اند يتحقق من البيانات
```php
// app/Http/Controllers/Api/AuthController.php
public function login(Request $request): JsonResponse
{
    // التحقق من email و password
    $user = User::where('email', $request->email)->first();
    
    if (!$user || !Hash::check($request->password, $user->password)) {
        return $this->error(['Invalid credentials'], 401);
    }
    
    // إنشاء توكن Sanctum
    $token = $user->createToken('auth-token')->plainTextToken;
    
    // إرسال التوكن كـ HTTP-only cookie
    $cookie = cookie(
        'auth_token',        // اسم الكوكي
        $token,              // قيمة الكوكي (التوكن)
        60 * 24 * 7,         // مدة الصلاحية: 7 أيام
        '/',                 // المسار: جميع الصفحات
        null,                // Domain: null (يعمل مع localhost)
        false,               // Secure: false (لـ HTTP في localhost)
        true,                // HttpOnly: true (لا يمكن الوصول من JavaScript)
        false,               // Raw: false
        'lax'                // SameSite: 'lax' (للعمل مع same-origin)
    );
    
    // إرجاع بيانات المستخدم مع الكوكي
    return $this->success([
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            // ... باقي البيانات
        ],
    ], ['Login successful.'])->cookie($cookie);
}
```

#### الخطوة 3: المتصفح يحفظ الكوكي تلقائياً
- المتصفح يستقبل `Set-Cookie` header من الباك اند
- يحفظ الكوكي `auth_token` تلقائياً
- الكوكي **HttpOnly** يعني أن JavaScript لا يمكنه الوصول إليه
- الكوكي يتم إرساله تلقائياً مع كل طلب إلى نفس الـ domain

#### الخطوة 4: Redux يحفظ حالة المستخدم
```javascript
// src/store/slices/authSlice.js
// عند نجاح Login
builder.addMatcher(
  api.endpoints.login.matchFulfilled,
  (state, { payload }) => {
    if (payload.status && payload.data) {
      state.user = payload.data.user;           // حفظ بيانات المستخدم
      state.isAuthenticated = true;             // تعيين حالة المصادقة
    }
  }
);
```

#### الخطوة 5: Redux Persist يحفظ البيانات في localStorage
```javascript
// src/store/store.js
const persistConfig = {
  key: 'root',
  storage: localStorage,  // حفظ في localStorage
  whitelist: ['auth'],    // فقط auth slice يتم حفظه
};

// عند إعادة تحميل الصفحة، Redux Persist يسترجع البيانات من localStorage
```

---

### 2. كيف يظل المستخدم مسجل دخول بعد Refresh؟

#### أ. Redux Persist يسترجع حالة المصادقة
```
1. المستخدم يعمل Refresh (F5)
2. Redux Persist يقرأ البيانات من localStorage
3. يسترجع state.auth.user و state.auth.isAuthenticated
4. التطبيق يعرف أن المستخدم مسجل دخول
```

#### ب. الكوكي يتم إرساله تلقائياً مع كل طلب
```
1. المستخدم يفتح صفحة جديدة أو يعمل refresh
2. التطبيق يرسل طلب GET /api/user
3. المتصفح يرسل الكوكي auth_token تلقائياً مع الطلب
4. الباك اند يقرأ الكوكي ويحقق من التوكن
5. يعيد بيانات المستخدم
```

#### ج. Middleware يقرأ الكوكي ويضيفه إلى Authorization Header
```php
// app/Http/Middleware/AuthenticateWithCookie.php
public function handle(Request $request, Closure $next): Response
{
    // إذا لم يكن هناك Authorization header
    if (!$request->bearerToken()) {
        // قراءة التوكن من الكوكي
        $token = $request->cookie('auth_token');
        
        if ($token) {
            // إضافة التوكن إلى Authorization header
            // حتى يتمكن Sanctum من قراءته
            $request->headers->set('Authorization', 'Bearer ' . $token);
        }
    }
    
    return $next($request);
}
```

#### د. Sanctum يتحقق من التوكن
```
1. Middleware يضيف Authorization header
2. Sanctum middleware يقرأ التوكن
3. يتحقق من صحة التوكن في قاعدة البيانات
4. يربط المستخدم بالطلب ($request->user())
```

---

### 3. الطلبات المصادقة (Authenticated Requests)

#### كيف يتم إرسال الكوكي مع الطلبات؟

**في الفرونت اند:**
```javascript
// src/services/api.js
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',  // ✅ هذا مهم! يخبر المتصفح بإرسال الكوكي
  }),
});
```

**`credentials: 'include'` يعني:**
- إرسال جميع الكوكيز مع كل طلب
- حتى لو كان الطلب cross-origin (مع Vite proxy)

#### Vite Proxy يمرر الكوكي
```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
      // Vite يمرر الكوكي تلقائياً من المتصفح إلى الباك اند
    },
  },
}
```

**كيف يعمل:**
```
1. المستخدم يضغط على "Add to Favorites"
2. Frontend يرسل POST /api/favorites
3. Vite proxy يستقبل الطلب من localhost:5173
4. يمرر الطلب إلى 127.0.0.1:8000
5. يمرر الكوكي مع الطلب تلقائياً
6. الباك اند يستقبل الكوكي
7. Middleware يقرأ الكوكي ويضيف Authorization header
8. Sanctum يتحقق من التوكن
9. الطلب ينجح ✅
```

---

### 4. تسجيل الخروج (Logout Flow)

```php
// app/Http/Controllers/Api/AuthController.php
public function logout(Request $request): JsonResponse
{
    // حذف التوكن من قاعدة البيانات
    $request->user()->currentAccessToken()->delete();
    
    // حذف الكوكي من المتصفح
    $cookie = cookie()->forget('auth_token');
    
    return $this->success(null, ['Logged out successfully.'])->cookie($cookie);
}
```

**ما يحدث:**
1. الباك اند يحذف التوكن من قاعدة البيانات
2. يرسل `Set-Cookie: auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
3. المتصفح يحذف الكوكي تلقائياً
4. Redux يمسح `user` و `isAuthenticated`

---

## المكونات الرئيسية

### 1. الباك اند (Laravel)

#### أ. AuthController
- **الملف**: `app/Http/Controllers/Api/AuthController.php`
- **المسؤوليات**:
  - `login()`: إنشاء توكن وإرساله كـ cookie
  - `verifyOtp()`: نفس الشيء عند تسجيل الدخول بـ OTP
  - `logout()`: حذف التوكن والكوكي
  - `user()`: إرجاع بيانات المستخدم الحالي

#### ب. AuthenticateWithCookie Middleware
- **الملف**: `app/Http/Middleware/AuthenticateWithCookie.php`
- **المسؤوليات**:
  - قراءة `auth_token` من الكوكي
  - إضافته إلى `Authorization` header
  - السماح لـ Sanctum بقراءته

#### ج. CORS Configuration
- **الملف**: `config/cors.php`
- **الإعدادات المهمة**:
  ```php
  'supports_credentials' => true,  // ✅ يسمح بإرسال الكوكي
  'allowed_origins' => ['http://localhost:5173', ...],
  ```

#### د. Session Configuration
- **الملف**: `config/session.php`
- **الإعدادات المستخدمة**:
  ```php
  'same_site' => 'lax',      // للعمل مع same-origin
  'secure' => false,          // لـ HTTP في localhost
  'http_only' => true,        // منع الوصول من JavaScript
  ```

---

### 2. الفرونت اند (React)

#### أ. Redux Auth Slice
- **الملف**: `src/store/slices/authSlice.js`
- **الحالة**:
  ```javascript
  {
    user: null,              // بيانات المستخدم
    isAuthenticated: false,  // حالة المصادقة
    // ❌ لا يوجد token هنا (يتم حفظه في الكوكي فقط)
  }
  ```

#### ب. Redux Persist
- **الملف**: `src/store/store.js`
- **المسؤوليات**:
  - حفظ `auth` slice في `localStorage`
  - استرجاع البيانات عند إعادة تحميل الصفحة
  - **ملاحظة**: لا يتم حفظ `token` (لأنه غير موجود في state)

#### ج. API Services
- **الملفات**: `src/services/*.js`
- **الإعدادات المشتركة**:
  ```javascript
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',  // ✅ إرسال الكوكي مع كل طلب
  }),
  ```

#### د. Vite Proxy
- **الملف**: `vite.config.js`
- **المسؤوليات**:
  - توجيه `/api/*` إلى `http://127.0.0.1:8000`
  - تمرير الكوكي تلقائياً
  - جعل جميع الطلبات من نفس الـ origin (localhost:5173)

---

## دورة حياة المصادقة

### 1. تسجيل الدخول لأول مرة

```
┌─────────────┐
│   المستخدم  │
│  يسجل دخول  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Frontend       │
│  POST /api/auth │
│  /login         │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Backend        │
│  AuthController │
│  - التحقق        │
│  - إنشاء token  │
│  - إرسال cookie │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Response       │
│  Set-Cookie:    │
│  auth_token=... │
│  + user data    │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  المتصفح        │
│  يحفظ cookie    │
│  تلقائياً       │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Redux          │
│  - حفظ user     │
│  - isAuth=true  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Redux Persist  │
│  حفظ في         │
│  localStorage   │
└─────────────────┘
```

### 2. إعادة تحميل الصفحة (Refresh)

```
┌─────────────┐
│  المستخدم   │
│  يعمل F5    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Redux Persist  │
│  يسترجع من      │
│  localStorage   │
│  - user         │
│  - isAuth=true  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Frontend       │
│  GET /api/user  │
│  (اختياري)      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  المتصفح        │
│  يرسل cookie    │
│  تلقائياً       │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Middleware     │
│  يقرأ cookie    │
│  يضيف Auth      │
│  header         │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Sanctum        │
│  يتحقق من       │
│  token          │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Backend        │
│  يعيد user data │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Redux          │
│  يحدث user      │
│  (إذا لزم)      │
└─────────────────┘
```

### 3. طلب مصادق (مثل إضافة إلى المفضلة)

```
┌─────────────┐
│  المستخدم   │
│  يضغط زر    │
│  المفضلة    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Frontend       │
│  POST /api/     │
│  favorites      │
│  credentials:   │
│  'include'      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Vite Proxy     │
│  يمرر الطلب     │
│  + cookie       │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Backend        │
│  Middleware     │
│  يقرأ cookie    │
│  يضيف Auth      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Sanctum        │
│  يتحقق          │
│  $request->user()│
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Controller     │
│  ينفذ الطلب     │
│  بنجاح ✅       │
└─────────────────┘
```

---

## لماذا الكوكي أفضل من localStorage؟

### 1. الأمان
- ✅ **HttpOnly**: JavaScript لا يمكنه الوصول للكوكي → منع XSS
- ✅ **SameSite**: يمنع CSRF attacks
- ✅ التوكن لا يظهر في DevTools → Application → Local Storage

### 2. التلقائية
- ✅ المتصفح يرسل الكوكي تلقائياً مع كل طلب
- ✅ لا حاجة لإضافة `Authorization` header يدوياً
- ✅ يعمل حتى بعد إعادة تحميل الصفحة

### 3. الإدارة
- ✅ الباك اند يتحكم في مدة صلاحية الكوكي
- ✅ يمكن حذف الكوكي من الباك اند (logout)
- ✅ يمكن تحديث الكوكي بدون تدخل من الفرونت اند

---

## إعدادات مهمة

### 1. ملف `.env` في الباك اند

```env
SESSION_DRIVER=database
SESSION_LIFETIME=10080
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=
SESSION_SECURE_COOKIE=false
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax
```

**شرح الإعدادات:**
- `SESSION_DOMAIN=`: فارغ للعمل مع localhost
- `SESSION_SECURE_COOKIE=false`: لـ HTTP في localhost (يجب أن يكون `true` في production مع HTTPS)
- `SESSION_SAME_SITE=lax`: للعمل مع same-origin (بفضل Vite proxy)

### 2. Vite Proxy

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

**لماذا مهم:**
- يجعل جميع الطلبات من نفس الـ origin (`localhost:5173`)
- يسمح للكوكي بالعمل مع `SameSite: lax`
- يمرر الكوكي تلقائياً

---

## استكشاف الأخطاء

### المشكلة: الكوكي لا يتم إرسالها

**التحقق:**
1. افتح Developer Tools → Application → Cookies
2. تحقق من وجود `auth_token`
3. افتح Network tab → Request Headers
4. تحقق من وجود `Cookie: auth_token=...`

**الحل:**
- تأكد من `credentials: 'include'` في جميع API services
- تأكد من `supports_credentials: true` في `config/cors.php`
- أعد تشغيل الباك اند والفرونت اند

### المشكلة: 401 Unauthorized

**التحقق:**
1. افتح Network tab → Request Headers
2. تحقق من وجود `Cookie: auth_token=...`
3. افتح Console → تحقق من الأخطاء

**الحل:**
- تأكد من أن الكوكي موجودة
- تأكد من أن middleware `AuthenticateWithCookie` يعمل
- تحقق من logs الباك اند

### المشكلة: المستخدم لا يظل مسجل دخول بعد Refresh

**التحقق:**
1. افتح Developer Tools → Application → Local Storage
2. تحقق من وجود `persist:root` مع بيانات `auth`

**الحل:**
- تأكد من أن Redux Persist يعمل
- تأكد من أن `whitelist: ['auth']` موجود في `persistConfig`
- تأكد من أن `isAuthenticated` يتم تحديثه عند Login

---

## ملاحظات مهمة

1. **الكوكي vs localStorage:**
   - الكوكي: آمن، تلقائي، يتحكم فيه الباك اند
   - localStorage: غير آمن، يدوي، يتحكم فيه الفرونت اند

2. **Redux Persist:**
   - يحفظ `user` و `isAuthenticated` فقط
   - **لا يحفظ `token`** (لأنه غير موجود في state)
   - يسترجع البيانات عند إعادة تحميل الصفحة

3. **Vite Proxy:**
   - مهم جداً للعمل في localhost
   - يجعل جميع الطلبات من نفس الـ origin
   - يسمح للكوكي بالعمل بشكل صحيح

4. **Production:**
   - يجب تغيير `SESSION_SECURE_COOKIE=true` (لـ HTTPS)
   - يجب إضافة domain الإنتاج إلى `allowed_origins` في CORS
   - يجب إضافة domain الإنتاج إلى `stateful` domains في Sanctum

---

## الخلاصة

نظام المصادقة بالكوكي يعمل كالتالي:

1. **عند تسجيل الدخول**: الباك اند يرسل الكوكي → المتصفح يحفظها → Redux يحفظ بيانات المستخدم
2. **عند إعادة التحميل**: Redux Persist يسترجع البيانات → الكوكي يتم إرسالها تلقائياً → الباك اند يتحقق
3. **عند الطلبات**: الكوكي يتم إرسالها تلقائياً → Middleware يقرأها → Sanctum يتحقق → الطلب ينجح

**المزايا:**
- ✅ أمان أفضل (HttpOnly)
- ✅ تلقائي (لا حاجة لإضافة headers)
- ✅ يظل مسجل دخول بعد refresh
- ✅ سهل الإدارة من الباك اند

