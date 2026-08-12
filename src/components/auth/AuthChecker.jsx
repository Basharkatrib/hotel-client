import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserQuery, useRefreshMutation, useUpdateFcmTokenMutation, api } from '../../services/api';
import { logout } from '../../store/slices/authSlice';
import { requestForToken, onMessageListener } from '../../services/firebase';
import { hotelsApi } from '../../services/hotelsApi';
import { toast } from 'react-toastify';


const AuthChecker = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const [refresh] = useRefreshMutation();
  const [updateFcmToken] = useUpdateFcmTokenMutation();
  const fcmRegistered = useRef(false);

  // ─────────────────────────────────────────────────────────────
  // 1. Silent Refresh – يعمل عند بدء التطبيق وكل 50 دقيقة
  //    التوكن مدته 60 دقيقة، نجدد بـ 10 دقائق قبل انتهائه
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const REFRESH_INTERVAL_MS = 50 * 60 * 1000; // 50 دقيقة

    const performRefresh = async () => {
      try {
        await refresh().unwrap();
        console.log('[AuthChecker] Token refreshed successfully.');
      } catch (err) {
        console.log('[AuthChecker] Silent refresh failed:', err?.status);
        // إذا فشل التجديد بـ 401 فالـ refresh_token cookie انتهى → خروج
        if (err?.status === 401 || err?.status === 403) {
          dispatch(logout());
          dispatch(api.util.resetApiState());
        }
      }
    };

    // نُجدد فوراً إذا كانت هناك جلسة نشطة (cookie موجود)
    // سواء كان token موجود في Redux أم لا
    performRefresh();

    // ثم نُكرر كل 50 دقيقة ما دام المستخدم في الصفحة
    const intervalId = setInterval(performRefresh, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // يعمل مرة واحدة عند mount وينظف نفسه عند unmount

  // ─────────────────────────────────────────────────────────────
  // 2. التحقق من صلاحية المستخدم (يعمل فقط إذا كان مسجلاً)
  // ─────────────────────────────────────────────────────────────
  const { error } = useGetUserQuery(undefined, {
    skip: !isAuthenticated || !token,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (error && error.status === 401) {
      // الـ interceptor في api.js سيحاول التجديد أولاً
      // إذا وصل الخطأ هنا فالتجديد فشل → خروج
      dispatch(logout());
      dispatch(api.util.resetApiState());
    }
  }, [error, dispatch]);

  // ─────────────────────────────────────────────────────────────
  // 3. Firebase Cloud Messaging Setup
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated && !fcmRegistered.current) {
      if (!('Notification' in window)) {
        console.warn('This browser does not support desktop notification');
        return;
      }

      const setupFCM = async () => {
        try {
          const currentToken = await requestForToken();
          if (currentToken) {
            await updateFcmToken({ fcm_token: currentToken }).unwrap();
            fcmRegistered.current = true;
            console.log('FCM Token registered successfully');
          }
        } catch (err) {
          console.error('FCM Setup Error:', err);
        }
      };
      setupFCM();
    }
  }, [isAuthenticated, updateFcmToken]);

  // ─────────────────────────────────────────────────────────────
  // 4. Listen for Foreground Messages
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onMessageListener((payload) => {
      console.log('--- FCM Message Received ---', payload);

      const title = payload.notification?.title || payload.data?.title || 'New Notification';
      const body = payload.notification?.body || payload.data?.body || 'You have a new message';

      dispatch(hotelsApi.util.invalidateTags(['Notifications']));

      toast.info(
        <div>
          <p className="font-bold">{title}</p>
          <p className="text-sm">{body}</p>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch]);

  return null;
};

export default AuthChecker;
