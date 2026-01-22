
export enum PlanType {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

export interface FormData {
  // Step 1: Personal
  fullName: string;
  email: string;
  phone: string;
  
  // Step 2: Account
  username: string;
  // Fix: changed from literal type '' to string to avoid type 'never' in validation
  password: string;
  confirmPassword: string;
  
  // Step 3: Preferences
  plan: PlanType;
  newsletter: boolean;
  bio: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface Step {
  id: number;
  title: string;
  description: string;
}

export const STEPS: Step[] = [
  { id: 1, title: 'Personal Info', description: 'Tell us about yourself' },
  { id: 2, title: 'Account Setup', description: 'Secure your account' },
  { id: 3, title: 'Preferences', description: 'Customize your experience' },
  { id: 4, title: 'Review', description: 'Check your details' }
];

export const INITIAL_FORM_DATA: FormData = {
  fullName: '',
  email: '',
  phone: '',
  username: '',
  password: '',
  confirmPassword: '',
  plan: PlanType.FREE,
  newsletter: false,
  bio: ''
};