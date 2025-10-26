# Consultation API Integration Guide (Angular)

This guide explains how to implement consultation API calls in your Angular frontend.

## Overview

Use the POST request to `https://backend-w6ii.onrender.com/start` to initiate a consultation.

## Service Implementation

**File:** `ui/src/app/services/consultation.service.ts`

- Injects `HttpClient` for API requests
- Uses TypeScript interfaces for type safety
- Implements RxJS operators for error handling
- Returns an Observable for reactive programming

## Sample Component

**File:** `ui/src/app/components/consultation-form/`

Features:
- Textarea for "motivo_consulta"
- Number input for "edad"
- Select dropdown for "sexo" (gender)
- Loading and error state management
- Success message and form validation
- Uses Angular signals for reactive state

## Quick Start

### Use Service Directly

```typescript
import { Component, inject } from '@angular/core';
import { ConsultationService } from './services/consultation.service';

export class YourComponent {
  private consultationService = inject(ConsultationService);

  startConsultation() {
    this.consultationService.startConsultation(
      'Dolor rodilla',
      50,
      'm'
    ).subscribe({
      next: (response) => {
        console.log('Success:', response);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }
}
```

### Use Pre-built Form Component

1. Import the component in your parent component:

```typescript
import { ConsultationForm } from './components/consultation-form/consultation-form';

@Component({
  selector: 'app-root',
  imports: [ConsultationForm], // Add this
  // ...
})
```

2. Add it to your template:

```html
<app-consultation-form></app-consultation-form>
```

## API Details

**Endpoint:** `POST https://backend-w6ii.onrender.com/start`

**Headers:**
- `accept: application/json`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "motivo_consulta": "Dolor rodilla",
  "edad": 50,
  "sexo": "m"
}
```

**Parameters:**
- `motivo_consulta` (string, required): Reason for consultation
- `edad` (number, required): Patient's age
- `sexo` (string, required): Patient's sex ("m" for male, "f" for female)

## Customization

### Update Response Interface

If you know the exact API response structure, update `ConsultationResponse` in `consultation.service.ts`:

```typescript
export interface ConsultationResponse {
  id: string;
  status: string;
  message: string;

}
```

### Change API URL

Update the `apiUrl` in the service as needed:

```typescript
private apiUrl = 'https://your-api-url.com';
```

Or use Angular's environment files for better configuration management.

## Testing

Run the tests:

```bash
npm test
```

Tests include:
- Service creation
- POST request correctness
- Header validation
- Error handling

## Next Steps

1. Update `ConsultationResponse` interface to match your backend
2. Add consultation form component to your app routing
3. Customize `consultation-form.css` for your design
4. Add extra form validation as needed
5. Implement navigation or further actions after submission

## Notes

- The service uses Angular's standalone API (no NgModule required)
- `HttpClient` is configured in `app.config.ts`
- The component uses Angular signals for state management
- Error handling is included at both service and component levels

---
