# Contributing to This Project

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Requirements](#testing-requirements)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of:

- Experience level
- Gender identity and expression
- Sexual orientation
- Disability
- Personal appearance
- Body size
- Race
- Ethnicity
- Age
- Religion
- Nationality

### Our Standards

**Positive behavior includes:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**

- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js v18.0.0 or higher
- npm v9.0.0 or higher
- Git installed and configured
- A GitHub account

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-user/your-repo.git
   cd your-repo
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-owner/your-repo.git
   ```

4. **Install dependencies**:
   ```bash
   # Backend
   cd Server
   npm install
   
   # Frontend
   cd ../ui
   npm install
   ```

### Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
# or
git checkout -b docs/your-documentation-update
```

**Branch naming conventions:**

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or changes
- `chore/` - Maintenance tasks

## Development Workflow

### 1. Sync with Upstream

Before starting work, sync with the upstream repository:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the coding standards (see below)
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes

```bash
# Backend tests
cd Server
npm test

# Frontend tests
cd ui
npm test

# Run linting
npm run lint
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature"
```

See [Commit Guidelines](#commit-guidelines) for commit message format.

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

- Go to GitHub and create a Pull Request
- Fill out the PR template
- Link related issues
- Wait for review

## Coding Standards

### TypeScript/JavaScript

#### General Rules

- Use **TypeScript** for all new code
- Use **const** and **let**, never **var**
- Use **arrow functions** for callbacks
- Use **async/await** instead of promises chains
- Use **meaningful variable names**

#### Example

```typescript
// Bad
function getData(x: any) {
  return fetch(x).then(r => r.json());
}

// Good
async function fetchUserData(userId: string): Promise<User> {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}
```

#### Naming Conventions

- **Classes**: PascalCase - `UserService`, `HttpClient`
- **Interfaces**: PascalCase with 'I' prefix - `IUserRepository`
- **Functions**: camelCase - `getUserById`, `validateEmail`
- **Variables**: camelCase - `userName`, `isActive`
- **Constants**: UPPER_SNAKE_CASE - `MAX_RETRY_ATTEMPTS`
- **Files**: kebab-case - `user-service.ts`, `http-client.ts`

### Backend Code Style

#### File Structure

```typescript
// 1. Imports
import { FastifyInstance } from 'fastify';
import { UserService } from '../services/user-service';

// 2. Interfaces/Types
interface UserRequest {
  name: string;
  email: string;
}

// 3. Constants
const MAX_USERS = 100;

// 4. Main code
export class UserController {
  constructor(private userService: UserService) {}
  
  async createUser(request: UserRequest): Promise<User> {
  }
}
```

#### Error Handling

```typescript
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

async function createUser(data: UserData): Promise<User> {
  if (!data.email) {
    throw new ValidationError('Email is required');
  }
}
```

### Frontend Code Style (Angular)

#### Component Structure

```typescript
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.loading = true;
    try {
      this.users = await this.userService.getUsers();
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      this.loading = false;
    }
  }
}
```

#### Template Guidelines

```html
<!-- Good - Use OnPush change detection when possible -->
<!-- Use async pipe for observables -->
<div *ngIf="users$ | async as users">
  <div *ngFor="let user of users; trackBy: trackByUserId">
    {{ user.name }}
  </div>
</div>

<!-- Use semantic HTML -->
<button type="button" (click)="deleteUser(user.id)">
  Delete
</button>
```

### Code Formatting

We use **Prettier** for consistent code formatting:

```bash
# Format code
npm run format

# Check formatting
npm run format:check
```

**Prettier configuration** (already in `package.json`):

```json
{
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "es5",
  "semi": true,
  "tabWidth": 2
}
```

### Linting

We use **ESLint** for code quality:

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

## Commit Guidelines

We follow the **Conventional Commits** specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semi-colons, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates
- **ci**: CI/CD changes
- **build**: Build system changes

### Examples

```bash
# Feature
git commit -m "feat(auth): add JWT authentication"

# Bug fix
git commit -m "fix(api): resolve CORS issue on /users endpoint"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Breaking change
git commit -m "feat(api): change user endpoint response format

BREAKING CHANGE: The /api/users endpoint now returns an object instead of an array"
```

### Commit Message Rules

- Use imperative mood: "add" not "added" or "adds"
- Don't capitalize first letter
- No period (.) at the end
- Keep subject line under 72 characters
- Separate subject from body with a blank line
- Use body to explain what and why, not how

## Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated and passing
- [ ] No console.log() or debugging code
- [ ] Branch is up to date with main

### PR Title

Follow the same format as commit messages:

```
feat(auth): implement OAuth2 authentication
fix(ui): resolve button alignment issue
docs(api): add endpoint documentation
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123
Relates to #456

## Changes Made
- Added X feature
- Fixed Y bug
- Updated Z documentation

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed


## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and linting
2. **Code Review**: At least one maintainer reviews the code
3. **Changes Requested**: Address feedback and push updates
4. **Approval**: PR is approved by maintainer(s)
5. **Merge**: Maintainer merges the PR

### After Merge

- Delete your feature branch
- Sync your fork with upstream
- Celebrate! 🎉

## Testing Requirements

### Backend Tests

All new features must include tests:

```typescript
import { describe, it, expect } from 'vitest';
import { UserService } from '../src/application/services/user-service';

describe('UserService', () => {
  it('should create a new user', async () => {
    const userService = new UserService();
    const user = await userService.createUser({
      name: 'John Doe',
      email: 'john@example.com'
    });
    
    expect(user).toBeDefined();
    expect(user.email).toBe('john@example.com');
  });
});
```

### Frontend Tests

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserListComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Test Coverage

- Aim for **>80% code coverage**
- All critical paths must be tested
- Edge cases and error handling tested

```bash
# Check coverage
npm run test:coverage
```

## Reporting Issues

### Bug Reports

Use the bug report template:

```markdown
**Describe the bug**
A clear description of the bug.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Ubuntu 22.04]
- Node.js version: [e.g. 18.17.0]
- Browser: [e.g. Chrome 120]

**Additional context**
Any other relevant information.
```

### Feature Requests

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features.

**Additional context**
Any other context or screenshots.
```

## Questions?

If you have questions about contributing:

1. Check existing issues and discussions
2. Read the documentation in `/docs`
3. Open a new discussion on GitHub
4. Contact maintainers

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing!**