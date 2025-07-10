import Image from 'next/image';
import Webcam from 'react-webcam';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useFaceRecognition } from '@/contexts/FaceRecognitionContext';
import { useApp } from '@/contexts/AppContext';
import Button from '@/components/Atom/Button';
import { useEffect } from 'react';

const FaceRecognition = () => {
  const { state, webcamRef, captureImage, retakePhoto, dispatch } =
    useFaceRecognition();
  const { showNotification } = useApp();

  const siteKey = '20000000-ffff-ffff-ffff-000000000002';

  const videoConstraints = {
    width: 480,
    height: 480,
    facingMode: 'user',
  };

  const handleCapture = async () => {
    const imageSrc = await captureImage();
    if (imageSrc) {
      // Process face descriptors here
      // This would integrate with face-api.js in a real implementation
      showNotification({
        type: 'success',
        title: 'Face Captured',
        message: 'Processing your face data...',
      });
    }
  };

  const handleCaptchaVerify = (token: string) => {
    dispatch({ type: 'SET_CAPTCHA_TOKEN', payload: token });
  };

  useEffect(() => {
    // Auto-capture when webcam is ready and captcha is verified
    if (webcamRef.current && state.captchaToken && !state.imageURL) {
      handleCapture();
    }
  }, [state.captchaToken, webcamRef.current]);

  return (
    <div className="flex flex-col items-center justify-center gap-5 w-[400px] h-[400px] bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg shadow-lg border border-blue-200 relative">
      {/* Loading overlay */}
      {state.isProcessing && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-50">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Processing...</span>
          </div>
        </div>
      )}

      {/* Webcam View */}
      {!state.imageURL && state.captchaToken && (
        <>
          <Webcam
            audio={false}
            height={480}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={480}
            videoConstraints={videoConstraints}
            mirrored={true}
            className="rounded-lg"
          />
          <Image
            src="/face-guide.png"
            width={480}
            height={480}
            alt="Face alignment guide"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] opacity-60 pointer-events-none z-10"
          />
        </>
      )}

      {/* Captured Image View */}
      {state.imageURL && state.captchaToken && (
        <>
          <Image
            src={state.imageURL}
            width={480}
            height={480}
            alt="Captured face"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] border-4 border-blue-500 rounded-lg object-cover"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={retakePhoto}
            className="absolute bottom-4 bg-white/90 hover:bg-white shadow-lg z-20 flex items-center"
            disabled={state.isProcessing}
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Retake Photo
          </Button>
        </>
      )}

      {/* Captcha */}
      {!state.captchaToken && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Verify to Continue
            </h3>
            <p className="text-sm text-gray-600">
              Please complete the verification below
            </p>
          </div>
          <HCaptcha
            sitekey={siteKey}
            onVerify={handleCaptchaVerify}
            theme="light"
          />
        </div>
      )}

      {/* Error Message */}
      {state.error && (
        <div className="absolute bottom-4 left-4 right-4 bg-red-50 border border-red-200 rounded-lg p-3 z-20">
          <p className="text-sm text-red-600 text-center">{state.error}</p>
        </div>
      )}
    </div>
  );
};

export default FaceRecognition;
