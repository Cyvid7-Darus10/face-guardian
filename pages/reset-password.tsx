import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { passwordStrength } from 'check-password-strength';
import Link from 'next/link';

import AuthLayout from '@/components/Common/AuthLayout';
import Button from '@/components/Atom/Button';
import Input from '@/components/Atom/Input';

const ResetPassword = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [validToken, setValidToken] = useState(false);

  const passwordStrengthResult = passwordStrength(password);

  useEffect(() => {
    // Check if the user has a valid session (from the reset link)
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      if (session) {
        setValidToken(true);
      } else {
        // If no session, redirect to forgot password
        router.push('/forgot-password');
      }
    };

    checkSession();
  }, [supabaseClient.auth, router]);

  const getPasswordStrengthColor = () => {
    switch (passwordStrengthResult.id) {
      case 0:
        return 'bg-red-500';
      case 1:
        return 'bg-orange-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (passwordStrengthResult.id < 2) {
      newErrors.password = 'Password is too weak';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { error } = await supabaseClient.auth.updateUser({
        password: password,
      });

      if (error) {
        toast.error(error.message);
        setErrors({ general: error.message });
      } else {
        setIsSuccess(true);
        toast.success('Password updated successfully!');

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!validToken) {
    return (
      <AuthLayout title="Loading..." subtitle="Verifying your reset link">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      </AuthLayout>
    );
  }

  if (isSuccess) {
    return (
      <AuthLayout
        title="Password Updated"
        subtitle="Your password has been successfully changed"
      >
        <div className="text-center space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Password Updated Successfully
            </h3>
            <p className="text-green-700">
              Your password has been changed. You can now sign in with your new
              password.
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/login">
              <Button fullWidth size="lg">
                Sign In Now
              </Button>
            </Link>

            <p className="text-sm text-gray-500">
              Redirecting to login page...
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your new password">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Please enter your new password. Make sure it&apos;s strong and
            secure.
          </p>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        <div>
          <Input
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your new password"
            leftIcon={<LockClosedIcon />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            }
            error={errors.password}
            fullWidth
          />

          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{
                      width: `${(passwordStrengthResult.id + 1) * 25}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600">
                  {passwordStrengthResult.value}
                </span>
              </div>
            </div>
          )}
        </div>

        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Confirm your new password"
          leftIcon={<LockClosedIcon />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          }
          error={errors.confirmPassword}
          fullWidth
        />

        <Button
          type="submit"
          loading={isLoading}
          disabled={passwordStrengthResult.id < 2 || isLoading}
          fullWidth
          size="lg"
        >
          {isLoading ? 'Updating Password...' : 'Update Password'}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Remember your password?{' '}
          <Link
            href="/login"
            className="text-primary-600 hover:text-primary-800 font-medium"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
