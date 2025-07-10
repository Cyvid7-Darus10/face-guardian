import React, { FormHTMLAttributes } from 'react';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const Form: React.FC<FormProps> = ({
  title,
  description,
  children,
  className = '',
  ...props
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {(title || description) && (
        <div className="px-6 py-4 border-b border-gray-200">
          {title && (
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          )}
          {description && <p className="text-gray-600 mt-1">{description}</p>}
        </div>
      )}
      <div className="p-6">
        <form className={`space-y-6 ${className}`} {...props}>
          {children}
        </form>
      </div>
    </div>
  );
};

export default Form;
