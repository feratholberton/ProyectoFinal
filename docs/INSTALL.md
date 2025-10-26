# ELIO Installation Guide

This guide explains how to install and configure ELIO for local development and production.

## Requirements

- OS: Windows, macOS, or Linux
- Node.js: v18.x or higher
- npm: v9.x or higher

## Clone the Repository

```bash
git clone https://github.com/alearecuest/ProyectoFinal_ELIO.git
cd ProyectoFinal_ELIO
```

## Backend Setup

```bash
cd server
npm install
npm run test
```

## Frontend Setup

```bash
cd client
npm install
npm run build
```

## Environment Configuration

### Backend

Create a `.env` file in `server/`:

```env
PORT=10000
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
GEMINI_API_KEY=your_gemini_api_key_here
SWAGGER_BASE_URL=/api/docs
LOG_LEVEL=info
```

### Frontend

Edit environment files in `client/src/environments/` if needed.

## Running the Application

### Development

- Backend: `npm run dev` (http://localhost:10000)
- Frontend: `npm run dev` (http://localhost:4200)

### Production

- Backend: `npm start`
- Frontend: `npm start`

## Troubleshooting

- Port conflicts: kill processes using the port.
- Dependency errors: reinstall node_modules.

For more help, open an issue.

---
