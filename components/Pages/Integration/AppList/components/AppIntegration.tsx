import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { CodeBlock } from '@/components/Atom';
import { App } from '@/types';

interface AppIntegrationProps {
  app: App;
}

const AppIntegration: React.FC<AppIntegrationProps> = ({ app }) => {
  const integrationCode = `import React from 'react';
import ReactDOM from 'react-dom';
import { FaceLogin, useUserData } from 'face-guardian';

const App = () => {
  const userData = useUserData();

  return (
    <React.StrictMode>
      <FaceLogin
        appId="${app.id}"
        buttonStyles={{ background: '#3b82f6', fontSize: '16px' }}
        buttonText="Login with Face Guardian"
      />
      {userData && <div>Welcome, {userData.first_name}!</div>}
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`;

  const installationCode = `npm install face-guardian`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Integration Guide
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get started with Face Guardian authentication in just two simple
          steps.
        </p>
      </div>

      {/* Installation */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-xl font-semibold text-gray-900">
            1. Install Face Guardian
          </h4>
          <p className="text-gray-600 mt-1">
            Add the Face Guardian library to your project
          </p>
        </div>
        <div className="p-6">
          <CodeBlock
            code={installationCode}
            language="bash"
            label="Installation"
          />
        </div>
      </div>

      {/* Basic Implementation */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-xl font-semibold text-gray-900">
            2. Basic Implementation
          </h4>
          <p className="text-gray-600 mt-1">
            Add Face Guardian authentication to your React app
          </p>
        </div>
        <div className="p-6">
          <CodeBlock
            code={integrationCode}
            language="javascript"
            label="React Integration"
          />
          <div className="mt-4 bg-blue-50 rounded-lg p-4">
            <h5 className="font-semibold text-blue-900 mb-2">Key Features:</h5>
            <ul className="text-blue-800 space-y-1">
              <li>
                • <strong>FaceLogin</strong> - Pre-built authentication
                component
              </li>
              <li>
                • <strong>useUserData</strong> - Hook to access authenticated
                user data
              </li>
              <li>
                • <strong>Custom styling</strong> - Customize button appearance
                and text
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security Note */}
      <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <ExclamationTriangleIcon className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-amber-900 mb-2">
              Security Best Practices
            </h4>
            <ul className="text-amber-800 space-y-1 text-sm">
              <li>
                • Store your App ID in environment variables for production
              </li>
              <li>• Ensure your redirect URLs use HTTPS in production</li>
              <li>
                • Regularly review and rotate your application credentials
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppIntegration;
