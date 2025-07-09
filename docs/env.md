# 🔧 Environment Variables

Complete guide to configuring Face Guardian environment variables for development and production.

---

## 📋 Overview

Face Guardian uses environment variables to configure database connections, API keys, and security settings. This guide covers all required and optional variables.

---

## 🚀 Quick Setup

### 1. Copy the template
```bash
cp env.example .env.local
```

### 2. Get your Supabase credentials
1. Go to [supabase.com](https://supabase.com) and create a project
2. Navigate to **Settings > API**
3. Copy the required values (see below)

### 3. Fill in the variables
```bash
# Required variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_service_role_key_here
SITE_URL=http://localhost:3000
NODE_ENV=development
```

---

## 📚 Variable Reference

### 🔐 **Supabase Configuration**

#### `NEXT_PUBLIC_SUPABASE_URL`
- **Type**: Client-side (accessible in browser)
- **Required**: ✅ Yes
- **Purpose**: Supabase project URL for client-side operations
- **Example**: `https://abcdefghijk.supabase.co`
- **Used in**: 
  - `pages/_app.tsx` - Creating browser Supabase client
  - All client-side components that interact with Supabase

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Type**: Client-side (accessible in browser)
- **Required**: ✅ Yes
- **Purpose**: Supabase anonymous/public key for client authentication
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Used in**: 
  - `pages/_app.tsx` - Creating browser Supabase client
  - Client-side database operations with RLS

#### `NEXT_PUBLIC_SUPABASE_URL`
- **Type**: Server-side (secure)
- **Required**: ✅ Yes
- **Purpose**: Supabase project URL for server-side operations
- **Example**: `https://abcdefghijk.supabase.co`
- **Used in**: 
  - `pages/api/authenticate.ts`
  - `pages/api/get-user.ts`
  - `pages/api/authenticate-face.ts`
  - `pages/api/request-token.ts`

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Type**: Server-side (secure)
- **Required**: ✅ Yes
- **Purpose**: Supabase service role key for admin operations
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Security**: ⚠️ **Never expose in client-side code**
- **Used in**: 
  - All API routes for bypassing RLS when needed
  - Administrative database operations

### 🌐 **Site Configuration**

#### `SITE_URL`
- **Type**: Server-side
- **Required**: ✅ Yes
- **Purpose**: Base URL for OAuth redirects and email links
- **Development**: `http://localhost:3000`
- **Production**: `https://your-domain.com`
- **Used in**: 
  - `pages/api/authenticate-face.ts` - OAuth redirect URLs

#### `NODE_ENV`
- **Type**: Server-side
- **Required**: ✅ Yes
- **Purpose**: Environment mode for Next.js
- **Values**: `development` | `production` | `test`
- **Used in**: 
  - `next.config.js` - Conditional configuration
  - Various components for environment-specific behavior

---

## 🔒 Security Best Practices

### ✅ **Do's**
- ✅ Use `.env.local` for local development
- ✅ Use separate keys for development and production
- ✅ Regularly rotate service role keys
- ✅ Use environment-specific URLs
- ✅ Validate all environment variables on startup

### ❌ **Don'ts**
- ❌ Never commit `.env.local` to version control
- ❌ Never use service role key in client-side code
- ❌ Never hardcode secrets in your application
- ❌ Never use development keys in production
- ❌ Never share service role keys publicly

---

## 🛠️ Development vs Production

### Development (`.env.local`)
```bash
# Development environment
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev_anon_key
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev_service_role_key
SITE_URL=http://localhost:3000
NODE_ENV=development
```

### Production (Environment Variables)
```bash
# Production environment
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod_anon_key
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod_service_role_key
SITE_URL=https://face-guardian.com
NODE_ENV=production
```

---

## 🚨 Troubleshooting

### Common Issues

#### **"Server configuration error"**
- **Cause**: Missing `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Solution**: Check your `.env.local` file and ensure all server-side variables are set

#### **Client-side Supabase errors**
- **Cause**: Missing `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Solution**: Ensure client-side variables are prefixed with `NEXT_PUBLIC_`

#### **OAuth redirect errors**
- **Cause**: Incorrect `SITE_URL` configuration
- **Solution**: Ensure `SITE_URL` matches your actual domain (no trailing slash)

#### **Database connection errors**
- **Cause**: Wrong Supabase URL or expired keys
- **Solution**: Verify credentials in Supabase dashboard Settings > API

### Validation Script
Create a simple validation script to check your environment:

```javascript
// scripts/validate-env.js
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SITE_URL',
  'NODE_ENV'
];

requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

console.log('✅ All environment variables are configured correctly!');
```

Run with: `node scripts/validate-env.js`

---

## 📞 Support

If you're having trouble with environment configuration:

1. **Check the setup guide** in the main [README.md](../README.md)
2. **Review the database setup** in [database/README.md](../database/README.md)
3. **Open an issue** with your configuration (remove sensitive values)

---

## 🔗 Related Documentation

- [Database Setup](../database/README.md)
- [API Reference](./api.md)
- [Security Best Practices](./security.md)
- [Contributing Guidelines](../CONTRIBUTING.md) 