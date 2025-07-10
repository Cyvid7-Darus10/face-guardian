import React, { useState } from 'react';
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

interface CodeBlockProps {
  code: string;
  language: string;
  label: string;
  className?: string;
  showHeader?: boolean;
  showCopy?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  label,
  className = '',
  showHeader = true,
  showCopy = true,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, label: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(label);
      toast.success(`${label} copied to clipboard!`);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  return (
    <div
      className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}
    >
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400 text-sm ml-2">{language}</span>
          </div>
          {showCopy && (
            <button
              onClick={() => copyToClipboard(code, label)}
              className="flex items-center gap-2 px-3 py-1 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
            >
              {copiedCode === label ? (
                <CheckIcon className="w-4 h-4 text-green-400" />
              ) : (
                <ClipboardDocumentIcon className="w-4 h-4" />
              )}
              {copiedCode === label ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
      )}
      <pre className="p-4 text-sm text-gray-300 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
