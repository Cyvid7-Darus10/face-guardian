import React, { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  showSecurityBadge?: boolean;
  appData?: {
    name: string;
    domain: string;
  };
  className?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showLogo = true,
  showSecurityBadge = true,
  appData,
  className = '',
}) => {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4 ${className}`}
    >
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 animate-fadeIn">
        {/* Logo Section */}
        {showLogo && (
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <Image
                src="/fg-logo.png"
                alt="Face Guardian"
                width={80}
                height={80}
                className="mx-auto mb-4"
              />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
          </div>
        )}

        {/* App Context (if applicable) */}
        {appData && (
          <div className="bg-primary-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-primary-800 font-medium">
              Authenticating for
            </p>
            <p className="text-lg font-semibold text-primary-900">
              {appData.name}
            </p>
            <p className="text-sm text-primary-600">{appData.domain}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="mb-6">{children}</div>

        {/* Security Badge */}
        {showSecurityBadge && (
          <div className="text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <ShieldCheckIcon className="w-4 h-4 mr-1" />
              Secured by Face Guardian
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;
