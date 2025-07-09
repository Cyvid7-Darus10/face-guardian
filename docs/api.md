# 🚀 API Reference

Complete documentation for Face Guardian's OAuth2 API endpoints and integration patterns.

---

## 📋 Overview

Face Guardian provides a RESTful API following OAuth2 standards for secure facial recognition authentication. This guide covers all endpoints, authentication methods, and integration examples.

**Base URL**: `https://your-domain.com/api` (or `http://localhost:3000/api` for development)

---

## 🔐 Authentication Flow

### OAuth2 Authorization Code Flow

```mermaid
sequenceDiagram
    participant App as Third-Party App
    participant User as User
    participant FG as Face Guardian
    participant DB as Database
    
    App->>FG: 1. GET /authenticate?appId=xxx
    FG->>DB: 2. Validate app
    FG->>User: 3. Show face auth UI
    User->>FG: 4. Face authentication
    FG->>App: 5. Redirect with auth code
    App->>FG: 6. POST /request-token
    FG->>App: 7. Return access token
    App->>FG: 8. GET /get-user (with token)
    FG->>App: 9. Return user data
```

---

## 🔧 API Endpoints

### 1. App Authentication

#### `POST /api/authenticate`

Validates if a third-party app is authorized to use Face Guardian.

**Request:**
```bash
curl -X POST https://your-domain.com/api/authenticate \
  -H "Content-Type: application/json" \
  -d '{
    "appId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Request Body:**
```json
{
  "appId": "string" // UUID of the registered app
}
```

**Response (Success):**
```json
{
  "message": "Authorized",
  "status": true,
  "appData": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "profile_id": "user-uuid",
    "name": "My App",
    "domain": "https://example.com",
    "redirect_to": "https://example.com/auth/callback",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
}
```

**Response (Error):**
```json
{
  "message": "App not found",
  "status": false
}
```

**Status Codes:**
- `200` - Success
- `404` - App not found
- `500` - Server error

---

### 2. Face Authentication

#### `POST /api/authenticate-face`

Authenticates a user via facial recognition and creates a session.

**Request:**
```bash
curl -X POST https://your-domain.com/api/authenticate-face \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid",
    "captchaToken": "captcha-token"
  }'
```

**Request Body:**
```json
{
  "userId": "string",      // UUID of the user
  "captchaToken": "string" // CAPTCHA verification token
}
```

**Response (Success):**
```json
{
  "message": "Authentication successful",
  "success": true,
  "redirectUrl": "https://your-domain.com/home?access_token=xxx"
}
```

**Response (Error):**
```json
{
  "message": "User not found",
  "success": false
}
```

**Status Codes:**
- `200` - Success
- `401` - User not verified
- `404` - User not found
- `500` - Server error

---

### 3. Token Exchange

#### `POST /api/request-token`

Exchanges an authorization code for an access token.

**Request:**
```bash
curl -X POST https://your-domain.com/api/request-token \
  -H "Content-Type: application/json" \
  -d '{
    "authorizationCode": "auth-code-here"
  }'
```

**Request Body:**
```json
{
  "authorizationCode": "string" // The authorization code from redirect
}
```

**Response (Success):**
```json
{
  "message": "Token retrieved",
  "status": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error):**
```json
{
  "message": "Authorization code has expired",
  "status": false
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing authorization code
- `401` - Code expired
- `404` - Code not found
- `500` - Server error

---

### 4. User Information

#### `GET /api/get-user`

Retrieves user information using an access token.

**Request:**
```bash
curl -X GET https://your-domain.com/api/get-user \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (Success):**
```json
{
  "message": "User data retrieved",
  "status": true,
  "data": {
    "profile_id": "user-uuid",
    "profiles": {
      "id": "user-uuid",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com"
    }
  }
}
```

**Response (Error):**
```json
{
  "message": "Token not found",
  "status": false
}
```

**Status Codes:**
- `200` - Success
- `401` - Missing or invalid token
- `404` - Token not found
- `500` - Server error

---

## 🛠️ Integration Examples

### JavaScript/Node.js

```javascript
class FaceGuardianAPI {
  constructor(baseURL = 'https://face-guardian.com/api') {
    this.baseURL = baseURL;
  }

  async validateApp(appId) {
    const response = await fetch(`${this.baseURL}/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ appId }),
    });
    
    return response.json();
  }

  async exchangeCodeForToken(authorizationCode) {
    const response = await fetch(`${this.baseURL}/request-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ authorizationCode }),
    });
    
    return response.json();
  }

  async getUserData(accessToken) {
    const response = await fetch(`${this.baseURL}/get-user`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    return response.json();
  }
}

// Usage
const api = new FaceGuardianAPI();

// 1. Validate your app
const appValidation = await api.validateApp('your-app-id');

// 2. Exchange code for token (after user authentication)
const tokenResponse = await api.exchangeCodeForToken(authCode);

// 3. Get user data
const userData = await api.getUserData(tokenResponse.token);
```

### Python

```python
import requests
import json

class FaceGuardianAPI:
    def __init__(self, base_url='https://face-guardian.com/api'):
        self.base_url = base_url
    
    def validate_app(self, app_id):
        """Validate if app is authorized."""
        response = requests.post(
            f'{self.base_url}/authenticate',
            json={'appId': app_id}
        )
        return response.json()
    
    def exchange_code_for_token(self, authorization_code):
        """Exchange authorization code for access token."""
        response = requests.post(
            f'{self.base_url}/request-token',
            json={'authorizationCode': authorization_code}
        )
        return response.json()
    
    def get_user_data(self, access_token):
        """Get user information using access token."""
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get(f'{self.base_url}/get-user', headers=headers)
        return response.json()

# Usage
api = FaceGuardianAPI()

# 1. Validate your app
app_validation = api.validate_app('your-app-id')

# 2. Exchange code for token (after user authentication)
token_response = api.exchange_code_for_token(auth_code)

# 3. Get user data
user_data = api.get_user_data(token_response['token'])
```

### PHP

```php
<?php
class FaceGuardianAPI {
    private $baseURL;
    
    public function __construct($baseURL = 'https://face-guardian.com/api') {
        $this->baseURL = $baseURL;
    }
    
    public function validateApp($appId) {
        $data = json_encode(['appId' => $appId]);
        
        $ch = curl_init($this->baseURL . '/authenticate');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return json_decode($response, true);
    }
    
    public function exchangeCodeForToken($authorizationCode) {
        $data = json_encode(['authorizationCode' => $authorizationCode]);
        
        $ch = curl_init($this->baseURL . '/request-token');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return json_decode($response, true);
    }
    
    public function getUserData($accessToken) {
        $ch = curl_init($this->baseURL . '/get-user');
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $accessToken
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return json_decode($response, true);
    }
}

// Usage
$api = new FaceGuardianAPI();

// 1. Validate your app
$appValidation = $api->validateApp('your-app-id');

// 2. Exchange code for token (after user authentication)
$tokenResponse = $api->exchangeCodeForToken($authCode);

// 3. Get user data
$userData = $api->getUserData($tokenResponse['token']);
?>
```

---

## 🔒 Security Considerations

### Rate Limiting
- **Authentication endpoints**: 10 requests per minute per IP
- **Token exchange**: 5 requests per minute per app
- **User data**: 100 requests per minute per token

### CORS Policy
- **Development**: `http://localhost:3000`
- **Production**: Configured domains only
- **Preflight**: OPTIONS requests supported

### Token Security
- **Expiration**: Access tokens expire after 1 hour
- **Refresh**: Not implemented (request new authorization)
- **Revocation**: Tokens can be revoked by users
- **Storage**: Store tokens securely (never in localStorage)

---

## 🚨 Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
  "message": "Invalid request format",
  "status": false,
  "error": "Missing required field: appId"
}
```

#### 401 Unauthorized
```json
{
  "message": "Authentication required",
  "status": false,
  "error": "Invalid or expired token"
}
```

#### 404 Not Found
```json
{
  "message": "Resource not found",
  "status": false,
  "error": "App ID does not exist"
}
```

#### 500 Server Error
```json
{
  "message": "Internal server error",
  "status": false,
  "error": "Database connection failed"
}
```

### Error Handling Best Practices

```javascript
async function handleAPICall(apiFunction) {
  try {
    const response = await apiFunction();
    
    if (!response.status) {
      throw new Error(response.message || 'API call failed');
    }
    
    return response;
  } catch (error) {
    console.error('API Error:', error.message);
    
    // Handle specific error types
    if (error.message.includes('expired')) {
      // Redirect to re-authentication
      window.location.href = '/login';
    }
    
    throw error;
  }
}
```

---

## 📊 Response Times

| Endpoint | Average Response Time | Max Response Time |
|----------|----------------------|-------------------|
| `/authenticate` | 50ms | 200ms |
| `/authenticate-face` | 100ms | 500ms |
| `/request-token` | 75ms | 250ms |
| `/get-user` | 25ms | 100ms |

---

## 🔗 Related Documentation

- [Environment Variables](./env.md)
- [Database Schema](../database/README.md)
- [Frontend Integration](./frontend.md)
- [Security Best Practices](./security.md)

---

## 📞 Support

For API-related questions:

1. **Check the examples** above for your programming language
2. **Review error responses** for troubleshooting
3. **Test with curl** to isolate issues
4. **Open an issue** with request/response details 