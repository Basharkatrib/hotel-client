import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useForgotPasswordMutation } from '../../../services/api';
import { forgotPasswordSchema } from '../../../validation/authSchemas';
import { toast } from 'react-toastify';

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (values, { setFieldError }) => {
    try {
      const result = await forgotPassword({ email: values.email }).unwrap();

      if (result.status) {
        toast.success('Reset code sent to your email.', {
          toastId: 'forgot-success',
        });
        navigate(`/auth/reset-password?email=${encodeURIComponent(values.email)}`);
      }
    } catch (error) {
      if (error.data && error.data.messages) {
        setFieldError('email', error.data.messages[0]);
      } else {
        setFieldError('email', 'An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Forgot your password?
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium">
          Enter your email address and we&apos;ll send you a reset code.
        </p>
      </div>

      <Formik
        initialValues={{ email: '' }}
        validationSchema={forgotPasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ isValid, dirty }) => (
          <Form className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-gray-800 dark:text-gray-200"
              >
                Email address
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              />
              <ErrorMessage
                name="email"
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
              {isLoading ? 'Sending...' : 'Send reset code'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPasswordForm;


