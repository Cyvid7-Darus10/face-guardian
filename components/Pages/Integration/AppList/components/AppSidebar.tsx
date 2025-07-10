import React from 'react';
import {
  CubeIcon,
  GlobeAltIcon,
  CalendarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { App } from '../index';

interface AppSidebarProps {
  apps: App[];
  selectedApp: App | null;
  onSelectApp: (app: App) => void;
  viewMode: 'grid' | 'list';
  searchQuery: string;
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  apps,
  selectedApp,
  onSelectApp,
  viewMode,
  searchQuery,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return formatDate(dateString);
    }
  };

  if (apps.length === 0) {
    return (
      <div className="text-center py-12">
        <CubeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">
          {searchQuery
            ? 'No apps found matching your search'
            : 'No applications created yet'}
        </p>
      </div>
    );
  }

  const AppCard = ({ app }: { app: App }) => {
    const isSelected = selectedApp?.id === app.id;

    return (
      <button
        onClick={() => onSelectApp(app)}
        className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
          isSelected
            ? 'border-blue-500 bg-blue-50 shadow-md'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isSelected ? 'bg-blue-100' : 'bg-gray-100'
            }`}
          >
            <CubeIcon
              className={`w-5 h-5 ${
                isSelected ? 'text-blue-600' : 'text-gray-600'
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={`font-medium truncate ${
                isSelected ? 'text-blue-900' : 'text-gray-900'
              }`}
            >
              {app.name}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              <GlobeAltIcon className="w-3 h-3 text-gray-400" />
              <p className="text-sm text-gray-500 truncate">{app.domain}</p>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <ClockIcon className="w-3 h-3 text-gray-400" />
              <p className="text-xs text-gray-400">
                Updated {getRelativeTime(app.updated_at)}
              </p>
            </div>
          </div>
        </div>
      </button>
    );
  };

  const AppListItem = ({ app }: { app: App }) => {
    const isSelected = selectedApp?.id === app.id;

    return (
      <button
        onClick={() => onSelectApp(app)}
        className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
          isSelected
            ? 'border-blue-500 bg-blue-50 shadow-sm'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${
                isSelected ? 'bg-blue-100' : 'bg-gray-100'
              }`}
            >
              <CubeIcon
                className={`w-4 h-4 ${
                  isSelected ? 'text-blue-600' : 'text-gray-600'
                }`}
              />
            </div>
            <div className="min-w-0">
              <h3
                className={`font-medium truncate ${
                  isSelected ? 'text-blue-900' : 'text-gray-900'
                }`}
              >
                {app.name}
              </h3>
              <p className="text-sm text-gray-500 truncate">{app.domain}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-gray-400">
              {getRelativeTime(app.updated_at)}
            </p>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-3">
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-3">
          {apps.map(app => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {apps.map(app => (
            <AppListItem key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppSidebar;
