import { useState, useRef } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { checkInputFields, registerUser } from './InputDetails/utils';
import Button from '@/components/Atom/Button';

interface VerificationStepProps {
  onPrevious: () => void;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
  };
  faceDescriptors: any;
  appId?: string;
}

const VerificationStep: React.FC<VerificationStepProps> = ({
  onPrevious,
  formData,
  faceDescriptors,
}) => {
  const [captchaToken, setCaptchaToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<
    'pending' | 'success' | 'error'
  >('pending');
  const captchaRef = useRef<any>(null);
  const supabaseClient = useSupabaseClient();
  const fpPromise = FingerprintJS.load();

  const siteKey = '10000000-ffff-ffff-ffff-000000000001';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaToken) {
      toast.error('Please complete the captcha');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare user data for registration
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        captchaToken: captchaToken,
      };

      // Validate input fields
      if (!checkInputFields(userData)) {
        setIsLoading(false);
        return;
      }

      // Register user
      await registerUser(userData, supabaseClient, fpPromise, faceDescriptors);

      setRegistrationStatus('success');
      toast.success(
        'Account created successfully! Please check your email for verification.'
      );

      // Redirect after successful registration
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationStatus('error');
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
      setCaptchaToken('');
      captchaRef?.current?.resetCaptcha();
    }
  };

  if (registrationStatus === 'success') {
    return (
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Account Created Successfully!
          </h2>
          <p className="text-gray-600">
            We&apos;ve sent a verification email to{' '}
            <strong>{formData.email}</strong>. Please check your inbox and click
            the verification link to complete your registration.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800">
            <strong>Next steps:</strong>
          </p>
          <ul className="text-sm text-green-700 mt-2 space-y-1">
            <li>• Check your email inbox (and spam folder)</li>
            <li>• Click the verification link</li>
            <li>• Start using Face Guardian</li>
          </ul>
        </div>

        <p className="text-sm text-gray-500">
          Redirecting you to the login page...
        </p>
      </div>
    );
  }

  if (registrationStatus === 'error') {
    return (
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <ExclamationCircleIcon className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Registration Failed
          </h2>
          <p className="text-gray-600">
            Something went wrong while creating your account. Please try again.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => setRegistrationStatus('pending')}
            size="lg"
            fullWidth
          >
            Try Again
          </Button>

          <Button onClick={onPrevious} variant="outline" size="lg" fullWidth>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verify Your Account
        </h2>
        <p className="text-gray-600">
          Please review your information and complete the verification to create
          your account.
        </p>
      </div>

      {/* Registration Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Registration Summary
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">
              {formData.firstName} {formData.lastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{formData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Face Recognition:</span>
            <span className="font-medium text-green-600">✓ Configured</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Terms Accepted:</span>
            <span className="font-medium text-green-600">✓ Yes</span>
          </div>
        </div>
      </div>

      {/* Captcha Verification */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center">
          <HCaptcha
            ref={captchaRef}
            sitekey={siteKey}
            onVerify={setCaptchaToken}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            disabled={isLoading}
            size="lg"
          >
            Previous
          </Button>

          <Button
            type="submit"
            loading={isLoading}
            disabled={!captchaToken}
            size="lg"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>
      </form>

      {/* Security Notice */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Security Notice:</strong> Your face biometric data is
          encrypted and stored securely. We use industry-standard security
          measures to protect your information.
        </p>
      </div>
    </div>
  );
};

export default VerificationStep;
