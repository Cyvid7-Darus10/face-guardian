import { generateRandomString } from '@/utils/encryption';
import { toast } from 'react-toastify';
import isEmail from 'validator/lib/isEmail';
import { passwordStrength } from 'check-password-strength';

const insertFaceDescriptors = async (
  data: any,
  faceDescriptors: any,
  supabaseClient: any
) => {
  const { error } = await supabaseClient.from('face_descriptors').insert([
    {
      profile_id: data?.user?.id,
      descriptors: '{' + faceDescriptors[0].toString() + '}',
    },
  ]);

  if (error) {
    toast(error.message, {
      type: 'error',
      autoClose: 2000,
    });
    return;
  }
};

const insertFingerprint = async (
  data: any,
  supabaseClient: any,
  fpPromise: any
) => {
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
    toast(error.message, {
      type: 'error',
      autoClose: 2000,
    });
    return;
  }
};

const checkInputFields = (userData: any): boolean => {
  if (!userData.firstName) {
    toast('Please enter your first name', {
      type: 'error',
      autoClose: 2000,
    });
    return false;
  } else if (!userData.lastName) {
    toast('Please enter your last name', {
      type: 'error',
      autoClose: 2000,
    });
    return false;
  } else if (!isEmail(userData.email)) {
    toast('Please enter a valid email', {
      type: 'error',
      autoClose: 2000,
    });
    return false;
  } else if (!userData.password) {
    toast('Please enter a password', {
      type: 'error',
      autoClose: 2000,
    });
    return false;
  } else if (passwordStrength(userData.password).id < 2) {
    toast('Password is too weak', {
      type: 'error',
      autoClose: 2000,
    });
    return false;
  } else if (!userData.captchaToken) {
    toast('Please complete the captcha', {
      type: 'error',
      autoClose: 2000,
    });
    return false;
  }
  return true;
};

const registerUser = async (
  userData: any,
  supabaseClient: any,
  fpPromise: any,
  faceDescriptors: any
) => {
  const { error, data } = await supabaseClient.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      emailRedirectTo: 'https://www.face-guardian.com/home',
      data: {
        first_name: userData.firstName,
        last_name: userData.lastName,
      },
      captchaToken: userData.captchaToken,
    },
  });

  if (error) {
    toast(error.message, {
      type: 'error',
      autoClose: 2000,
    });
    return;
  } else if (data) {
    Promise.all([
      insertFaceDescriptors(data, faceDescriptors, supabaseClient),
      insertFingerprint(data, supabaseClient, fpPromise),
    ]);

    toast(
      'Account created successfully. Please check your email for verification.',
      {
        type: 'success',
        autoClose: 2000,
      }
    );

    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  } else {
    toast('Something went wrong', {
      type: 'error',
      autoClose: 2000,
    });
    return;
  }
};

export { checkInputFields, registerUser };
