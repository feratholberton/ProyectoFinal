# Options Selector Component - Usage Guide

## Overview
The Options Selector component displays checkboxes for multiple options returned from the backend and sends back only the selected options to the `/api/collect` endpoint.

## Flow

1. User fills out consultation form (motivo, edad, genero)
2. Submit to `/start` endpoint
3. Backend returns response with `patientID`, `pasoActual`, and `opciones` array
4. Options Selector component displays checkboxes
5. User selects applicable options and optionally adds additional information
6. Submit to `/api/collect` endpoint with only selected options

## Component Structure

### Files Created

```
src/app/components/options-selector/
├── options-selector.ts         # Component logic
├── options-selector.html       # Template with checkboxes
├── options-selector.css        # Styling
└── options-selector.spec.ts    # Unit tests
```

### Updated Files

- `consultation.service.ts` - Added interfaces and `collectData()` method
- `consultation-form.ts` - Integrated with options selector
- `consultation-form.html` - Added options selector display
- `consultation-form.css` - Updated layout styles

## API Integration

### Step 1: Start Consultation

**Endpoint:** `POST /start`

**Request:**
```json
{
  "motivo_consulta": "Dolor rodilla",
  "edad": 50,
  "genero": "m"
}
```

**Response:**
```json
{
  "patientID": "1f9607e4-3fd6-494b-93fe-916c36b0c726",
  "pasoActual": "antecedentes",
  "opciones": [
    { "label": "Artrosis", "checked": false },
    { "label": "Cirugía rodilla", "checked": false },
    { "label": "Sobrepeso", "checked": false },
    { "label": "Diabetes", "checked": false },
    { "label": "Hipertensión", "checked": false },
    { "label": "Gota", "checked": false },
    { "label": "Tabaquismo", "checked": false }
  ]
}
```

### Step 2: Collect Data

**Endpoint:** `POST /api/collect`

**Request:**
```json
{
  "patientID": "1f9607e4-3fd6-494b-93fe-916c36b0c726",
  "opciones": ["Artrosis", "Sobrepeso"],
  "additional": "string"
}
```

## Usage Examples

### Standalone Usage

```typescript
import { Component, inject, viewChild } from '@angular/core';
import { OptionsSelector } from './components/options-selector/options-selector';
import { ConsultationService } from './services/consultation.service';

@Component({
  selector: 'app-my-component',
  imports: [OptionsSelector],
  template: `
    <app-options-selector (dataSubmitted)="onDataSubmitted($event)" />
  `
})
export class MyComponent {
  optionsSelector = viewChild(OptionsSelector);
  consultationService = inject(ConsultationService);

  loadOptions() {
    this.consultationService.startConsultation('Dolor rodilla', 50, 'm')
      .subscribe(response => {
        const selector = this.optionsSelector();
        if (selector) {
          selector.loadData(response);
        }
      });
  }

  onDataSubmitted(result: any) {
    console.log('Data submitted:', result);
    // Handle next step if the response contains new options
    if (result['patientID'] && result['opciones']) {
      const selector = this.optionsSelector();
      if (selector) {
        selector.loadData(result);
      }
    }
  }
}
```

### Integrated with Consultation Form

The consultation form component automatically handles the integration:

1. User submits initial consultation
2. Options selector appears with checkboxes
3. User selects options and submits
4. If backend returns new options, they're loaded automatically

## Component API

### OptionsSelector

**Inputs:**
- `consultationData` - Optional input to pre-load data

**Outputs:**
- `dataSubmitted` - Emits when data is successfully submitted to the server

**Public Methods:**
- `loadData(data: ConsultationResponse)` - Load consultation response data
- `getSelectedOptions()` - Get array of selected option labels
- `toggleOption(index: number)` - Toggle checkbox state
- `hasData()` - Check if component has data to display

**Signals:**
- `patientID` - Current patient ID
- `pasoActual` - Current step name
- `opciones` - Array of options with checked state
- `additional` - Additional information text
- `isLoading` - Loading state
- `error` - Error message

## Features

### Checkbox Management
- Display multiple options as checkboxes
- Track checked/unchecked state
- Only send selected options to server

### Validation
- Requires at least one option to be selected
- Shows error message if no options selected

### Additional Information
- Optional textarea for additional details
- Sent with selected options

### Loading States
- Disables form during submission
- Shows loading indicator on submit button

### Error Handling
- Displays error messages
- Logs errors to console
- Allows retry after error

### Multi-Step Support
- Automatically loads new options if returned from server
- Supports chained consultation steps
- Maintains patient ID across steps

## Styling

The component uses a clean, modern design:
- Responsive layout
- Hover effects on checkboxes
- Clear visual feedback
- Accessible form controls

## Testing

Run tests with:
```bash
npm test
```

Tests verify:
- Component creation
- Service integration
- HTTP requests
- Error handling

## Customization

### Change Checkbox Layout

Modify `options-selector.css`:
```css
.checkbox-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two columns */
  gap: 0.75rem;
}
```

### Add Custom Validation

In `options-selector.ts`:
```typescript
onSubmit() {
  const selectedOptions = this.getSelectedOptions();
  
  // Custom validation
  if (selectedOptions.length > 5) {
    this.error.set('No puede seleccionar más de 5 opciones');
    return;
  }
  
  // Continue with submission...
}
```

### Handle Response Data

Update `CollectResponse` interface in `consultation.service.ts`:
```typescript
export interface CollectResponse {
  patientID: string;
  pasoActual: string;
  opciones?: Opcion[];
  message?: string;
  // Add your fields
}
```

## Next Steps

1. Test the complete flow from consultation to data collection
2. Add more validation rules if needed
3. Customize styling to match your design system
4. Add analytics/tracking if needed
5. Implement navigation to next steps after submission
