import { useEffect, useState, useRef } from 'react';
import {
  loadModels,
  createMatcher,
  getFullFaceDescription,
  detectFaces,
  isSmiling,
  getSmileConfidence,
  isFaceWellPositioned,
} from '@/utils/face';
import { faceData } from './faceData';
import ReplayIcon from '@mui/icons-material/Replay';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const videoConstraints = {
  width: 480,
  height: 480,
  facingMode: 'user',
};

const FaceFunction = () => {
  const webcamRef = useRef<any>(null);
  const [faceMatcher, setFaceMatcher] = useState<any>(null);
  const [captchaToken, setCaptchaToken] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [smileDetected, setSmileDetected] = useState(false);
  const [smileConfidence, setSmileConfidence] = useState(0);
  const [facePositioned, setFacePositioned] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  // New state for smile tracking
  const [smilesNeeded, setSmilesNeeded] = useState(1);
  const [smilesLeft, setSmilesLeft] = useState(1);
  const [smileCount, setSmileCount] = useState(0);
  const [lastSmileTime, setLastSmileTime] = useState(0);
  const supabaseClient = useSupabaseClient();
  const fpPromise = FingerprintJS.load();

  useEffect(() => {
    const fetchData = async () => {
      if (!captchaToken) {
        setIsProcessing(true);
        setStatusMessage('Loading face recognition...');

        try {
          await loadModels();
          const data = await faceData(supabaseClient);
          if (data) {
            const faceMatcher = await createMatcher(data);
            setFaceMatcher(faceMatcher);
            setStatusMessage('Face recognition ready');
          } else {
            setErrorMessage('No face data available');
          }
        } catch (error) {
          console.error('Error loading face recognition:', error);
          setErrorMessage(
            'Error loading face recognition. Please refresh the page.'
          );
        } finally {
          setIsProcessing(false);
        }
      }

      if (captchaToken && faceMatcher) {
        await capture(faceMatcher);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captchaToken]);

  const handleImage = async (
    descriptor: any,
    fMatch: any = faceMatcher,
    previousUser: any
  ) => {
    const temptDescriptors = descriptor.map((fd: any) => fd.descriptor);
    if (temptDescriptors.length > 0 && fMatch) {
      let tempMatch = await Promise.all(
        temptDescriptors.map((d: any) => fMatch.findBestMatch(d))
      );

      if (tempMatch[0]._label !== 'unknown') {
        const userId = tempMatch[0]._label;
        // Perform security check only if we have a previously detected (non-smiling) user
        if (previousUser && userId !== previousUser) {
          setErrorMessage('Security alert: Different user detected');
          return;
        }
        await loginUser(userId);
      } else {
        setErrorMessage('User not registered');
      }
    } else {
      setErrorMessage('Login failed. Please try again.');
    }
  };

  const getUserData = async (descriptor: any, fMatch: any = faceMatcher) => {
    const temptDescriptors = descriptor.map((fd: any) => fd.descriptor);
    if (temptDescriptors.length > 0 && fMatch) {
      let tempMatch = await temptDescriptors.map((descriptor: any) =>
        fMatch.findBestMatch(descriptor)
      );

      const userId = tempMatch[0]._label;
      return userId;
    }

    return null;
  };

  const capture = async (fMatcher: any) => {
    if (!captchaToken) {
      setErrorMessage('Please complete the captcha first');
      return;
    }

    setIsProcessing(true);
    setStatusMessage('Initializing camera...');

    let isCameraReady = false;
    let previousUser = null;
    let cameraReadyMessageShown = false;
    let isCurrentlySmiling = false;
    let lastSmileEnd = 0;
    let currentSmileCount = 0;

    // Login configuration
    const REQUIRED_SMILES = 1;
    const MIN_SMILE_CONFIDENCE = 0.3;
    const SMILE_COOLDOWN_MS = 1000; // 1 second between smiles

    // Initialize smile tracking
    setSmileCount(0);
    setSmilesLeft(REQUIRED_SMILES);
    setSmilesNeeded(REQUIRED_SMILES);

    while (true) {
      if (webcamRef?.current) {
        if (!isCameraReady && webcamRef.current.video.readyState === 4) {
          isCameraReady = true;
          setIsProcessing(false);
          setStatusMessage('Position your face and smile to login!');
          cameraReadyMessageShown = true;
        }

        if (isCameraReady) {
          const screenShot = webcamRef.current.getScreenshot();
          if (screenShot) {
            const result = await detectFaces(screenShot, 480);

            if (result.length > 1) {
              setErrorMessage(
                'Multiple faces detected. Please ensure only one person is in frame.'
              );
              setSmileDetected(false);
              setFacePositioned(false);
            } else if (result.length === 1) {
              const fullDesc = await getFullFaceDescription(screenShot, 480);

              if (fullDesc && fullDesc[0]) {
                const faceDesc = fullDesc[0];

                // Check face positioning
                const isWellPositioned = isFaceWellPositioned(
                  faceDesc,
                  480,
                  480
                );
                setFacePositioned(isWellPositioned);

                // Get smile confidence
                const smileConf = getSmileConfidence(faceDesc);
                setSmileConfidence(smileConf);

                // Check if user is smiling with minimum confidence
                const isUserSmiling = smileConf >= MIN_SMILE_CONFIDENCE;
                setSmileDetected(isUserSmiling);

                // Clear any previous error messages
                if (errorMessage) setErrorMessage('');

                // Get user data when not smiling (for pre-verification)
                if (isWellPositioned && !isUserSmiling) {
                  previousUser = await getUserData(fullDesc, fMatcher);
                }

                // Smile detection logic
                const currentTime = Date.now();

                if (isUserSmiling && isWellPositioned) {
                  if (
                    !isCurrentlySmiling &&
                    currentTime - lastSmileEnd > SMILE_COOLDOWN_MS
                  ) {
                    // New smile detected
                    currentSmileCount++;
                    setSmileCount(currentSmileCount);
                    setSmilesLeft(REQUIRED_SMILES - currentSmileCount);
                    setLastSmileTime(currentTime);

                    console.log(
                      `Smile ${currentSmileCount} detected! Smiles left: ${REQUIRED_SMILES - currentSmileCount}`
                    );

                    // Check if we have enough smiles
                    if (currentSmileCount >= REQUIRED_SMILES) {
                      setIsProcessing(true);
                      setStatusMessage('Processing login...');
                      handleImage(fullDesc, fMatcher, previousUser);
                      break;
                    }
                  }
                  isCurrentlySmiling = true;
                } else {
                  if (isCurrentlySmiling) {
                    lastSmileEnd = currentTime;
                  }
                  isCurrentlySmiling = false;
                }
              }
            } else {
              // No face detected
              setSmileDetected(false);
              setFacePositioned(false);
            }
          }
        }
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const loginUser = async (userId: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*, profile_devices(device_id)')
        .eq('id', userId)
        .single();

      if (error) {
        console.error(error);
        setErrorMessage('Authentication failed');
        setIsProcessing(false);
        return;
      }

      const devices = data?.profile_devices.map(
        (device: any) => device.device_id
      );

      // Check if device is already registered
      const isDeviceRegistered = await isCurrentDevicePresent(devices);

      if (data) {
        // Use a secure server-side endpoint for face authentication
        const response = await fetch('/api/authenticate-face', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            captchaToken,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setStatusMessage('Login successful! Redirecting...');

          // Insert device ID if it's not already registered
          if (!isDeviceRegistered) {
            await insertDeviceID(userId);
          }

          // Handle different authentication response types
          if (result.accessToken) {
            // Direct authentication with access token
            try {
              const { data: authData, error: authError } =
                await supabaseClient.auth.setSession({
                  access_token: result.accessToken,
                  refresh_token: result.refreshToken || '',
                });

              if (!authError) {
                window.location.href = '/home';
                return;
              }
            } catch (tokenError) {
              console.warn(
                'Token authentication failed, using fallback:',
                tokenError
              );
            }
          }

          // Fallback: Use magic link or redirect
          if (result.magicLink) {
            setStatusMessage('Opening secure login link...');
            window.location.href = result.magicLink;
          } else {
            setTimeout(() => {
              window.location.href = '/home';
            }, 2000);
          }
        } else {
          console.error('Authentication failed:', result);
          setErrorMessage(result.message || 'Login failed');

          // If it's a server configuration error, provide helpful feedback
          if (result.message?.includes('Server configuration')) {
            setErrorMessage(
              'Server setup issue detected. Please check environment variables.'
            );
          }

          setIsProcessing(false);
        }
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Authentication failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const insertDeviceID = async (userId: string) => {
    try {
      const fp = await fpPromise;
      const result = await fp.get();
      const deviceID = result.visitorId;

      const { error } = await supabaseClient.from('profile_devices').insert([
        {
          profile_id: userId,
          device_id: deviceID,
          user_agent: navigator.userAgent,
        },
      ]);

      if (error) {
        console.error('Error inserting device ID:', error);
      } else {
        console.log('Device ID inserted successfully');
      }
    } catch (error) {
      console.error('Error with fingerprint:', error);
    }
  };

  const isCurrentDevicePresent = async (devices: any): Promise<boolean> => {
    const fp = await fpPromise;
    const result = await fp.get();
    const deviceID = result.visitorId;

    return devices.includes(deviceID);
  };

  return {
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
  };
};

export default FaceFunction;
