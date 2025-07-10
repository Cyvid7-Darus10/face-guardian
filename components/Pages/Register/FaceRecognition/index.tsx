import Image from 'next/image';
import Webcam from 'react-webcam';
import FaceFunction from './FaceFunction';

const FaceRecognition = ({
  setFaceDescriptors,
  onNext,
}: {
  setFaceDescriptors: any;
  onNext?: () => void;
}) => {
  const {
    webcamRef,
    imageURL,
    capture,
    videoConstraints,
    ReplayIcon,
    faceMatcher,
    setImageURL,
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
    isCapturing,
    cameraActive,
    captureComplete,
  } = FaceFunction({ setFaceDescriptors, onNext });

  const handleRetake = () => {
    setImageURL(null);
    setErrorMessage('');
    if (faceMatcher) {
      capture(faceMatcher);
    }
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
      {!imageURL && cameraActive && (
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

              {/* Registration Progress */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-purple-600">
                    Registration Progress
                  </span>
                  <span className="text-xs text-gray-600">
                    {smileCount}/{smilesNeeded} smiles
                  </span>
                </div>
                <div className="w-full bg-purple-100 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
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
                <span className="text-purple-600">💡 Registration</span>
                {smilesLeft === 0 ? (
                  <span className="text-green-600 font-medium animate-pulse">
                    🎉 Capturing now!
                  </span>
                ) : smileDetected && facePositioned ? (
                  <span className="text-green-600 font-medium animate-pulse">
                    📸 Keep smiling! {smilesLeft} left
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
              {statusMessage && !errorMessage && !captureComplete && (
                <div className="mt-1 text-xs text-purple-600 bg-purple-50 border border-purple-200 rounded p-1">
                  <div className="flex items-center gap-1">
                    <span className="text-purple-500">ℹ️</span>
                    <span>{statusMessage}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Camera Off State */}
      {!imageURL && !cameraActive && (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600">Camera is off</p>
            <p className="text-xs text-gray-500 mt-1">
              Capture complete or processing...
            </p>
          </div>
        </div>
      )}

      {/* Captured Image View */}
      {imageURL && (
        <>
          <Image
            src={imageURL}
            width={1000}
            height={1000}
            alt="Captured face"
            className="z-50 w-[400px] h-[400px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-green-500 rounded-md"
          />
          <button
            onClick={handleRetake}
            className="bg-blue-600 text-white rounded-full hover:bg-blue-700 m-auto z-50 p-4 border absolute bottom-4 transition-colors"
          >
            <ReplayIcon />
          </button>

          {/* Success message overlay - only show when capture is truly complete */}
          {imageURL &&
            captureComplete &&
            statusMessage &&
            statusMessage.includes('successfully') && (
              <div className="absolute top-4 left-4 right-4 z-20">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-800">
                      ✅ {statusMessage}
                    </span>
                  </div>
                </div>
              </div>
            )}

          {/* Error message overlay when image is captured but there's an error */}
          {imageURL && errorMessage && (
            <div className="absolute top-4 left-4 right-4 z-20">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-red-800">
                    ⚠️ {errorMessage}
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FaceRecognition;
