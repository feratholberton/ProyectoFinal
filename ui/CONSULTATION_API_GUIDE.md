# How to Use the Consultation API in Angular

## Overview
This guide shows how to implement the POST request to `https://backend-w6ii.onrender.com/start` in your Angular application.

## Files Created

### 1. Service: `consultation.service.ts`
Location: `ui/src/app/services/consultation.service.ts`

This service handles the API communication with the backend.

**Key features:**
- Injects HttpClient for making HTTP requests
- Defines TypeScript interfaces for type safety
- Implements error handling with RxJS operators
- Returns an Observable for reactive programming

### 2. Example Component: `consultation-form`
Location: `ui/src/app/components/consultation-form/`

A complete example component showing how to use the service.

**Features:**
- Form with textarea for "motivo de consulta"
- Number input for age (edad)
- Select dropdown for gender (genero)
- Loading state management
- Error handling and display
- Success message with response data
- Form validation for all required fields
- Uses Angular signals for reactive state management

## Quick Start

### Option 1: Use the Service Directly in Any Component

```typescript
import { Component, inject } from '@angular/core';
import { ConsultationService } from './services/consultation.service';

export class YourComponent {
  private consultationService = inject(ConsultationService);

  startConsultation() {
    this.consultationService.startConsultation(
      'Dolor rodilla',  // motivo_consulta
      50,               // edad
      'm'               // genero: 'm' or 'f'
    ).subscribe({
      next: (response) => {
        console.log('Success:', response);
        // Handle success
      },
      error: (error) => {
        console.error('Error:', error);
        // Handle error
      }
    });
  }
}
```

### Option 2: Use the Pre-built Form Component

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
  "genero": "m"
}
```

**Parameters:**
- `motivo_consulta` (string, required): Reason for consultation
- `edad` (number, required): Patient's age
- `genero` (string, required): Patient's gender - "m" for male, "f" for female

## Customization

### Update Response Interface
If you know the exact structure of the API response, update the `ConsultationResponse` interface in `consultation.service.ts`:

```typescript
export interface ConsultationResponse {
  id: string;
  status: string;
  message: string;
  // Add your actual response fields here
}
```

### Change API URL
To use a different environment or API URL, update the `apiUrl` in the service:

```typescript
private apiUrl = 'https://your-api-url.com';
```

Or use Angular's environment files for better configuration management.

## Testing

Run the tests with:
```bash
npm test
```

The service includes unit tests that verify:
- Service creation
- POST request is sent correctly
- Headers are set properly
- Error handling works as expected

## Next Steps

1. Update the `ConsultationResponse` interface with your actual API response structure
2. Add the consultation form component to your routing or main app component
3. Customize the styling in `consultation-form.css` to match your design
4. Consider adding form validation if needed
5. Implement navigation or additional actions after successful submission

## Notes

- The service uses Angular's standalone API (no NgModule required)
- HttpClient is already configured in your `app.config.ts`
- The component uses Angular signals for reactive state management
- Error handling is included in both the service and component levels
