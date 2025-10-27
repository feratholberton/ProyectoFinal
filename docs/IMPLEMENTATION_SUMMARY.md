# ELIO Implementation Summary

This document summarizes the technical implementation of the ELIO platform.

## Frontend (`client/`)

- Built using Angular 20 and TypeScript.
- Organized into modular folders:
  - `components/` — UI components for forms, multi-step intake, selectors.
  - `models/` — TypeScript interfaces and types.
  - `application/`, `domain/`, `infrastructure/`, `presentation/`, `utils/` — separated by responsibility.
- Entry point: `src/main.ts`
- SSR support: `src/main.server.ts`
- Routing managed in `app.routes.ts`
- State managed per session/consultation.

## Backend (`server/`)

- Built using Fastify and TypeScript.
- Main entry: `src/app.ts`
- Each clinical step implemented as a route in `src/routes/` (e.g., `antecedents`, `allergies`, `drugs`).
- AI integration (Google Gemini) via plugin in `src/plugins/genai.ts`
- Session state managed in-memory via `src/stores/patient-intake-store.ts`
- Utility functions in `src/utils/`
- API documentation via Swagger plugin.

## Data Flow

- User starts a consultation in the frontend.
- Form data POSTed to backend `/start` endpoint.
- Backend processes and responds with options for next step.
- User selects options, submits for each step.
- Backend updates session and responds with next step or summary.

## Tests

- Backend: Unit tests in `server/test/`
- Frontend: Unit tests in `client/src/app/components/` and other relevant folders.

## Deployment

- Backend and frontend can be deployed separately.
- See [DEPLOYMENT.md](DEPLOYMENT.md) for details.

## Security

- CORS and secure HTTP headers enabled in backend.
- Sensitive environment variables managed via `.env`
- Frontend uses Angular security best practices.

---
