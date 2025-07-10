import Image from 'next/image';
import Webcam from 'react-webcam';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useFaceRecognition } from '@/contexts/FaceRecognitionContext';
import { useApp } from '@/contexts/AppContext';
import Button from '@/components/Atom/Button';
import { useEffect } from 'react';
import FaceFunction from './FaceFunction';

const FaceRecognition = () => {
  const { showNotification } = useApp();
  const {
    webcamRef,
    capture,
    videoConstraints,
    ReplayIcon,
    faceMatcher,
    captchaToken,
    setCaptchaToken,
    isProcessing,
    smileDetected,
    smileConfidence,
    facePositioned,
    errorMessage,
    statusMessage,
    setErrorMessage,
    smilesNeeded,
    smilesLeft,
    smileCount,
    lastSmileTime,
  } = FaceFunction();

  const siteKey = '20000000-ffff-ffff-ffff-000000000002';

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    // Clear any previous error messages when captcha is verified
    setErrorMessage('');
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5 w-[400px] h-[400px] bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg shadow-lg border border-blue-200 relative">
      {/* Loading overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-50">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Processing...</span>
            {statusMessage && (
              <span className="text-xs text-gray-500 text-center max-w-xs">
                {statusMessage}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Webcam View */}
      {captchaToken && (
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

          {/* Smile Detection Overlay */}
          <div className="absolute top-2 left-2 right-2 z-20">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${facePositioned ? 'bg-green-500' : 'bg-red-500'}`}
                  ></div>
                  <span className="text-xs font-medium">
                    {facePositioned ? 'Positioned ✓' : 'Center Face'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${smileDetected ? 'bg-green-500' : 'bg-gray-400'}`}
                  ></div>
                  <span className="text-xs font-medium">
                    {smileDetected ? 'Smile ✓' : 'Smile 😊'}
                  </span>
                </div>
              </div>

              {/* Smile Progress */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-blue-600">
                    Login Progress
                  </span>
                  <span className="text-xs text-gray-600">
                    {smileCount}/{smilesNeeded} smiles
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(smileCount / smilesNeeded) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Smile Confidence Bar */}
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    smileConfidence > 0.7
                      ? 'bg-green-500'
                      : smileConfidence > 0.4
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(smileConfidence * 100, 100)}%` }}
                ></div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-600">✨ Auto-login</span>
                {smilesLeft === 0 ? (
                  <span className="text-green-600 font-medium animate-pulse">
                    📸 Authenticating!
                  </span>
                ) : (
                  <span className="text-gray-600">
                    {smilesLeft} smile{smilesLeft > 1 ? 's' : ''} needed
                  </span>
                )}
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mt-1 text-xs text-red-600 bg-red-50 border border-red-200 rounded p-1">
                  <div className="flex items-center gap-1">
                    <span className="text-red-500">⚠️</span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              {/* Status Message */}
              {statusMessage && !errorMessage && (
                <div className="mt-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded p-1">
                  <div className="flex items-center gap-1">
                    <span className="text-blue-500">ℹ️</span>
                    <span>{statusMessage}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Captcha Section */}
      {!captchaToken && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center rounded-lg z-40">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">
              Security Verification
            </h3>
            <HCaptcha sitekey={siteKey} onVerify={handleCaptchaVerify} />
            {errorMessage && (
              <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                <div className="flex items-center gap-2">
                  <span className="text-red-500">⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceRecognition;
