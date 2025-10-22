# Multi-Step Consultation Flow - Complete Guide

## Overview
The consultation system now supports a complete multi-step workflow:
1. Initial consultation submission
2. First set of options (antecedentes)
3. View previous selections + new options (alergias, etc.)
4. Continuous flow until complete

## API Flow

### Step 1: Start Consultation
```
POST /start
Body: { motivo_consulta, edad, genero }
Response: { patientID, pasoActual, opciones }
```

### Step 2: Collect First Options
```
POST /api/collect
Body: { patientID, opciones: ["selected1", "selected2"], additional }
Response: success confirmation
```

### Step 3: Get Consulta State
```
POST /consulta/{patientID}
Body: (empty)
Response: {
  pasoActual: "alergias",
  partialState: {
    motivo_consulta,
    edad,
    genero,
    opciones: [{ label, checked }] // Previous selections
  }
}
```

### Step 4: Get New Options
```
GET /generator/{patientID}
Response: {
  opciones: [{ label, checked }] // New options for current step
}
```

### Step 5: Repeat
Steps 2-4 repeat for each consultation stage (alergias, medicamentos, etc.)

## Implementation Details

### Service Methods

#### `startConsultation(motivo, edad, genero)`
Initiates the consultation flow

#### `collectData(patientID, selectedOptions, additional)`
Submits selected options for current step

#### `getConsulta(patientID)`
Retrieves current consultation state with previous selections

#### `getGenerator(patientID)`
Gets new options for the current step

## Component Behavior

### OptionsSelector Component

**Features:**
1. **Displays current options** as checkboxes
2. **Shows previous selections** in a blue badge section
3. **Automatic flow progression** after submission:
   - Collects data
   - Retrieves consulta state (with previous selections)
   - Fetches new generator options
   - Updates display automatically

**Signals:**
- `patientID` - Current patient ID
- `pasoActual` - Current step name (e.g., "alergias")
- `opciones` - Current step options (checkboxes)
- `previousSelections` - Array of all previous selections
- `additional` - Optional additional information
- `isLoading` - Loading state
- `error` - Error messages

### Flow Example

```
User Journey:
1. Fill form: "Dolor ojo derecho", age 50, gender M
2. Click "Iniciar Consulta"
   → Shows: antecedentes options
   
3. Select: "Uso lentes contacto", "Antecedente Herpes Zoster"
4. Click "Enviar"
   → POST to /api/collect
   → POST to /consulta/{id} (gets previous selections)
   → GET /generator/{id} (gets new options)
   
5. Display updates:
   Previous Selections (blue badges):
   - Uso lentes contacto
   - Antecedente Herpes Zoster
   
   Current Step: alergias
   New Options (checkboxes):
   - Alergia a conservantes...
   - Alergia a componentes...
   - etc.

6. Select new options and repeat...
```

## UI Components

### Previous Selections Display
```html
<div class="previous-selections">
  <h3>Selecciones anteriores:</h3>
  <div class="selection-list">
    <span class="selection-badge">Uso lentes contacto</span>
    <span class="selection-badge">Antecedente Herpes Zoster</span>
  </div>
</div>
```

Styled with:
- Blue background
- Blue badges for each selection
- Displayed above current options

### Current Options
Standard checkbox list for the current step's options

## Complete Code Flow

### On Submit Button Click:

```typescript
1. Get selected options from checkboxes
2. Validate (at least one selected)
3. POST to /api/collect with selections
4. On success:
   a. POST to /consulta/{patientID}
      - Get pasoActual
      - Get partialState.opciones (previous selections)
   b. GET /generator/{patientID}
      - Get new opciones for current step
   c. Update component:
      - Set previousSelections (badges)
      - Set opciones (new checkboxes)
      - Set pasoActual (step title)
      - Clear additional text
   d. Emit dataSubmitted event
```

## Data Structures

### Opcion
```typescript
{
  label: string;
  checked: boolean;
}
```

### PartialState
```typescript
{
  motivo_consulta: string;
  edad: number;
  genero: string;
  opciones: Opcion[]; // All previous selections with checked: true
}
```

### ConsultaResponse
```typescript
{
  pasoActual: string; // Current step name
  partialState: PartialState;
}
```

### GeneratorResponse
```typescript
{
  opciones: Opcion[]; // New options, all with checked: false
}
```

## Error Handling

The system handles errors at each step:
- Network failures
- Invalid responses
- Missing data

Errors are displayed to the user with retry capability.

## Testing the Flow

1. Start the app: `npm start`
2. Fill consultation form
3. Submit and verify first options appear
4. Select some options and submit
5. Verify:
   - Previous selections show in blue badges
   - New step name appears
   - New checkboxes are displayed
   - Previous checkboxes are cleared

## Debug Mode

The component includes debug information (can be removed in production):
```html
<div style="background: #f0f0f0; padding: 10px;">
  Has Data: {{ hasData() }}
  Opciones Length: {{ opciones().length }}
  Patient ID: {{ patientID() }}
  Paso Actual: {{ pasoActual() }}
</div>
```

## Customization

### Change Badge Colors
Edit `options-selector.css`:
```css
.selection-badge {
  background-color: #28a745; /* Green instead of blue */
}
```

### Add Step Counter
Track and display step number in the component.

### Add Progress Bar
Show visual progress through consultation steps.

## Production Considerations

1. **Remove debug div** from HTML template
2. **Add loading spinner** for better UX during API calls
3. **Add confirmation dialog** before moving to next step
4. **Save progress** periodically
5. **Add navigation** to go back to previous steps
6. **Add summary view** showing all selections

## Summary

✅ Complete multi-step flow implemented
✅ Previous selections displayed as badges
✅ Automatic progression through steps
✅ Error handling at each stage
✅ Clean, intuitive UI
✅ Fully typed with TypeScript
✅ Reactive with Angular signals

The system is now ready to handle the complete consultation workflow!
