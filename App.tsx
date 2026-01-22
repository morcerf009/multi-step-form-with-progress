
import React, { useState, useEffect, useCallback } from 'react';
import { FormData, FormErrors, INITIAL_FORM_DATA, STEPS, PlanType } from './types';
import { validateStep } from './utils/validation';


// Components
const InputField = ({ label, name, type = 'text', value, onChange, error, placeholder }: any) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
    />
    {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
  </div>
);

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);


  // Load from LocalStorage
  useEffect(() => {
    const savedData = localStorage.getItem('prostep_form_data');
    const savedStep = localStorage.getItem('prostep_current_step');
    if (savedData) setFormData(JSON.parse(savedData));
    if (savedStep) setCurrentStep(parseInt(savedStep, 10));
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (!isSubmitted) {
      localStorage.setItem('prostep_form_data', JSON.stringify(formData));
      localStorage.setItem('prostep_current_step', currentStep.toString());
    }
  }, [formData, currentStep, isSubmitted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({ ...prev, [name]: val }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
      setErrors({});
    } else {
      setErrors(stepErrors);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalErrors = validateStep(currentStep, formData);
    if (Object.keys(finalErrors).length === 0) {
      setIsSubmitted(true);
      localStorage.removeItem('prostep_form_data');
      localStorage.removeItem('prostep_current_step');
    } else {
      setErrors(finalErrors);
    }
  };



  const progressPercentage = (currentStep / STEPS.length) * 100;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Registration Complete!</h2>
          <p className="text-gray-600 mb-8">Thank you, {formData.fullName}. Your account has been created successfully. We've sent a verification email to {formData.email}.</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start New Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">

        {/* Progress Section */}
        <div className="bg-gray-900 p-6 md:p-8 text-white">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">ProStep Account</h1>
              <p className="text-gray-400 text-sm">Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}</p>
            </div>
            <div className="hidden md:flex space-x-2">
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${currentStep === step.id ? 'bg-blue-500 ring-4 ring-blue-500/20' :
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-700'
                    }`}
                />
              ))}
            </div>
          </div>

          <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 md:p-10 flex-grow min-h-[400px]">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{STEPS[currentStep - 1].title}</h2>
            <p className="text-gray-500 text-sm">{STEPS[currentStep - 1].description}</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            {currentStep === 1 && (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <InputField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  error={errors.fullName}
                  placeholder="John Doe"
                />
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  placeholder="john@example.com"
                />
                <InputField
                  label="Phone Number (Optional)"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={errors.phone}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <InputField
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  error={errors.username}
                  placeholder="johndoe123"
                />
                <InputField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  placeholder="Minimum 8 characters"
                />
                <InputField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={errors.confirmPassword}
                  placeholder="Repeat your password"
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="animate-in slide-in-from-right-4 duration-300 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Subscription Plan</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: PlanType.FREE, name: 'Free', price: '$0', desc: 'Basic features' },
                      { id: PlanType.PRO, name: 'Pro', price: '$19', desc: 'Power tools' },
                      { id: PlanType.ENTERPRISE, name: 'Biz', price: '$99', desc: 'Team scaling' }
                    ].map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, plan: p.id }))}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${formData.plan === p.id
                          ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600/10'
                          : 'border-gray-100 hover:border-gray-200'
                          }`}
                      >
                        <p className="font-bold text-gray-900">{p.name}</p>
                        <p className="text-xl font-black text-blue-600">{p.price}</p>
                        <p className="text-xs text-gray-500">{p.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-semibold text-gray-700">Short Bio</label>

                  </div>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Tell us a bit about yourself..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>

                <label className="flex items-center space-x-3 cursor-pointer p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 font-medium">I want to receive the monthly developer newsletter</span>
                </label>
              </div>
            )}

            {currentStep === 4 && (
              <div className="animate-in slide-in-from-right-4 duration-300 space-y-4">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Name</p>
                      <p className="text-gray-900 font-medium">{formData.fullName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Email</p>
                      <p className="text-gray-900 font-medium truncate">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Username</p>
                      <p className="text-gray-900 font-medium">{formData.username}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Plan</p>
                      <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold">{formData.plan}</span>
                    </div>
                  </div>
                  {formData.bio && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Bio</p>
                      <p className="text-gray-700 text-sm italic">"{formData.bio}"</p>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 items-start">
                  <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-amber-700">Please ensure all details are correct. You can edit them later in your profile settings, but your username is permanent.</p>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Sticky Footer */}
        <div className="p-6 md:px-10 md:pb-8 bg-white border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={handleBack}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${currentStep === 1 ? 'invisible' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="flex gap-3">
            {currentStep < STEPS.length ? (
              <button
                onClick={handleNext}
                className="group flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
              >
                Next Step
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-2.5 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 shadow-lg shadow-green-500/20 active:scale-95 transition-all"
              >
                Complete Registration
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-400 text-xs font-medium">
          Secure Form &bull; Progress Automatically Saved &bull; &copy; 2026 ProStep &bull; Designed and created by MZL
        </p>
      </div>
    </div>
  );
};

export default App;
