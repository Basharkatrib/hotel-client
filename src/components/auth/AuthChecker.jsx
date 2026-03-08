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
  const hasRefreshed = useRef(false);
  const fcmRegistered = useRef(false);

  // 1. Silent Refresh
  useEffect(() => {
    const performRefresh = async () => {
      if (!token && !hasRefreshed.current) {
        hasRefreshed.current = true;
        try {
          await refresh().unwrap();
        } catch (err) {
          console.log('Silent refresh skipped or failed');
        }
      }
    };

    performRefresh();
  }, [token, refresh]);

  // 2. التحقق من صلاحية المستخدم
  const { error } = useGetUserQuery(undefined, {
    skip: !isAuthenticated || !token,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (error && error.status === 401) {
      dispatch(logout());
      // Reset API state to clear any sensitive data from the rejected session
      dispatch(api.util.resetApiState());
      // Optionally reload to ensure a fresh app state
      window.location.reload();
    }
  }, [error, dispatch]);

  // 3. Firebase Cloud Messaging Setup
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

  // 4. Listen for Foreground Messages
  useEffect(() => {
    const unsubscribe = onMessageListener((payload) => {
      console.log('--- FCM Message Received ---', payload);

      const title = payload.notification?.title || payload.data?.title || 'New Notification';
      const body = payload.notification?.body || payload.data?.body || 'You have a new message';

      // Refetch notifications from server (invalidate cache)
      dispatch(hotelsApi.util.invalidateTags(['Notifications']));

      // Show toast
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
