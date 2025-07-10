import React from 'react';

interface ActivityItem {
  id: string;
  appName: string;
  action: string;
  timestamp: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
}

interface RecentActivityProps {
  activities: ActivityItem[];
  title?: string;
  emptyMessage?: string;
  className?: string;
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  title = 'Recent Activity',
  emptyMessage = 'No recent activity',
  className = '',
}) => {
  const getActivityColor = (color: string = 'blue') => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}
    >
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            {emptyMessage}
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map(activity => (
              <div key={activity.id} className="flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getActivityColor(activity.color)}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.appName}
                    </p>
                    <p className="text-xs text-gray-400 flex-shrink-0 ml-2">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.action}
                  </p>
                </div>
                {activity.icon && (
                  <div className="text-gray-400 flex-shrink-0">
                    {activity.icon}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
