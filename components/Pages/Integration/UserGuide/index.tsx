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
          Get started with Face Guardian by setting up your application and
          integrating the authentication flow.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Step 1: Register Your Application
          </h3>
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-blue-800 text-sm">
              First, register your application in the Face Guardian dashboard to
              get your App ID and configure redirect URLs.
            </p>
          </div>
          <CodeBlock
            code={`# Navigate to Face Guardian Dashboard
https://your-face-guardian-domain.com/integration/application

# Register your application with:
# - Application name
# - Domain (e.g., https://yourapp.com)
# - Redirect URL (e.g., https://yourapp.com/auth/callback)`}
            language="bash"
            label="Application Registration"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Step 2: Basic Integration
          </h3>
          <p className="text-gray-600 mb-4">
            Face Guardian uses OAuth 2.0 flow. You can integrate it using
            standard OAuth libraries or implement the flow directly.
          </p>
          <CodeBlock
            code={`<!-- Simple redirect-based integration -->
<a href="https://your-face-guardian-domain.com/authenticate?appId=YOUR_APP_ID&redirect_to=YOUR_CALLBACK_URL">
  Login with Face Guardian
</a>

<!-- Or using JavaScript -->
<script>
function loginWithFaceGuardian() {
  const appId = 'YOUR_APP_ID';
  const redirectUrl = 'https://yourapp.com/auth/callback';
  const authUrl = \`https://your-face-guardian-domain.com/authenticate?appId=\${appId}&redirect_to=\${redirectUrl}\`;
  window.location.href = authUrl;
}
</script>`}
            language="html"
            label="Basic Integration"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Step 3: Handle OAuth Callback
          </h3>
          <CodeBlock
            code={`// Handle the OAuth callback in your application
// Face Guardian will redirect to: https://yourapp.com/auth/callback?authorizationCode=xxx&redirectUrl=xxx

// Example callback handler (Node.js/Express)
app.get('/auth/callback', async (req, res) => {
  const { authorizationCode, redirectUrl } = req.query;
  
  if (authorizationCode) {
    try {
      // Exchange authorization code for access token
      const tokenResponse = await fetch('https://your-face-guardian-domain.com/api/request-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorizationCode })
      });
      
      const { accessToken } = await tokenResponse.json();
      
      // Get user data
      const userResponse = await fetch('https://your-face-guardian-domain.com/api/get-user', {
        headers: { 'Authorization': \`Bearer \${accessToken}\` }
      });
      
      const userData = await userResponse.json();
      
      // Store user session and redirect
      req.session.user = userData;
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Authentication failed:', error);
      res.redirect('/login?error=auth_failed');
    }
  } else {
    res.redirect('/login?error=no_code');
  }
});`}
            language="javascript"
            label="OAuth Callback Handler"
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
              <strong>Important:</strong> Make sure your domain is registered in
              your Face Guardian application settings and matches exactly with
              your redirect URLs.
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
          Configure your application to work with Face Guardian&apos;s OAuth 2.0
          authentication flow.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Environment Variables
          </h3>
          <CodeBlock
            code={`# .env file
FACE_GUARDIAN_BASE_URL=https://your-face-guardian-domain.com
FACE_GUARDIAN_APP_ID=your_app_id_here
FACE_GUARDIAN_REDIRECT_URL=https://yourdomain.com/auth/callback

# Optional: Session configuration
SESSION_SECRET=your_session_secret_here
SESSION_TIMEOUT=3600000`}
            language="env"
            label="Environment Variables"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            OAuth 2.0 Flow Configuration
          </h3>
          <CodeBlock
            code={`// OAuth configuration object
const faceGuardianConfig = {
  baseUrl: process.env.FACE_GUARDIAN_BASE_URL,
  appId: process.env.FACE_GUARDIAN_APP_ID,
  redirectUrl: process.env.FACE_GUARDIAN_REDIRECT_URL,
  
  // OAuth endpoints
  endpoints: {
    authenticate: '/authenticate',
    requestToken: '/api/request-token',
    getUser: '/api/get-user',
    validateApp: '/api/authenticate'
  }
};

// Helper function to generate auth URL
function generateAuthUrl(appId, redirectUrl) {
  const params = new URLSearchParams({
    appId: appId,
    redirect_to: redirectUrl
  });
  
  return \`\${faceGuardianConfig.baseUrl}/authenticate?\${params.toString()}\`;
}`}
            language="javascript"
            label="OAuth Configuration"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            API Endpoints Reference
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-medium text-gray-900">
                    Endpoint
                  </th>
                  <th className="text-left py-2 font-medium text-gray-900">
                    Method
                  </th>
                  <th className="text-left py-2 font-medium text-gray-900">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-2 font-mono text-blue-600">
                    /authenticate
                  </td>
                  <td className="py-2 text-gray-600">GET</td>
                  <td className="py-2 text-gray-600">
                    Initiate OAuth flow with face authentication
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-blue-600">
                    /api/authenticate
                  </td>
                  <td className="py-2 text-gray-600">POST</td>
                  <td className="py-2 text-gray-600">
                    Validate app credentials and authorization
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-blue-600">
                    /api/request-token
                  </td>
                  <td className="py-2 text-gray-600">POST</td>
                  <td className="py-2 text-gray-600">
                    Exchange authorization code for access token
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-mono text-blue-600">
                    /api/get-user
                  </td>
                  <td className="py-2 text-gray-600">GET</td>
                  <td className="py-2 text-gray-600">
                    Get user profile data with access token
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            User Data Structure
          </h3>
          <CodeBlock
            code={`// User data returned from /api/get-user
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "avatar_url": "https://example.com/avatar.jpg",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z",
  "email_verified": true,
  "face_registered": true
}`}
            language="json"
            label="User Data Structure"
          />
        </div>
      </div>
    </div>
  );

  const renderExamples = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Code Examples</h2>
        <p className="text-gray-600 mb-6">
          Practical examples for integrating Face Guardian authentication into
          different types of applications.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Frontend Integration (HTML/JavaScript)
          </h3>
          <CodeBlock
            code={`<!DOCTYPE html>
<html>
<head>
    <title>Face Guardian Integration</title>
</head>
<body>
    <div id="app">
        <h1>My Application</h1>
        <button onclick="loginWithFaceGuardian()">Login with Face Guardian</button>
        <div id="user-info" style="display: none;">
            <h2>Welcome!</h2>
            <p>Name: <span id="user-name"></span></p>
            <p>Email: <span id="user-email"></span></p>
            <button onclick="logout()">Logout</button>
        </div>
    </div>

    <script>
        const config = {
            baseUrl: 'https://your-face-guardian-domain.com',
            appId: 'YOUR_APP_ID',
            redirectUrl: window.location.origin + '/auth/callback'
        };

        function loginWithFaceGuardian() {
            const authUrl = \`\${config.baseUrl}/authenticate?appId=\${config.appId}&redirect_to=\${config.redirectUrl}\`;
            window.location.href = authUrl;
        }

        function logout() {
            localStorage.removeItem('faceGuardianToken');
            document.getElementById('user-info').style.display = 'none';
            location.reload();
        }

        // Handle OAuth callback
        if (window.location.pathname === '/auth/callback') {
            const urlParams = new URLSearchParams(window.location.search);
            const authCode = urlParams.get('authorizationCode');
            
            if (authCode) {
                handleAuthCallback(authCode);
            }
        }

        async function handleAuthCallback(authCode) {
            try {
                // Exchange code for token
                const tokenResponse = await fetch(\`\${config.baseUrl}/api/request-token\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ authorizationCode: authCode })
                });
                
                const { accessToken } = await tokenResponse.json();
                localStorage.setItem('faceGuardianToken', accessToken);
                
                // Get user data
                const userResponse = await fetch(\`\${config.baseUrl}/api/get-user\`, {
                    headers: { 'Authorization': \`Bearer \${accessToken}\` }
                });
                
                const userData = await userResponse.json();
                displayUserInfo(userData);
                
            } catch (error) {
                console.error('Authentication failed:', error);
                alert('Authentication failed. Please try again.');
            }
        }

        function displayUserInfo(user) {
            document.getElementById('user-name').textContent = \`\${user.first_name} \${user.last_name}\`;
            document.getElementById('user-email').textContent = user.email;
            document.getElementById('user-info').style.display = 'block';
        }
    </script>
</body>
</html>`}
            language="html"
            label="Frontend Integration"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            React Integration
          </h3>
          <CodeBlock
            code={`import React, { useState, useEffect } from 'react';

const FaceGuardianAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const config = {
    baseUrl: 'https://your-face-guardian-domain.com',
    appId: 'YOUR_APP_ID',
    redirectUrl: window.location.origin + '/auth/callback'
  };

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('faceGuardianToken');
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const loginWithFaceGuardian = () => {
    const authUrl = \`\${config.baseUrl}/authenticate?appId=\${config.appId}&redirect_to=\${config.redirectUrl}\`;
    window.location.href = authUrl;
  };

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(\`\${config.baseUrl}/api/get-user\`, {
        headers: { 'Authorization': \`Bearer \${token}\` }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('faceGuardianToken');
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      localStorage.removeItem('faceGuardianToken');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('faceGuardianToken');
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.first_name}!</h2>
          <p>Email: {user.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>Please Login</h2>
          <button onClick={loginWithFaceGuardian}>
            Login with Face Guardian
          </button>
        </div>
      )}
    </div>
  );
};

export default FaceGuardianAuth;`}
            language="javascript"
            label="React Component"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Node.js/Express Backend
          </h3>
          <CodeBlock
            code={`const express = require('express');
const session = require('express-session');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

const config = {
  baseUrl: process.env.FACE_GUARDIAN_BASE_URL,
  appId: process.env.FACE_GUARDIAN_APP_ID,
  redirectUrl: process.env.FACE_GUARDIAN_REDIRECT_URL
};

// Route to initiate Face Guardian authentication
app.get('/auth/login', (req, res) => {
  const authUrl = \`\${config.baseUrl}/authenticate?appId=\${config.appId}&redirect_to=\${config.redirectUrl}\`;
  res.redirect(authUrl);
});

// OAuth callback handler
app.get('/auth/callback', async (req, res) => {
  const { authorizationCode } = req.query;
  
  if (!authorizationCode) {
    return res.redirect('/login?error=no_code');
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch(\`\${config.baseUrl}/api/request-token\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorizationCode })
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const { accessToken } = await tokenResponse.json();

    // Get user data
    const userResponse = await fetch(\`\${config.baseUrl}/api/get-user\`, {
      headers: { 'Authorization': \`Bearer \${accessToken}\` }
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData = await userResponse.json();

    // Store user in session
    req.session.user = userData;
    req.session.accessToken = accessToken;

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Authentication failed:', error);
    res.redirect('/login?error=auth_failed');
  }
});

// Protected route example
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.json({
    message: 'Welcome to your dashboard!',
    user: req.session.user
  });
});

// Logout route
app.post('/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction failed:', err);
    }
    res.redirect('/login');
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`}
            language="javascript"
            label="Node.js Backend"
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
