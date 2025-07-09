import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

interface Step {
  id: number;
  title: string;
  description?: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  showDescriptions?: boolean;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  className = '',
  showDescriptions = true,
}) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                currentStep >= step.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {currentStep > step.id ? (
                <CheckIcon className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </div>

            {showDescriptions && (
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500">{step.description}</p>
                )}
              </div>
            )}

            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 transition-colors duration-200 ${
                  currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
