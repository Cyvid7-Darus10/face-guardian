import { useState } from 'react';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { passwordStrength } from 'check-password-strength';
import isEmail from 'validator/lib/isEmail';
import Button from '@/components/Atom/Button';
import Input from '@/components/Atom/Input';

interface PersonalInfoStepProps {
  onNext: () => void;
  onPrevious: () => void;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
  };
  onFormDataChange: (data: any) => void;
  appId?: string;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  onNext,
  onPrevious,
  formData,
  onFormDataChange,
}) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrengthResult = passwordStrength(formData.password);

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (passwordStrengthResult.id < 2) {
      newErrors.password = 'Password is too weak';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    onFormDataChange({ [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Personal Information
        </h2>
        <p className="text-gray-600">
          Please provide your details to create your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={e => handleInputChange('firstName', e.target.value)}
            placeholder="Enter your first name"
            leftIcon={<UserIcon />}
            error={errors.firstName}
            fullWidth
          />

          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={e => handleInputChange('lastName', e.target.value)}
            placeholder="Enter your last name"
            leftIcon={<UserIcon />}
            error={errors.lastName}
            fullWidth
          />
        </div>

        {/* Email Field */}
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={e => handleInputChange('email', e.target.value)}
          placeholder="Enter your email address"
          leftIcon={<EnvelopeIcon />}
          error={errors.email}
          fullWidth
        />

        {/* Password Field */}
        <div>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={e => handleInputChange('password', e.target.value)}
            placeholder="Create a password"
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
          {formData.password && (
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

        {/* Confirm Password Field */}
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={e => handleInputChange('confirmPassword', e.target.value)}
          placeholder="Confirm your password"
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

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-3">
          <div className="flex items-center h-5">
            <input
              id="acceptTerms"
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={e =>
                onFormDataChange({ acceptTerms: e.target.checked })
              }
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
          <div className="text-sm">
            <label htmlFor="acceptTerms" className="text-gray-700">
              I accept the{' '}
              <a
                href="/terms"
                className="text-primary-600 hover:text-primary-800 font-medium"
              >
                Terms and Conditions
              </a>{' '}
              and{' '}
              <a
                href="/privacy"
                className="text-primary-600 hover:text-primary-800 font-medium"
              >
                Privacy Policy
              </a>
            </label>
            {errors.acceptTerms && (
              <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onPrevious}
            size="lg"
          >
            Previous
          </Button>

          <Button
            type="submit"
            size="lg"
            disabled={passwordStrengthResult.id < 2}
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoStep;
