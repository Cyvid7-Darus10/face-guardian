import React from 'react';
import Link from 'next/link';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
}

interface QuickActionCardProps {
  title: string;
  actions: QuickAction[];
  className?: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  actions,
  className = '',
}) => {
  const getIconBackgroundColor = (color: string = 'blue') => {
    const colors = {
      blue: 'bg-blue-100',
      green: 'bg-green-100',
      purple: 'bg-purple-100',
      red: 'bg-red-100',
      yellow: 'bg-yellow-100',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconTextColor = (color: string = 'blue') => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      red: 'text-red-600',
      yellow: 'text-yellow-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const renderAction = (action: QuickAction) => {
    const content = (
      <div className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${getIconBackgroundColor(action.color)}`}
        >
          <div className={`w-4 h-4 ${getIconTextColor(action.color)}`}>
            {action.icon}
          </div>
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">{action.title}</p>
          <p className="text-sm text-gray-500">{action.description}</p>
        </div>
      </div>
    );

    if (action.href) {
      return (
        <Link key={action.title} href={action.href}>
          {content}
        </Link>
      );
    }

    return (
      <button key={action.title} onClick={action.onClick} className="w-full">
        {content}
      </button>
    );
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}
    >
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6 space-y-3">{actions.map(renderAction)}</div>
    </div>
  );
};

export default QuickActionCard;
