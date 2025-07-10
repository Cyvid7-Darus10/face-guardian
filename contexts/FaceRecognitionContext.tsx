import React, {
  createContext,
  useContext,
  useReducer,
  useRef,
  ReactNode,
} from 'react';
import { useApp } from './AppContext';

// Types
interface FaceDescriptor {
  descriptor: Float32Array;
  confidence: number;
  timestamp: number;
}

interface FaceRecognitionState {
  isScanning: boolean;
  isProcessing: boolean;
  imageURL: string | null;
  faceDescriptors: FaceDescriptor[];
  error: string | null;
  captchaToken: string | null;
  validationStatus: 'none' | 'valid' | 'invalid';
  attemptCount: number;
  maxAttempts: number;
}

type FaceRecognitionAction =
  | { type: 'START_SCANNING' }
  | { type: 'STOP_SCANNING' }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_IMAGE'; payload: string | null }
  | { type: 'SET_DESCRIPTORS'; payload: FaceDescriptor[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CAPTCHA_TOKEN'; payload: string | null }
  | { type: 'SET_VALIDATION_STATUS'; payload: 'none' | 'valid' | 'invalid' }
  | { type: 'INCREMENT_ATTEMPT' }
  | { type: 'RESET_ATTEMPTS' }
  | { type: 'RESET_STATE' };

interface FaceRecognitionContextType {
  state: FaceRecognitionState;
  dispatch: React.Dispatch<FaceRecognitionAction>;
  webcamRef: React.RefObject<any>;
  // Actions
  startScanning: () => void;
  stopScanning: () => void;
  captureImage: () => Promise<string | null>;
  processFaceDescriptors: (image: string) => Promise<FaceDescriptor[]>;
  validateFace: (descriptors: FaceDescriptor[]) => Promise<boolean>;
  retakePhoto: () => void;
  resetState: () => void;
}

// Initial state
const initialState: FaceRecognitionState = {
  isScanning: false,
  isProcessing: false,
  imageURL: null,
  faceDescriptors: [],
  error: null,
  captchaToken: null,
  validationStatus: 'none',
  attemptCount: 0,
  maxAttempts: 5,
};

// Reducer
const faceRecognitionReducer = (
  state: FaceRecognitionState,
  action: FaceRecognitionAction
): FaceRecognitionState => {
  switch (action.type) {
    case 'START_SCANNING':
      return { ...state, isScanning: true, error: null };
    case 'STOP_SCANNING':
      return { ...state, isScanning: false };
    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };
    case 'SET_IMAGE':
      return { ...state, imageURL: action.payload };
    case 'SET_DESCRIPTORS':
      return { ...state, faceDescriptors: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isProcessing: false };
    case 'SET_CAPTCHA_TOKEN':
      return { ...state, captchaToken: action.payload };
    case 'SET_VALIDATION_STATUS':
      return { ...state, validationStatus: action.payload };
    case 'INCREMENT_ATTEMPT':
      return { ...state, attemptCount: state.attemptCount + 1 };
    case 'RESET_ATTEMPTS':
      return { ...state, attemptCount: 0 };
    case 'RESET_STATE':
      return { ...initialState };
    default:
      return state;
  }
};

// Context
const FaceRecognitionContext = createContext<
  FaceRecognitionContextType | undefined
>(undefined);

// Provider
export const FaceRecognitionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(faceRecognitionReducer, initialState);
  const { showNotification } = useApp();
  const webcamRef = useRef<any>(null);

  const startScanning = (): void => {
    dispatch({ type: 'START_SCANNING' });
  };

  const stopScanning = (): void => {
    dispatch({ type: 'STOP_SCANNING' });
  };

  const captureImage = async (): Promise<string | null> => {
    if (!webcamRef.current) {
      dispatch({ type: 'SET_ERROR', payload: 'Camera not available' });
      return null;
    }

    try {
      dispatch({ type: 'SET_PROCESSING', payload: true });
      const imageSrc = webcamRef.current.getScreenshot();

      if (!imageSrc) {
        throw new Error('Failed to capture image');
      }

      dispatch({ type: 'SET_IMAGE', payload: imageSrc });
      return imageSrc;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showNotification({
        type: 'error',
        title: 'Capture Failed',
        message: 'Failed to capture image. Please try again.',
      });
      return null;
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  };

  const processFaceDescriptors = async (
    image: string
  ): Promise<FaceDescriptor[]> => {
    try {
      dispatch({ type: 'SET_PROCESSING', payload: true });

      // This is a placeholder for actual face recognition processing
      // In a real implementation, you would use a library like face-api.js
      // For now, return mock data
      const mockDescriptors: FaceDescriptor[] = [
        {
          descriptor: new Float32Array(128),
          confidence: 0.95,
          timestamp: Date.now(),
        },
      ];

      dispatch({ type: 'SET_DESCRIPTORS', payload: mockDescriptors });
      return mockDescriptors;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showNotification({
        type: 'error',
        title: 'Processing Failed',
        message: 'Failed to process face data. Please try again.',
      });
      return [];
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  };

  const validateFace = async (
    descriptors: FaceDescriptor[]
  ): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_PROCESSING', payload: true });

      // Validation logic
      if (descriptors.length === 0) {
        dispatch({ type: 'SET_VALIDATION_STATUS', payload: 'invalid' });
        dispatch({
          type: 'SET_ERROR',
          payload: 'No face detected in the image',
        });
        return false;
      }

      const averageConfidence =
        descriptors.reduce((sum, desc) => sum + desc.confidence, 0) /
        descriptors.length;

      if (averageConfidence < 0.8) {
        dispatch({ type: 'SET_VALIDATION_STATUS', payload: 'invalid' });
        dispatch({
          type: 'SET_ERROR',
          payload:
            'Face quality is too low. Please ensure good lighting and look directly at the camera.',
        });
        return false;
      }

      dispatch({ type: 'SET_VALIDATION_STATUS', payload: 'valid' });
      showNotification({
        type: 'success',
        title: 'Face Validation Successful',
        message: 'Your face has been successfully validated.',
      });
      return true;
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_VALIDATION_STATUS', payload: 'invalid' });
      showNotification({
        type: 'error',
        title: 'Validation Failed',
        message: error.message,
      });
      return false;
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  };

  const retakePhoto = (): void => {
    dispatch({ type: 'SET_IMAGE', payload: null });
    dispatch({ type: 'SET_DESCRIPTORS', payload: [] });
    dispatch({ type: 'SET_VALIDATION_STATUS', payload: 'none' });
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'INCREMENT_ATTEMPT' });
  };

  const resetState = (): void => {
    dispatch({ type: 'RESET_STATE' });
  };

  const value: FaceRecognitionContextType = {
    state,
    dispatch,
    webcamRef,
    startScanning,
    stopScanning,
    captureImage,
    processFaceDescriptors,
    validateFace,
    retakePhoto,
    resetState,
  };

  return (
    <FaceRecognitionContext.Provider value={value}>
      {children}
    </FaceRecognitionContext.Provider>
  );
};

// Hook
export const useFaceRecognition = (): FaceRecognitionContextType => {
  const context = useContext(FaceRecognitionContext);
  if (context === undefined) {
    throw new Error(
      'useFaceRecognition must be used within a FaceRecognitionProvider'
    );
  }
  return context;
};
