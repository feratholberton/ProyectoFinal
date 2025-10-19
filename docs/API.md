# ELIO API Documentation

Complete reference for the REST API endpoints.

## Base URL

```
Development: http://localhost:10000
Production: https://api.yourdomain.com
```

## Authentication

Currently, the API uses session-based authentication. Future versions will implement JWT tokens.

### Headers

All requests should include:

```http
Content-Type: application/json
Accept: application/json
```

## API Endpoints

### Health Check

Check if the API server is running.

#### Endpoint

```http
GET /health
```

#### Response

```json
{
  "status": "ok",
  "timestamp": "2025-10-19T00:02:26Z",
  "uptime": 12345
}
```

### Consultation Endpoints

The consultation API integrates with Google's Generative AI for intelligent responses.

#### Create Consultation

```http
POST /api/consultations
```

**Request Body:**

```json
{
  "message": "What are the best practices for REST API design?",
  "context": "software development"
}
```

**Response:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "response": "Here are the best practices for REST API design...",
  "timestamp": "2025-10-19T00:02:26Z",
  "tokensUsed": 150
}
```

**Status Codes:**

- `200 OK`: Successful request
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Authentication required
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

#### Get Consultation History

```http
GET /api/consultations
```

**Query Parameters:**

- `limit` (optional): Number of results (default: 10, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response:**

```json
{
  "consultations": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "message": "What are the best practices...",
      "response": "Here are the best practices...",
      "timestamp": "2025-10-19T00:02:26Z"
    }
  ],
  "total": 25,
  "limit": 10,
  "offset": 0
}
```

#### Get Single Consultation

```http
GET /api/consultations/:id
```

**Parameters:**

- `id`: Consultation UUID

**Response:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "message": "What are the best practices for REST API design?",
  "response": "Here are the best practices...",
  "timestamp": "2025-10-19T00:02:26Z",
  "tokensUsed": 150
}
```

**Status Codes:**

- `200 OK`: Consultation found
- `404 Not Found`: Consultation not found

## Error Handling

### Error Response Format

All errors follow this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional context"
    },
    "timestamp": "2025-10-19T00:02:26Z"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | External service down |

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Limit**: 100 requests per minute per IP
- **Headers**: Rate limit info included in response headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1634567890
```

## Swagger Documentation

Interactive API documentation is available at:

```
http://localhost:10000/api/docs
```

This provides:
- Interactive API testing
- Request/response schemas
- Authentication flows
- Example requests

## SDK and Client Libraries

### JavaScript/TypeScript

```typescript
import { ApiClient } from 'your-repo-client';

const client = new ApiClient({
  baseUrl: 'http://localhost:10000',
  apiKey: 'your-api-key'
});

const response = await client.consultations.create({
  message: 'Hello, AI!',
  context: 'general'
});
```

## Versioning

The API uses URL versioning:

```
/api/v1/consultations
/api/v2/consultations
```

Current version: `v1`

## CORS Configuration

CORS is configured via environment variables:

```env
# Allow all origins
CORS_ORIGIN=*

# Allow specific origins
CORS_ORIGIN=http://localhost:4200,https://yourdomain.com

# Disable CORS
CORS_ORIGIN=false
```

## WebSocket Support (Future)

Future versions will support WebSocket connections for real-time updates:

```javascript
const ws = new WebSocket('ws://localhost:10000/ws');

ws.onmessage = (event) => {
  console.log('Received:', event.data);
};
```

## Best Practices

1. **Always handle errors gracefully**
2. **Implement retry logic with exponential backoff**
3. **Cache responses when appropriate**
4. **Use pagination for large datasets**
5. **Validate input on the client side**
6. **Keep API keys secure**
7. **Use HTTPS in production**
