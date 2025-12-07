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
      
      if (result.status && result.data.token) {
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
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
      >
        <span className="text-lg">&larr;</span>
        <span>Back</span>
      </button>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Log in or sign up
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Enter verification code has sent{' '}
          <span className="font-medium text-gray-900">{email}</span>
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
                  className="h-12 w-12 rounded-xl border border-gray-200 text-center text-lg font-semibold text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
              className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                !isValid || Object.values(values).some((v) => !v) || isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
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


