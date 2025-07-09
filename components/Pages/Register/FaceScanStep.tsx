import { useState } from 'react';
import {
  CameraIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import Button from '@/components/Atom/Button';
import Card from '@/components/Atom/Card';
import FaceRecognition from './FaceRecognition';

interface FaceScanStepProps {
  onNext: () => void;
  onFaceDescriptors: (descriptors: any) => void;
  appId?: string;
}

const FaceScanStep: React.FC<FaceScanStepProps> = ({
  onNext,
  onFaceDescriptors,
}) => {
  const [scanStatus, setScanStatus] = useState('ready'); // ready, scanning, success, error
  const [instructions, setInstructions] = useState(
    'Position your face in the center of the frame'
  );
  const [faceDescriptors, setFaceDescriptors] = useState(null);

  const handleFaceDescriptors = (descriptors: any) => {
    setFaceDescriptors(descriptors);
    onFaceDescriptors(descriptors);
    setScanStatus('success');
    setInstructions(
      'Face scan completed successfully! You can proceed to the next step.'
    );
  };

  const handleStartScan = () => {
    setScanStatus('scanning');
    setInstructions('Please look directly at the camera and remain still...');
  };

  const handleError = () => {
    setScanStatus('error');
    setInstructions(
      'Face scan failed. Please ensure good lighting and try again.'
    );
  };

  const getStatusIcon = () => {
    switch (scanStatus) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
      case 'error':
        return <XCircleIcon className="w-6 h-6 text-red-600" />;
      case 'scanning':
        return (
          <div className="w-6 h-6 animate-spin border-2 border-blue-600 border-t-transparent rounded-full" />
        );
      default:
        return <InformationCircleIcon className="w-6 h-6 text-blue-600" />;
    }
  };

  const getStatusColor = () => {
    switch (scanStatus) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'scanning':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="text-center max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Face Recognition Setup
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We&apos;ll securely scan your face to create your unique biometric
          profile. This ensures only you can access your account.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Face Scanning Area */}
        <div className="order-2 lg:order-1">
          <div className="relative inline-block">
            <div className="w-96 h-96 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center relative overflow-hidden shadow-lg">
              {scanStatus === 'ready' && (
                <div className="absolute inset-6 rounded-xl border-2 border-dashed border-primary-400 flex items-center justify-center">
                  <div className="text-center">
                    <CameraIcon className="w-20 h-20 mx-auto text-primary-500 mb-6" />
                    <p className="text-primary-700 font-medium text-lg">
                      Click to start scanning
                    </p>
                    <p className="text-primary-600 text-sm mt-2">
                      Ensure good lighting
                    </p>
                  </div>
                </div>
              )}

              {(scanStatus === 'scanning' || scanStatus === 'success') && (
                <div className="w-full h-full">
                  <FaceRecognition setFaceDescriptors={handleFaceDescriptors} />
                </div>
              )}
            </div>

            {/* Scan Overlay Effects */}
            {scanStatus === 'scanning' && (
              <>
                <div className="absolute inset-0 rounded-2xl border-4 border-primary-500 animate-pulse">
                  <div className="absolute top-6 left-6 right-6 bottom-6 rounded-lg border-2 border-dashed border-primary-400 animate-pulse" />
                </div>
                {/* Corner indicators */}
                <div className="absolute top-8 left-8 w-8 h-8 border-l-4 border-t-4 border-primary-500 animate-pulse"></div>
                <div className="absolute top-8 right-8 w-8 h-8 border-r-4 border-t-4 border-primary-500 animate-pulse"></div>
                <div className="absolute bottom-8 left-8 w-8 h-8 border-l-4 border-b-4 border-primary-500 animate-pulse"></div>
                <div className="absolute bottom-8 right-8 w-8 h-8 border-r-4 border-b-4 border-primary-500 animate-pulse"></div>
              </>
            )}

            {scanStatus === 'success' && (
              <div className="absolute inset-0 rounded-2xl border-4 border-green-500">
                <div className="absolute top-6 left-6 right-6 bottom-6 rounded-lg border-2 border-solid border-green-400" />
              </div>
            )}
          </div>
        </div>

        {/* Instructions and Controls */}
        <div className="order-1 lg:order-2 text-left">
          {/* Status Message */}
          <Card className={`mb-8 border ${getStatusColor()}`}>
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3">{getStatusIcon()}</div>
              <div>
                <p className="font-medium text-sm">{instructions}</p>
              </div>
            </div>
          </Card>

          {/* Tips Section */}
          <Card className="mb-8 bg-gray-50 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-amber-500" />
              Tips for Best Results
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Ensure good, even lighting on your face
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Look directly at the camera
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Keep your face centered in the frame
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Remove glasses or hats if possible
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Stay still during the scanning process
              </li>
            </ul>
          </Card>

          {/* Security Notice */}
          <Card className="mb-8 bg-green-50 border-green-200">
            <div className="flex items-start">
              <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900 mb-1">
                  Privacy & Security
                </h4>
                <p className="text-sm text-green-700">
                  Your biometric data is encrypted and processed locally. We
                  never store raw facial images.
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4">
            {scanStatus === 'ready' && (
              <Button
                onClick={handleStartScan}
                size="lg"
                fullWidth
                className="bg-primary-600 hover:bg-primary-700"
              >
                <CameraIcon className="w-5 h-5 mr-2" />
                Start Face Scan
              </Button>
            )}

            {scanStatus === 'scanning' && (
              <Button disabled loading size="lg" fullWidth>
                Scanning Your Face...
              </Button>
            )}

            {scanStatus === 'success' && (
              <Button
                onClick={onNext}
                variant="primary"
                size="lg"
                fullWidth
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Continue to Next Step
              </Button>
            )}

            {scanStatus === 'error' && (
              <Button
                onClick={() => {
                  setScanStatus('ready');
                  setInstructions(
                    'Position your face in the center of the frame'
                  );
                }}
                variant="secondary"
                size="lg"
                fullWidth
              >
                <XCircleIcon className="w-5 h-5 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceScanStep;
