# Hotel Booking System - Setup Guide

## Overview
نظام حجز كامل مع تكامل Stripe للدفع، يتضمن إدارة التواريخ المحجوزة ومنع الحجوزات المتداخلة.

## Backend Setup

### 1. Stripe Configuration

أضف Stripe keys في ملف `.env`:

```env
STRIPE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
STRIPE_SECRET=sk_test_YOUR_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

**للحصول على Test Keys:**
1. سجل دخول إلى [Stripe Dashboard](https://dashboard.stripe.com/test/dashboard)
2. اذهب إلى Developers > API keys
3. انسخ Publishable key و Secret key

### 2. Database Migration

قم بتشغيل migrations:

```bash
cd c:\Users\dell\Herd\hotel-server
php artisan migrate
```

هذا سينشئ جداول:
- `bookings` - لحفظ الحجوزات
- `payments` - لحفظ معلومات الدفع

### 3. Test the API

تأكد من أن السيرفر يعمل:
```bash
# إذا كنت تستخدم Herd، السيرفر يعمل تلقائياً على:
http://hotel-server.test
```

## Frontend Setup

### 1. Update Stripe Publishable Key

في ملف `src/pages/Payment/Payment.jsx`، استبدل الـ key:

```javascript
const stripePromise = loadStripe('pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY');
```

### 2. Install Dependencies (Already Done)

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js react-datepicker date-fns
```

### 3. Start Development Server

```bash
npm run dev
```

## Testing the Booking Flow

### 1. اختر فندقاً
- اذهب إلى صفحة الفندق
- اختر التواريخ من BookingCard
- اضغط "Show Rooms" للانتقال إلى قسم الغرف

### 2. اختر غرفة
- في قسم Rooms، اختر غرفة
- اضغط "Book Now"

### 3. تأكيد الحجز
- املأ معلومات الضيف
- اضغط "Proceed to Payment"

### 4. الدفع
استخدم بطاقة اختبار Stripe:
- **Card Number:** 4242 4242 4242 4242
- **Expiry:** أي تاريخ مستقبلي (مثلاً 12/34)
- **CVC:** أي 3 أرقام (مثلاً 123)
- **ZIP:** أي 5 أرقام (مثلاً 12345)

### 5. صفحة النجاح
بعد الدفع الناجح، سيتم توجيهك إلى صفحة تأكيد الحجز.

### 6. عرض الحجوزات
اذهب إلى `/my-bookings` لعرض جميع حجوزاتك.

## API Endpoints

### Public Endpoints
- `POST /api/bookings/check-availability` - التحقق من توفر غرفة

### Protected Endpoints (تحتاج Token)
- `GET /api/bookings` - قائمة حجوزات المستخدم
- `POST /api/bookings` - إنشاء حجز جديد
- `GET /api/bookings/{id}` - تفاصيل حجز
- `PUT /api/bookings/{id}/cancel` - إلغاء حجز
- `POST /api/payments/create-intent` - إنشاء Payment Intent
- `POST /api/payments/confirm` - تأكيد الدفع

### Webhook
- `POST /api/payments/webhook` - Stripe webhook

## Features Implemented

### Backend
✅ Bookings table مع جميع الحقول المطلوبة
✅ Payments table مع تكامل Stripe
✅ Room availability checking (منع الحجوزات المتداخلة)
✅ BookingController مع جميع الـ APIs
✅ PaymentController مع Stripe integration
✅ Webhook handler لتحديثات Stripe
✅ Relationships بين Models (User, Hotel, Room, Booking, Payment)

### Frontend
✅ BookingCard مع Date Picker
✅ BookingConfirmation page
✅ Payment page مع Stripe Elements
✅ PaymentSuccess page
✅ MyBookings page
✅ Redux integration للـ APIs
✅ Routes configuration

## Important Notes

### منع الحجوزات المتداخلة
النظام يتحقق تلقائياً من:
- عدم وجود حجوزات متداخلة للغرفة نفسها
- الحجوزات بحالة `pending` أو `confirmed` فقط تمنع الحجوزات الجديدة
- الحجوزات الملغاة لا تؤثر على التوفر

### حالات الحجز
- `pending` - في انتظار الدفع
- `confirmed` - تم الدفع والتأكيد
- `cancelled` - تم الإلغاء
- `completed` - انتهى (بعد Check-out)

### Test Mode
النظام يعمل في وضع الاختبار:
- استخدم فقط Test Keys من Stripe
- لا يتم خصم أموال حقيقية
- جميع المعاملات وهمية

## Troubleshooting

### مشكلة: "Room is not available"
- تأكد من عدم وجود حجوزات متداخلة
- تحقق من حالة الغرفة (`is_available` و `is_active`)

### مشكلة: "Payment failed"
- تأكد من Stripe keys الصحيحة
- تحقق من استخدام بطاقة اختبار صحيحة
- راجع console للأخطاء

### مشكلة: "Unauthorized"
- تأكد من تسجيل الدخول
- تحقق من وجود Token في localStorage
- راجع Redux state للـ auth

## Next Steps

### تحسينات مقترحة:
1. إرسال Email confirmation بعد الحجز
2. إضافة Notifications للمستخدم
3. تحسين UI/UX للـ date picker
4. إضافة Filters في MyBookings
5. تطبيق Refund logic عند الإلغاء
6. إضافة Admin panel لإدارة الحجوزات

## Support

إذا واجهت أي مشاكل:
1. تحقق من console logs (Frontend & Backend)
2. راجع Stripe Dashboard للمعاملات
3. تأكد من تشغيل migrations
4. تحقق من CORS settings

---

تم إنشاء هذا النظام بنجاح! 🎉

