import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { useApp } from './AppContext';
import { useFaceRecognition } from './FaceRecognitionContext';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import isEmail from 'validator/lib/isEmail';
import { passwordStrength } from 'check-password-strength';

// Types
interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  captchaToken: string | null;
  faceDescriptors: any[];
  agreedToTerms: boolean;
  agreedToPrivacy: boolean;
}

interface RegistrationState {
  currentStep: number;
  totalSteps: number;
  data: RegistrationData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isComplete: boolean;
  completedSteps: number[];
}

type RegistrationAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_DATA'; payload: Partial<RegistrationData> }
  | { type: 'SET_ERRORS'; payload: Record<string, string> }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_COMPLETE'; payload: boolean }
  | { type: 'COMPLETE_STEP'; payload: number }
  | { type: 'RESET' };

interface RegistrationContextType {
  state: RegistrationState;
  dispatch: React.Dispatch<RegistrationAction>;
  // Actions
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  updateData: (data: Partial<RegistrationData>) => void;
  validateStep: (step: number) => boolean;
  submitRegistration: () => Promise<boolean>;
  reset: () => void;
}

// Initial state
const initialData: RegistrationData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  captchaToken: null,
  faceDescriptors: [],
  agreedToTerms: false,
  agreedToPrivacy: false,
};

const initialState: RegistrationState = {
  currentStep: 1,
  totalSteps: 3,
  data: initialData,
  errors: {},
  isSubmitting: false,
  isComplete: false,
  completedSteps: [],
};

// Reducer
const registrationReducer = (
  state: RegistrationState,
  action: RegistrationAction
): RegistrationState => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.totalSteps),
      };
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1),
      };
    case 'SET_DATA':
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'SET_COMPLETE':
      return { ...state, isComplete: action.payload };
    case 'COMPLETE_STEP':
      return {
        ...state,
        completedSteps: [...state.completedSteps, action.payload],
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

// Context
const RegistrationContext = createContext<RegistrationContextType | undefined>(
  undefined
);

// Provider
export const RegistrationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(registrationReducer, initialState);
  const { showNotification } = useApp();
  const { state: faceState } = useFaceRecognition();
  const supabaseClient = useSupabaseClient();

  const nextStep = (): void => {
    if (validateStep(state.currentStep)) {
      dispatch({ type: 'COMPLETE_STEP', payload: state.currentStep });
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  const prevStep = (): void => {
    dispatch({ type: 'PREV_STEP' });
  };

  const setStep = (step: number): void => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const updateData = (data: Partial<RegistrationData>): void => {
    dispatch({ type: 'SET_DATA', payload: data });
    // Clear related errors
    const newErrors = { ...state.errors };
    Object.keys(data).forEach(key => {
      delete newErrors[key];
    });
    dispatch({ type: 'SET_ERRORS', payload: newErrors });
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 1: // Face Scan Step
        if (!faceState.imageURL) {
          errors.face = 'Please capture your face photo';
        }
        if (faceState.validationStatus !== 'valid') {
          errors.face = 'Face validation failed. Please retake the photo';
        }
        if (!state.data.captchaToken) {
          errors.captcha = 'Please complete the captcha';
        }
        break;

      case 2: // Personal Info Step
        if (!state.data.firstName.trim()) {
          errors.firstName = 'First name is required';
        }
        if (!state.data.lastName.trim()) {
          errors.lastName = 'Last name is required';
        }
        if (!isEmail(state.data.email)) {
          errors.email = 'Please enter a valid email address';
        }
        if (!state.data.password) {
          errors.password = 'Password is required';
        } else if (passwordStrength(state.data.password).id < 2) {
          errors.password =
            'Password is too weak. Please use at least 8 characters with a mix of letters, numbers, and symbols';
        }
        if (state.data.password !== state.data.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
        }
        break;

      case 3: // Verification Step
        if (!state.data.agreedToTerms) {
          errors.terms = 'Please accept the terms and conditions';
        }
        if (!state.data.agreedToPrivacy) {
          errors.privacy = 'Please accept the privacy policy';
        }
        break;

      default:
        break;
    }

    dispatch({ type: 'SET_ERRORS', payload: errors });
    return Object.keys(errors).length === 0;
  };

  const submitRegistration = async (): Promise<boolean> => {
    if (!validateStep(3)) {
      return false;
    }

    dispatch({ type: 'SET_SUBMITTING', payload: true });

    try {
      // Sign up user
      const { error, data } = await supabaseClient.auth.signUp({
        email: state.data.email,
        password: state.data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/home`,
          data: {
            first_name: state.data.firstName,
            last_name: state.data.lastName,
          },
          captchaToken: state.data.captchaToken || undefined,
        },
      });

      if (error) throw error;

      if (data?.user) {
        // Store face descriptors
        if (faceState.faceDescriptors.length > 0) {
          const { error: faceError } = await supabaseClient
            .from('face_descriptors')
            .insert([
              {
                profile_id: data.user.id,
                descriptors: JSON.stringify(faceState.faceDescriptors),
              },
            ]);

          if (faceError) {
            console.error('Face descriptor storage error:', faceError);
          }
        }

        // Store device fingerprint
        try {
          const { error: deviceError } = await supabaseClient
            .from('profile_devices')
            .insert([
              {
                profile_id: data.user.id,
                device_id: 'web-device-' + Date.now(),
                user_agent: navigator.userAgent,
              },
            ]);

          if (deviceError) {
            console.error('Device storage error:', deviceError);
          }
        } catch (deviceError) {
          console.error('Device fingerprint error:', deviceError);
        }

        dispatch({ type: 'SET_COMPLETE', payload: true });
        showNotification({
          type: 'success',
          title: 'Registration Successful',
          message: 'Please check your email for verification instructions.',
        });

        // Redirect after success
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);

        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Registration error:', error);
      showNotification({
        type: 'error',
        title: 'Registration Failed',
        message: error.message || 'An error occurred during registration',
      });
      return false;
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  };

  const reset = (): void => {
    dispatch({ type: 'RESET' });
  };

  const value: RegistrationContextType = {
    state,
    dispatch,
    nextStep,
    prevStep,
    setStep,
    updateData,
    validateStep,
    submitRegistration,
    reset,
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
};

// Hook
export const useRegistration = (): RegistrationContextType => {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error(
      'useRegistration must be used within a RegistrationProvider'
    );
  }
  return context;
};
