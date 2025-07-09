import { useState } from 'react';
import {
  CameraIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import Button from '@/components/Atom/Button';
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
    'Position your face in the frame'
  );
  const [faceDescriptors, setFaceDescriptors] = useState(null);

  const handleFaceDescriptors = (descriptors: any) => {
    setFaceDescriptors(descriptors);
    onFaceDescriptors(descriptors);
    setScanStatus('success');
    setInstructions('Face scan successful! You can proceed to the next step.');
  };

  const handleStartScan = () => {
    setScanStatus('scanning');
    setInstructions('Please look directly at the camera...');
  };

  const handleError = () => {
    setScanStatus('error');
    setInstructions('Face scan failed. Please try again.');
  };

  return (
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Face Verification
      </h2>
      <p className="text-gray-600 mb-8">
        We&apos;ll scan your face to ensure account security. This helps prevent
        unauthorized access.
      </p>

      {/* Face Scanning Area */}
      <div className="relative inline-block mb-6">
        <div className="w-80 h-80 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center relative overflow-hidden">
          {scanStatus === 'ready' && (
            <div className="absolute inset-4 rounded-xl border-2 border-dashed border-primary-400 flex items-center justify-center">
              <div className="text-center">
                <CameraIcon className="w-16 h-16 mx-auto text-primary-500 mb-4" />
                <p className="text-primary-700 font-medium">
                  Click to start scanning
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

        {/* Scan Overlay */}
        {scanStatus === 'scanning' && (
          <div className="absolute inset-0 rounded-2xl border-4 border-primary-500 animate-pulse">
            <div className="absolute top-4 left-4 right-4 bottom-4 rounded-lg border-2 border-dashed border-primary-400 animate-pulse" />
          </div>
        )}
      </div>

      {/* Status Messages */}
      <div className="mb-6">
        <div
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            scanStatus === 'success'
              ? 'bg-green-100 text-green-800'
              : scanStatus === 'error'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
          }`}
        >
          {scanStatus === 'success' && (
            <CheckCircleIcon className="w-5 h-5 mr-2" />
          )}
          {scanStatus === 'error' && <XCircleIcon className="w-5 h-5 mr-2" />}
          {scanStatus === 'scanning' && (
            <div className="w-5 h-5 mr-2 animate-spin border-2 border-blue-600 border-t-transparent rounded-full" />
          )}
          {instructions}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Tips for best results:
        </h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Ensure good lighting on your face</li>
          <li>• Look directly at the camera</li>
          <li>• Keep your face centered in the frame</li>
          <li>• Remove glasses if possible</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        {scanStatus === 'ready' && (
          <Button onClick={handleStartScan} size="lg">
            Start Face Scan
          </Button>
        )}

        {scanStatus === 'scanning' && (
          <Button disabled loading size="lg">
            Scanning...
          </Button>
        )}

        {scanStatus === 'success' && (
          <Button onClick={onNext} variant="primary" size="lg">
            Continue
          </Button>
        )}

        {scanStatus === 'error' && (
          <Button
            onClick={() => setScanStatus('ready')}
            variant="secondary"
            size="lg"
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default FaceScanStep;
