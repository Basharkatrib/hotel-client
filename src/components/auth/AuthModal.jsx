import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LoginEmailForm from './forms/LoginEmailForm';
import LoginCodeForm from './forms/LoginCodeForm';
import RegisterForm from './forms/RegisterForm';
import ForgotPasswordForm from './forms/ForgotPasswordForm';
import ResetPasswordForm from './forms/ResetPasswordForm';
import VerifyEmailInfo from './forms/VerifyEmailInfo';
import VerifyEmailForm from './forms/VerifyEmailForm';

const AuthModal = ({ variant }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const backgroundLocation =
    location.state && location.state.backgroundLocation
      ? location.state.backgroundLocation
      : { pathname: '/' };

  const handleClose = () => {
    navigate(backgroundLocation);
  };

  let title = 'Log in or sign up';
  if (variant === 'register') title = 'Create your account';
  if (variant === 'forgot') title = 'Forgot password';
  if (variant === 'reset') title = 'Reset password';
  if (variant === 'verify') title = 'Verify your email';
  if (variant === 'verify-email') title = 'Verify your email';

  const renderContent = () => {
    switch (variant) {
      case 'register':
        return <RegisterForm />;
      case 'forgot':
        return <ForgotPasswordForm />;
      case 'reset':
        return <ResetPasswordForm />;
      case 'verify':
        return <VerifyEmailInfo />;
      case 'verify-email':
        return <VerifyEmailForm />;
      case 'login-verify':
        return <LoginCodeForm />;
      case 'login':
      default:
        return <LoginEmailForm />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative mx-4 w-full max-w-lg rounded-3xl bg-white shadow-2xl flex flex-col max-h-[90vh]"
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
            <h2 className="w-full text-center text-sm font-semibold text-gray-900">
              {title}
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close"
            >
              <span className="text-xl">&times;</span>
            </button>
          </div>

          {/* Body */}
          <div className="px-8 pt-6 pb-8 overflow-y-auto overscroll-contain">
            {renderContent()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;


