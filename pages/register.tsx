import { useState } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '@/contexts/AppContext';
import { useRegistration } from '@/contexts/RegistrationContext';
import Button from '@/components/Atom/Button';
import Input from '@/components/Atom/Input';
import Card from '@/components/Atom/Card';
import Image from 'next/image';
import Link from 'next/link';
import FaceRecognition from '@/components/Pages/Register/FaceRecognition';

// Step 1: Face Scanning Component
const FaceScanStep = () => {
  const { state: regState, updateData } = useRegistration();
  const { showNotification } = useApp();

  const handleFaceDescriptors = (descriptors: any) => {
    updateData({ faceDescriptors: descriptors });
    showNotification({
      type: 'success',
      title: 'Face Captured',
      message: 'Face scan completed successfully!',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      {/* Face Scanning Area */}
      <div className="flex flex-col items-center">
        <FaceRecognition setFaceDescriptors={handleFaceDescriptors} />
      </div>

      {/* Instructions */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Face Verification
          </h2>
          <p className="text-gray-600 mb-6">
            Position your face within the guide and smile naturally. The photo
            will be captured automatically when you smile!
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Position Your Face
              </h3>
              <p className="text-sm text-gray-600">
                Center your face within the camera frame for optimal detection.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Smile Naturally</h3>
              <p className="text-sm text-gray-600">
                Give us your best smile! The system will automatically detect
                and capture it.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Auto-Capture</h3>
              <p className="text-sm text-gray-600">
                No buttons to click! The photo captures automatically when a
                good smile is detected.
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {regState.errors.face && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{regState.errors.face}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Step 2: Personal Information Component
const PersonalInfoStep = () => {
  const { state, updateData } = useRegistration();

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Personal Information
        </h2>
        <p className="text-gray-600">
          Please provide your personal details to complete registration.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={state.data.firstName}
            onChange={e => updateData({ firstName: e.target.value })}
            error={state.errors.firstName}
            required
          />
          <Input
            label="Last Name"
            value={state.data.lastName}
            onChange={e => updateData({ lastName: e.target.value })}
            error={state.errors.lastName}
            required
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          value={state.data.email}
          onChange={e => updateData({ email: e.target.value })}
          error={state.errors.email}
          required
        />

        <Input
          label="Password"
          type="password"
          value={state.data.password}
          onChange={e => updateData({ password: e.target.value })}
          error={state.errors.password}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          value={state.data.confirmPassword}
          onChange={e => updateData({ confirmPassword: e.target.value })}
          error={state.errors.confirmPassword}
          required
        />

        <div className="text-xs text-gray-500 space-y-1">
          <p>Password must contain:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>At least 8 characters</li>
            <li>Mix of letters, numbers, and symbols</li>
            <li>Both uppercase and lowercase letters</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Step 3: Verification Component
const VerificationStep = () => {
  const { state, updateData } = useRegistration();

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Terms & Verification
        </h2>
        <p className="text-gray-600">
          Please review and accept our terms to complete registration.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={state.data.agreedToTerms}
              onChange={e => updateData({ agreedToTerms: e.target.checked })}
              className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              I agree to the{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                Terms and Conditions
              </Link>
            </span>
          </label>
          {state.errors.terms && (
            <p className="text-sm text-red-600 ml-7">{state.errors.terms}</p>
          )}

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={state.data.agreedToPrivacy}
              onChange={e => updateData({ agreedToPrivacy: e.target.checked })}
              className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              I agree to the{' '}
              <Link
                href="/privacy"
                className="text-blue-600 hover:text-blue-500"
              >
                Privacy Policy
              </Link>
            </span>
          </label>
          {state.errors.privacy && (
            <p className="text-sm text-red-600 ml-7">{state.errors.privacy}</p>
          )}
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            Registration Summary
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>Name:</strong> {state.data.firstName}{' '}
              {state.data.lastName}
            </p>
            <p>
              <strong>Email:</strong> {state.data.email}
            </p>
            <p>
              <strong>Face Verification:</strong> Completed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Progress Indicator
const SimpleProgressIndicator = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => (
  <div className="flex justify-center mb-8">
    <div className="flex space-x-4">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i + 1}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            i + 1 === currentStep
              ? 'bg-blue-600 text-white'
              : i + 1 < currentStep
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-600'
          }`}
        >
          {i + 1}
        </div>
      ))}
    </div>
  </div>
);

// Main Registration Page
const RegisterPage = () => {
  const router = useRouter();
  const { state: appState } = useApp();
  const { state, nextStep, prevStep, submitRegistration } = useRegistration();

  const steps = [
    { id: 1, title: 'Face Scan', component: <FaceScanStep /> },
    { id: 2, title: 'Personal Info', component: <PersonalInfoStep /> },
    { id: 3, title: 'Verification', component: <VerificationStep /> },
  ];

  const handleNext = () => {
    nextStep();
  };

  const handlePrev = () => {
    prevStep();
  };

  const handleSubmit = async () => {
    const success = await submitRegistration();
    if (success) {
      // Registration successful, will redirect automatically
    }
  };

  if (appState.isAuthenticated) {
    router.push('/home');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Join Face Guardian for secure authentication
          </p>
        </div>

        {/* Progress Indicator */}
        <SimpleProgressIndicator
          currentStep={state.currentStep}
          totalSteps={state.totalSteps}
        />

        {/* Step Content */}
        <Card className="mb-8">
          <div className="p-8">{steps[state.currentStep - 1]?.component}</div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={state.currentStep === 1}
          >
            Previous
          </Button>

          <div className="flex space-x-3">
            <Link href="/login">
              <Button variant="ghost">Already have an account?</Button>
            </Link>

            {state.currentStep < state.totalSteps ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={state.isSubmitting}
                loading={state.isSubmitting}
              >
                {state.isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
