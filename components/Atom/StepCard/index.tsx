import React from 'react';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive?: boolean;
  isCompleted?: boolean;
  onClick?: () => void;
  className?: string;
}

const StepCard: React.FC<StepCardProps> = ({
  number,
  title,
  description,
  icon,
  isActive = false,
  isCompleted = false,
  onClick,
  className = '',
}) => {
  const getCardClasses = () => {
    let classes = 'p-6 rounded-xl border transition-all duration-200 ';

    if (isCompleted) {
      classes += 'border-green-500 bg-green-50 shadow-lg';
    } else if (isActive) {
      classes += 'border-blue-500 bg-blue-50 shadow-lg';
    } else {
      classes += 'border-gray-200 hover:border-gray-300 hover:shadow-md';
    }

    if (onClick) {
      classes += ' cursor-pointer';
    }

    return classes + ' ' + className;
  };

  const getIconClasses = () => {
    if (isCompleted) {
      return 'bg-green-600 text-white';
    } else if (isActive) {
      return 'bg-blue-600 text-white';
    } else {
      return 'bg-gray-100 text-gray-600';
    }
  };

  const getStepBadgeClasses = () => {
    if (isCompleted) {
      return 'bg-green-100 text-green-800';
    } else if (isActive) {
      return 'bg-blue-100 text-blue-800';
    } else {
      return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className={getCardClasses()} onClick={onClick}>
      <div className="flex items-start gap-4">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconClasses()}`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-sm font-medium px-2 py-1 rounded ${getStepBadgeClasses()}`}
            >
              {isCompleted ? '✓' : `Step ${number}`}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default StepCard;
