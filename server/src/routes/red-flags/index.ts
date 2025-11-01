import { FastifyPluginAsync } from 'fastify'
import {
  PatientIntakeRecord,
  SymptomOnsetQuestion,
  buildPatientKey,
  getPatientIntake,
  normalizeChiefComplaint,
  upsertPatientIntake
} from '../../stores/patient-intake-store.js'

interface SaveRedFlagsRequestBody {
  age: number;
  gender: 'Masculino' | 'Femenino';
  chiefComplaint: string;
  answers: Array<{ id: string; answer: string }>;
}

interface SaveRedFlagsResponseBody {
  message: string;
  record: PatientIntakeRecord;
  redFlagsQuestions: SymptomOnsetQuestion[];
  naturalSummary: string;
  reviewSummary: string;
}

const redFlagsRoute: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: SaveRedFlagsRequestBody; Reply: SaveRedFlagsResponseBody }>(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['age', 'gender', 'chiefComplaint', 'answers'],
          properties: {
            age: { type: 'integer', minimum: 0, maximum: 140 },
            gender: { type: 'string', enum: ['Masculino', 'Femenino'] },
            chiefComplaint: { type: 'string', minLength: 1 },
            answers: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id', 'answer'],
                properties: {
                  id: { type: 'string', minLength: 1 },
                  answer: { type: 'string' }
                }
              },
              maxItems: 32
            }
          }
        },
        response: {
          200: {
            type: 'object',
            required: ['message', 'record', 'redFlagsQuestions', 'reviewSummary'],
            properties: {
              message: { type: 'string' },
              record: {
                type: 'object',
                required: [
                  'age',
                  'gender',
                  'chiefComplaint',
                  'selectedAntecedents',
                  'selectedAllergies',
                  'selectedDrugs',
                  'suggestedAllergies',
                  'suggestedDrugs',
                  'symptomOnsetQuestions',
                  'evaluationQuestions',
                  'locationQuestions',
                  'characteristicsQuestions',
                  'functionalImpactQuestions',
                  'priorTherapiesQuestions',
                  'redFlagsQuestions',
                  'updatedAt'
                ],
                properties: {
                  age: { type: 'integer' },
                  gender: { type: 'string', enum: ['Masculino', 'Femenino'] },
                  chiefComplaint: { type: 'string' },
                  selectedAntecedents: { type: 'array', items: { type: 'string' } },
                  selectedAllergies: { type: 'array', items: { type: 'string' } },
                  selectedDrugs: { type: 'array', items: { type: 'string' } },
                  suggestedAllergies: { type: 'array', items: { type: 'string' } },
                  suggestedDrugs: { type: 'array', items: { type: 'string' } },
                  symptomOnsetQuestions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['id', 'prompt', 'answer'],
                      properties: {
                        id: { type: 'string' },
                        prompt: { type: 'string' },
                        answer: { type: 'string' }
                      }
                    }
                  },
                  evaluationQuestions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['id', 'prompt', 'answer'],
                      properties: {
                        id: { type: 'string' },
                        prompt: { type: 'string' },
                        answer: { type: 'string' }
                      }
                    }
                  },
                  locationQuestions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['id', 'prompt', 'answer'],
                      properties: {
                        id: { type: 'string' },
                        prompt: { type: 'string' },
                        answer: { type: 'string' }
                      }
                    }
                  },
                  characteristicsQuestions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['id', 'prompt', 'answer'],
                      properties: {
                        id: { type: 'string' },
                        prompt: { type: 'string' },
                        answer: { type: 'string' }
                      }
                    }
                  },
                  functionalImpactQuestions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['id', 'prompt', 'answer'],
                      properties: {
                        id: { type: 'string' },
                        prompt: { type: 'string' },
                        answer: { type: 'string' }
                      }
                    }
                  },
                  priorTherapiesQuestions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['id', 'prompt', 'answer'],
                      properties: {
                        id: { type: 'string' },
                        prompt: { type: 'string' },
                        answer: { type: 'string' }
                      }
                    }
                  },
                  redFlagsQuestions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['id', 'prompt', 'answer'],
                      properties: {
                        id: { type: 'string' },
                        prompt: { type: 'string' },
                        answer: { type: 'string' }
                      }
                    }
                  },
                  updatedAt: { type: 'string' }
                }
              },
              redFlagsQuestions: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['id', 'prompt', 'answer'],
                  properties: {
                    id: { type: 'string' },
                    prompt: { type: 'string' },
                    answer: { type: 'string' }
                  }
                }
              },
              reviewSummary: { type: 'string' },
              naturalSummary: { type: 'string' }
            }
          }
        }
      }
    },
    async (request) => {
      const { age, gender, chiefComplaint, answers } = request.body

      const normalizedChiefComplaint = normalizeChiefComplaint(chiefComplaint)
      const key = buildPatientKey(age, gender, normalizedChiefComplaint)
      const existing = getPatientIntake(key)

      const baseQuestions: SymptomOnsetQuestion[] = existing?.redFlagsQuestions ?? []
      const answersById = new Map(answers.map((a) => [a.id, (a.answer ?? '').trim()]))
      const updatedQuestions = baseQuestions.map((q) => ({
        id: q.id,
        prompt: q.prompt,
        answer: answersById.get(q.id) ?? q.answer ?? ''
      }))

      const record = upsertPatientIntake({
        age,
        gender,
        chiefComplaint: normalizedChiefComplaint,
        redFlagsQuestions: updatedQuestions
      })

      request.log.debug({ key, updatedQuestions }, 'Saved red flag symptoms answers')

      const lines: string[] = []
      lines.push('Resumen de respuestas del formulario clínico')
      lines.push('')
      lines.push(`Edad: ${record.age}`)
      lines.push(`Género: ${record.gender}`)
      lines.push(`Motivo de consulta: ${record.chiefComplaint}`)
      lines.push('')
      const list = (title: string, items: string[]) => {
        lines.push(`${title}`)
        lines.push(items.length ? `- ${items.join(', ')}` : '- (sin datos)')
        lines.push('')
      }
      list('Antecedentes', record.selectedAntecedents ?? [])
      list('Alergias', record.selectedAllergies ?? [])

      const qa = (title: string, qs?: SymptomOnsetQuestion[]) => {
        if (!qs || qs.length === 0) return
        lines.push(`${title}`)
        for (const q of qs) {
          lines.push(`- ${q.prompt}`)
          lines.push(`  Respuesta: ${q.answer ?? ''}`)
        }
        lines.push('')
      }
      qa('Inicio de síntomas', record.symptomOnsetQuestions)
      qa('Evaluación y curso', record.evaluationQuestions)
      qa('Localización', record.locationQuestions)
      qa('Características del síntoma', record.characteristicsQuestions)
      qa('Impacto funcional y calidad de vida', record.functionalImpactQuestions)
      qa('Tratamientos previos y automedicación', record.priorTherapiesQuestions)
      qa('Síntomas de alarma', record.redFlagsQuestions)

      const reviewSummary = lines.join('\n')

      // Generate a natural language summary using the configured GenAI model
      let naturalSummary = ''
      if (!fastify.genAIClient) {
        // If the AI client is not configured, fallback to a simple deterministic summary
        const fallbackLines: string[] = []
        fallbackLines.push(`Paciente de ${record.age} años, de género ${record.gender}.`)
        fallbackLines.push(`Acude por motivo de consulta: ${record.chiefComplaint}.`)
        fallbackLines.push(record.selectedAntecedents?.length ? `Antecedentes relevantes: ${record.selectedAntecedents.join(', ')}.` : 'No se registraron antecedentes relevantes.')
        fallbackLines.push(record.selectedAllergies?.length ? `Alergias: ${record.selectedAllergies.join(', ')}.` : 'No se registraron alergias conocidas.')
        naturalSummary = fallbackLines.join(' ')
      } else {
        const chosenModel = fastify.genAIDefaultModel
        const prompt = [
          'Eres un médico clínico. A partir de la información que sigue, genera UN SOLO resumen clínico en español en lenguaje natural, respetando el ORDEN y SIN INVENTAR datos. Si falta información, escribe "(sin datos)" para ese campo. No añadas hipótesis diagnósticas nuevas ni fechas.',
          '',
          'INSTRUCCIONES DE SALIDA: 1) Identificación (edad, género). 2) Motivo de consulta. 3) Antecedentes relevantes. 4) Alergias. 5) Síntomas principales (inicio, evolución, localización). 6) Evaluación y curso. 7) Factores asociados. Entrega el texto en español, en párrafos cortos, sin listas JSON ni metadatos.',
          '',
          'INFORMACIÓN: ',
          reviewSummary
        ].join('\n')

        try {
          const response = await fastify.genAIClient.models.generateContent({
            model: chosenModel,
            contents: prompt
          })

          const answer = response.text
          if (!answer) {
            request.log.warn({ response }, 'Google GenAI returned an empty summary')
            throw fastify.httpErrors.badGateway('El modelo no devolvió un resumen válido')
          }

          naturalSummary = String(answer).trim()
        } catch (err) {
          request.log.error({ err }, 'Failed to generate natural summary with Google GenAI')
          // Do not block the saving flow; return an empty naturalSummary and log the error
          naturalSummary = ''
        }
      }

      return {
        message: 'Síntomas de alarma guardados.',
        record,
        redFlagsQuestions: record.redFlagsQuestions,
        reviewSummary,
        naturalSummary
      }
    }
  )
}

export default redFlagsRoute
