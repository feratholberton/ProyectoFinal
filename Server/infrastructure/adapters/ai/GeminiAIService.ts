import { GoogleGenerativeAI } from '@google/generative-ai';
import { IAIService } from './IAIService.ts';
import type { PartialState } from '../../../session.ts';
import { prompts } from './prompts.ts';
import { buildClinicalPrompt } from './resumenPrompt.ts';
import { parseOptionsFromText } from './parseUtils.ts';

export * from '../../../src/infrastructure/adapters/ai/GeminiAIService';






