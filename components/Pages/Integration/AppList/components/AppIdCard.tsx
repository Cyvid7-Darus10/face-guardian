import React, { useState } from 'react';
import {
  CubeIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Button from '@/components/Atom/Button';

interface AppIdCardProps {
  appId: string;
}

const AppIdCard: React.FC<AppIdCardProps> = ({ appId }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(appId).then(() => {
      setCopied(true);
      toast.success('App ID copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <CubeIcon className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Application ID
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Use this ID to integrate Face Guardian authentication into your
            application.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm font-mono text-gray-900 shadow-sm">
              {appId}
            </code>
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className={
                copied ? 'border-green-300 text-green-600 bg-green-50' : ''
              }
            >
              {copied ? (
                <>
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppIdCard;
