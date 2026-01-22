import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
import { useLoginMutation } from "../../../services/api";
import * as Yup from "yup";
import { toast } from "react-toastify";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginEmailForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (values, { setFieldError }) => {
    try {
      const result = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      if (result.status && result.data.user) {
        toast.success("Logged in successfully. Welcome back!", {
          toastId: "login-success",
        });
        navigate(location.state?.backgroundLocation || "/");
      }
    } catch (error) {
      if (error.data && error.data.data?.needs_verification) {
        navigate(
          `/auth/verify-email?email=${encodeURIComponent(values.email)}`
        );
      } else if (error.data && error.data.messages) {
        setFieldError("password", error.data.messages[0]);
      } else {
        setFieldError("password", "An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Welcome to Vayka
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium">
          Log in or sign up to continue.
        </p>
      </div>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
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

            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-800 dark:text-gray-200"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() =>
                    navigate("/auth/forgot-password", {
                      state: {
                        backgroundLocation:
                          location.state?.backgroundLocation || location,
                      },
                    })
                  }
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <Field
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={!isValid || !dirty || isLoading}
              className={`w-full rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${!isValid || !dirty || isLoading
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200 dark:border-gray-700"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg active:scale-[0.98]"
                }`}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </Form>
        )}
      </Formik>

      <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest">
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        <span>or</span>
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>

      <div className="space-y-3">
        <button
          type="button"
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-card px-4 py-2.5 text-sm font-bold text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-md active:scale-[0.98]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400 font-medium">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() =>
            navigate("/auth/register", {
              state: {
                backgroundLocation:
                  location.state?.backgroundLocation || location,
              },
            })
          }
          className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default LoginEmailForm;
