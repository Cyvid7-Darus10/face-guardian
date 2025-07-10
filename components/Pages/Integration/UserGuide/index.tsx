import { useState } from 'react';
import {
  RocketLaunchIcon,
  DocumentTextIcon,
  CubeIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  CommandLineIcon,
  CloudIcon,
  CogIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

// Import atomic components
import CodeBlock from '@/components/Atom/CodeBlock';
import StepCard from '@/components/Atom/StepCard';
import TabNavigation from '@/components/Common/TabNavigation';

const UserGuide = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'installation' | 'configuration' | 'examples' | 'deployment'
  >('overview');

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <DocumentTextIcon className="w-4 h-4" />,
    },
    {
      id: 'installation',
      label: 'Installation',
      icon: <CommandLineIcon className="w-4 h-4" />,
    },
    {
      id: 'configuration',
      label: 'Configuration',
      icon: <CogIcon className="w-4 h-4" />,
    },
    {
      id: 'examples',
      label: 'Examples',
      icon: <CubeIcon className="w-4 h-4" />,
    },
    {
      id: 'deployment',
      label: 'Deployment',
      icon: <CloudIcon className="w-4 h-4" />,
    },
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <RocketLaunchIcon className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Face Guardian Integration
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Integrate Face Guardian&apos;s facial authentication into your
          application in just a few minutes. Our OAuth 2.0 provider makes it
          easy to add secure, passwordless authentication.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StepCard
          number={1}
          title="Create Application"
          description="Register your application and get your client credentials"
          icon={<CubeIcon className="w-5 h-5" />}
        />
        <StepCard
          number={2}
          title="Install SDK"
          description="Add our lightweight SDK to your project"
          icon={<CommandLineIcon className="w-5 h-5" />}
        />
        <StepCard
          number={3}
          title="Configure OAuth"
          description="Set up OAuth 2.0 flow with your credentials"
          icon={<CogIcon className="w-5 h-5" />}
        />
        <StepCard
          number={4}
          title="Deploy"
          description="Go live with facial authentication"
          icon={<CloudIcon className="w-5 h-5" />}
        />
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <RocketLaunchIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Ready to get started?
            </h3>
            <p className="text-gray-600 mb-4">
              Complete integration typically takes less than 30 minutes with our
              comprehensive guides.
            </p>
            <button
              onClick={() => setActiveTab('installation')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Integration
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInstallation = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Installation</h2>
        <p className="text-gray-600 mb-6">
          Choose your preferred installation method based on your project setup.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            NPM Installation
          </h3>
          <CodeBlock
            code={`npm install @face-guardian/oauth-client`}
            language="bash"
            label="NPM Install"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Yarn Installation
          </h3>
          <CodeBlock
            code={`yarn add @face-guardian/oauth-client`}
            language="bash"
            label="Yarn Install"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            CDN Installation
          </h3>
          <CodeBlock
            code={`<script src="https://cdn.face-guardian.com/oauth-client/latest/face-guardian.min.js"></script>`}
            language="html"
            label="CDN Script"
          />
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Make sure your domain is registered in your
              Face Guardian application settings before testing the integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfiguration = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Configuration</h2>
        <p className="text-gray-600 mb-6">
          Set up your Face Guardian OAuth client with your application
          credentials.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Environment Variables
          </h3>
          <CodeBlock
            code={`# .env file
FACE_GUARDIAN_CLIENT_ID=your_client_id_here
FACE_GUARDIAN_CLIENT_SECRET=your_client_secret_here
FACE_GUARDIAN_REDIRECT_URI=https://yourdomain.com/auth/callback
FACE_GUARDIAN_SCOPE=openid profile email`}
            language="env"
            label="Environment Variables"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Basic Setup
          </h3>
          <CodeBlock
            code={`import { FaceGuardianClient } from '@face-guardian/oauth-client';

const faceGuardian = new FaceGuardianClient({
  clientId: process.env.FACE_GUARDIAN_CLIENT_ID,
  clientSecret: process.env.FACE_GUARDIAN_CLIENT_SECRET,
  redirectUri: process.env.FACE_GUARDIAN_REDIRECT_URI,
  scope: 'openid profile email'
});`}
            language="javascript"
            label="Basic Setup"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Configuration Options
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-medium text-gray-900">
                    Option
                  </th>
                  <th className="text-left py-2 font-medium text-gray-900">
                    Type
                  </th>
                  <th className="text-left py-2 font-medium text-gray-900">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-2 font-mono text-blue-600">clientId</td>
                  <td className="py-2 text-gray-600">string</td>
                  <td className="py-2 text-gray-600">
                    Your application&apos;s client ID
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-blue-600">clientSecret</td>
                  <td className="py-2 text-gray-600">string</td>
                  <td className="py-2 text-gray-600">
                    Your application&apos;s client secret
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-blue-600">redirectUri</td>
                  <td className="py-2 text-gray-600">string</td>
                  <td className="py-2 text-gray-600">OAuth callback URL</td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-blue-600">scope</td>
                  <td className="py-2 text-gray-600">string</td>
                  <td className="py-2 text-gray-600">
                    OAuth scope permissions
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExamples = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Examples</h2>
        <p className="text-gray-600 mb-6">
          Common integration patterns and usage examples.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Initiate Authentication
          </h3>
          <CodeBlock
            code={`// Redirect user to Face Guardian login
const authUrl = faceGuardian.getAuthorizationUrl({
  state: 'random_state_string',
  codeChallenge: 'your_code_challenge',
  codeChallengeMethod: 'S256'
});

// Redirect user
window.location.href = authUrl;`}
            language="javascript"
            label="Initiate Auth"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Handle Callback
          </h3>
          <CodeBlock
            code={`// Handle OAuth callback
app.get('/auth/callback', async (req, res) => {
  const { code, state } = req.query;
  
  try {
    // Exchange code for access token
    const tokenResponse = await faceGuardian.exchangeCodeForToken(code, {
      codeVerifier: 'your_code_verifier'
    });
    
    // Get user profile
    const userProfile = await faceGuardian.getUserProfile(tokenResponse.access_token);
    
    // Store user session
    req.session.user = userProfile;
    
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Authentication failed:', error);
    res.redirect('/login?error=auth_failed');
  }
});`}
            language="javascript"
            label="Handle Callback"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            React Hook Example
          </h3>
          <CodeBlock
            code={`import { useState, useEffect } from 'react';
import { FaceGuardianClient } from '@face-guardian/oauth-client';

const useFaceGuardianAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const faceGuardian = new FaceGuardianClient({
    clientId: process.env.REACT_APP_FACE_GUARDIAN_CLIENT_ID,
    redirectUri: window.location.origin + '/auth/callback'
  });

  const login = () => {
    const authUrl = faceGuardian.getAuthorizationUrl();
    window.location.href = authUrl;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('face_guardian_token');
  };

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('face_guardian_token');
    if (token) {
      faceGuardian.getUserProfile(token)
        .then(profile => setUser(profile))
        .catch(() => localStorage.removeItem('face_guardian_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return { user, loading, login, logout };
};

export default useFaceGuardianAuth;`}
            language="javascript"
            label="React Hook"
          />
        </div>
      </div>
    </div>
  );

  const renderDeployment = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Deployment</h2>
        <p className="text-gray-600 mb-6">
          Best practices for deploying Face Guardian integration in production.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Security Checklist
          </h3>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="space-y-3">
              {[
                'Store client secrets securely using environment variables',
                'Use HTTPS for all OAuth redirect URIs',
                'Validate state parameters to prevent CSRF attacks',
                'Implement proper session management',
                'Use PKCE for public clients (mobile apps, SPAs)',
                'Regularly rotate client secrets',
                'Monitor authentication logs for suspicious activity',
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Environment Setup
          </h3>
          <CodeBlock
            code={`# Production environment variables
FACE_GUARDIAN_CLIENT_ID=prod_client_id
FACE_GUARDIAN_CLIENT_SECRET=prod_client_secret
FACE_GUARDIAN_REDIRECT_URI=https://yourdomain.com/auth/callback
FACE_GUARDIAN_ENVIRONMENT=production

# Optional: Enable debug logging
FACE_GUARDIAN_DEBUG=false`}
            language="env"
            label="Production Env"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Error Handling
          </h3>
          <CodeBlock
            code={`// Comprehensive error handling
try {
  const tokenResponse = await faceGuardian.exchangeCodeForToken(code);
  const userProfile = await faceGuardian.getUserProfile(tokenResponse.access_token);
  
  // Success handling
  handleSuccessfulAuth(userProfile);
} catch (error) {
  switch (error.type) {
    case 'invalid_grant':
      // Handle expired/invalid authorization code
      redirectToLogin('Code expired. Please try again.');
      break;
    case 'invalid_client':
      // Handle invalid client credentials
      logError('Invalid client credentials', error);
      showError('Configuration error. Please contact support.');
      break;
    case 'network_error':
      // Handle network issues
      showError('Network error. Please check your connection.');
      break;
    default:
      // Handle unknown errors
      logError('Unknown authentication error', error);
      showError('Authentication failed. Please try again.');
  }
}`}
            language="javascript"
            label="Error Handling"
          />
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'installation':
        return renderInstallation();
      case 'configuration':
        return renderConfiguration();
      case 'examples':
        return renderExamples();
      case 'deployment':
        return renderDeployment();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Face Guardian Integration Guide
        </h1>
        <p className="text-lg text-gray-600">
          Complete guide to integrating facial authentication into your
          application
        </p>
      </div>

      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={tabId => setActiveTab(tabId as any)}
        className="mb-8"
      />

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-8">{renderTabContent()}</div>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          Need help? Contact our support team
        </div>
        <div className="flex gap-2">
          {activeTab !== 'overview' && (
            <button
              onClick={() => {
                const currentIndex = tabs.findIndex(
                  tab => tab.id === activeTab
                );
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1].id as any);
                }
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
          )}
          {activeTab !== 'deployment' && (
            <button
              onClick={() => {
                const currentIndex = tabs.findIndex(
                  tab => tab.id === activeTab
                );
                if (currentIndex < tabs.length - 1) {
                  setActiveTab(tabs[currentIndex + 1].id as any);
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Next
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
