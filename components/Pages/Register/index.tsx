import { useState } from 'react';
import { useRouter } from 'next/router';

// Design system components
import ProgressIndicator from '@/components/Atom/ProgressIndicator';
import Card from '@/components/Atom/Card';

// Step components
import FaceScanStep from './FaceScanStep';
import PersonalInfoStep from './PersonalInfoStep';
import VerificationStep from './VerificationStep';

const RegisterPage = () => {
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
      description: 'Scan your face for verification',
    },
    { id: 2, title: 'Personal Info', description: 'Enter your details' },
    { id: 3, title: 'Verification', description: 'Confirm your account' },
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Indicator */}
        <ProgressIndicator
          steps={steps}
          currentStep={currentStep}
          className="mb-8"
        />

        {/* Step Content */}
        <Card shadow="xl" className="animate-fadeIn">
          {currentStep === 1 && (
            <FaceScanStep
              onNext={handleNextStep}
              onFaceDescriptors={handleFaceDescriptors}
              appId={appId as string}
            />
          )}

          {currentStep === 2 && (
            <PersonalInfoStep
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
              formData={formData}
              onFormDataChange={handleFormDataChange}
              appId={appId as string}
            />
          )}

          {currentStep === 3 && (
            <VerificationStep
              onPrevious={handlePreviousStep}
              formData={formData}
              faceDescriptors={faceDescriptors}
              appId={appId as string}
            />
          )}
        </Card>

        {/* Navigation Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a
              href={appId ? `/login?appId=${appId}` : '/login'}
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
