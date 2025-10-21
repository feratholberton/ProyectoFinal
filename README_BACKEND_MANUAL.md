# Manual de Usuario - Backend Sistema de Consulta Médica

## Tabla de Contenidos
1. [Introducción](#introducción)
2. [Acceso al Swagger](#acceso-al-swagger)
3. [Flujo Completo de Consulta](#flujo-completo-de-consulta)
4. [Guía Paso a Paso](#guía-paso-a-paso)
5. [Ejemplos de Bodies](#ejemplos-de-bodies)
6. [Solución de Problemas](#solución-de-problemas)

---

## Introducción

Este sistema permite realizar una anamnesis médica completa de forma estructurada y sistemática. El flujo consiste en iniciar una consulta, recopilar antecedentes, realizar preguntas específicas sobre el motivo de consulta y generar un informe final.

**URL del Swagger:** https://backend-w6ii.onrender.com/docs

---

## Acceso al Swagger

1. Abre tu navegador web
2. Ingresa a: https://backend-w6ii.onrender.com/docs
3. Verás la interfaz de Swagger con todos los endpoints disponibles

---

## Flujo Completo de Consulta

```
┌─────────────────────────────────────────────────────────────┐
│  1. POST /start - Iniciar Consulta                          │
│     ↓ (Obtener patientID)                                   │
├─────────────────────────────────────────────────────────────┤
│  2. POST /api/collect - Recopilar Antecedentes              │
│     ↓ (Usar patientID + opciones generadas)                 │
├─────────────────────────────────────────────────────────────┤
│  3. GET /consulta/{id} - Verificar Paso Actual              │
│     ↓ (Actualizar paso)                                     │
├─────────────────────────────────────────────────────────────┤
│  4. POST /generator/{id} - Generar Preguntas                │
│     ↓ (Actualizar edad, sexo, motivo, antecedentes)         │
├─────────────────────────────────────────────────────────────┤
│  5. POST /api/anamnesis - Responder Preguntas (BUCLE)       │
│     │                                                        │
│     ├→ Enviar body #1                                       │
│     ├→ GET /consulta/{id} - Actualizar paso                 │
│     ├→ Enviar body #2                                       │
│     ├→ GET /consulta/{id} - Actualizar paso                 │
│     ├→ ... (repetir para los 10 bodies)                     │
│     ↓                                                        │
├─────────────────────────────────────────────────────────────┤
│  6. POST /api/end - Generar Informe Final                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Guía Paso a Paso

### **PASO 1: Iniciar Consulta** 
**Endpoint:** `POST /start`

1. En Swagger, busca el endpoint **POST /start**
2. Haz clic en **"Try it out"**
3. Ingresa el siguiente body:

```json
{
  "motivo_consulta": "Dolor intenso en molar inferior derecho",
  "edad": 35,
  "genero": "masculino"
}
```

4. Haz clic en **"Execute"**
5. **IMPORTANTE:** Copia el `patientID` que aparece en la respuesta. Lo necesitarás para todos los pasos siguientes.

**Respuesta esperada:**
```json
{
  "patientID": "9e56c8a6-96b2-4a84-805f-ee4ab132c854",
  "edad": 35,
  "genero": "masculino",
  "motivo_consulta": "Dolor intenso en molar inferior derecho",
  "antecedentes": [],
  "paso": 1
}
```

---

### **PASO 2: Recopilar Antecedentes**
**Endpoint:** `POST /api/collect`

1. Busca el endpoint **POST /api/collect**
2. Haz clic en **"Try it out"**
3. Ingresa el siguiente body (reemplaza `patientID` con tu ID):

```json
{
  "patientID": "TU_PATIENT_ID_AQUI",
  "opciones": [
    "Hipertensión arterial",
    "Diabetes tipo 2"
  ],
  "additional": "Fumador ocasional, última visita odontológica hace 2 años"
}
```

4. Haz clic en **"Execute"**

**Nota:** Las opciones son los antecedentes médicos del paciente. Puedes agregar información adicional en el campo `additional`.

---

### **PASO 3: Verificar Paso Actual**
**Endpoint:** `GET /consulta/{id}`

1. Busca el endpoint **GET /consulta/{id}**
2. Haz clic en **"Try it out"**
3. Ingresa tu `patientID` en el campo `id`
4. Haz clic en **"Execute"**

Esto te mostrará el estado actual de la consulta y en qué paso te encuentras.

---

### **PASO 4: Generar Preguntas de Anamnesis**
**Endpoint:** `POST /generator/{id}`

1. Busca el endpoint **POST /generator/{id}**
2. Haz clic en **"Try it out"**
3. Ingresa tu `patientID` en el campo `id`
4. Haz clic en **"Execute"**

Este paso actualiza la información base (edad, sexo, motivo de consulta y antecedentes con alergias) y genera las preguntas de anamnesis específicas.

---

### **PASO 5: Completar Anamnesis (BUCLE)**
**Endpoint:** `POST /api/anamnesis`

Este es el paso más importante. Debes enviar **10 bodies diferentes**, uno por uno, siguiendo este patrón:

#### **Ciclo de Anamnesis:**

**Para cada body (del 1 al 10):**

1. Ve a **POST /api/anamnesis**
2. Haz clic en **"Try it out"**
3. Ingresa el body correspondiente (ver sección [Ejemplos de Bodies](#ejemplos-de-bodies))
4. Haz clic en **"Execute"**
5. Ve a **GET /consulta/{id}** para actualizar el paso
6. Repite con el siguiente body

---

### **PASO 6: Generar Informe Final**
**Endpoint:** `POST /api/end`

1. Una vez completados los 10 bodies de anamnesis
2. Busca el endpoint **POST /api/end**
3. Haz clic en **"Try it out"**
4. Ingresa tu `patientID`:

```json
{
  "patientID": "TU_PATIENT_ID_AQUI"
}
```

5. Haz clic en **"Execute"**
6. Recibirás el informe médico completo generado por IA

---

## Ejemplos de Bodies

### **Body 1: Inicio y Cronología**
```json
{
  "patientID": "TU_PATIENT_ID_AQUI",
  "answers": [
    { "key": "cuando_comenzo", "type": "date", "value": "2025-10-12" },
    { "key": "como_fue_inicio", "type": "single", "value": "brusco" },
    { "key": "tiempo_sintomas", "type": "text", "value": "Comenzó hace 2 días con dolor intenso intermitente" },
    { "key": "evento_desencadenante", "type": "multi", "value": ["comida"] }
  ]
}
```

### **Body 2: Evolución**
```json
{
  "patientID": "TU_PATIENT_ID_AQUI",
  "answers": [
    { "key": "evolucion", "type": "single", "value": "intermitente" },
    { "key": "remision", "type": "text", "value": "Periodicidad con remisiones cortas entre episodios" },
    { "key": "patron_horario", "type": "single", "value": "nocturno" },
    { "key": "tratamiento", "type": "boolean", "value": true },
    { "key": "resultado_tratamiento", "type": "single", "value": "mejoró" }
  ]
}
```

### **Body 3: Localización**
```json
{
  "patientID": "TU_PATIENT_ID_AQUI",
  "answers": [
    { "key": "localizacion_principal", "type": "text", "value": "Molar inferior derecho" },
    { "key": "irradia", "type": "boolean", "value": true },
    { "key": "hacia_donde", "type": "text", "value": "Se irradia hacia la mandíbula y oído derecho" },
    { "key": "variacion_localizacion", "type": "text", "value": "Principalmente en el mismo diente, a veces se siente en zona adyacente" },
    { "key": "tipo_localizacion", "type": "single", "value": "focal" }
  ]
}
```

### **Body 4: Características del Dolor**
```json
{
  "patientID": "TU_PATIENT_ID_AQUI",
  "answers": [
    { "key": "descripcion", "type": "multi", "value": ["punzante", "pulsátil"] },
    { "key": "intensidad", "type": "number", "value": 8 },
    { "key": "duracion", "type": "text", "value": "Episodios de 15-45 minutos" },
    { "key": "alivia", "type": "multi", "value": ["medicación"] },
    { "key": "empeora", "type": "multi", "value": ["comida", "presión sobre el diente"] }
  ]
}
```

### **Body 5: Síntomas Asociados**
```json
{
  "patientID": "TU_PATIENT_ID_AQUI",
  "answers": [
    { "key": "generales", "type": "multi", "value": ["fiebre"] },
    { "key": "cardiovascular", "type": "multi", "value": ["ninguno"] },
    { "key": "respiratorio", "type": "multi", "value": ["ninguno"] },
    { "key": "digestivo", "type": "multi", "value": ["náuseas"] },
    { "key": "urinario", "type": "multi", "value": ["sin cambios"] },
    { "key": "neurologico", "type": "multi", "value": [] },
    { "key": "otros", "type": "text", "value": "Sensación de presión mandibular" }
  ]
}
```

### **Body 6: Factores Modificadores**
```json
{
  "patientID": "TU_PATIENT_ID_AQUI",
  "answers": [
    { "key": "factores_precipitantes", "type": "multi", "value": ["comida"] },
    { "key": "actividad_relacionada", "type": "boolean", "value": false },
    { "key": "actividad_detalle", "type": "text", "value": "" },
    { "key": "varia_dia", "type": "boolean", "value": false },
    { "key": "detalle_varia_dia", "type": "text", "value": "" },
    { "key": "varia_comidas", "type": "boolean", "value": true },
    { "key": "detalle_varia_comidas", "type": "text", "value": "Empeora con alimentos calientes o dulces" }
  ]
}
```

### **Body 7: Contexto Epidemiológico**
```json
{
  "patientID": "TU_PATIENT_ID_AQUI",
  "answers": [
    { "key": "contactos_similares", "type": "boolean", "value": false },
    { "key": "detalle_contactos", "type": "text", "value": "" },
    { "key": "cuadros_parecidos", "type": "boolean", "value": false },
    { "key": "detalle_parecidos", "type": "text", "value": "" },
    { "key": "infecciones_recientes", "type": "multi", "value": [] },
    { "key": "viajes", "type": "text", "value": "" },
    { "key": "exposicion_mosquitos", "type": "boolean", "value": false },
    { "key": "contacto_animales", "type": "boolean", "value": false }
  ]
}
```

### **Body 8: Repercusión Funcional**
```json
{
  "patientID": "TU_PATIENT_ID_AQUI",
  "answers": [
    { "key": "actividad", "type": "boolean", "value": false },
    { "key": "ausencia_trabajo", "type": "boolean", "value": false },
    { "key": "sueno", "type": "boolean", "value": false },
    { "key": "apetito", "type": "boolean", "value": true },
    { "key": "estado_animo", "type": "boolean", "value": false }
  ]
}
```

### **Body 9: Tratamientos Previos**
```json
{
  "patientID": "TU_PATIENT_ID_AQUI",
  "answers": [
    { "key": "medicacion_alivio", "type": "text", "value": "Ibuprofeno 600 mg cada 8 horas desde ayer" },
    { "key": "efecto_medicacion", "type": "text", "value": "Alivio parcial por 4 horas" },
    { "key": "atencion_previa", "type": "text", "value": "No consultó antes" },
    { "key": "estudios_resultados", "type": "text", "value": "" },
    { "key": "remedios_caseros", "type": "text", "value": "Enjuagues con agua tibia y sal" }
  ]
}
```

### **Body 10: Signos de Alarma**
```json
{
  "patientID": "TU_PATIENT_ID_AQUI",
  "answers": [
    { "key": "fiebre_dias", "type": "number", "value": 1 },
    { "key": "sangrados", "type": "multi", "value": [] },
    { "key": "disnea", "type": "multi", "value": [] },
    { "key": "dolor_toracico", "type": "multi", "value": [] },
    { "key": "perdida_peso", "type": "boolean", "value": false },
    { "key": "sincope", "type": "multi", "value": [] },
    { "key": "convulsiones", "type": "boolean", "value": false },
    { "key": "alteraciones_neurologicas", "type": "multi", "value": [] },
    { "key": "deshidratacion", "type": "text", "value": "" },
    { "key": "ictericia", "type": "boolean", "value": false },
    { "key": "petequias", "type": "boolean", "value": false }
  ]
}
```

---

## Tipos de Respuestas

El sistema maneja diferentes tipos de respuestas:

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `text` | Texto libre | `"Dolor desde hace 3 días"` |
| `single` | Opción única | `"brusco"`, `"gradual"` |
| `multi` | Múltiples opciones | `["comida", "estrés"]` |
| `boolean` | Verdadero/Falso | `true`, `false` |
| `number` | Valor numérico | `8`, `38.5` |
| `date` | Fecha | `"2025-10-12"` |

---

## Solución de Problemas

### **Error: "Patient not found"**
- **Causa:** El `patientID` es incorrecto o no existe
- **Solución:** Verifica que hayas copiado correctamente el ID del paso 1

### **Error: "Invalid step"**
- **Causa:** Estás intentando saltar pasos
- **Solución:** Usa `GET /consulta/{id}` para verificar en qué paso estás

### **Error: "Missing required fields"**
- **Causa:** Falta información en el body
- **Solución:** Verifica que todos los campos del body estén completos

### **No se genera el informe final**
- **Causa:** No completaste los 10 bodies de anamnesis
- **Solución:** Verifica con `GET /consulta/{id}` que todos los pasos estén completos

---

## Checklist de Prueba Completa

- [ ] POST /start - Obtener patientID
- [ ] POST /api/collect - Agregar antecedentes
- [ ] GET /consulta/{id} - Verificar paso
- [ ] POST /generator/{id} - Generar preguntas
- [ ] POST /api/anamnesis - Body 1 (Inicio)
- [ ] GET /consulta/{id} - Actualizar
- [ ] POST /api/anamnesis - Body 2 (Evolución)
- [ ] GET /consulta/{id} - Actualizar
- [ ] POST /api/anamnesis - Body 3 (Localización)
- [ ] GET /consulta/{id} - Actualizar
- [ ] POST /api/anamnesis - Body 4 (Características)
- [ ] GET /consulta/{id} - Actualizar
- [ ] POST /api/anamnesis - Body 5 (Síntomas)
- [ ] GET /consulta/{id} - Actualizar
- [ ] POST /api/anamnesis - Body 6 (Factores)
- [ ] GET /consulta/{id} - Actualizar
- [ ] POST /api/anamnesis - Body 7 (Epidemiología)
- [ ] GET /consulta/{id} - Actualizar
- [ ] POST /api/anamnesis - Body 8 (Repercusión)
- [ ] GET /consulta/{id} - Actualizar
- [ ] POST /api/anamnesis - Body 9 (Tratamientos)
- [ ] GET /consulta/{id} - Actualizar
- [ ] POST /api/anamnesis - Body 10 (Alarmas)
- [ ] GET /consulta/{id} - Actualizar
- [ ] POST /api/end - Generar informe final

---

## Notas Importantes

1. **Siempre guarda el `patientID`** - Lo necesitarás en cada paso
2. **Respeta el orden de los bodies** - Deben enviarse en secuencia (1 → 10)
3. **Actualiza el paso** - Usa `GET /consulta/{id}` entre cada body
4. **Revisa las respuestas** - Cada endpoint devuelve información útil
5. **Los campos vacíos van como `""`** - No omitas campos, déjalos vacíos si no aplican

---

## Contacto y Soporte

- **Swagger URL:** https://backend-w6ii.onrender.com/docs
