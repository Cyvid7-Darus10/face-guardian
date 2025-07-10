import { useState } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '@/contexts/AppContext';
import { useFaceRecognition } from '@/contexts/FaceRecognitionContext';
import Button from '@/components/Atom/Button';
import Input from '@/components/Atom/Input';
import Card from '@/components/Atom/Card';
import Link from 'next/link';
import Image from 'next/image';
import Webcam from 'react-webcam';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const LoginPage = () => {
  const router = useRouter();
  const { state: appState, login } = useApp();
  const {
    state: faceState,
    webcamRef,
    captureImage,
    retakePhoto,
    dispatch,
  } = useFaceRecognition();

  const [loginMethod, setLoginMethod] = useState<'email' | 'face'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const siteKey = '20000000-ffff-ffff-ffff-000000000002';

  const videoConstraints = {
    width: 480,
    height: 480,
    facingMode: 'user',
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!email || !password) {
      setErrors({
        general: 'Please enter both email and password',
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/home');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFaceLogin = async () => {
    if (!faceState.captchaToken) {
      setErrors({ face: 'Please complete the captcha verification first' });
      return;
    }

    const imageSrc = await captureImage();
    if (imageSrc) {
      // In a real implementation, you would:
      // 1. Process the face descriptors
      // 2. Compare with stored descriptors
      // 3. Authenticate the user

      // For now, simulate successful face authentication
      setTimeout(() => {
        router.push('/home');
      }, 2000);
    }
  };

  const handleCaptchaVerify = (token: string) => {
    dispatch({ type: 'SET_CAPTCHA_TOKEN', payload: token });
    setErrors({});
  };

  if (appState.isAuthenticated) {
    router.push('/home');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Sign in to Face Guardian
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choose your preferred authentication method
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <div className="p-6">
            {/* Login Method Toggle */}
            <div className="flex rounded-lg p-1 bg-gray-100 mb-6">
              <button
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === 'email'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Email & Password
              </button>
              <button
                onClick={() => setLoginMethod('face')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === 'face'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Face Recognition
              </button>
            </div>

            {/* Email Login Form */}
            {loginMethod === 'email' && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  error={errors.email}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  error={errors.password}
                  required
                />

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{errors.general}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  loading={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>
            )}

            {/* Face Recognition Login */}
            {loginMethod === 'face' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="relative w-[300px] h-[300px] bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow-lg border border-blue-200 p-4">
                    {/* Loading overlay */}
                    {faceState.isProcessing && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-50">
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span className="text-sm text-gray-600">
                            Processing...
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Webcam View */}
                    {!faceState.imageURL && faceState.captchaToken && (
                      <>
                        <Webcam
                          audio={false}
                          height={300}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          width={300}
                          videoConstraints={videoConstraints}
                          mirrored={true}
                          className="rounded-lg w-full h-full object-cover"
                        />
                        <Image
                          src="/face-guide.png"
                          width={300}
                          height={300}
                          alt="Face alignment guide"
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] opacity-60 pointer-events-none z-10"
                        />
                      </>
                    )}

                    {/* Captured Image View */}
                    {faceState.imageURL && faceState.captchaToken && (
                      <>
                        <Image
                          src={faceState.imageURL}
                          width={300}
                          height={300}
                          alt="Captured face"
                          className="rounded-lg w-full h-full object-cover"
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={retakePhoto}
                          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white/90 hover:bg-white shadow-lg z-20"
                          disabled={faceState.isProcessing}
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
                          Retake
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Captcha */}
                {!faceState.captchaToken && (
                  <div className="flex justify-center">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        Please complete verification to enable face recognition
                      </p>
                      <HCaptcha
                        sitekey={siteKey}
                        onVerify={handleCaptchaVerify}
                        theme="light"
                      />
                    </div>
                  </div>
                )}

                {/* Face Login Button */}
                {faceState.captchaToken && (
                  <Button
                    onClick={handleFaceLogin}
                    className="w-full"
                    disabled={faceState.isProcessing}
                  >
                    {faceState.imageURL
                      ? 'Authenticate with Face'
                      : 'Capture Face'}
                  </Button>
                )}

                {/* Error Message */}
                {errors.face && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{errors.face}</p>
                  </div>
                )}
              </div>
            )}

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-2">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
              <div className="text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
