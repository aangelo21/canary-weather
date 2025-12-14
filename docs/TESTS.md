# CanaryWeather Testing Documentation

This document explains how testing works in the Canary Weather project. It covers both frontend and backend tests, how to run them, what they test, and how to write new tests.

---

## Table of Contents

1. [Overview](#overview)
2. [Frontend Testing](#frontend-testing)
3. [Backend Testing](#backend-testing)
4. [Running Tests](#running-tests)
5. [Writing New Tests](#writing-new-tests)
6. [Best Practices](#best-practices)
7. [Common Testing Patterns](#common-testing-patterns)

---

## Overview

Testing is an important part of software development. Tests verify that the code works correctly and help prevent bugs.

The Canary Weather project uses two different testing frameworks:

- **Frontend**: Uses Vitest (a fast testing framework for modern JavaScript)
- **Backend**: Uses Jest (a popular JavaScript testing framework)

Both frameworks help developers:
- Check that functions work as expected
- Verify that API endpoints return correct responses
- Catch errors before they reach users
- Ensure code changes do not break existing functionality

---

## Frontend Testing

### What Gets Tested

Frontend tests verify that the user interface works correctly. This includes:

- **API Service**: Tests that the frontend can communicate with the backend API
- **Services**: Tests for functions that handle data (location service, alert service, user service)
- **Components**: Tests that React components render correctly and respond to user actions
- **Hooks**: Tests for custom React logic

### Testing Framework: Vitest

Vitest is a fast unit testing framework designed for modern JavaScript projects using Vite (the build tool).

#### Configuration File

The frontend testing configuration is in `frontend/vitest.config.js`:

```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
  },
});
```

This configuration tells Vitest to:
- Use a simulated browser environment (jsdom)
- Load setup files before running tests
- Handle CSS during testing

#### Setup File

The frontend setup file (`frontend/src/setupTests.js`) imports testing libraries:

```javascript
import '@testing-library/jest-dom';
```

This provides extra helper functions for testing DOM elements.

### Frontend Test Example

Here is an example of a frontend test for the API service:

```javascript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('API Service', () => {
  let apiService;

  beforeEach(async () => {
    vi.resetModules();
    vi.stubGlobal('fetch', vi.fn());
    apiService = await import('../api');
    apiService.setAccessToken(null);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should manage access token correctly', () => {
    expect(apiService.getAccessToken()).toBeNull();
    apiService.setAccessToken('test-token');
    expect(apiService.getAccessToken()).toBe('test-token');
  });

  it('should make requests with correct base URL', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
    await apiService.apiFetch('/test');
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:85/api/test',
      expect.objectContaining({
        credentials: 'include',
      })
    );
  });
});
```

### How Frontend Tests Work

1. **Describe Block**: Groups related tests together
   - `describe('API Service', () => { ... })`
   - Makes test output organized and easy to read

2. **Setup and Teardown**: Prepare before and clean up after each test
   - `beforeEach()`: Runs before each test (resets mocks, imports modules)
   - `afterEach()`: Runs after each test (cleans up)

3. **Test Cases**: Individual test functions
   - `it('should do something', () => { ... })`
   - Each test checks one specific behavior

4. **Assertions**: Check if results are correct
   - `expect(value).toBe(expectedValue)` - Check equality
   - `expect(function).toHaveBeenCalled()` - Check if function was called
   - `expect(value).toBeNull()` - Check if value is null

5. **Mocking**: Simulate dependencies
   - `vi.stubGlobal('fetch', vi.fn())` - Replace fetch with a fake version
   - `global.fetch.mockResolvedValue()` - Control what fetch returns
   - Useful for testing without making real API calls

### Frontend Test File Locations

Frontend tests are stored in the `__tests__` folders next to the code they test:

```
frontend/src/
  services/
    __tests__/
      api.test.js          <- Tests for api service
    api.js
    locationService.js
```

### Frontend Test Naming Convention

Frontend test files follow this naming pattern:
- File being tested: `api.js`
- Test file: `api.test.js` or `api.spec.js`

---

## Backend Testing

### What Gets Tested

Backend tests verify that the API endpoints work correctly. This includes:

- **Controllers**: Tests for API request handlers (login, forgot password, etc.)
- **Services**: Tests for business logic (LDAP authentication, email sending)
- **Routes**: Tests that verify endpoints exist and work as expected
- **Database Operations**: Tests for database queries

### Testing Framework: Jest

Jest is a popular JavaScript testing framework that works great for Node.js projects.

#### Configuration File

The backend testing configuration is in `backend/jest.config.js`:

```javascript
export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  setupFiles: ['<rootDir>/tests/setup.js'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
```

This configuration tells Jest to:
- Use Node.js environment (not a browser)
- Look for test files in `__tests__` folders or files ending with `.test.js` or `.spec.js`
- Load setup files before running tests
- Print detailed test output

#### Setup File

The backend setup file (`backend/tests/setup.js`) defines environment variables for testing:

```javascript
process.env.RESEND_API_KEY = 're_test_123';
process.env.JWT_SECRET = 'test_secret';
process.env.FRONTEND_URL = 'http://localhost:3000';
```

These environment variables are used during tests so that the code works without real API keys.

### Backend Test Example

Here is an example of a backend test for the authentication controller:

```javascript
import { jest } from '@jest/globals';

jest.unstable_mockModule('../../services/ldapService.js', () => ({
  LdapService: {
    getAllUsers: jest.fn(),
  }
}));

jest.unstable_mockModule('../../services/emailService.js', () => ({
  sendPasswordResetEmail: jest.fn(),
}));

const authController = await import('../../controllers/authController.js');
const { LdapService } = await import('../../services/ldapService.js');
const { sendPasswordResetEmail } = await import('../../services/emailService.js');

describe('Auth Controller - Forgot Password', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('should return 400 if email is missing', async () => {
    req.body.email = '';
    await authController.forgotPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Email is required" });
  });

  it('should send email and return success message if user is found', async () => {
    req.body.email = 'test@example.com';
    LdapService.getAllUsers.mockResolvedValue([
      { username: 'testuser', email: 'test@example.com' }
    ]);

    await authController.forgotPassword(req, res);

    expect(sendPasswordResetEmail).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: "If an account with that email exists, a password reset link has been sent."
    });
  });

  it('should handle errors gracefully', async () => {
    req.body.email = 'test@example.com';
    LdapService.getAllUsers.mockRejectedValue(new Error('LDAP Error'));

    await authController.forgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
```

### How Backend Tests Work

1. **Mock Dependencies**: Replace external services with fake versions
   - `jest.unstable_mockModule()` - Replace imports with mocked versions
   - Example: Instead of calling the real LDAP server, use a fake one

2. **Create Mock Request/Response**: Simulate HTTP requests
   - `req = { body: {} }` - Create a fake request object
   - `res = { status: jest.fn(), json: jest.fn() }` - Create a fake response object
   - These fake objects allow testing without a real HTTP server

3. **Test the Function**: Call the function and check results
   - Call `authController.forgotPassword(req, res)` with fake data
   - Check that it called the email service
   - Check that it returned the correct response

4. **Verify Behavior**: Use assertions to check what happened
   - `expect(res.status).toHaveBeenCalledWith(400)` - Verify response status
   - `expect(sendPasswordResetEmail).toHaveBeenCalled()` - Verify email was sent
   - Makes sure the code does what it should

### Backend Test File Locations

Backend tests are stored in the `backend/tests` folder:

```
backend/
  tests/
    setup.js
    controllers/
      authController.test.js    <- Tests for auth controller
  controllers/
    authController.js
```

---

## Running Tests

### Frontend Tests

Run all frontend tests:

```bash
npm run test
```

This command:
- Finds all test files in the frontend directory
- Runs them using Vitest
- Shows which tests passed and which failed
- Watches for file changes and reruns tests

Run tests once without watching:

```bash
npm run test:run
```

This is useful for running tests in a continuous integration pipeline.

Run tests with coverage:

```bash
npm run test -- --coverage
```

Shows which lines of code are covered by tests.

### Backend Tests

Run all backend tests:

```bash
npm test
```

This command:
- Finds all test files in the backend directory
- Runs them using Jest
- Shows which tests passed and which failed
- Then exits (does not watch files)

Run a specific test file:

```bash
npm test -- authController.test.js
```

Run tests with coverage:

```bash
npm test -- --coverage
```

Shows code coverage statistics.

Watch for changes and rerun tests:

```bash
npm test -- --watch
```

Reruns tests whenever you change a file.

### Troubleshooting Test Execution

If tests fail:

1. **Read the error message carefully**: It tells you what went wrong
2. **Check that dependencies are installed**: Run `npm install`
3. **Verify environment variables**: For backend, check `tests/setup.js`
4. **Clear cache**: Run `npm test -- --clearCache` for backend
5. **Check file paths**: Make sure test files are in correct locations

---

## Writing New Tests

### Before Writing Tests

Before writing tests, understand:
- What should the function do?
- What inputs should it accept?
- What should it return?
- What errors could happen?

### Frontend Test Template

Here is a template for writing a new frontend test:

```javascript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Feature Name', () => {
  // Setup: Prepare test environment
  beforeEach(() => {
    // Clear mocks
    vi.clearAllMocks();
    // Reset modules if needed
    vi.resetModules();
  });

  // Cleanup: Remove temporary data
  afterEach(() => {
    // Clean up any mocks
    vi.unstubAllGlobals();
  });

  // Test Case 1: Normal behavior
  it('should do something when given valid input', () => {
    const result = functionUnderTest('valid input');
    expect(result).toBe('expected output');
  });

  // Test Case 2: Error handling
  it('should throw error when given invalid input', () => {
    expect(() => {
      functionUnderTest('invalid input');
    }).toThrow();
  });

  // Test Case 3: Async operations
  it('should handle async operations correctly', async () => {
    const result = await asyncFunctionUnderTest();
    expect(result).toBeDefined();
  });
});
```

### Backend Test Template

Here is a template for writing a new backend test:

```javascript
import { jest } from '@jest/globals';

// Mock external dependencies
jest.unstable_mockModule('../../services/externalService.js', () => ({
  externalService: {
    doSomething: jest.fn(),
  }
}));

// Import modules to test
const controllerUnderTest = await import('../../controllers/controller.js');
const { externalService } = await import('../../services/externalService.js');

describe('Controller Name', () => {
  let req, res;

  beforeEach(() => {
    // Create fake request and response objects
    req = {
      body: {},
      params: {},
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // Test Case 1: Success scenario
  it('should return success response with valid data', async () => {
    req.body = { name: 'test' };
    externalService.doSomething.mockResolvedValue({ success: true });

    await controllerUnderTest.handleRequest(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: true,
    }));
  });

  // Test Case 2: Error scenario
  it('should return error when required field is missing', async () => {
    req.body = {}; // Missing required field
    await controllerUnderTest.handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  // Test Case 3: External service failure
  it('should handle external service errors', async () => {
    req.body = { name: 'test' };
    externalService.doSomething.mockRejectedValue(new Error('Service down'));

    await controllerUnderTest.handleRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
```

### What to Test

Write tests for:

1. **Happy Path**: Function works with valid inputs
   ```javascript
   it('should return user data when email exists', () => {
     // Test successful case
   });
   ```

2. **Error Cases**: Function handles errors correctly
   ```javascript
   it('should return 404 when user not found', () => {
     // Test error case
   });
   ```

3. **Edge Cases**: Function works with unusual inputs
   ```javascript
   it('should handle empty string input', () => {
     // Test edge case
   });
   ```

4. **Integration**: Functions work together correctly
   ```javascript
   it('should save alert and send notification', () => {
     // Test multiple functions together
   });
   ```

### What NOT to Test

Do NOT write tests for:
- Libraries you did not write (React, Express, etc.)
- Third-party services (unless mocking them)
- Code that just calls other functions without logic

---

## Best Practices

### 1. Write Clear Test Names

Good test names describe what the test checks:

```javascript
// Good: Clear and descriptive
it('should return 400 status when email is missing', () => {});

// Bad: Vague and unclear
it('should work correctly', () => {});
```

### 2. Test One Thing Per Test

Each test should check one behavior:

```javascript
// Good: Tests one behavior
it('should return success message when email is valid', () => {});

// Bad: Tests multiple behaviors
it('should validate email and send message and log action', () => {});
```

### 3. Use Descriptive Variable Names

```javascript
// Good: Clear what the variable contains
const validUserEmail = 'user@example.com';
const invalidUserEmail = '';

// Bad: Unclear variable names
const email1 = 'user@example.com';
const email2 = '';
```

### 4. Mock External Dependencies

Always mock external services to test your code in isolation:

```javascript
// Good: Mock the service
const mockLdapService = { getUser: jest.fn() };

// Bad: Call real external service
const realLdapConnection = new LdapConnection();
```

### 5. Test Expected Behavior, Not Implementation

```javascript
// Good: Tests what the function should do
expect(res.status).toHaveBeenCalledWith(200);

// Bad: Tests how it was implemented
expect(someInternalVariable).toBe(true);
```

### 6. Keep Tests Fast

- Mock slow operations (database, API calls)
- Run tests frequently during development
- Use `test:run` for fast feedback

### 7. Maintain Tests

- Update tests when requirements change
- Delete tests for deleted code
- Keep test code as clean as production code

---

## Common Testing Patterns

### Pattern 1: Testing API Calls

Testing that the frontend makes correct API calls:

```javascript
it('should call API with correct URL and headers', async () => {
  global.fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
  
  await apiService.apiFetch('/users', { method: 'GET' });
  
  expect(global.fetch).toHaveBeenCalledWith(
    'http://localhost:85/api/users',
    expect.objectContaining({
      method: 'GET',
      credentials: 'include',
    })
  );
});
```

### Pattern 2: Testing Token Management

Testing that tokens are stored and sent correctly:

```javascript
it('should include authorization token in requests', async () => {
  apiService.setAccessToken('valid-token');
  global.fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
  
  await apiService.apiFetch('/protected');
  
  expect(global.fetch).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: 'Bearer valid-token',
      }),
    })
  );
});
```

### Pattern 3: Testing Error Handling

Testing that errors are caught and handled correctly:

```javascript
it('should handle API errors gracefully', async () => {
  global.fetch.mockResolvedValue({ 
    ok: false, 
    status: 500,
    json: async () => ({ error: 'Server error' })
  });
  
  try {
    await apiService.apiFetch('/data');
  } catch (error) {
    expect(error.message).toContain('Server error');
  }
});
```

### Pattern 4: Testing Controller Response

Testing that controllers return correct responses:

```javascript
it('should return user data with correct status code', async () => {
  const userData = { id: 1, name: 'John', email: 'john@example.com' };
  mockUserService.getUser.mockResolvedValue(userData);
  
  req.params.id = 1;
  await userController.getUser(req, res);
  
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(userData);
});
```

### Pattern 5: Testing Validation

Testing that input validation works:

```javascript
it('should reject request with invalid email format', async () => {
  req.body = { email: 'not-an-email' };
  
  await authController.register(req, res);
  
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: expect.stringContaining('email') })
  );
});
```

---

## Coverage Goals

Code coverage measures how much of your code is tested.

### Coverage Types

- **Line Coverage**: Percentage of lines executed by tests
- **Branch Coverage**: Percentage of decision paths tested
- **Function Coverage**: Percentage of functions called by tests

### Coverage Targets

Aim for these coverage targets:

| Type | Target |
|------|--------|
| Critical paths | 100% |
| Public functions | 80%+ |
| Utils and helpers | 70%+ |
| UI components | 60%+ |

View coverage:

```bash
# Frontend
npm run test -- --coverage

# Backend
npm test -- --coverage
```

---

## Continuous Integration

Tests should run automatically whenever code changes.

### GitHub Actions / CI Pipeline

When you push code:
1. Automated pipeline runs all tests
2. Tests must pass before merging to main branch
3. Coverage reports are generated
4. Failures block deployment

This ensures code quality and prevents bugs.

---

## Summary

Testing in Canary Weather:

- **Frontend**: Uses Vitest for testing React components and services
- **Backend**: Uses Jest for testing API controllers and services
- **Running**: Use `npm test` for backend, `npm run test` for frontend
- **Writing**: Create test files next to code, mock dependencies, test one thing per test
- **Best Practices**: Clear names, test behavior not implementation, maintain tests
- **Coverage**: Aim for 70%+ coverage on important code

Tests make the code more reliable, easier to maintain, and safer to change.

For more information:
- Vitest docs: https://vitest.dev
- Jest docs: https://jestjs.io
- Testing Library docs: https://testing-library.com