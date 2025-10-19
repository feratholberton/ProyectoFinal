# ELIO Installation Guide

This guide provides comprehensive instructions for setting up the development environment and deploying the application.

## Table of Contents

- [System Requirements](#system-requirements)
- [Development Setup](#development-setup)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## System Requirements

### Minimum Requirements

- **Operating System**: Windows 10+, macOS 11+, or Linux (Ubuntu 20.04+)
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **RAM**: 4GB minimum (8GB recommended)
- **Disk Space**: 2GB free space

### Recommended Development Tools

- **IDE**: Visual Studio Code with Angular/TypeScript extensions
- **Terminal**: PowerShell, Bash, or Zsh
- **Browser**: Chrome or Firefox (latest version)
- **Git**: Latest stable version

## Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-user/your-repo.git
cd your-repo
```

### 2. Backend Setup (Server)

```bash
cd Server

npm install

npm run test
```

### 3. Frontend Setup (UI)

```bash
cd ../ui

npm install

npm run build
```

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `Server/` directory:

```env
# Server Configuration
PORT=10000
NODE_ENV=development

# CORS Configuration
# Options: 
# - 'true' or '*' for all origins
# - 'false' to disable CORS
# - Comma-separated list of origins: 'http://localhost:4200,https://yourdomain.com'
CORS_ORIGIN=http://localhost:4200

# Google Generative AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Swagger Documentation
SWAGGER_BASE_URL=/api/docs

# Logging
LOG_LEVEL=info
```

### Frontend Environment Configuration

The Angular application uses environment files located in `ui/src/environments/`:

- `environment.ts` - Development environment
- `environment.prod.ts` - Production environment

## Running the Application

### Development Mode

#### Start Backend Server

```bash
cd Server
npm run dev
```

Server will start at `http://localhost:10000` with hot-reload enabled.

#### Start Frontend Application

```bash
cd ui
npm start
```

Application will be available at `http://localhost:4200`.

### Production Mode

#### Build Backend

```bash
cd Server
npm start
```

#### Build Frontend

```bash
cd ui
npm run build
npm run serve:ssr:ui
```

## Deployment

### Prerequisites

- Cloud platform account (AWS, Google Cloud, Azure, etc.)
- Domain name (optional but recommended)
- SSL certificate for HTTPS

### Backend Deployment

1. **Set production environment variables**
2. **Build the application**
   ```bash
   cd Server
   npm install --production
   ```
3. **Start with process manager (PM2)**
   ```bash
   npm install -g pm2
   pm2 start npm --name "api-server" -- start
   ```

### Frontend Deployment

1. **Build for production**
   ```bash
   cd ui
   npm run build
   ```
2. **Deploy the `dist/` directory** to your hosting service

### Docker Deployment (Optional)

Create a `Dockerfile` in each directory for containerized deployment.

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
lsof -ti:10000 | xargs kill -9

netstat -ano | findstr :10000
taskkill /PID <PID> /F
```

#### Module Not Found Errors

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### TypeScript Compilation Errors

```bash
npm run build
```

### Getting Help

If you encounter issues not covered here:

1. Check the [API Documentation](API.md)
2. Review the [Architecture Guide](ARCHITECTURE.md)
3. Open an issue on GitHub with detailed error logs
