import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserQuery, useRefreshMutation } from '../../services/api';
import { logout } from '../../store/slices/authSlice';

/**
 * مكون للتحقق من صلاحية التوكن عند تحميل التطبيق
 * إذا انتهت صلاحية التوكن، يعمل logout تلقائياً
 * 
 * يعمل كالتالي:
 * 1. عند تحميل التطبيق، يتحقق من وجود بيانات مصادقة في Redux (من localStorage)
 * 2. إذا كان هناك بيانات، يرسل طلب GET /api/user للتحقق من صلاحية التوكن
 * 3. إذا كان الخطأ 401، يعني التوكن منتهي → يعمل logout تلقائياً
 * 4. إذا نجح الطلب، يعني التوكن صالح → يحدث isAuthenticated = true
 */
const AuthChecker = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const [refresh, { isLoading: isRefreshing }] = useRefreshMutation();
  const hasRefreshed = useRef(false);

  // 1. عند تحميل التطبيق لأول مرة (أو عند عمل Refresh للصفحة)
  // نحاول الحصول على توكن جديد باستخدام الـ HttpOnly Cookie
  useEffect(() => {
    const performRefresh = async () => {
      if (!token && !hasRefreshed.current) {
        hasRefreshed.current = true;
        try {
          // محاولة تجديد التوكن صامتاً
          await refresh().unwrap();
        } catch (err) {
          // إذا فشل التجديد (لا توجد كوكي أو غير صالحة)، لا نفعل شيئاً
          // سيظل المستخدم غير مسجل دخول وهذا طبيعي
          console.log('Silent refresh skipped or failed');
        }
      }
    };

    performRefresh();
  }, [token, refresh]);

  // 2. التحقق من صلاحية المستخدم (اختياري، لأن Refresh يرجع بيانات المستخدم أيضاً)
  const { error } = useGetUserQuery(undefined, {
    skip: !isAuthenticated || !token,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (error && error.status === 401) {
      dispatch(logout());
    }
  }, [error, dispatch]);

  return null;
};

export default AuthChecker;

