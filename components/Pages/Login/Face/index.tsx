import Link from 'next/link';
import FaceRecognition from '../FaceRecognition';

// New design system components
import AuthLayout from '@/components/Common/AuthLayout';
import Button from '@/components/Atom/Button';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

const Face = ({ appData }: { appData?: any }) => {
  return (
    <AuthLayout
      title="Face Guardian"
      subtitle="Secure face authentication"
      appData={appData}
    >
      {/* Face Recognition Component */}
      <div className="mb-8">
        <FaceRecognition />
      </div>

      {/* Action Links */}
      <div className="space-y-4">
        {/* Email Login Alternative */}
        <Link
          href={appData ? `/login/email?appId=${appData?.id}` : '/login/email'}
        >
          <Button
            variant="outline"
            fullWidth
            className="flex items-center justify-center"
          >
            <EnvelopeIcon className="w-5 h-5 mr-2" />
            Use Email Instead
          </Button>
        </Link>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              href={appData ? `/register?appId=${appData?.id}` : '/register'}
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Face;
