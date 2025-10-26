# ELIO Security Guide

This guide describes security practices for ELIO.

## Backend Security

- **CORS:** Restrict origins via `CORS_ORIGIN` in `.env`
- **Helmet:** Secure HTTP headers via Fastify plugin
- **API Keys:** Store AI and third-party keys in environment variables
- **Input Validation:** Validate all incoming data on backend
- **Session Management:** Use secure, in-memory session for consultation flow

## Frontend Security

- **Angular XSS Protection:** Built-in sanitization
- **Environment Separation:** Sensitive configs only in environment files
- **Route Guards:** Protect sensitive routes

## Data Protection

- **HTTPS:** Use SSL certificates in production
- **Logs:** Avoid sensitive data in logs

## User Security

- **Password Management:** Enforce strong passwords if applicable
- **Two-Factor Authentication:** Enable if available

## Best Practices

- Keep dependencies updated
- Regularly audit security
- Use trusted cloud infrastructure

---
