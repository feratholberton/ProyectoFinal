# ELIO Deployment Guide

Comprehensive guide for deploying the application to production environments.

## Table of Contents

- [Deployment Options](#deployment-options)
- [Cloud Platform Deployment](#cloud-platform-deployment)
- [Docker Deployment](#docker-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring and Logging](#monitoring-and-logging)
- [Post-Deployment](#post-deployment)

## Deployment Options

### Recommended Platforms

1. **AWS (Amazon Web Services)**
   - EC2 for VMs
   - ECS/EKS for containers
   - Elastic Beanstalk for simple deployment

2. **Google Cloud Platform**
   - Compute Engine
   - Cloud Run (serverless containers)
   - App Engine

3. **Microsoft Azure**
   - App Service
   - Azure Kubernetes Service
   - Container Instances

4. **Platform-as-a-Service**
   - Heroku
   - Render
   - Railway
   - DigitalOcean App Platform

## Cloud Platform Deployment

### AWS EC2 Deployment

#### 1. Create EC2 Instance

```bash
# Launch Ubuntu 22.04 LTS instance
# Instance type: t3.medium or higher
# Security group: Allow ports 80, 443, 22
```

#### 2. Connect and Setup

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

#### 3. Deploy Application

```bash
# Clone repository
git clone https://github.com/your-user/your-repo.git
cd your-repo

# Setup backend
cd Server
npm install --production
cp .env.example .env
# Edit .env with production values

# Start with PM2
pm2 start npm --name "api-server" -- start
pm2 save
pm2 startup

# Setup frontend
cd ../ui
npm install
npm run build

# Copy build to Nginx
sudo cp -r dist/ui/browser/* /var/www/html/
```

#### 4. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/default
```

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:10000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## Docker Deployment

### Dockerfile (Backend)

Create `Server/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 10000

CMD ["npm", "start"]
```

### Dockerfile (Frontend)

Create `ui/Dockerfile`:

```dockerfile
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/ui/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

Create `docker-compose.yml` in root:

```yaml
version: '3.8'

services:
  backend:
    build: ./Server
    ports:
      - "10000:10000"
    environment:
      - NODE_ENV=production
      - PORT=10000
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - CORS_ORIGIN=http://localhost:4200
    restart: unless-stopped
    networks:
      - app-network

  frontend:
    build: ./ui
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### Deploy with Docker

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd Server && npm ci
          cd ../ui && npm ci
      
      - name: Run tests
        run: |
          cd Server && npm test
          cd ../ui && npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/your-repo
            git pull origin main
            cd Server && npm install --production
            pm2 restart api-server
            cd ../ui && npm install && npm run build
            sudo cp -r dist/ui/browser/* /var/www/html/
```

### Environment Secrets

Configure in GitHub repository settings:
- `HOST`: Server IP address
- `USERNAME`: SSH username
- `SSH_KEY`: Private SSH key
- `GEMINI_API_KEY`: Google AI API key

## Monitoring and Logging

### PM2 Monitoring

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs api-server

# Save logs
pm2 install pm2-logrotate
```

### Application Logging

```bash
# Create log directory
mkdir -p /var/log/your-app

# Configure log rotation
sudo nano /etc/logrotate.d/your-app
```

```
/var/log/your-app/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

### Monitoring Tools

Consider integrating:
- **PM2 Plus**: Process monitoring
- **New Relic**: Application performance monitoring
- **Datadog**: Infrastructure and application monitoring
- **Sentry**: Error tracking
- **LogRocket**: Frontend monitoring

## Post-Deployment

### Health Checks

```bash
# Backend health
curl http://yourdomain.com/api/health

# Frontend
curl http://yourdomain.com
```

### Performance Testing

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Load test
ab -n 1000 -c 10 http://yourdomain.com/api/health
```

### Backup Strategy

```bash
# Automated daily backups
sudo nano /etc/cron.daily/backup-app
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_DIR="/backups/$DATE"

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/app.tar.gz /var/www/your-repo
tar -czf $BACKUP_DIR/logs.tar.gz /var/log/your-app

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR s3://your-backup-bucket/ --recursive
```

### Rollback Procedure

```bash
# If deployment fails
cd /var/www/your-repo
git reset --hard HEAD~1
pm2 restart api-server
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   sudo lsof -i :10000
   sudo kill -9 <PID>
   ```

2. **Permission denied**
   ```bash
   sudo chown -R $USER:$USER /var/www/your-repo
   ```

3. **Out of memory**
   ```bash
   # Increase Node.js memory
   NODE_OPTIONS="--max-old-space-size=4096" pm2 restart api-server
   ```

4. **SSL certificate issues**
   ```bash
   sudo certbot renew --force-renewal
   ```

## Best Practices

1. Use environment variables for configuration
2. Enable HTTPS with valid SSL certificates
3. Implement health check endpoints
4. Set up automated backups
5. Monitor application performance
6. Use process managers (PM2)
7. Implement zero-downtime deployments
8. Test in staging before production
9. Document rollback procedures
10. Set up alerts for critical issues