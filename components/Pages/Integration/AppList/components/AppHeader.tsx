import React from 'react';
import { CubeIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { App } from '@/types';

interface AppHeaderProps {
  app: App;
}

const AppHeader: React.FC<AppHeaderProps> = ({ app }) => {
  return (
    <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
          <CubeIcon className="w-7 h-7 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{app.name}</h1>
          <p className="text-gray-600 flex items-center gap-2 mt-1">
            <GlobeAltIcon className="w-4 h-4" />
            {app.domain}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
