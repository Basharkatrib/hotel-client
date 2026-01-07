import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRegisterMutation } from '../../../services/api';
import { registerSchema } from '../../../validation/authSchemas';
import { toast } from 'react-toastify';

const RegisterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (values, { setFieldError, setErrors }) => {
    try {
      const result = await register({
        name: values.name,
        email: values.email,
        password: values.password,
        password_confirmation: values.confirmPassword,
      }).unwrap();

      if (result.status) {
        toast.success('Registration successful. Please check your email for the verification code.', {
          toastId: 'register-success',
        });
        navigate(`/auth/verify-email?email=${encodeURIComponent(values.email)}`);
      }
    } catch (error) {
      console.log('Registration error:', error);

      if (error.data && error.data.messages && Array.isArray(error.data.messages)) {
        const errors = {};
        error.data.messages.forEach((msg) => {
          const lowerMsg = msg.toLowerCase();
          if (lowerMsg.includes('email')) {
            errors.email = msg;
          } else if (lowerMsg.includes('password')) {
            errors.password = msg;
          } else if (lowerMsg.includes('name')) {
            errors.name = msg;
          } else {
            errors.email = msg;
          }
        });
        setErrors(errors);
      } else if (error.message) {
        setFieldError('email', error.message);
      } else {
        setFieldError('email', 'An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Create your Tripto account
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium">
          Sign up to save your favourites and manage bookings.
        </p>
      </div>

      <Formik
        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
      >
        {({ isValid, dirty }) => (
          <Form className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-gray-800 dark:text-gray-200"
              >
                Full name
              </label>
              <Field
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </div>

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

            <div className="space-y-1.5 text-left">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-800 dark:text-gray-200"
              >
                Password
              </label>
              <Field
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
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
                placeholder="Repeat your password"
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
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </Form>
        )}
      </Formik>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6 font-medium">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/auth/login', { state: location.state })}
          className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;


