import { useState, useRef } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import Link from 'next/link';
import {
  EnvelopeIcon,
  LockClosedIcon,
  CameraIcon,
} from '@heroicons/react/24/outline';
import isEmail from 'validator/lib/isEmail';
import { toast } from 'react-toastify';

// New design system components
import AuthLayout from '@/components/Common/AuthLayout';
import Button from '@/components/Atom/Button';
import Input from '@/components/Atom/Input';
import Card from '@/components/Atom/Card';

const InputDetails = () => {
  const supabaseClient = useSupabaseClient();
  const fpPromise = FingerprintJS.load();
  const captchaRef = useRef<any>(null);
  const siteKey = '10000000-ffff-ffff-ffff-000000000001';

  const [userData, setUserData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    captchaToken: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!userData.email) {
      newErrors.email = 'Email is required';
    } else if (!isEmail(userData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!userData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      }
    } catch (error) {
      console.error('Error with fingerprint:', error);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { error, data } = await supabaseClient.auth.signInWithPassword({
        email: userData.email,
        password: userData.password,
        options: {
          captchaToken: userData.captchaToken,
        },
      });

      if (error) {
        toast.error(error.message);
        setErrors({ general: error.message });
      } else if (data) {
        toast.success('Login successful!');
        await insertDeviceID(data?.user?.id as string);

        setTimeout(() => {
          window.location.href = '/home';
        }, 1000);
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
      setUserData(prev => ({ ...prev, captchaToken: '' }));
      captchaRef?.current?.resetCaptcha();
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* General Error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        {/* Email Input */}
        <Input
          label="Email Address"
          type="email"
          value={userData.email}
          onChange={e => setUserData({ ...userData, email: e.target.value })}
          placeholder="Enter your email"
          leftIcon={<EnvelopeIcon />}
          error={errors.email}
          fullWidth
        />

        {/* Password Input */}
        <Input
          label="Password"
          type="password"
          value={userData.password}
          onChange={e => setUserData({ ...userData, password: e.target.value })}
          placeholder="Enter your password"
          leftIcon={<LockClosedIcon />}
          error={errors.password}
          fullWidth
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={userData.rememberMe}
              onChange={e =>
                setUserData({ ...userData, rememberMe: e.target.checked })
              }
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-800 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        {/* Captcha */}
        <div className="flex justify-center">
          <HCaptcha
            ref={captchaRef}
            sitekey={siteKey}
            onVerify={token =>
              setUserData({ ...userData, captchaToken: token })
            }
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          loading={isLoading}
          disabled={!userData.captchaToken}
          fullWidth
          size="lg"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-sm text-gray-500">Or</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Alternative Login */}
      <Link href="/login">
        <Button
          variant="outline"
          fullWidth
          className="flex items-center justify-center"
        >
          <CameraIcon className="w-5 h-5 mr-2" />
          Use Face Recognition
        </Button>
      </Link>

      {/* Sign Up Link */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="text-primary-600 hover:text-primary-800 font-medium"
        >
          Sign up here
        </Link>
      </p>
    </AuthLayout>
  );
};

export default InputDetails;
