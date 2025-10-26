# ELIO Architecture Guide

This document describes the technical architecture and design of ELIO.

## System Overview

ELIO is structured as a modular client-server application:

- **Frontend (`client/`):**  
  Modern Angular 20 project. Implements user interface, multi-step consultation forms, and communicates with the backend via HTTP.

- **Backend (`server/`):**  
  Fastify + TypeScript project. Manages REST endpoints for each clinical intake step, session/state management, and AI integration.

- **Project Charter (`manELIO.md`):**  
  High-level overview and goals of the system.

---

## Backend Structure

**Location:** `server/`

- **Entry point:** `server/src/app.ts`
- **Routes:**  
  All clinical sections are implemented as folders in `server/src/routes/` (e.g., `antecedents`, `allergies`, `drugs`, etc.).
- **Plugins:**  
  Located at `server/src/plugins/` (CORS, Swagger, AI, security).
- **Stores:**  
  State/session management in `server/src/stores/`.
- **Utils:**  
  Helpers in `server/src/utils/`.

**Testing:**  
Backend tests are in `server/test/`.

---

## Frontend Structure

**Location:** `client/`

- **Entry point:** `client/src/main.ts`, `client/src/main.server.ts`
- **App code:** `client/src/app/`
  - `components/` — UI components (forms, selectors, etc.)
  - `application/`, `domain/`, `infrastructure/`, `models/`, `presentation/`, `utils/` — organized by responsibility.
  - Routing in `app.routes.ts` and `app.routes.server.ts`
- **Config/environment:**  
  `client/src/app/config.ts` and `client/src/environments/`
- **Public assets:**  
  `client/public/`
- **Global styles:**  
  `client/src/styles.css`

---

## Data Flow

1. User starts a consultation in the frontend.
2. Form data is POSTed to backend endpoints (see API.md).
3. Backend processes input and returns options for the next step.
4. Frontend displays options as checkboxes; user selects and submits.
5. Backend updates session state and advances to next step.
6. Flow repeats until consultation is completed.

---

## Design Principles

- **Separation of concerns:** Frontend, backend, and documentation are clearly separated.
- **Modular routes:** Each intake step is a separate backend route.
- **State/session:** Managed server-side for each patient/consultation.
- **Plugin architecture:** Fastify plugins for middleware (AI, security, docs).
- **Multi-step UX:** Frontend guides users through each consultation stage.

---

## Performance and Scalability

- Fastify backend for speed and scalability.
- Stateless REST endpoints.
- Angular SSR for frontend performance.

---
