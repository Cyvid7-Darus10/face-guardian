import { generateRandomString } from '@/utils/encryption';
import { toast } from 'react-toastify';
import isEmail from 'validator/lib/isEmail';
import { passwordStrength } from 'check-password-strength';

// Legacy function - now handled by RegistrationContext
const insertFaceDescriptors = async (
  data: any,
  faceDescriptors: any,
  supabaseClient: any
) => {
  const { error } = await supabaseClient.from('face_descriptors').insert([
    {
      profile_id: data?.user?.id,
      descriptors: JSON.stringify(faceDescriptors),
    },
  ]);

  if (error) {
    console.error('Face descriptor insertion error:', error);
    throw error;
  }
};

// Legacy function - now handled by RegistrationContext
const insertFingerprint = async (
  data: any,
  supabaseClient: any,
  fpPromise: any
) => {
  try {
    const fp = await fpPromise;
    const result = await fp.get();
    const deviceID = result.visitorId;

    const { error } = await supabaseClient.from('profile_devices').insert([
      {
        profile_id: data?.user?.id,
        device_id: deviceID,
        user_agent: navigator.userAgent,
      },
    ]);

    if (error) {
      console.error('Device fingerprint insertion error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Fingerprint generation error:', error);
    // Fallback to basic device ID
    const { error: deviceError } = await supabaseClient
      .from('profile_devices')
      .insert([
        {
          profile_id: data?.user?.id,
          device_id: 'web-device-' + Date.now(),
          user_agent: navigator.userAgent,
        },
      ]);

    if (deviceError) {
      console.error('Fallback device insertion error:', deviceError);
      throw deviceError;
    }
  }
};

// Validation functions - now used by RegistrationContext
export const validatePersonalInfo = (
  userData: any
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!userData.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!userData.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!userData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!isEmail(userData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!userData.password) {
    errors.password = 'Password is required';
  } else {
    const strength = passwordStrength(userData.password);
    if (strength.id < 2) {
      errors.password =
        'Password is too weak. Please use at least 8 characters with a mix of letters, numbers, and symbols';
    }
  }

  if (!userData.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (userData.password !== userData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateCaptcha = (
  captchaToken: string | null
): { isValid: boolean; error?: string } => {
  if (!captchaToken) {
    return {
      isValid: false,
      error: 'Please complete the captcha verification',
    };
  }

  return { isValid: true };
};

export const validateTermsAndPrivacy = (
  agreedToTerms: boolean,
  agreedToPrivacy: boolean
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!agreedToTerms) {
    errors.terms = 'Please accept the terms and conditions';
  }

  if (!agreedToPrivacy) {
    errors.privacy = 'Please accept the privacy policy';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Legacy function - now handled by RegistrationContext
const checkInputFields = (userData: any): boolean => {
  const { isValid, errors } = validatePersonalInfo(userData);

  if (!isValid) {
    const firstError = Object.values(errors)[0];
    toast(firstError, {
      type: 'error',
      autoClose: 2000,
    });
    return false;
  }

  const captchaValidation = validateCaptcha(userData.captchaToken);
  if (!captchaValidation.isValid) {
    toast(captchaValidation.error, {
      type: 'error',
      autoClose: 2000,
    });
    return false;
  }

  return true;
};

// Legacy function - now handled by RegistrationContext
const registerUser = async (
  userData: any,
  supabaseClient: any,
  fpPromise: any,
  faceDescriptors: any
) => {
  try {
    const { error, data } = await supabaseClient.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/home`,
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
        },
        captchaToken: userData.captchaToken,
      },
    });

    if (error) throw error;

    if (data?.user) {
      // Store additional data
      await Promise.all([
        insertFaceDescriptors(data, faceDescriptors, supabaseClient),
        insertFingerprint(data, supabaseClient, fpPromise),
      ]);

      toast(
        'Account created successfully. Please check your email for verification.',
        {
          type: 'success',
          autoClose: 3000,
        }
      );

      setTimeout(() => {
        window.location.href = '/';
      }, 3000);

      return { success: true, data };
    }

    throw new Error('Registration failed - no user data returned');
  } catch (error: any) {
    console.error('Registration error:', error);
    toast(error.message || 'Registration failed', {
      type: 'error',
      autoClose: 3000,
    });
    throw error;
  }
};

// Export legacy functions for backward compatibility
export {
  checkInputFields,
  registerUser,
  insertFaceDescriptors,
  insertFingerprint,
};
