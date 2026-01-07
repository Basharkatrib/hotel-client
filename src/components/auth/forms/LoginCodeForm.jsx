import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { useVerifyOtpMutation } from '../../../services/api';
import { loginCodeSchema } from '../../../validation/authSchemas';

const LoginCodeForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email') || 'your email';
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const handleSubmit = async (values, { setFieldError }) => {
    try {
      const code = `${values.d1}${values.d2}${values.d3}${values.d4}`;
      const result = await verifyOtp({ email, code }).unwrap();

      if (result.status && result.data.user) {
        navigate(location.state?.backgroundLocation || '/');
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
        onClick={() => navigate('/auth/login')}
        className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-bold transition-colors"
      >
        <span className="text-lg">&larr;</span>
        <span>Back</span>
      </button>

      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Log in or sign up
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
          Enter verification code has sent{' '}
          <span className="font-bold text-gray-900 dark:text-white">{email}</span>
        </p>
      </div>

      <Formik
        initialValues={{ d1: '', d2: '', d3: '', d4: '' }}
        validationSchema={loginCodeSchema}
        onSubmit={handleSubmit}
      >
        {({ isValid, values, setFieldValue }) => (
          <Form className="space-y-6">
            <div className="flex justify-center gap-3">
              {['d1', 'd2', 'd3', 'd4'].map((name) => (
                <Field
                  key={name}
                  name={name}
                  maxLength={1}
                  autoComplete="one-time-code"
                  className="h-12 w-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-center text-lg font-bold text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                  onChange={(e) => {
                    const { value } = e.target;
                    if (/^[0-9]?$/.test(value)) {
                      setFieldValue(name, value);
                    }
                  }}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={!isValid || Object.values(values).some((v) => !v) || isLoading}
              className={`w-full rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${!isValid || Object.values(values).some((v) => !v) || isLoading
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200 dark:border-gray-700'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg active:scale-[0.98]'
                }`}
            >
              {isLoading ? 'Verifying...' : 'Verify email'}
            </button>

            <p className="text-xs text-center text-gray-500">
              Didn&apos;t receive email? Check your spam folder or request
              another code in 58 seconds
            </p>

            <button
              type="button"
              onClick={() => navigate('/auth/login')}
              className="mx-auto block text-xs font-medium text-blue-600 hover:underline"
            >
              Edit Email
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginCodeForm;


