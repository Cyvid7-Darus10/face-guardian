import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  lines?: number;
  animated?: boolean;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  width = 'w-full',
  height = 'h-4',
  rounded = 'md',
  lines = 1,
  animated = true,
}) => {
  const baseClasses = 'bg-gray-200';

  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const animationClasses = animated ? 'animate-pulse' : '';

  if (lines === 1) {
    return (
      <div
        className={`${baseClasses} ${width} ${height} ${roundedClasses[rounded]} ${animationClasses} ${className}`}
      >
        {animated && (
          <div className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded-inherit" />
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`${baseClasses} ${width} ${height} ${roundedClasses[rounded]} ${animationClasses} ${
            index === lines - 1 ? 'w-3/4' : ''
          }`}
        >
          {animated && (
            <div className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite] rounded-inherit" />
          )}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
