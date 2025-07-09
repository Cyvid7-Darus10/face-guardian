import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  UserPlusIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

// Design system components
import ProgressIndicator from '@/components/Atom/ProgressIndicator';
import Card from '@/components/Atom/Card';
import Button from '@/components/Atom/Button';

// Step components
import FaceScanStep from '@/components/Pages/Register/FaceScanStep';
import PersonalInfoStep from '@/components/Pages/Register/PersonalInfoStep';
import VerificationStep from '@/components/Pages/Register/VerificationStep';

interface RegisterPageProps {
  appData?: {
    name: string;
    domain: string;
    id: string;
    redirectTo?: string;
  };
}

const RegisterPage = ({ appData }: RegisterPageProps) => {
  const router = useRouter();
  const { appId } = router.query;

  const [currentStep, setCurrentStep] = useState(1);
  const [faceDescriptors, setFaceDescriptors] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const steps = [
    {
      id: 1,
      title: 'Face Scan',
      description: 'Secure facial recognition setup',
    },
    {
      id: 2,
      title: 'Personal Info',
      description: 'Your account details',
    },
    {
      id: 3,
      title: 'Verification',
      description: 'Complete registration',
    },
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFaceDescriptors = (descriptors: any) => {
    setFaceDescriptors(descriptors);
  };

  const handleFormDataChange = (newData: any) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mr-4">
              <UserPlusIcon className="w-8 h-8 text-primary-600" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Create Your Account
              </h1>
              <p className="text-gray-600">
                Join Face Guardian for secure authentication
              </p>
            </div>
          </div>

          {/* App Context Banner */}
          {appData && (
            <Card className="mb-8 bg-primary-50 border-primary-200">
              <div className="flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6 text-primary-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-primary-800">
                    Creating account for
                  </p>
                  <p className="text-lg font-bold text-primary-900">
                    {appData.name}
                  </p>
                  <p className="text-sm text-primary-600">{appData.domain}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator
          steps={steps}
          currentStep={currentStep}
          className="mb-12"
        />

        {/* Step Content */}
        <Card shadow="xl" className="animate-fadeIn mb-8">
          {currentStep === 1 && (
            <FaceScanStep
              onNext={handleNextStep}
              onFaceDescriptors={handleFaceDescriptors}
              appId={(appId || appData?.id) as string}
            />
          )}

          {currentStep === 2 && (
            <PersonalInfoStep
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
              formData={formData}
              onFormDataChange={handleFormDataChange}
              appId={(appId || appData?.id) as string}
            />
          )}

          {currentStep === 3 && (
            <VerificationStep
              onPrevious={handlePreviousStep}
              formData={formData}
              faceDescriptors={faceDescriptors}
              appId={(appId || appData?.id) as string}
            />
          )}
        </Card>

        {/* Navigation Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href={appData ? `/login?appId=${appData.id}` : '/login'}
                className="text-primary-600 hover:text-primary-800 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <Link href="/">
            <Button variant="ghost" className="flex items-center">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Security Notice */}
        <Card className="mt-8 bg-gray-50 border-gray-200">
          <div className="text-center">
            <ShieldCheckIcon className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Your Privacy is Protected
            </h3>
            <p className="text-sm text-gray-600">
              Your facial biometric data is encrypted end-to-end and stored
              securely. We use industry-standard security measures to protect
              your personal information.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
