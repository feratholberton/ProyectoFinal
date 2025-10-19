import { GoogleGenerativeAI } from '@google/generative-ai';
import { IAIService } from './IAIService.ts';
import type { PartialState } from '../../../session.ts';
import { promptBuilder } from '../../../application/services/PromptBuilder.ts';
import { buildClinicalPrompt } from './resumenPrompt.ts';
import { parseOptionsFromText } from './parseUtils.ts';
import { logger, safeSnippet } from '../../logging/logger.ts';

export class GeminiAIService implements IAIService {
	private client: any;
	constructor(apiKey?: string) {
		const key = apiKey ?? process.env.GEMINI_API_KEY;
		if (!key) throw new Error('GEMINI_API_KEY no definida');
		this.client = new GoogleGenerativeAI(key);
	}

	private async generateRaw(prompt: string) {
		const model = this.client.getGenerativeModel({ model: 'gemini-2.5-flash' });
		const result = await model.generateContent(prompt);
		const text = await result.response.text();

		try {
			logger.debug('[GeminiAIService] prompt snippet=', safeSnippet(prompt, 600));
			logger.debug('[GeminiAIService] rawLen=', String(text).length, 'raw snippet=', safeSnippet(text, 2000));
		} catch (e) {
			logger.warn('[GeminiAIService] logging failure', e);
		}
		return text;
	}

	async generateOptions(state: PartialState, tipo: string): Promise<string[]> {

			const builder: any = (promptBuilder as any)[tipo];
			const prompt =
				typeof builder === 'function' ? builder.call(promptBuilder, state) : JSON.stringify(state);
	logger.debug('[GeminiAIService] generateOptions tipo=', tipo, 'prompt snippet=', safeSnippet(String(prompt), 300));
		const raw = await this.generateRaw(prompt);
		const options = parseOptionsFromText(raw);
	logger.info('[GeminiAIService] parsed options count=', options.length);
		return options.slice(0, 8);
	}

	async generateSummary(state: PartialState): Promise<string> {
		const prompt = buildClinicalPrompt(state);
		return await this.generateRaw(prompt);
	}
}
