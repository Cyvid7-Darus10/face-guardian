import React from 'react';

interface ProgressStep {
  id: string;
  title: string;
  isCompleted?: boolean;
  isCurrent?: boolean;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  className = '',
  orientation = 'vertical',
}) => {
  const getStepClasses = (step: ProgressStep) => {
    if (step.isCompleted) {
      return 'bg-green-500';
    } else if (step.isCurrent) {
      return 'bg-blue-500';
    } else {
      return 'bg-gray-300';
    }
  };

  const getTextClasses = (step: ProgressStep) => {
    if (step.isCompleted) {
      return 'text-green-600';
    } else if (step.isCurrent) {
      return 'text-blue-600';
    } else {
      return 'text-gray-500';
    }
  };

  if (orientation === 'horizontal') {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full flex-shrink-0 ${getStepClasses(step)}`}
              />
              <span className={`text-sm font-medium ${getTextClasses(step)}`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="w-8 h-px bg-gray-300 flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {steps.map(step => (
        <div key={step.id} className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full flex-shrink-0 ${getStepClasses(step)}`}
          />
          <span className={`text-sm ${getTextClasses(step)}`}>
            {step.title}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;
