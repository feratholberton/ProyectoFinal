# ELIO Project Documentation

A full-stack application built with Angular 20 (frontend) and Fastify (backend), featuring AI-powered consultation services using Google's Generative AI.

## Architecture

This project follows a **monorepo structure** with clear separation between frontend and backend:

```
your-repo/
├── Server/          # Backend API (Fastify + TypeScript)
├── ui/              # Frontend Application (Angular 20)
└── docs/            # Comprehensive documentation
```

## Quick Start

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: Latest version

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-user/your-repo.git
   cd your-repo
   ```

2. **Install backend dependencies**
   ```bash
   cd Server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../ui
   npm install
   ```

### Configuration

Create a `.env` file in the `Server/` directory:

```env
# Server Configuration
PORT=10000

# CORS Configuration
CORS_ORIGIN=http://localhost:4200

# Google Generative AI
GEMINI_API_KEY=your_api_key_here

# Swagger Documentation
SWAGGER_BASE_URL=/api/docs
```

### Running the Application

#### Backend Server

```bash
cd Server
npm run dev 
npm start
npm test
```

The API will be available at `http://localhost:10000`

#### Frontend Application

```bash
cd ui
npm start
npm run build
npm test
```

The UI will be available at `http://localhost:4200`

## Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Installation Guide](docs/INSTALL.md)** - Detailed setup instructions
- **[Architecture Overview](docs/ARCHITECTURE.md)** - System design and patterns
- **[API Reference](docs/API.md)** - Complete API documentation
- **[Security Guide](docs/SECURITY.md)** - Security best practices
- **[User Guide](docs/USER_GUIDE.md)** - End-user documentation

## Technology Stack

### Backend
- **Framework**: Fastify 5.6.1
- **Language**: TypeScript 5.9.2
- **AI Integration**: Google Generative AI
- **Testing**: Vitest
- **Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: Angular 20.3.0
- **Language**: TypeScript 5.9.2
- **Rendering**: Server-Side Rendering (SSR)
- **Testing**: Jasmine + Karma
- **Styling**: CSS3

## Architecture Pattern

The backend follows **Hexagonal Architecture (Ports & Adapters)**:

- **Domain Layer**: Business logic and entities
- **Application Layer**: Use cases and services
- **Infrastructure Layer**: External adapters (HTTP, AI, etc.)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the ISC License.

## Useful Links

- [Fastify Documentation](https://www.fastify.io/)
- [Angular Documentation](https://angular.io/docs)
- [Google Generative AI](https://ai.google.dev/)

## Support

For issues, questions, or contributions, please open an issue in the repository.
