# Consultation Flow - Visual Guide

## Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONSULTATION FLOW                             │
└─────────────────────────────────────────────────────────────────┘

STEP 1: Initial Consultation
┌──────────────────────────┐
│  User fills form:        │
│  - Motivo consulta       │
│  - Edad                  │
│  - Genero                │
└────────────┬─────────────┘
             │
             ▼
      POST /start
             │
             ▼
┌──────────────────────────┐
│  Response:               │
│  - patientID             │
│  - pasoActual            │
│  - opciones[]            │
└────────────┬─────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│  DISPLAY: First Options (Antecedentes)        │
│                                                │
│  [ ] Artrosis                                  │
│  [ ] Cirugía rodilla                           │
│  [ ] Sobrepeso                                 │
│  [ ] Diabetes                                  │
│  ...                                           │
└────────────┬───────────────────────────────────┘
             │
             ▼
    User selects options
             │
             ▼
┌────────────────────────────────────────────────┐
│  POST /api/collect                             │
│  {                                             │
│    patientID: "xxx",                           │
│    opciones: ["Artrosis", "Sobrepeso"],        │
│    additional: ""                              │
│  }                                             │
└────────────┬───────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│  POST /consulta/{patientID}                    │
│  (empty body)                                  │
└────────────┬───────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│  Response:                                     │
│  {                                             │
│    pasoActual: "alergias",                     │
│    partialState: {                             │
│      motivo_consulta: "...",                   │
│      edad: 50,                                 │
│      genero: "M",                              │
│      opciones: [                               │
│        { label: "Artrosis", checked: true },   │
│        { label: "Sobrepeso", checked: true }   │
│      ]                                         │
│    }                                           │
│  }                                             │
└────────────┬───────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│  GET /generator/{patientID}                    │
└────────────┬───────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│  Response:                                     │
│  {                                             │
│    opciones: [                                 │
│      { label: "Alergia a...", checked: false } │
│      { label: "Alergia a...", checked: false } │
│      ...                                       │
│    ]                                           │
│  }                                             │
└────────────┬───────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────┐
│  DISPLAY: Next Step (Alergias)                 │
│                                                │
│  ┌─────────────────────────────────────────┐  │
│  │ Selecciones anteriores:                 │  │
│  │ [Artrosis] [Sobrepeso]                  │  │
│  └─────────────────────────────────────────┘  │
│                                                │
│  Seleccione las opciones aplicables:          │
│  [ ] Alergia a conservantes...                │
│  [ ] Alergia a componentes...                 │
│  [ ] Alergia a polen...                       │
│  ...                                           │
└────────────┬───────────────────────────────────┘
             │
             ▼
    User selects options
             │
             ▼
    REPEAT: POST /api/collect → POST /consulta → GET /generator
             │
             ▼
         Next Step...
```

## UI Components Visual

```
┌─────────────────────────────────────────────────────────┐
│ Consultation Form                                        │
│                                                          │
│ Motivo de Consulta: [________________]                  │
│ Edad: [___]  Género: [v Masculino]                      │
│                                                          │
│ [Iniciar Consulta]                                       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼ (After submission)
┌─────────────────────────────────────────────────────────┐
│ Options Selector                                         │
│                                                          │
│ antecedentes                                            │
│ Paciente ID: 1f9607e4-3fd6-494b-93fe-916c36b0c726      │
│                                                          │
│ Seleccione las opciones aplicables:                     │
│ ┌─────────────────────────────────────────────┐        │
│ │ ☑ Artrosis                                  │        │
│ │ ☐ Cirugía rodilla                           │        │
│ │ ☑ Sobrepeso                                 │        │
│ │ ☐ Diabetes                                  │        │
│ │ ☐ Hipertensión                              │        │
│ └─────────────────────────────────────────────┘        │
│                                                          │
│ Información adicional (opcional):                        │
│ [_________________________________________]             │
│                                                          │
│ [Enviar]                                                 │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼ (After submission)
┌─────────────────────────────────────────────────────────┐
│ Options Selector (Updated)                              │
│                                                          │
│ alergias                                                │
│ Paciente ID: 1f9607e4-3fd6-494b-93fe-916c36b0c726      │
│                                                          │
│ ┌────────────────────────────────────────────┐         │
│ │ Selecciones anteriores:                    │         │
│ │ [Artrosis] [Sobrepeso]                     │         │
│ └────────────────────────────────────────────┘         │
│                                                          │
│ Seleccione las opciones aplicables:                     │
│ ┌─────────────────────────────────────────────┐        │
│ │ ☐ Alergia a conservantes...                 │        │
│ │ ☑ Alergia a componentes...                  │        │
│ │ ☐ Alergia a polen...                        │        │
│ │ ☐ Alergia a cosméticos...                   │        │
│ └─────────────────────────────────────────────┘        │
│                                                          │
│ Información adicional (opcional):                        │
│ [_________________________________________]             │
│                                                          │
│ [Enviar]                                                 │
└─────────────────────────────────────────────────────────┘
```

## State Management

```
Component State Throughout Flow:
─────────────────────────────────

Initial State:
  patientID: ""
  pasoActual: ""
  opciones: []
  previousSelections: []

After /start:
  patientID: "1f9607e4..."
  pasoActual: "antecedentes"
  opciones: [
    { label: "Artrosis", checked: false },
    { label: "Sobrepeso", checked: false }
  ]
  previousSelections: []

User Selects Options:
  opciones: [
    { label: "Artrosis", checked: true },
    { label: "Sobrepeso", checked: true }
  ]

After Submit → /consulta → /generator:
  patientID: "1f9607e4..."
  pasoActual: "alergias"
  opciones: [
    { label: "Alergia a...", checked: false },
    { label: "Alergia a...", checked: false }
  ]
  previousSelections: [
    { label: "Artrosis", checked: true },
    { label: "Sobrepeso", checked: true }
  ]
```

## HTTP Request Sequence

```
Timeline:
─────────

T0: User clicks "Iniciar Consulta"
    │
    ├─→ POST /start
    │   Request: { motivo_consulta, edad, genero }
    │   Response: { patientID, pasoActual, opciones }
    │
    └─→ Display first options

T1: User selects options and clicks "Enviar"
    │
    ├─→ POST /api/collect
    │   Request: { patientID, opciones: ["selected"], additional }
    │   Response: { success }
    │
    ├─→ POST /consulta/{patientID}
    │   Request: (empty)
    │   Response: { pasoActual, partialState }
    │
    ├─→ GET /generator/{patientID}
    │   Request: (none)
    │   Response: { opciones }
    │
    └─→ Update display with new options + previous selections

T2: Repeat T1 for each step...
```

## Key Features Highlighted

### 1. Previous Selections Badge
- Blue background box
- Individual badges for each selection
- Displayed at top of new options
- Visual history of consultation

### 2. Automatic Flow
- No manual navigation needed
- Each submit triggers next step
- Smooth transitions
- Loading states during API calls

### 3. Data Persistence
- Patient ID maintained
- All selections tracked
- Server holds complete state
- Client displays current + previous

### 4. Validation
- At least one option required
- Clear error messages
- Form validation before submit

## Example User Journey

```
User: "I have eye pain"
  ↓
System: "Age? Gender?"
  ↓
User: "50, Male"
  ↓
System: "Select relevant medical history:"
        [ ] Arthritis
        [ ] Previous surgery
        [x] Contact lens use
        [x] Herpes Zoster history
  ↓
User: Selects 2 options, clicks Submit
  ↓
System: "Your previous selections: [Contact lens use] [Herpes Zoster]
         Now select relevant allergies:"
        [x] Allergy to preservatives
        [ ] Allergy to pollen
        [ ] Allergy to cosmetics
  ↓
User: Selects 1 option, clicks Submit
  ↓
System: Continues to next step...
```

## Summary

✓ Visual flow from start to multiple steps
✓ Clear state management
✓ HTTP sequence documented
✓ UI components illustrated
✓ User journey mapped
✓ All previous selections visible
✓ Automatic progression implemented
