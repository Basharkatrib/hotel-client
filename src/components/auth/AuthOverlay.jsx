import React from 'react';
import { useLocation } from 'react-router-dom';
import AuthModal from './AuthModal';

const AuthOverlay = () => {
  const location = useLocation();
  const { pathname } = location;

  if (!pathname.startsWith('/auth')) return null;

  let variant = 'login';

  if (pathname.startsWith('/auth/register')) {
    variant = 'register';
  } else if (pathname.startsWith('/auth/forgot-password')) {
    variant = 'forgot';
  } else if (pathname.startsWith('/auth/reset-password')) {
    variant = 'reset';
  } else if (pathname.startsWith('/auth/verify-email')) {
    variant = 'verify-email';
  } else if (pathname.startsWith('/auth/login/verify')) {
    variant = 'login-verify';
  }

  return <AuthModal variant={variant} />;
};

export default AuthOverlay;


