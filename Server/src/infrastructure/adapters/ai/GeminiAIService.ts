import { GoogleGenerativeAI } from '@google/generative-ai';
import { IAIService } from './IAIService.ts';
import type { PartialState } from '../../../session.ts';
import { promptBuilder } from '../../../application/services/PromptBuilder.ts';
import { buildClinicalPrompt } from './resumenPrompt.ts';
import { parseOptionsFromText } from './parseUtils.ts';

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
			console.log('[GeminiAIService] prompt[:600]=', prompt.slice(0, 600));
			console.log('[GeminiAIService] rawLen=', text.length, 'raw[:2000]=', text.slice(0, 2000));
		} catch (e) {

		}
		return text;
	}

	async generateOptions(state: PartialState, tipo: string): Promise<string[]> {

			const builder: any = (promptBuilder as any)[tipo];
			const prompt =
				typeof builder === 'function' ? builder.call(promptBuilder, state) : JSON.stringify(state);
		console.log('[GeminiAIService] generateOptions tipo=', tipo, 'prompt[:300]=', String(prompt).slice(0, 300));
		const raw = await this.generateRaw(prompt);
		const options = parseOptionsFromText(raw);
		console.log('[GeminiAIService] parsed options count=', options.length, 'options[:10]=', options.slice(0, 10));
		return options.slice(0, 8);
	}

	async generateSummary(state: PartialState): Promise<string> {
		const prompt = buildClinicalPrompt(state);
		return await this.generateRaw(prompt);
	}
}
