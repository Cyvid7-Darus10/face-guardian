export const installation = `
## Getting Started

Face Guardian uses OAuth 2.0 flow for authentication. Follow these steps to integrate it into your application:

### Step 1: Register Your Application

First, register your application in the Face Guardian dashboard:

1. Navigate to the Face Guardian dashboard
2. Go to **Integration** > **Application**
3. Click **"Create New Application"**
4. Fill in your application details:
   - **Application Name**: Your app's name
   - **Domain**: Your app's domain (e.g., https://yourapp.com)
   - **Redirect URL**: OAuth callback URL (e.g., https://yourapp.com/auth/callback)
5. Save your **App ID** for integration

### Step 2: Basic Integration

\`\`\`html
<!-- Simple redirect-based integration -->
<a href="https://your-face-guardian-domain.com/authenticate?appId=YOUR_APP_ID&redirect_to=YOUR_CALLBACK_URL">
  Login with Face Guardian
</a>
\`\`\`

### Step 3: Handle OAuth Callback

Face Guardian will redirect users back to your specified callback URL with an authorization code:

\`\`\`javascript
// Example callback handler
const urlParams = new URLSearchParams(window.location.search);
const authCode = urlParams.get('authorizationCode');

if (authCode) {
  // Exchange code for access token
  exchangeCodeForToken(authCode);
}
\`\`\`
`;

export const usage = `
## Complete Integration Example

Here's a complete example showing how to integrate Face Guardian authentication:

\`\`\`javascript
// Configuration
const config = {
  baseUrl: 'https://your-face-guardian-domain.com',
  appId: 'YOUR_APP_ID',
  redirectUrl: 'https://yourapp.com/auth/callback'
};

// Initiate authentication
function loginWithFaceGuardian() {
  const authUrl = \`\${config.baseUrl}/authenticate?appId=\${config.appId}&redirect_to=\${config.redirectUrl}\`;
  window.location.href = authUrl;
}

// Handle OAuth callback
async function handleAuthCallback(authCode) {
  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch(\`\${config.baseUrl}/api/request-token\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorizationCode: authCode })
    });
    
    const { accessToken } = await tokenResponse.json();
    
    // Get user data
    const userResponse = await fetch(\`\${config.baseUrl}/api/get-user\`, {
      headers: { 'Authorization': \`Bearer \${accessToken}\` }
    });
    
    const userData = await userResponse.json();
    
    // Store user data and redirect
    localStorage.setItem('faceGuardianToken', accessToken);
    displayUserInfo(userData);
    
  } catch (error) {
    console.error('Authentication failed:', error);
  }
}
\`\`\`

## API Endpoints

### Authentication Flow

| Endpoint | Method | Description |
|----------|--------|-------------|
| \`/authenticate\` | GET | Initiate OAuth flow with face authentication |
| \`/api/authenticate\` | POST | Validate app credentials |
| \`/api/request-token\` | POST | Exchange authorization code for access token |
| \`/api/get-user\` | GET | Get user profile data with access token |

### User Data Structure

The \`/api/get-user\` endpoint returns user data in this format:

\`\`\`json
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
}
\`\`\`

## React Integration

For React applications, you can create a custom hook:

\`\`\`jsx
import React, { useState, useEffect } from 'react';

const useFaceGuardianAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const config = {
    baseUrl: 'https://your-face-guardian-domain.com',
    appId: 'YOUR_APP_ID',
    redirectUrl: window.location.origin + '/auth/callback'
  };

  const login = () => {
    const authUrl = \`\${config.baseUrl}/authenticate?appId=\${config.appId}&redirect_to=\${config.redirectUrl}\`;
    window.location.href = authUrl;
  };

  const logout = () => {
    localStorage.removeItem('faceGuardianToken');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('faceGuardianToken');
    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

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

  return { user, loading, login, logout };
};

export default useFaceGuardianAuth;
\`\`\`

## Security Features

- **Biometric authentication** using facial recognition
- **Device fingerprinting** for enhanced security
- **OAuth 2.0 compliant** authentication flow
- **No password required** - secure and convenient
- **Automatic session management** with access tokens

## Error Handling

Always implement proper error handling in your integration:

\`\`\`javascript
try {
  const response = await fetch('/api/request-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ authorizationCode })
  });
  
  if (!response.ok) {
    throw new Error('Token exchange failed');
  }
  
  const data = await response.json();
  // Handle success
} catch (error) {
  console.error('Authentication error:', error);
  // Handle error appropriately
}
\`\`\`
`;
