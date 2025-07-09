# Face Guardian Database Setup Guide

This guide will help you set up your Supabase database from scratch for the Face Guardian facial recognition OAuth system.

## 📋 Database Schema Overview

The Face Guardian system uses 5 main tables:

1. **`profiles`** - User profile information (extends Supabase auth.users)
2. **`face_descriptors`** - Facial recognition data for each user
3. **`profile_devices`** - Trusted devices for enhanced security
4. **`apps`** - OAuth client applications
5. **`tokens`** - OAuth authorization codes and access tokens

## 🚀 Quick Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

### 2. Run Database Schema
1. Open your Supabase dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `schema.sql`
4. Click "Run" to execute

### 3. Configure Environment Variables
1. Copy `env.example` to `.env.local`
2. Fill in your Supabase credentials:

```bash
# Client-side (accessible in browser)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Server-side (secure)
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 📚 Table Details

### Profiles Table
Extends Supabase's built-in auth system with additional user information.

```sql
profiles (
  id UUID PRIMARY KEY,          -- Links to auth.users.id
  email TEXT NOT NULL,          -- User email
  first_name TEXT NOT NULL,     -- First name
  last_name TEXT NOT NULL,      -- Last name
  authenticated BOOLEAN,        -- Email verified status
  avatar_url TEXT,              -- Profile picture URL
  created_at TIMESTAMPTZ,       -- Account creation
  updated_at TIMESTAMPTZ        -- Last update
)
```

### Face Descriptors Table
Stores facial recognition data for biometric authentication.

```sql
face_descriptors (
  id UUID PRIMARY KEY,
  profile_id UUID,              -- Links to profiles.id
  descriptors FLOAT8[],         -- Face-api.js descriptor array
  quality_score FLOAT4,         -- Quality metric (0-1)
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### Profile Devices Table
Tracks trusted devices for each user (device fingerprinting).

```sql
profile_devices (
  id UUID PRIMARY KEY,
  profile_id UUID,              -- Links to profiles.id
  device_id TEXT,               -- FingerprintJS device ID
  user_agent TEXT,              -- Browser user agent
  device_name TEXT,             -- Optional friendly name
  last_used_at TIMESTAMPTZ,     -- Last access time
  is_trusted BOOLEAN,           -- Trust status
  created_at TIMESTAMPTZ
)
```

### Apps Table
OAuth client applications that integrate with Face Guardian.

```sql
apps (
  id UUID PRIMARY KEY,
  owner_id UUID,                -- Links to profiles.id
  name TEXT,                    -- App name
  description TEXT,             -- App description
  domain TEXT,                  -- Allowed domain
  redirect_to TEXT,             -- OAuth redirect URL
  client_id TEXT,               -- OAuth client ID
  client_secret TEXT,           -- OAuth client secret
  is_active BOOLEAN,            -- Active status
  scopes TEXT[],                -- OAuth scopes
  logo_url TEXT,                -- App logo
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### Tokens Table
OAuth authorization codes and access tokens.

```sql
tokens (
  id UUID PRIMARY KEY,
  profile_id UUID,              -- Links to profiles.id
  app_id UUID,                  -- Links to apps.id
  code TEXT,                    -- Authorization code
  token TEXT,                   -- Access token
  refresh_token TEXT,           -- Refresh token
  redirect_at TEXT,             -- Redirect URL
  scopes TEXT[],                -- Granted scopes
  expires_at TIMESTAMPTZ,       -- Token expiration
  expiration_date TIMESTAMPTZ,  -- Auth code expiration
  is_revoked BOOLEAN,           -- Revocation status
  created_at TIMESTAMPTZ,
  used_at TIMESTAMPTZ           -- When token was used
)
```

## 🔒 Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies that ensure:
- Users can only access their own data
- Proper authorization for OAuth operations
- Secure device and app management

### Automatic Triggers
- **Profile Creation**: Automatically creates profile when user signs up
- **Email Verification**: Updates authentication status when email is confirmed
- **Timestamps**: Auto-updates `updated_at` fields

### Utility Functions
- `cleanup_expired_tokens()` - Removes expired tokens
- `revoke_user_tokens(user_id)` - Revokes all tokens for a user

## 🔧 TypeScript Integration

Import the database types in your code:

```typescript
import { Database, Profile, FaceDescriptor } from '@/types/database';

// Use with Supabase client
const supabase = createClient<Database>(url, key);

// Type-safe queries
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId);
```

## 📊 Common Queries

### Create a new OAuth app
```typescript
const { data } = await supabase
  .from('apps')
  .insert({
    owner_id: userId,
    name: 'My App',
    domain: 'https://myapp.com',
    redirect_to: 'https://myapp.com/auth/callback',
    scopes: ['read:profile', 'read:email']
  });
```

### Store face descriptors
```typescript
const { error } = await supabase
  .from('face_descriptors')
  .insert({
    profile_id: userId,
    descriptors: faceDescriptorArray,
    quality_score: 0.95
  });
```

### Register a trusted device
```typescript
const { error } = await supabase
  .from('profile_devices')
  .insert({
    profile_id: userId,
    device_id: fingerprintId,
    user_agent: navigator.userAgent,
    device_name: 'iPhone 12'
  });
```

### Create OAuth token
```typescript
const { data } = await supabase
  .from('tokens')
  .insert({
    profile_id: userId,
    app_id: appId,
    code: authorizationCode,
    token: accessToken,
    redirect_at: redirectUrl,
    scopes: ['read:profile']
  });
```

## 🚨 Important Security Notes

1. **Client Secrets**: In production, hash OAuth client secrets
2. **Token Expiration**: Regularly clean up expired tokens
3. **Face Data**: Face descriptors are sensitive - ensure proper encryption
4. **Device Trust**: Implement device verification workflows
5. **Rate Limiting**: Add rate limiting for authentication attempts

## 🔄 Migration from Old Schema

If you have existing data, create migration scripts to:
1. Export existing user data
2. Transform to new schema format
3. Import with proper relationships
4. Verify data integrity

## 📈 Performance Optimization

The schema includes optimized indexes for:
- User lookups by email/ID
- Face descriptor queries
- Device management
- OAuth token operations
- App management

## 🐛 Troubleshooting

### Common Issues
1. **RLS Policies**: Ensure user is authenticated when accessing data
2. **Foreign Keys**: Check that referenced records exist
3. **Triggers**: Verify profile creation triggers are working
4. **Types**: Update TypeScript types if schema changes

### Useful Queries
```sql
-- Check profile creation
SELECT * FROM profiles WHERE id = 'user-id';

-- Verify face descriptors
SELECT profile_id, array_length(descriptors, 1) as descriptor_count 
FROM face_descriptors;

-- OAuth app status
SELECT name, is_active, scopes FROM apps;

-- Active tokens
SELECT profile_id, app_id, expires_at 
FROM tokens 
WHERE is_revoked = false AND expires_at > NOW();
```

## 📞 Support

For issues with the database schema:
1. Check the SQL logs in Supabase dashboard
2. Verify environment variables are set correctly
3. Ensure proper user authentication
4. Review RLS policies for data access

---

Your Face Guardian database is now ready! 🎉 