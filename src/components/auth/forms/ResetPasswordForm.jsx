import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';
import { useResetPasswordMutation } from '../../../services/api';
import { resetPasswordSchema } from '../../../validation/authSchemas';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const resetPasswordWithCodeSchema = Yup.object().shape({
  code: Yup.string()
    .required('Verification code is required')
    .length(4, 'Code must be 4 digits'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email') || '';
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (values, { setFieldError }) => {
    try {
      const result = await resetPassword({
        email,
        code: values.code,
        password: values.password,
        password_confirmation: values.confirmPassword,
      }).unwrap();

      if (result.status) {
        // طلب CSRF cookie جديد بعد reset password
        // لأن reset password يحذف session القديم بما فيه CSRF token
        await fetch('/sanctum/csrf-cookie', {
          method: 'GET',
          credentials: 'include',
        });

        toast.success('Password has been reset successfully. You can now log in.', {
          toastId: 'reset-success',
        });
        navigate('/auth/login');
      }
    } catch (error) {
      if (error.data && error.data.messages) {
        error.data.messages.forEach((msg) => {
          if (msg.includes('code')) {
            setFieldError('code', msg);
          } else if (msg.includes('password')) {
            setFieldError('password', msg);
          } else {
            setFieldError('code', msg);
          }
        });
      } else {
        setFieldError('code', 'An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Reset your password
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium">
          Enter the code sent to{' '}
          <span className="font-bold text-gray-900 dark:text-white">{email}</span> and choose
          a new password.
        </p>
      </div>

      <Formik
        initialValues={{ code: '', password: '', confirmPassword: '' }}
        validationSchema={resetPasswordWithCodeSchema}
        onSubmit={handleSubmit}
      >
        {({ isValid, dirty }) => (
          <Form className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="code"
                className="text-sm font-semibold text-gray-800 dark:text-gray-200"
              >
                Verification code
              </label>
              <Field
                id="code"
                name="code"
                type="text"
                maxLength={4}
                placeholder="Enter 4-digit code"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              />
              <ErrorMessage
                name="code"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-800 dark:text-gray-200"
              >
                New password
              </label>
              <Field
                id="password"
                name="password"
                type="password"
                placeholder="Enter a new password"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-gray-800 dark:text-gray-200"
              >
                Confirm password
              </label>
              <Field
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repeat your new password"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={!isValid || !dirty || isLoading}
              className={`w-full rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${!isValid || !dirty || isLoading
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200 dark:border-gray-700'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg active:scale-[0.98]'
                }`}
            >
              {isLoading ? 'Resetting...' : 'Reset password'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPasswordForm;


