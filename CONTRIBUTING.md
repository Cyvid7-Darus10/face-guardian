# 🤝 Contributing to Face Guardian

Thank you for your interest in contributing to Face Guardian! This guide will help you get started with contributing to our facial recognition OAuth system.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Security Considerations](#security-considerations)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Documentation](#documentation)
- [Community & Support](#community--support)

---

## 🤝 Code of Conduct

Face Guardian is committed to providing a welcoming and inclusive environment for all contributors. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

### Our Standards

- **Be respectful** and considerate in all interactions
- **Be collaborative** and help others learn
- **Be constructive** in feedback and discussions
- **Be patient** with newcomers and questions
- **Be mindful** of security and privacy implications

---

## 🚀 Getting Started

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug fixes** - Help us improve stability
- ✨ **New features** - Add functionality that benefits users
- 📚 **Documentation** - Improve guides and references
- 🧪 **Testing** - Add or improve test coverage
- 🔒 **Security** - Identify and fix security issues
- 🎨 **UI/UX** - Improve user interface and experience
- ⚡ **Performance** - Optimize speed and efficiency

### Before You Start

1. **Check existing issues** - See if your idea is already being discussed
2. **Open an issue** - Discuss major changes before implementation
3. **Fork the repository** - Create your own copy to work on
4. **Create a branch** - Use descriptive branch names

---

## 🛠️ Development Setup

### Prerequisites

- **Node.js 18+** and npm
- **Git** for version control
- **Supabase account** for database access
- **Code editor** (VS Code recommended)

### Local Development

1. **Clone your fork:**
   ```bash
   git clone https://github.com/your-username/face-guardian.git
   cd face-guardian
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment:**
   ```bash
   cp env.example .env.local
   # Fill in your Supabase credentials
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Run tests:**
   ```bash
   npm test
   npm run test:watch  # For continuous testing
   ```

### Database Setup

1. **Create Supabase project** at [supabase.com](https://supabase.com)
2. **Run database migrations:**
   ```bash
   # Copy SQL from database/schema.sql to Supabase SQL editor
   ```
3. **Set up Row Level Security** policies as described in database/README.md

### Development Tools

#### **Recommended VS Code Extensions:**
- **TypeScript** - Language support
- **Prettier** - Code formatting
- **ESLint** - Code linting
- **Tailwind CSS IntelliSense** - CSS utilities
- **GitLens** - Git integration

#### **Useful Commands:**
```bash
# Code formatting
npm run format

# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Build
npm run build

# Database types generation
npm run generate-types
```

---

## 📏 Coding Standards

### TypeScript Guidelines

```typescript
// ✅ Good - Explicit types and clear naming
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
}

const createUserProfile = async (userData: UserProfile): Promise<UserProfile> => {
  // Implementation
};

// ❌ Bad - Implicit types and unclear naming
const createUser = async (data: any) => {
  // Implementation
};
```

### React Component Guidelines

```tsx
// ✅ Good - Functional component with proper types
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  onClick,
  children,
  disabled = false
}) => {
  const baseClasses = 'font-medium rounded-md focus:outline-none';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
```

### API Route Guidelines

```typescript
// ✅ Good - Proper error handling and validation
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

const requestSchema = z.object({
  userId: z.string().uuid(),
  action: z.enum(['login', 'register', 'verify'])
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, action } = requestSchema.parse(req.body);
    
    // Implementation
    
    res.status(200).json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

### Database Query Guidelines

```typescript
// ✅ Good - Type-safe database operations
const getUserProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Database error:', error);
    return null;
  }

  return data;
};

// ✅ Good - Error handling for inserts
const createFaceDescriptor = async (
  profileId: string,
  descriptors: string
): Promise<FaceDescriptor> => {
  const { data, error } = await supabase
    .from('face_descriptors')
    .insert([{
      profile_id: profileId,
      descriptors,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create face descriptor: ${error.message}`);
  }

  return data;
};
```

### Style Guidelines

#### **CSS Classes:**
```css
/* ✅ Good - Semantic class names */
.face-recognition-container {
  @apply relative flex flex-col items-center p-6 bg-white rounded-lg shadow-lg;
}

.capture-button {
  @apply px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500;
}

/* ❌ Bad - Unclear class names */
.container1 {
  @apply p-4 bg-gray-100;
}
```

#### **File Naming:**
```
✅ Good:
- UserProfile.tsx
- face-recognition.ts
- authenticate-user.api.ts
- user-profile.types.ts

❌ Bad:
- userprofile.tsx
- faceRecognition.ts
- authenticate_user.api.ts
```

---

## 🧪 Testing Requirements

### Test Categories

#### **Unit Tests**
```typescript
// components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button onClick={jest.fn()}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button onClick={jest.fn()} disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

#### **Integration Tests**
```typescript
// __tests__/integration/auth-flow.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import AuthFlow from '../../components/AuthFlow';

describe('Authentication Flow', () => {
  it('completes full face authentication', async () => {
    const user = userEvent.setup();
    
    render(
      <SessionContextProvider>
        <AuthFlow />
      </SessionContextProvider>
    );

    // Start face authentication
    await user.click(screen.getByText('Use Face Authentication'));
    
    // Wait for camera to load
    await waitFor(() => {
      expect(screen.getByText('Camera ready')).toBeInTheDocument();
    });

    // Capture face
    await user.click(screen.getByText('Capture'));
    
    // Wait for authentication
    await waitFor(() => {
      expect(screen.getByText('Authentication successful')).toBeInTheDocument();
    });
  });
});
```

#### **API Tests**
```typescript
// __tests__/api/authenticate.test.ts
import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/authenticate';

describe('/api/authenticate', () => {
  it('returns 405 for non-POST requests', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });

  it('validates app successfully', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        appId: 'valid-app-id'
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      status: true,
      message: 'Authorized'
    });
  });
});
```

### Test Coverage Requirements

- **Minimum 80% code coverage** for new features
- **All API endpoints** must have tests
- **Critical user flows** must have integration tests
- **Security functions** must have comprehensive tests

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- Button.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="authentication"
```

---

## 🔒 Security Considerations

### Security-First Development

All contributions must consider security implications:

#### **Data Protection**
- Never log sensitive data (passwords, tokens, biometric data)
- Use environment variables for secrets
- Encrypt sensitive data at rest
- Validate all inputs

#### **Authentication & Authorization**
- Implement proper session management
- Use secure token generation
- Validate user permissions
- Implement rate limiting

#### **Face Recognition Security**
- Never store raw face images
- Encrypt face descriptors
- Implement anti-spoofing measures
- Validate face quality

### Security Review Process

1. **Self-review** - Check your code for security issues
2. **Automated scanning** - Tests run security checks
3. **Manual review** - Security team reviews sensitive changes
4. **Penetration testing** - For major security features

### Security Testing

```typescript
// Example security test
describe('Face Recognition Security', () => {
  it('should encrypt face descriptors before storage', async () => {
    const mockDescriptor = new Float32Array([0.1, 0.2, 0.3]);
    const encrypted = await encryptFaceDescriptor(mockDescriptor);
    
    // Should not contain raw descriptor values
    expect(encrypted).not.toContain('0.1');
    expect(encrypted).not.toContain('0.2');
    expect(encrypted).not.toContain('0.3');
    
    // Should be properly encrypted
    expect(encrypted).toMatch(/^[A-Za-z0-9+/]+=*$/);
  });

  it('should validate face liveness', async () => {
    const mockImageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...';
    
    // Mock a photo attack
    const isLive = await performLivenessCheck(mockImageData);
    expect(isLive).toBe(false);
  });
});
```

---

## 🔄 Pull Request Process

### Before Submitting

1. **Test your changes** - Ensure all tests pass
2. **Update documentation** - Update relevant docs
3. **Check formatting** - Run `npm run format`
4. **Review security** - Consider security implications
5. **Update types** - Ensure TypeScript types are correct

### Pull Request Template

When creating a pull request, use this template:

```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Security fix

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Security testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added for new functionality
- [ ] No sensitive data exposed

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Related Issues
Closes #123
```

### Review Process

1. **Automated checks** - CI/CD pipeline runs
2. **Code review** - At least one maintainer reviews
3. **Security review** - For security-related changes
4. **Testing** - QA team tests if needed
5. **Approval** - Maintainer approves changes
6. **Merge** - Changes merged to main branch

### Review Guidelines

#### **For Reviewers:**
- Focus on correctness, security, and maintainability
- Provide constructive feedback
- Approve when ready or request changes
- Consider performance implications

#### **For Contributors:**
- Respond to feedback promptly
- Ask questions if feedback is unclear
- Make requested changes
- Keep discussions professional

---

## 📝 Issue Guidelines

### Reporting Bugs

Use the bug report template:

```markdown
## Bug Description
Clear description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Version: [e.g., 1.0.0]

## Screenshots
Add screenshots if applicable.

## Additional Context
Any other context about the problem.
```

### Requesting Features

Use the feature request template:

```markdown
## Feature Description
Clear description of the feature you'd like.

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How would you like this feature to work?

## Alternatives Considered
Other solutions you've considered.

## Additional Context
Any other context about the feature.
```

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or improvement
- `security` - Security-related issue
- `documentation` - Documentation needs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority: high` - High priority issue

---

## 📚 Documentation

### Documentation Standards

- **Keep it updated** - Update docs with code changes
- **Be clear and concise** - Write for your audience
- **Include examples** - Show, don't just tell
- **Use proper formatting** - Follow markdown standards

### Types of Documentation

#### **API Documentation**
```typescript
/**
 * Authenticates a user via facial recognition
 * @param userId - The user's unique identifier
 * @param faceDescriptor - The face descriptor array
 * @returns Promise<AuthResult> - Authentication result
 * @throws {Error} When face recognition fails
 * @example
 * ```typescript
 * const result = await authenticateUser('123', descriptor);
 * if (result.success) {
 *   console.log('User authenticated');
 * }
 * ```
 */
const authenticateUser = async (
  userId: string,
  faceDescriptor: Float32Array
): Promise<AuthResult> => {
  // Implementation
};
```

#### **Component Documentation**
```tsx
/**
 * Button component for user interactions
 * 
 * @component
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
interface ButtonProps {
  /** Button style variant */
  variant: 'primary' | 'secondary';
  /** Button size */
  size: 'sm' | 'md' | 'lg';
  /** Click handler */
  onClick: () => void;
  /** Button content */
  children: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
}
```

---

## 🌟 Community & Support

### Getting Help

- **GitHub Issues** - For bugs and feature requests
- **Discussions** - For general questions and ideas
- **Discord** - Real-time chat with the community
- **Email** - Direct contact with maintainers

### Contributing to Community

- **Answer questions** - Help other developers
- **Write tutorials** - Share your knowledge
- **Improve documentation** - Make it better for everyone
- **Mentor newcomers** - Guide new contributors

### Recognition

We recognize contributors through:
- **Contributors file** - All contributors listed
- **Release notes** - Major contributors mentioned
- **Community highlights** - Regular recognition
- **Swag** - Stickers and merchandise for active contributors

---

## 🙏 Thank You

Thank you for contributing to Face Guardian! Your efforts help make facial recognition authentication more secure and accessible for everyone.

For questions about contributing, please:
- Open an issue for technical questions
- Join our Discord for real-time help
- Email maintainers for sensitive topics

Happy coding! 🚀 