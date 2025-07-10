import React from 'react';
import Link from 'next/link';
import ProgressIndicator from '@/components/Atom/ProgressIndicator';

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  isActive?: boolean;
}

interface NavigationSidebarProps {
  title: string;
  items: NavigationItem[];
  currentItem?: string;
  showProgress?: boolean;
  progressSteps?: Array<{
    id: string;
    title: string;
    isCompleted?: boolean;
    isCurrent?: boolean;
  }>;
  className?: string;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  title,
  items,
  currentItem,
  showProgress = false,
  progressSteps = [],
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8 ${className}`}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>

      <nav className="space-y-2">
        {items.map(item => {
          const isActive = item.isActive || item.title === currentItem;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div
                className={`flex-shrink-0 mt-0.5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className={`font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'}`}
                >
                  {item.title}
                </div>
                <div
                  className={`text-sm mt-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
                >
                  {item.description}
                </div>
              </div>
              {isActive && (
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {showProgress && progressSteps.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Progress</h3>
          <ProgressIndicator steps={progressSteps} />
        </div>
      )}
    </div>
  );
};

export default NavigationSidebar;
