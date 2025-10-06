export const anamnesisPrompt = `
A continuación, realiza una anamnesis dirigida siguiendo este flujo de preguntas, adaptadas al motivo de consulta. Devuelve solo la lista de preguntas, sin texto adicional:

1. Inicio del cuadro
- ¿Cuándo comenzó el problema?
- ¿Cómo fue el inicio: brusco o gradual?
- ¿Hace cuánto tiempo presenta los síntomas? (horas / días / semanas / meses)

2. Evolución
- ¿Cómo ha evolucionado desde que comenzó? (progresivo / estable / intermitente / en mejoría / en empeoramiento)
- ¿Ha recibido algún tratamiento? ¿Mejoró o empeoró?

3. Localización
- ¿Dónde siente el malestar o síntoma principal?
- ¿Se irradia hacia algún otro lugar?
- ¿Es siempre en el mismo sitio o cambia?

4. Características del síntoma (ej. dolor)
- ¿Cómo describiría el dolor o malestar? (punzante / opresivo / cólico / urente / difuso)
- ¿Qué intensidad tiene? (leve / moderada / intensa)
- ¿Cuánto dura cada episodio?
- ¿Qué lo alivia o lo empeora?

5. Síntomas asociados
- ¿Presenta fiebre?
- ¿Tiene náuseas o vómitos?
- ¿Ha notado pérdida de peso o apetito?
- ¿Tiene tos, dificultad para respirar o palpitaciones?
- ¿Diarrea, constipación, orina oscura o dolor al orinar?
- ¿Otros síntomas acompañantes? (especificar)

6. Factores desencadenantes
- ¿Hubo algo que haya precipitado los síntomas? (traumatismo, ejercicio, alimento, medicamento, estrés, exposición, etc.)
- ¿Se relaciona con alguna actividad, comida o momento del día?

7. Antecedentes recientes o contactos
- ¿Alguien cercano presentó síntomas similares?
- ¿Ha tenido cuadros parecidos antes?
- ¿Tuvo infecciones recientes o viajó?

8. Repercusión funcional
- ¿Le impide realizar sus actividades habituales?
- ¿Tuvo que quedarse en cama o faltar al trabajo?

9. Tratamientos previos
- ¿Tomó alguna medicación para aliviarlo?
- ¿Recibió atención médica o tratamientos antes de esta consulta?

10. Síntomas de alarma (según corresponda)
- ¿Ha notado fiebre alta persistente, sangrados, dificultad respiratoria, dolor torácico intenso, pérdida de conciencia o convulsiones?
`;
