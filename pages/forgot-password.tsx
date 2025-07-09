import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import isEmail from 'validator/lib/isEmail';

import AuthLayout from '@/components/Common/AuthLayout';
import Button from '@/components/Atom/Button';
import Input from '@/components/Atom/Input';

const ForgotPassword = () => {
  const supabaseClient = useSupabaseClient();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!isEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
        toast.error(error.message);
      } else {
        setIsSuccess(true);
        toast.success('Password reset email sent!');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We've sent you a password reset link"
      >
        <div className="text-center space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
              <EnvelopeIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Email Sent Successfully
            </h3>
            <p className="text-green-700">
              We&apos;ve sent a password reset link to{' '}
              <span className="font-medium">{email}</span>
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Next steps:</strong>
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1 text-left">
              <li>• Check your email inbox (and spam folder)</li>
              <li>• Click the password reset link</li>
              <li>• Enter your new password</li>
              <li>• Sign in with your new password</li>
            </ul>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => {
                setIsSuccess(false);
                setEmail('');
              }}
              variant="outline"
              fullWidth
            >
              Send Another Email
            </Button>

            <Link href="/login">
              <Button variant="ghost" fullWidth>
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email to reset your password"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Don&apos;t worry! Enter your email address and we&apos;ll send you a
            link to reset your password.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter your email address"
          leftIcon={<EnvelopeIcon />}
          error={error && !isEmail(email) ? error : ''}
          fullWidth
        />

        <Button
          type="submit"
          loading={isLoading}
          disabled={!email || isLoading}
          fullWidth
          size="lg"
        >
          {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
        </Button>
      </form>

      <div className="mt-8 text-center space-y-4">
        <p className="text-sm text-gray-600">
          Remember your password?{' '}
          <Link
            href="/login"
            className="text-primary-600 hover:text-primary-800 font-medium"
          >
            Sign in here
          </Link>
        </p>

        <Link href="/login">
          <Button variant="ghost" fullWidth>
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
