# Options Selector Component Guide

## Overview

The Options Selector component displays checkboxes for multiple options returned from the backend. Only the selected options are sent to the `/api/collect` endpoint.

## Flow

1. User completes consultation form (`motivo_consulta`, `edad`, `sexo`)
2. Form is submitted to `/start` endpoint
3. Backend responds with `patientID`, `pasoActual`, and `opciones` array
4. Options Selector component renders checkboxes for each option
5. User selects applicable options and may add additional information
6. Selected options are submitted to `/api/collect` endpoint

## Component Structure

**Files:**
```
src/app/components/options-selector/
├── options-selector.ts         # Component logic
├── options-selector.html       # Template with checkboxes
├── options-selector.css        # Styling
└── options-selector.spec.ts    # Unit tests
```

**Updated Files:**
- `consultation.service.ts` — add interfaces and `collectData()` method
- `consultation-form.ts` — integrate Options Selector
- `consultation-form.html` — display Options Selector
- `consultation-form.css` — update layout styles

## API Integration

### Step 1: Start Consultation

**Endpoint:** `POST /start`

**Request:**
```json
{
  "motivo_consulta": "Dolor rodilla",
  "edad": 50,
  "sexo": "m"
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
    { "label": "Sobrepeso", "checked": false }
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
  "additional": "Notes or details"
}
```

## Usage Examples

**Standalone Usage:**

```typescript
import { Component, inject, viewChild } from '@angular/core';
import { OptionsSelector } from './components/options-selector/options-selector';
import { ConsultationService } from './services/consultation.service';

@Component({
  selector: 'app-my-component',
  imports: [OptionsSelector],
  template: `<app-options-selector (dataSubmitted)="onDataSubmitted($event)" />`
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
    // Handle next step if new options are received
    if (result['patientID'] && result['opciones']) {
      const selector = this.optionsSelector();
      if (selector) {
        selector.loadData(result);
      }
    }
  }
}
```

**Integrated with Consultation Form:**
1. User submits initial consultation
2. Options selector appears
3. User selects options and submits
4. New options are loaded automatically if returned by backend

## Component API

### OptionsSelector

**Inputs:**
- `consultationData` — pre-load data (optional)

**Outputs:**
- `dataSubmitted` — emitted when data is submitted

**Public Methods:**
- `loadData(data: ConsultationResponse)`
- `getSelectedOptions()`
- `toggleOption(index: number)`
- `hasData()`

**Signals:**
- `patientID`, `pasoActual`, `opciones`, `additional`, `isLoading`, `error`

## Features

- Display options as checkboxes
- Track checked/unchecked state
- Send selected options only
- Validation (at least one option required)
- Additional information field
- Loading indicators and error handling
- Multi-step support (chained options)
- Responsive, accessible design

## Testing

Run tests with:
```bash
npm test
```
Tests cover:
- Component creation
- Service integration
- HTTP requests
- Error handling

## Customization

**Change Checkbox Layout:**
```css
.checkbox-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}
```

**Add Custom Validation:**
```typescript
onSubmit() {
  const selectedOptions = this.getSelectedOptions();
  if (selectedOptions.length > 5) {
    this.error.set('You cannot select more than 5 options');
    return;
  }
}
```

**Handle Response Data:**
```typescript
export interface CollectResponse {
  patientID: string;
  pasoActual: string;
  opciones?: Opcion[];
  message?: string;
}
```

## Next Steps

1. Test the complete flow from consultation to data collection
2. Add more validation as needed
3. Customize styling to match your design system
4. Add analytics/tracking if needed
5. Implement navigation to next steps after submission

---
