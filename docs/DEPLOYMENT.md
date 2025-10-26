# ELIO Deployment Guide

This guide explains how to deploy ELIO to production.

## Prerequisites

- Cloud provider or dedicated server (Linux recommended)
- Node.js v18.x or higher
- Domain name (optional)
- SSL certificate for HTTPS (recommended)

## Backend Deployment

1. **Set production environment variables in `server/.env`**
2. **Install dependencies**
   ```bash
   cd server
   npm install --production
   ```
3. **Start server (with PM2 or similar)**
   ```bash
   npm install -g pm2
   pm2 start src/app.ts --name "elio-backend"
   ```

## Frontend Deployment

1. **Build frontend**
   ```bash
   cd client
   npm install
   npm run build
   ```
2. **Serve static files or SSR**
   - Use Node.js, Nginx, or cloud hosting
   - For SSR: `npm run serve:ssr:client`

## Docker (optional)

- Create Dockerfiles in `client/` and `server/` for containerized deployment.
- Use `docker-compose` for orchestration.

## Monitoring & Scaling

- Monitor logs and performance (PM2, cloud dashboards)
- Scale horizontally by running multiple backend instances and load balancing.

## Maintenance

- Keep dependencies updated
- Backup critical data (if persistent storage is added)

---
