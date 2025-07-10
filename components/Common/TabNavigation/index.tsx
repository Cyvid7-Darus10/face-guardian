import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  variant = 'default',
}) => {
  const getTabClasses = (tab: Tab, isActive: boolean) => {
    const baseClasses =
      'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors';

    if (tab.disabled) {
      return `${baseClasses} text-gray-400 cursor-not-allowed`;
    }

    switch (variant) {
      case 'pills':
        return `${baseClasses} rounded-md ${
          isActive
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`;

      case 'underline':
        return `${baseClasses} border-b-2 ${
          isActive
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
        }`;

      default:
        return `${baseClasses} rounded-md ${
          isActive
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`;
    }
  };

  const getContainerClasses = () => {
    switch (variant) {
      case 'pills':
        return 'flex gap-2';
      case 'underline':
        return 'flex border-b border-gray-200';
      default:
        return 'flex gap-2 p-1 bg-gray-100 rounded-lg';
    }
  };

  return (
    <div className={`${getContainerClasses()} ${className}`}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            className={getTabClasses(tab, isActive)}
            disabled={tab.disabled}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabNavigation;
