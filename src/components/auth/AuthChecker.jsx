import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserQuery } from '../../services/api';
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
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const hasCheckedRef = useRef(false);

  // التحقق من صلاحية التوكن عند تحميل التطبيق
  // نتحقق إذا كان هناك بيانات مصادقة في Redux (من localStorage)
  // أو إذا كان هناك cookie موجودة (حتى لو لم يكن هناك بيانات في Redux)
  const shouldCheck = isAuthenticated || user;
  
  const { data, error } = useGetUserQuery(undefined, {
    skip: !shouldCheck, // تخطي الطلب إذا لم يكن هناك بيانات مصادقة
    refetchOnMountOrArgChange: true, // إعادة التحقق عند تحميل المكون
  });

  useEffect(() => {
    // إذا كان هناك خطأ 401 (Unauthorized)، يعني التوكن منتهي أو غير صالح
    if (error && error.status === 401) {
      // عمل logout (سيتم التعامل معه تلقائياً في authSlice أيضاً)
      dispatch(logout());
      
      // حذف البيانات من localStorage
      try {
        localStorage.removeItem('persist:root');
      } catch (err) {
        console.warn('Failed to clear localStorage:', err);
      }
    }
  }, [error, dispatch]);

  // هذا المكون لا يعرض أي شيء
  return null;
};

export default AuthChecker;

