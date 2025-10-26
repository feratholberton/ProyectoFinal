# ELIO API Reference

This document describes the real REST API endpoints implemented in ELIO.

## Base URLs

- Development: `http://localhost:10000`
- Production: Set in deployment environment

---

## Endpoints

### Health Check

- **GET /health**
  - Checks API server status.
  - **Response:**
    ```json
    {
      "status": "ok",
      "timestamp": "<ISO8601>",
      "uptime": <seconds>
    }
    ```

---

### Consultation Intake Steps

All consultation steps are implemented as dedicated endpoints under `server/src/routes/`.

#### Initial Consultation

- **POST /start**
  - Starts a new consultation.
  - **Request:**
    ```json
    {
      "motivo_consulta": "Pain in right knee",
      "edad": 50,
      "sexo": "m"
    }
    ```
  - **Response:**
    ```json
    {
      "patientID": "<uuid>",
      "pasoActual": "antecedents",
      "opciones": [
        { "label": "Diabetes", "checked": false },
        { "label": "Hypertension", "checked": false }
      ]
    }
    ```

#### Step Endpoints

For each clinical intake step, there is a dedicated endpoint.  
(Examples — see `server/src/routes/` for full list):

- **POST /antecedents**
- **POST /allergies**
- **POST /drugs**
- **POST /characteristics**
- **POST /location**
- **POST /red-flags**
- ... (continue with other folders in `routes/`)

Each request typically expects:

```json
{
  "patientID": "<uuid>",
  "opciones": ["Diabetes", "Hypertension"],
  "additional": "Any notes"
}
```

Each response typically includes:

```json
{
  "status": "ok",
  "nextStep": "allergies",
  "opciones": [
    { "label": "Penicillin allergy", "checked": false }
  ]
}
```

---

### API Documentation

Swagger is enabled at:  
`http://localhost:10000/api/docs` (when backend is running)

---

## Error Handling

All errors return:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Description",
    "timestamp": "<ISO8601>"
  }
}
```

Common codes: `VALIDATION_ERROR`, `NOT_FOUND`, `INTERNAL_ERROR`

---

## Rate Limiting

Configurable in backend environment.

---

## CORS

Configurable via `CORS_ORIGIN` in backend `.env`.

---

---
