import * as Yup from 'yup';

export const loginEmailSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
});

export const loginCodeSchema = Yup.object({
  d1: Yup.string().length(1, 'Required'),
  d2: Yup.string().length(1, 'Required'),
  d3: Yup.string().length(1, 'Required'),
  d4: Yup.string().length(1, 'Required'),
});

export const registerSchema = Yup.object({
  name: Yup.string().min(2, 'Too short').required('Name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'At least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
});

export const resetPasswordSchema = Yup.object({
  password: Yup.string().min(6, 'At least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});


