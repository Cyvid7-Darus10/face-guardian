import React from 'react';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

interface AppInfoGridProps {
  createdAt: string;
  updatedAt: string;
}

const AppInfoGrid: React.FC<AppInfoGridProps> = ({ createdAt, updatedAt }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <CalendarIcon className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Created</h3>
        </div>
        <p className="text-gray-700 font-medium">{formatDate(createdAt)}</p>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <ClockIcon className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Last Updated</h3>
        </div>
        <p className="text-gray-700 font-medium">{formatDate(updatedAt)}</p>
      </div>
    </div>
  );
};

export default AppInfoGrid;
