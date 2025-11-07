import { ChatSession, GenerativeModel } from '@google/generative-ai';
import { FastifyInstance } from 'fastify';
import { PatientIntakeRecord, buildPatientKey } from '../stores/patient-intake-store.js';

const chatSessions = new Map<string, ChatSession>();

export function getOrCreateChatSession(
  fastify: FastifyInstance,
  patientInfo: Pick<PatientIntakeRecord, 'age' | 'gender' | 'chiefComplaint'>
): ChatSession | null {
  if (!fastify.genAIClient) {
    fastify.log.error('Google GenAI client is not initialized.');
    return null;
  }

  const patientKey = buildPatientKey(patientInfo.age, patientInfo.gender, patientInfo.chiefComplaint);

  if (chatSessions.has(patientKey)) {
    return chatSessions.get(patientKey)!;
  }

  const model: GenerativeModel = fastify.genAIClient.getGenerativeModel({
    model: fastify.genAIDefaultModel,
  });

  const chat = model.startChat({
    history: [
        {
            role: "user",
            parts: [{ text: "You are a medical assistant helping a doctor with a patient intake. Your goal is to suggest relevant information to ask the patient based on the information provided. Keep your answers concise and in Spanish." }],
        },
        {
            role: "model",
            parts: [{ text: "Entendido. Seré un asistente médico conciso y en español." }],
        }
    ],
    generationConfig: {
      maxOutputTokens: 1024,
    },
  });

  chatSessions.set(patientKey, chat);
  return chat;
}
