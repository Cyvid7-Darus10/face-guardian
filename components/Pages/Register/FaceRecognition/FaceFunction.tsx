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

const videoConstraints = {
  width: 480,
  height: 480,
  facingMode: 'user',
};

const FaceFunction = ({
  setFaceDescriptors,
  onNext,
}: {
  setFaceDescriptors: any;
  onNext?: () => void;
}) => {
  const webcamRef = useRef<any>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [faceMatcher, setFaceMatcher] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [smileDetected, setSmileDetected] = useState(false);
  const [smileConfidence, setSmileConfidence] = useState(0);
  const [facePositioned, setFacePositioned] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  // Updated smile tracking state
  const [smilesNeeded, setSmilesNeeded] = useState(3);
  const [smilesLeft, setSmilesLeft] = useState(3);
  const [smileCount, setSmileCount] = useState(0);
  const [lastSmileTime, setLastSmileTime] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const [captureComplete, setCaptureComplete] = useState(false);
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    const fetchData = async () => {
      setIsProcessing(true);
      setStatusMessage('Loading face recognition...');
      setCaptureComplete(false);

      try {
        await loadModels();
        const data = await faceData(supabaseClient);
        if (data) {
          const faceMatcher = await createMatcher(data);
          setFaceMatcher(faceMatcher);
          setStatusMessage(''); // Clear status message after loading

          await capture(faceMatcher);
        } else {
          setErrorMessage('No face data available');
        }
      } catch (error) {
        console.error('Error loading face recognition:', error);
        setErrorMessage(
          'Error loading face recognition. Please refresh the page.'
        );
        setStatusMessage(''); // Clear status message on error
      } finally {
        setIsProcessing(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImage = async (imageData: any, fMatcher: any) => {
    try {
      setIsProcessing(true);
      setStatusMessage('Processing face data...');

      const descriptor = await getFullFaceDescription(imageData, 480);

      if (descriptor && descriptor.length > 0) {
        const faceDescriptor = descriptor[0];

        // Check for existing faces to prevent duplicates
        if (fMatcher && Object.keys(fMatcher._labeledDescriptors).length > 0) {
          const match = fMatcher.findBestMatch(faceDescriptor.descriptor);

          if (match.distance < 0.6) {
            setErrorMessage(
              'This face is already registered. Please use a different person.'
            );
            setImageURL(null);
            setIsProcessing(false);
            setCameraActive(true);
            setIsCapturing(false);
            // Reset smile tracking
            setSmileCount(0);
            setSmilesLeft(3);
            setSmilesNeeded(3);
            setLastSmileTime(0);
            setCaptureComplete(false);
            setStatusMessage(''); // Clear status message
            await capture(fMatcher);
            return;
          }
        }

        // Set the face descriptors for registration
        setFaceDescriptors(descriptor);
        setCaptureComplete(true); // Mark capture as complete
        setStatusMessage(
          'Face captured successfully! Proceeding to next step...'
        );
        setCameraActive(false); // Turn off camera when done

        // Auto-navigate to next step after a brief delay
        setTimeout(() => {
          if (onNext) {
            onNext();
          }
        }, 2000);
      } else {
        setErrorMessage('No face detected in the image. Please try again.');
        setImageURL(null);
        setCameraActive(true);
        setIsCapturing(false);
        // Reset smile tracking
        setSmileCount(0);
        setSmilesLeft(3);
        setSmilesNeeded(3);
        setLastSmileTime(0);
        setCaptureComplete(false);
        setStatusMessage(''); // Clear status message
        await capture(fMatcher);
      }
    } catch (error) {
      console.error('Error processing face:', error);
      setErrorMessage('Error processing face data. Please try again.');
      setImageURL(null);
      setCameraActive(true);
      setIsCapturing(false);
      // Reset smile tracking
      setSmileCount(0);
      setSmilesLeft(3);
      setSmilesNeeded(3);
      setLastSmileTime(0);
      setCaptureComplete(false);
      setStatusMessage(''); // Clear status message
      await capture(fMatcher);
    } finally {
      setIsProcessing(false);
    }
  };

  const capture = async (fMatcher: any) => {
    setIsProcessing(true);
    setStatusMessage('Initializing camera...');
    setIsCapturing(true);
    setCameraActive(true);
    setCaptureComplete(false);

    let isCameraReady = false;
    let isCurrentlySmiling = false;
    let lastSmileEnd = 0;
    let currentSmileCount = 0;

    // Registration configuration
    const REQUIRED_SMILES = 3;
    const MIN_SMILE_CONFIDENCE = 0.4; // Higher confidence for registration
    const SMILE_COOLDOWN_MS = 800; // 0.8 seconds between smiles

    // Initialize smile tracking
    setSmileCount(0);
    setSmilesLeft(REQUIRED_SMILES);
    setSmilesNeeded(REQUIRED_SMILES);
    setLastSmileTime(0);

    while (true) {
      if (webcamRef?.current) {
        if (!isCameraReady && webcamRef.current.video.readyState === 4) {
          isCameraReady = true;
          setIsProcessing(false);
          setStatusMessage('Position your face and smile 3 times to register!');
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
              // Reset smile tracking on error
              currentSmileCount = 0;
              setSmileCount(0);
              setSmilesLeft(REQUIRED_SMILES);
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
                      setStatusMessage(
                        'Processing face data for registration...'
                      );
                      setImageURL(screenShot);
                      setIsCapturing(false);
                      await handleImage(screenShot, fMatcher);
                      break;
                    } else {
                      // Update status message with progress
                      setStatusMessage(
                        `Great! ${currentSmileCount} smile${currentSmileCount > 1 ? 's' : ''} captured. ${REQUIRED_SMILES - currentSmileCount} more to go!`
                      );
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

  return {
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
  };
};

export default FaceFunction;
