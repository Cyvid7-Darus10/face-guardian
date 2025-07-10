import React from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { App } from '@/types';

interface AppConfigCardProps {
  app: App;
}

const AppConfigCard: React.FC<AppConfigCardProps> = ({ app }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900">
          Current Configuration
        </h3>
        <p className="text-gray-600 mt-1">Review your application settings</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Application Name
            </label>
            <p className="text-lg font-semibold text-gray-900">{app.name}</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Domain
            </label>
            <div className="flex items-center gap-3">
              <p className="text-lg font-semibold text-gray-900 truncate">
                {app.domain}
              </p>
              <a
                href={app.domain}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 hover:border-blue-300 transition-colors flex-shrink-0 shadow-sm"
                title="Visit website"
              >
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                Visit
              </a>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Redirect URL
            </label>
            <p className="text-lg font-semibold text-gray-900 break-all">
              {app.redirect_to}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppConfigCard;
