# ELIO Architecture Documentation

This document provides a comprehensive overview of the application's architecture, design patterns, and technical decisions.

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Pattern](#architecture-pattern)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Data Flow](#data-flow)
- [Design Decisions](#design-decisions)

## System Overview

The application follows a **client-server architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                     │
│              Angular 20 + SSR + RxJS                    │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP/HTTPS
                       │ REST API
┌──────────────────────▼──────────────────────────────────┐
│                   API Server                            │
│           Fastify + TypeScript + CORS                   │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │
┌──────────────────────▼──────────────────────────────────┐
│             External Services                           │
│          Google Generative AI (Gemini)                  │
└─────────────────────────────────────────────────────────┘
```

## Architecture Pattern

### Hexagonal Architecture (Backend)

The backend implements **Hexagonal Architecture** (also known as Ports and Adapters), which provides:

- **Separation of concerns**
- **Testability**
- **Flexibility to change external dependencies**
- **Domain-driven design principles**

```
┌───────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                   │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │   HTTP API  │  │  AI Adapter  │  │  Config Files   │   │
│  └──────┬──────┘  └──────┬───────┘  └─────────┬───────┘   │
│         │                │                    │           │
└─────────┼────────────────┼────────────────────┼───────────┘
          │                │                    │
┌─────────▼────────────────▼────────────────────▼───────────┐
│                   Application Layer                       │
│  ┌──────────────┐  ┌─────────────────┐  ┌──────────────┐  │
│  │  Use Cases   │  │   Services      │  │     DTOs     │  │
│  └──────┬───────┘  └─────────┬───────┘  └──────────────┘  │
└─────────┼────────────────────┼────────────────────────────┘
          │                    │
┌─────────▼────────────────────▼────────────────────────────┐
│                      Domain Layer                         │
│  ┌───────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Entities    │  │    Ports     │  │ Value Objects│    │
│  └───────────────┘  └──────────────┘  └──────────────┘    │
│  ┌───────────────┐  ┌──────────────┐                      │
│  │Domain Services│  │    Errors    │                      │
│  └───────────────┘  └──────────────┘                      │
└───────────────────────────────────────────────────────────┘
```

## Backend Architecture

### Directory Structure

```
Server/
├── src/
│   ├── domain/                    # Core business logic
│   │   ├── entities/              # Domain entities
│   │   ├── value-objects/         # Immutable value objects
│   │   ├── ports/                 # Interfaces (contracts)
│   │   ├── services/              # Domain services
│   │   └── errors/                # Domain-specific errors
│   │
│   ├── application/               # Application use cases
│   │   ├── use-cases/             # Business use cases
│   │   ├── services/              # Application services
│   │   └── dtos/                  # Data Transfer Objects
│   │
│   ├── infrastructure/            # External adapters
│   │   ├── http/                  # HTTP routes & controllers
│   │   │   ├── routes/            # Route definitions
│   │   │   └── controllers/       # Request handlers
│   │   ├── adapters/              # External service adapters
│   │   └── config/                # Configuration files
│   │
│   └── server.ts                  # Application entry point
│
├── test/                          # Test files
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies
└── .env                           # Environment variables
```

### Layer Responsibilities

#### 1. Domain Layer
- **Entities**: Core business objects with unique identity
- **Value Objects**: Immutable objects defined by their attributes
- **Ports**: Interfaces that define contracts for external dependencies
- **Domain Services**: Business logic that doesn't belong to entities
- **Errors**: Custom error types for domain violations

**Key Principle**: No external dependencies, pure business logic

#### 2. Application Layer
- **Use Cases**: Orchestrate domain objects to fulfill business requirements
- **Application Services**: Coordinate use cases and infrastructure
- **DTOs**: Transform data between layers

**Key Principle**: Coordinates domain and infrastructure

#### 3. Infrastructure Layer
- **HTTP**: REST API endpoints and controllers
- **Adapters**: Implementations of domain ports (AI services, databases, etc.)
- **Config**: Environment and application configuration

**Key Principle**: Implements technical details and external integrations

### Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Runtime | Node.js | 18+ | JavaScript runtime |
| Framework | Fastify | 5.6.1 | High-performance web framework |
| Language | TypeScript | 5.9.2 | Type-safe JavaScript |
| CORS | @fastify/cors | 11.1.0 | Cross-origin resource sharing |
| Security | @fastify/helmet | 13.0.2 | Security headers |
| Documentation | @fastify/swagger | 9.5.2 | API documentation |
| AI Integration | @google/generative-ai | 0.24.1 | Google Gemini AI |
| Testing | Vitest | 1.0.0 | Unit testing framework |
| Environment | dotenv | 17.2.3 | Environment variables |

## Frontend Architecture

### Directory Structure

```
ui/
├── src/
│   ├── app/                       # Application code
│   │   ├── components/            # Reusable components
│   │   ├── services/              # Business services
│   │   ├── models/                # TypeScript interfaces
│   │   ├── guards/                # Route guards
│   │   └── interceptors/          # HTTP interceptors
│   │
│   ├── assets/                    # Static assets
│   ├── environments/              # Environment configs
│   ├── main.ts                    # Application entry point
│   ├── main.server.ts             # SSR entry point
│   └── styles.css                 # Global styles
│
├── public/                        # Public assets
├── angular.json                   # Angular configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies
```

### Component Architecture

Angular follows a **component-based architecture** with:

- **Smart Components**: Handle business logic and state management
- **Presentational Components**: Pure UI components
- **Services**: Shared business logic and HTTP communication
- **Guards**: Route protection
- **Interceptors**: HTTP request/response modification

### Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | Angular | 20.3.0 | Frontend framework |
| Language | TypeScript | 5.9.2 | Type-safe JavaScript |
| State Management | RxJS | 7.8.0 | Reactive programming |
| SSR | Angular SSR | 20.3.3 | Server-side rendering |
| Server | Express | 5.1.0 | SSR server |
| Testing | Jasmine/Karma | Latest | Unit/Integration testing |

## Data Flow

### Request Flow

```
User Action (Browser)
    ↓
Angular Component
    ↓
Angular Service (HTTP Client)
    ↓
[HTTP Request] → Backend API
    ↓
Fastify Route Handler
    ↓
Controller
    ↓
Use Case (Application Layer)
    ↓
Domain Service / Entity
    ↓
Port Interface
    ↓
Adapter (Infrastructure)
    ↓
External Service (Google AI)
    ↓
[Response Path - Reverse Order]
    ↓
Angular Component Updates View
    ↓
User Sees Result
```

### Authentication Flow

```
User Login Request
    ↓
Backend validates credentials
    ↓
Generate JWT token
    ↓
Return token to frontend
    ↓
Frontend stores token (session/localStorage)
    ↓
Subsequent requests include token in headers
    ↓
Backend validates token via middleware
    ↓
Grant/Deny access to resources
```

## Design Decisions

### 1. Why Hexagonal Architecture?

**Rationale**: 
- Decouples business logic from technical implementation
- Makes the application more testable
- Allows easy replacement of external dependencies
- Enforces clean separation of concerns

### 2. Why Fastify over Express?

**Rationale**:
- **Performance**: 2-3x faster than Express
- **Type Safety**: Better TypeScript support
- **Plugin System**: Modular architecture
- **Schema Validation**: Built-in request/response validation
- **Modern**: Async/await support out of the box

### 3. Why Angular with SSR?

**Rationale**:
- **SEO**: Server-side rendering improves search engine optimization
- **Performance**: Faster initial page load
- **Type Safety**: Full TypeScript support
- **Enterprise-Ready**: Comprehensive framework with everything included
- **Reactive Programming**: RxJS for complex async operations

### 4. Why Google Generative AI?

**Rationale**:
- **Advanced Capabilities**: State-of-the-art language model
- **Reliability**: Enterprise-grade service
- **Cost-Effective**: Competitive pricing
- **Easy Integration**: Official SDK available

### 5. Why Vitest for Testing?

**Rationale**:
- **Speed**: Extremely fast test execution
- **Vite Integration**: Seamless integration with modern tooling
- **ESM Support**: Native ES modules support
- **TypeScript**: First-class TypeScript support

## Security Considerations

### Backend Security

1. **Helmet**: Security headers (XSS, clickjacking protection)
2. **CORS**: Configurable cross-origin resource sharing
3. **Environment Variables**: Sensitive data not hardcoded
4. **Input Validation**: Schema-based request validation
5. **Error Handling**: Generic error messages to clients

### Frontend Security

1. **Angular Sanitization**: Automatic XSS protection
2. **HTTP Interceptors**: Token management and error handling
3. **Route Guards**: Access control
4. **Environment Variables**: Separate configs for dev/prod

## Performance Optimizations

### Backend
- Fastify's high-performance architecture
- Asynchronous request handling
- Connection pooling for external services
- Response caching where appropriate

### Frontend
- Server-Side Rendering (SSR) for initial load
- Lazy loading of modules
- OnPush change detection strategy
- Production build optimizations (minification, tree-shaking)

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Load balancing support
- Multiple server instances

### Vertical Scaling
- Efficient resource utilization
- Async/await for non-blocking operations
- Memory management best practices

## Monitoring and Logging

### Backend
- Fastify built-in logger (Pino)
- Structured logging (JSON format)
- Error tracking and reporting
- Performance metrics

### Frontend
- Error boundary components
- Console logging in development
- Analytics integration ready

## Future Improvements

1. **Database Integration**: Add PostgreSQL/MongoDB
2. **Caching Layer**: Implement Redis for performance
3. **Message Queue**: Add RabbitMQ/Kafka for async processing
4. **API Gateway**: Centralized API management
5. **Microservices**: Split into domain-specific services
6. **Container Orchestration**: Kubernetes deployment
7. **GraphQL**: Alternative API layer
8. **WebSockets**: Real-time communication
