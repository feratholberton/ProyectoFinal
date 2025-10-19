# ELIO Security Guide

This document outlines security practices, configurations, and guidelines for the application.

## Table of Contents

- [Security Overview](#security-overview)
- [Backend Security](#backend-security)
- [Frontend Security](#frontend-security)
- [Authentication & Authorization](#authentication--authorization)
- [Data Protection](#data-protection)
- [Environment Variables](#environment-variables)
- [Security Best Practices](#security-best-practices)
- [Reporting Vulnerabilities](#reporting-vulnerabilities)

## Security Overview

This application implements multiple layers of security:

1. **Transport Layer**: HTTPS encryption
2. **Application Layer**: Input validation, sanitization
3. **Authentication**: Session-based (JWT planned)
4. **Authorization**: Role-based access control
5. **Data Layer**: Encrypted sensitive data

## Backend Security

### HTTP Security Headers

The application uses `@fastify/helmet` to set secure HTTP headers:

```typescript
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=31536000
- Content-Security-Policy: default-src 'self'
```

### CORS Configuration

Cross-Origin Resource Sharing (CORS) is strictly controlled:

```typescript
.env configuration
CORS_ORIGIN = http://localhost:4200
CORS_ORIGIN = https://yourdomain.com
```

**Security Note**: Never use `CORS_ORIGIN=*` in production.

### Input Validation

All API endpoints validate input using Fastify schemas:

```typescript
const schema = {
  body: {
    type: 'object',
    required: ['message'],
    properties: {
      message: { type: 'string', minLength: 1, maxLength: 1000 },
      context: { type: 'string', maxLength: 500 }
    }
  }
};
```

### Rate Limiting

Protect against abuse with rate limiting:

- **Default**: 100 requests per minute per IP
- **Customizable**: Configure via environment variables

### SQL Injection Protection

- Use parameterized queries
- ORM with prepared statements
- Input sanitization

### Error Handling

Never expose sensitive information in error messages:

```typescript
throw new Error(`Database password: ${password}`);

throw new Error('Authentication failed');
logger.error({ userId, error }, 'Authentication failed');
```

## Frontend Security

### XSS Protection

Angular provides built-in XSS protection:

- **Automatic sanitization** of HTML content
- **Template security** prevents script injection
- **DomSanitizer** for trusted content

```typescript
import { DomSanitizer } from '@angular/platform-browser';

const safe = this.sanitizer.sanitize(SecurityContext.HTML, untrustedHtml);
```

### Content Security Policy

Configure CSP in the Angular application:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'">
```

### CSRF Protection

Implement CSRF tokens for state-changing operations:

```typescript
@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.getCsrfToken();
    const cloned = req.clone({
      headers: req.headers.set('X-CSRF-Token', token)
    });
    return next.handle(cloned);
  }
}
```

## Authentication & Authorization

### Current Implementation

**Session-Based Authentication**:

1. User submits credentials
2. Server validates and creates session
3. Session ID stored in secure cookie
4. Subsequent requests include session cookie

```typescript
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 3600000
  }
};
```

## Data Protection

### Sensitive Data

Never store sensitive data in plain text:

- API keys
- Passwords
- Personal information
- Payment details

### Encryption at Rest

Use encryption for sensitive database fields:

```typescript
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}
```

### Encryption in Transit

- **HTTPS**: All production traffic must use TLS 1.3
- **Certificate**: Use Let's Encrypt or commercial CA
- **HSTS**: Enforce HTTPS with Strict-Transport-Security header

## Environment Variables

### Required Security Variables

```env
# Application Secrets
SESSION_SECRET=your-random-256-bit-secret-here
JWT_SECRET=your-jwt-secret-here
ENCRYPTION_KEY=your-encryption-key-here

# API Keys
GEMINI_API_KEY=your-gemini-api-key

# Database (if applicable)
DB_PASSWORD=your-secure-database-password

# Environment
NODE_ENV=production
```

### Generating Secure Secrets

```bash
# Generate 256-bit random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

### .env File Security

- **Never commit** `.env` files to version control
- Add to `.gitignore`: `echo ".env" >> .gitignore`
- Use environment-specific files: `.env.development`, `.env.production`
- Use secret management services in production (AWS Secrets Manager, Azure Key Vault)

## Security Best Practices

### Code Security

1. **Dependency Management**
   ```bash
   # Audit dependencies regularly
   npm audit
   npm audit fix
   
   # Use specific versions
   npm install package@1.2.3 --save-exact
   ```

2. **Keep Dependencies Updated**
   ```bash
   # Check for outdated packages
   npm outdated
   
   # Update packages
   npm update
   ```

3. **Use Security Linters**
   ```bash
   npm install --save-dev eslint-plugin-security
   ```

### Deployment Security

1. **Environment Isolation**: Separate dev/staging/production
2. **Access Control**: Limit who can deploy
3. **Secrets Management**: Use vault services
4. **Monitoring**: Log security events
5. **Backups**: Regular encrypted backups

### API Security

1. **API Keys**: Rotate regularly
2. **Rate Limiting**: Prevent abuse
3. **Input Validation**: Validate all inputs
4. **Output Encoding**: Prevent injection attacks
5. **HTTPS Only**: No HTTP in production

### Database Security

1. **Least Privilege**: Database users with minimal permissions
2. **Parameterized Queries**: Prevent SQL injection
3. **Encryption**: Encrypt sensitive fields
4. **Backups**: Encrypted and tested backups
5. **Access Logs**: Monitor database access

## Security Checklist

### Pre-Deployment

- [ ] All environment variables configured
- [ ] HTTPS certificates installed
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] Dependencies audited and updated
- [ ] Authentication/authorization tested
- [ ] CORS properly configured
- [ ] Logging and monitoring enabled

### Post-Deployment

- [ ] Penetration testing completed
- [ ] Security monitoring active
- [ ] Incident response plan documented
- [ ] Regular security audits scheduled
- [ ] Team trained on security practices

## Reporting Vulnerabilities

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Email security concerns to: security@yourdomain.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work with you to address the issue.

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Angular Security Guide](https://angular.io/guide/security)
- [Fastify Security](https://www.fastify.io/docs/latest/Guides/Recommendations/)

## Compliance

This application is designed to be compliant with:

- **GDPR**: Data protection and privacy
- **OWASP**: Security best practices
- **SOC 2**: Security controls

Consult with legal and compliance teams for specific requirements.
