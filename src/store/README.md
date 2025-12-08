# Redux Store Documentation

## الهيكلية

```
src/
├── services/
│   └── api.js              # RTK Query API endpoints
├── store/
│   ├── slices/
│   │   └── authSlice.js    # Auth state management
│   └── store.js            # Redux store configuration
```

## استخدام API Hooks

### 1. Register (التسجيل)

```javascript
import { useRegisterMutation } from '../services/api';

const RegisterForm = () => {
  const [register, { isLoading, error }] = useRegisterMutation();

  const handleSubmit = async (values) => {
    try {
      const result = await register({
        name: values.name,
        email: values.email,
        password: values.password,
        password_confirmation: values.passwordConfirmation
      }).unwrap();
      
      if (result.status) {
        // نجح التسجيل، انتقل لصفحة التحقق
        console.log(result.messages);
      }
    } catch (err) {
      console.error('Registration failed:', err.data.messages);
    }
  };
};
```

### 2. Verify Email (تأكيد الإيميل)

```javascript
import { useVerifyEmailMutation } from '../services/api';

const VerifyEmailForm = () => {
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  const handleVerify = async (email, code) => {
    try {
      const result = await verifyEmail({ email, code }).unwrap();
      
      if (result.status) {
        // تم التحقق بنجاح
        console.log('Email verified!');
      }
    } catch (err) {
      console.error(err.data.messages);
    }
  };
};
```

### 3. Login (تسجيل الدخول بالباسورد)

```javascript
import { useLoginMutation } from '../services/api';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '../store/slices/authSlice';

const LoginForm = () => {
  const [login, { isLoading }] = useLoginMutation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  const handleLogin = async (email, password) => {
    try {
      const result = await login({ email, password }).unwrap();
      
      if (result.status) {
        // تم تسجيل الدخول، الـ token محفوظ تلقائياً في الـ state
        console.log('Logged in:', result.data.user);
      }
    } catch (err) {
      console.error(err.data.messages);
    }
  };
};
```

### 4. Login بالـ OTP (إرسال + تحقق)

```javascript
import { useSendOtpMutation, useVerifyOtpMutation } from '../services/api';

// إرسال OTP
const [sendOtp] = useSendOtpMutation();
await sendOtp({ email: 'user@example.com' }).unwrap();

// التحقق من OTP
const [verifyOtp] = useVerifyOtpMutation();
const result = await verifyOtp({ 
  email: 'user@example.com', 
  code: '1234' 
}).unwrap();
```

### 5. Forgot Password (نسيت كلمة المرور)

```javascript
import { useForgotPasswordMutation } from '../services/api';

const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

const handleForgot = async (email) => {
  try {
    const result = await forgotPassword({ email }).unwrap();
    console.log(result.messages); // "Password reset code has been sent..."
  } catch (err) {
    console.error(err.data.messages);
  }
};
```

### 6. Reset Password (إعادة تعيين كلمة المرور)

```javascript
import { useResetPasswordMutation } from '../services/api';

const [resetPassword, { isLoading }] = useResetPasswordMutation();

const handleReset = async (values) => {
  try {
    const result = await resetPassword({
      email: values.email,
      code: values.code,
      password: values.password,
      password_confirmation: values.passwordConfirmation
    }).unwrap();
    
    console.log('Password reset successfully!');
  } catch (err) {
    console.error(err.data.messages);
  }
};
```

### 7. Get Current User (الحصول على بيانات المستخدم)

```javascript
import { useGetUserQuery } from '../services/api';

const Profile = () => {
  const { data, isLoading, error } = useGetUserQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user</div>;

  return (
    <div>
      <h1>{data.data.user.name}</h1>
      <p>{data.data.user.email}</p>
    </div>
  );
};
```

### 8. Logout (تسجيل الخروج)

```javascript
import { useLogoutMutation } from '../services/api';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '../store/slices/authSlice';

const LogoutButton = () => {
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      // الـ state يتم تنظيفه تلقائياً عبر extraReducers
    } catch (err) {
      // في حالة فشل الـ API، نظف الـ state يدوياً
      dispatch(logoutAction());
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};
```

## استخدام Auth State

```javascript
import { useSelector } from 'react-redux';
import { 
  selectCurrentUser, 
  selectToken, 
  selectIsAuthenticated 
} from '../store/slices/authSlice';

const Component = () => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.name}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
};
```

## Redux Persist

الـ auth state يتم حفظه تلقائياً في `localStorage` عبر Redux Persist.

عند إعادة تحميل الصفحة، سيتم استرجاع:
- `user`
- `token`
- `isAuthenticated`

لحذف البيانات المحفوظة:
```javascript
import { persistor } from '../store/store';

// حذف كل البيانات المحفوظة
persistor.purge();
```

## معالجة الأخطاء

جميع الـ API responses تتبع نفس الشكل:

```json
{
  "status": true|false,
  "data": {...},
  "messages": ["message1", "message2"],
  "code": 200
}
```

عند حدوث خطأ:

```javascript
try {
  const result = await apiCall().unwrap();
} catch (error) {
  // error.data.status === false
  // error.data.messages === ["Error message 1", "Error message 2"]
  // error.data.code === 422 (or 401, 404, etc.)
}
```





<<<<<<< HEAD


=======
>>>>>>> origin/j-branch
