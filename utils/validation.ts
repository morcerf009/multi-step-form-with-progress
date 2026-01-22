
import { FormData, FormErrors } from '../types';

export const validateStep = (step: number, data: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (step === 1) {
    if (!data.fullName.trim()) errors.fullName = 'Full name is required';
    else if (data.fullName.length < 3) errors.fullName = 'Name must be at least 3 characters';
    
    if (!data.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Invalid email format';
    
    if (data.phone && !/^\+?[\d\s-]{10,}$/.test(data.phone)) {
      errors.phone = 'Invalid phone number format';
    }
  }

  if (step === 2) {
    if (!data.username.trim()) errors.username = 'Username is required';
    else if (data.username.length < 4) errors.username = 'Username must be at least 4 characters';
    
    if (!data.password) errors.password = 'Password is required';
    else if (data.password.length < 8) errors.password = 'Password must be at least 8 characters';
    
    if (data.confirmPassword !== data.password) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }

  if (step === 3) {
    if (!data.plan) errors.plan = 'Please select a plan';
  }

  return errors;
};
