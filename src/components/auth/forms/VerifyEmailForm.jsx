import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { useVerifyEmailMutation, useResendOtpMutation } from '../../../services/api';
import { loginCodeSchema } from '../../../validation/authSchemas';
import { toast } from 'react-toastify';

const VerifyEmailForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email') || 'your email';
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const [resendMessage, setResendMessage] = useState('');

  const handleSubmit = async (values, { setFieldError }) => {
    try {
      const code = `${values.d1}${values.d2}${values.d3}${values.d4}`;
      const result = await verifyEmail({ email, code }).unwrap();

      if (result.status) {
        // طلب CSRF cookie جديد بعد verify email
        // للتأكد من وجود CSRF token صالح عند تسجيل الدخول
        await fetch('/sanctum/csrf-cookie', {
          method: 'GET',
          credentials: 'include',
        });

        toast.success('Email verified successfully. Please log in.', {
          toastId: 'verify-email-success',
        });
        navigate('/auth/login');
      }
    } catch (error) {
      if (error.data && error.data.messages) {
        setFieldError('d1', error.data.messages[0]);
      } else {
        setFieldError('d1', 'Invalid or expired code.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate('/auth/register')}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
      >
        <span className="text-lg">&larr;</span>
        <span>Back</span>
      </button>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Verify your email
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Enter verification code sent to{' '}
          <span className="font-medium text-gray-900">{email}</span>
        </p>
      </div>

      <Formik
        initialValues={{ d1: '', d2: '', d3: '', d4: '' }}
        validationSchema={loginCodeSchema}
        onSubmit={handleSubmit}
      >
        {({ isValid, values, setFieldValue, errors }) => (
          <Form className="space-y-6">
            {errors.d1 && (
              <div className="text-xs text-red-500 text-center">{errors.d1}</div>
            )}
            
            <div className="flex justify-center gap-3">
              {['d1', 'd2', 'd3', 'd4'].map((name, index) => (
                <Field
                  key={name}
                  name={name}
                  maxLength={1}
                  autoComplete="one-time-code"
                  className="h-12 w-12 rounded-xl border border-gray-200 text-center text-lg font-semibold text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => {
                    const { value } = e.target;
                    if (/^[0-9]?$/.test(value)) {
                      setFieldValue(name, value);
                      if (value && index < 3) {
                        const nextInput = document.querySelector(
                          `input[name="d${index + 2}"]`
                        );
                        if (nextInput) nextInput.focus();
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !values[name] && index > 0) {
                      const prevInput = document.querySelector(
                        `input[name="d${index}"]`
                      );
                      if (prevInput) prevInput.focus();
                    }
                  }}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={!isValid || Object.values(values).some((v) => !v) || isLoading}
              className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                !isValid || Object.values(values).some((v) => !v) || isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Verifying...' : 'Verify email'}
            </button>

            <div className="text-center text-xs text-gray-500">
              {resendMessage && (
                <div className="mb-2 text-green-600 font-medium">{resendMessage}</div>
              )}
              Didn't receive email? Check your spam folder or{' '}
              <button
                type="button"
                disabled={isResending}
                className="text-blue-600 hover:underline font-medium disabled:opacity-50"
                onClick={async () => {
                  try {
                    const result = await resendOtp({
                      email,
                      type: 'verify_email',
                    }).unwrap();
                    if (result.status) {
                      setResendMessage('Code resent successfully!');
                      toast.success('Verification code resent to your email.', {
                        toastId: 'resend-verify-email-success',
                      });
                      setTimeout(() => setResendMessage(''), 3000);
                    }
                  } catch (error) {
                    setResendMessage('Failed to resend code.');
                    toast.error('Failed to resend verification code.', {
                      toastId: 'resend-verify-email-error',
                    });
                    setTimeout(() => setResendMessage(''), 3000);
                  }
                }}
              >
                {isResending ? 'Sending...' : 'request another code'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default VerifyEmailForm;

