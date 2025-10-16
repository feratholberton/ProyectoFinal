# ELIO API Documentation

## Authentication
ELIO uses [authentication method] to secure API endpoints.

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "name": "string",
    "role": "string"
  }
}
```

## Patient Endpoints

### Retrieve Patient List

```
GET /api/patients
```

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page`: page number (default: 1)
- `limit`: results per page (default: 10)
- `search`: search term

**Response:**
```json
{
  "total": 50,
  "page": 1,
  "limit": 10,
  "data": [
    {
      "id": "string",
      "name": "string",
      "dateOfBirth": "string",
      "gender": "string",
      "identificationNumber": "string"
    }
  ]
}
```

### Retrieve Patient by ID

```
GET /api/patients/{id}
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "lastName": "string",
  "dateOfBirth": "date",
  "gender": "string",
  "address": "string",
  "phone": "string",
  "email": "string",
  "identificationNumber": "string",
  "bloodType": "string",
  "allergies": ["string"],
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Create Patient

```
POST /api/patients
```

[Document remaining endpoints...]

## Medical Record Endpoints

### Create New Medical Record Entry

```
POST /api/patients/{patientId}/records
```

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "date": "datetime",
  "reason": "string",
  "diagnosis": "string",
  "treatment": "string",
  "observations": "string",
  "vitalSigns": {
    "bloodPressure": "string",
    "heartRate": "number",
    "temperature": "number",
    "respiratoryRate": "number"
  }
}
```

[Document remaining endpoints...]

## Data Models

### Patient
```json
{
  "id": "string",
  "name": "string",
  "lastName": "string",
  "dateOfBirth": "date",
  "gender": "string",
  "address": "string",
  "phone": "string",
  "email": "string",
  "identificationNumber": "string",
  "bloodType": "string",
  "allergies": ["string"],
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Medical Record
```json
{
  "id": "string",
  "patientId": "string",
  "practitionerId": "string",
  "date": "datetime",
  "reason": "string",
  "diagnosis": "string",
  "treatment": "string",
  "observations": "string",
  "vitalSigns": {
    "bloodPressure": "string",
    "heartRate": "number",
    "temperature": "number",
    "respiratoryRate": "number"
  },
  "attachments": ["string"],
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

[Document other models...]

## Error Codes
| Code | Description |
|------|-------------|
| 400  | Bad Request |
| 401  | Unauthorized |
| 403  | Forbidden |
| 404  | Not Found |
| 500  | Internal Server Error |

## Rate Limiting
ELIO API implements rate limiting to prevent abuse. The current limits are:
- 100 requests per minute per IP address
- 1000 requests per hour per user
