# Backend Testing Guide

This document outlines the testing strategy for the **proyecto Final ELIO** backend, including how to set up, run, and interpret tests.

---

## Why Testing Matters

Testing ensures that the backend functions as expected, prevents regressions, and improves code quality. This project uses both **unit tests** and **integration tests** to verify functionality.

---

## Prerequisites

Before running tests, ensure the following are installed and configured:
1. **Node.js** (v16 or higher recommended)
2. **NPM** or **Yarn** for package management
3. A testing database (if applicable)

---

## Testing Framework

This project uses the following tools for testing:
- **Jest**: A JavaScript testing framework.
- **Supertest**: Used for HTTP assertions and testing API endpoints.
- **Other tools**: Add any other libraries or tools used for testing (e.g., `chai`, `mocha`).

---

## Setting Up the Testing Environment

1. **Install Dependencies**:
   Make sure all necessary dependencies are installed:
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**:
   Create a separate `.env.test` file for the testing environment. This should include:
   ```env
   DB_HOST=localhost
   DB_USER=test_user
   DB_PASSWORD=test_password
   DB_NAME=test_database
   PORT=3001
   JWT_SECRET=test_secret
   ```

3. **Prepare the Test Database** (if applicable):
   - Create a dedicated database for testing.
   - Run migration scripts to ensure the database schema is up to date:
     ```bash
     npm run migrate:test
     ```

---

## Running Tests

To execute all tests, use:
```bash
npm test
```

### Running Specific Tests
You can run a single test file or a specific test suite:
```bash
npm test -- <path_to_test_file>
```

For example:
```bash
npm test -- tests/auth.test.js
```

### Watch Mode
Run tests in watch mode to automatically re-run them when files change:
```bash
npm test -- --watch
```

---

## Test Coverage

To generate a test coverage report:
```bash
npm run test:coverage
```

This will produce a detailed report showing which parts of the codebase are covered by tests. Open the `coverage/index.html` file in your browser to view the report.

---

## Types of Tests

### 1. **Unit Tests**
- Test individual functions or modules in isolation.
- Focus on specific pieces of logic.
- Example: Testing a utility function or a model method.

### 2. **Integration Tests**
- Test how different components of the application work together.
- Example: Testing an API endpoint that interacts with the database.

### 3. **End-to-End (E2E) Tests** _(Optional)_
- Simulate real-world user interactions with the API.
- Example: Testing the login flow from API request to database validation.

---

## Writing Tests

### Test File Structure
Test files are located in the `/tests` directory. Each module or feature should have a dedicated test file:
```
/tests
  auth.test.js
  users.test.js
  products.test.js
```

### Example Test
Here’s an example of a test for a login endpoint:

```javascript
const request = require('supertest');
const app = require('../server');

describe('POST /auth/login', () => {
  it('should log in a user with valid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'user@example.com', password: '123456' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should fail with invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'user@example.com', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});
```

---

## Debugging Tests

### View Console Logs
Add `console.log` statements in your code or tests to debug:
```javascript
console.log('Debugging output:', someVariable);
```

### Use the `--verbose` Flag
Run tests with detailed output:
```bash
npm test -- --verbose
```

---

## Best Practices for Tests

1. **Keep Tests Isolated**:
   - Tests should not depend on external factors like the development database.
   - Use mock data or a dedicated testing database.

2. **Write Descriptive Test Cases**:
   - Test names should clearly describe what they verify.
   - Example: `it('should return a 401 status for invalid credentials')`.

3. **Clean Up After Tests**:
   - Ensure the test database is reset after each test or suite:
     ```javascript
     afterEach(async () => {
       await clearTestDatabase();
     });
     ```

4. **Aim for High Test Coverage**:
   - Test critical paths, edge cases, and error handling.

---

## Common Issues

### Tests Fail Due to Database Connection
- Ensure the testing database is running and environment variables are correctly set up.

### Port Conflicts
- The testing environment should run on a different port than the development server. Update the `PORT` variable in `.env.test`.

---

## Additional Commands

- **Lint and Fix Code**:
  ```bash
  npm run lint
  ```

- **Run Tests with Linting**:
  ```bash
  npm run test:lint
  ```

---

For questions or issues related to testing, feel free to reach out to the development team.