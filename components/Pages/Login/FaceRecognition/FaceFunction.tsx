import { useEffect, useState, useRef } from 'react';
import {
  loadModels,
  createMatcher,
  getFullFaceDescription,
  detectFace,
  isSmiling,
} from '@/utils/face';
import { faceData } from './faceData';
import ReplayIcon from '@mui/icons-material/Replay';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from 'react-toastify';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const videoConstraints = {
  width: 480,
  height: 480,
  facingMode: 'user',
};

const FaceFunction = () => {
  const webcamRef = useRef<any>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [faceMatcher, setFaceMatcher] = useState<any>(null);
  const [captchaToken, setCaptchaToken] = useState('');
  const supabaseClient = useSupabaseClient();
  const fpPromise = FingerprintJS.load();

  useEffect(() => {
    const fetchData = async () => {
      if (!captchaToken) {
        await loadModels();
        const data = await faceData(supabaseClient);
        const faceMatcher = await createMatcher(data);
        setFaceMatcher(faceMatcher);
      }
      if (captchaToken) await capture(faceMatcher);
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
      let tempMatch = await temptDescriptors.map((descriptor: any) =>
        fMatch.findBestMatch(descriptor)
      );

      if (tempMatch[0]._label !== 'unknown') {
        const userId = tempMatch[0]._label;
        if (userId !== previousUser) {
          toast('An attempt to login as another user is detected', {
            type: 'error',
            autoClose: 2000,
          });
        } else {
          await loginUser(userId);
        }
      } else {
        toast('User is not registered', {
          type: 'error',
          autoClose: 2000,
        });
      }
    } else {
      toast('Login Failed. Try Again.', {
        type: 'error',
        autoClose: 2000,
      });
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
    toast(captchaToken ? 'Please wait...' : 'Please complete the captcha', {
      type: 'info',
      autoClose: 2000,
    });

    let smileCount = 0;
    let isSmilingPrevious = false;
    let isCameraReady = false;
    let previousUser = null;
    let cameraReadyMessageShown = false;

    while (true) {
      if (webcamRef?.current) {
        if (!isCameraReady && webcamRef.current.video.readyState === 4) {
          isCameraReady = true;
        }

        if (isCameraReady) {
          const screenShot = webcamRef.current.getScreenshot();
          if (screenShot) {
            const result = await detectFace(screenShot);
            if (result.length > 1) {
              toast('Multiple faces detected', {
                type: 'error',
                autoClose: 2000,
              });
            } else if (result.length === 1) {
              const fullDesc = await getFullFaceDescription(screenShot);
              const isUserSmiling =
                fullDesc && fullDesc[0] && isSmiling(fullDesc[0]);

              if (isUserSmiling && !isSmilingPrevious) {
                isSmilingPrevious = true;
                smileCount++;
                toast(`Smile detected! (${smileCount}/1)`, {
                  type: 'success',
                  autoClose: 2000,
                });
              } else if (!isUserSmiling) {
                if (!cameraReadyMessageShown) {
                  toast('Camera is ready, please smile', {
                    type: 'success',
                    autoClose: 2000,
                  });
                  cameraReadyMessageShown = true;
                }

                isSmilingPrevious = false;
                previousUser = await getUserData(fullDesc, fMatcher);
              }

              if (smileCount === 1) {
                setImageURL(screenShot);
                handleImage(fullDesc, fMatcher, previousUser);
                break;
              }
            }
          }
        }
      }
      await new Promise(resolve => setTimeout(resolve, 250));
    }
  };

  const loginUser = async (userId: string) => {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*, profile_devices(device_id)')
      .eq('id', userId)
      .single();

    if (error) {
      console.error(error);
      toast('Authentication failed', {
        type: 'error',
        autoClose: 2000,
      });
      return;
    }

    const devices = data?.profile_devices.map(
      (device: any) => device.device_id
    );

    if (data && (await isCurrentDevicePresent(devices))) {
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
        toast('Login Successful', {
          type: 'success',
          autoClose: 2000,
        });

        setTimeout(() => {
          window.location.href = '/home';
        }, 2000);
      } else {
        toast(result.message || 'Login Failed', {
          type: 'error',
          autoClose: 2000,
        });
      }
    }
  };

  const isCurrentDevicePresent = async (devices: any): Promise<boolean> => {
    const fp = await fpPromise;
    const result = await fp.get();
    const deviceID = result.visitorId;
    if (devices.includes(deviceID)) {
      return true;
    } else {
      toast('Device is not registered, login using email', {
        type: 'error',
        autoClose: 2000,
      });
      return false;
    }
  };

  return {
    webcamRef,
    imageURL,
    capture,
    videoConstraints,
    ReplayIcon,
    faceMatcher,
    setImageURL,
    captchaToken,
    setCaptchaToken,
  };
};

export default FaceFunction;
