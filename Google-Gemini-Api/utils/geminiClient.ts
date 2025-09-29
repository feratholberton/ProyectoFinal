import { GoogleGenerativeAI, GenerativeModel, GenerateContentResult } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

// Interfaces para tipado
export interface GenerationOptions {
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
}

export interface UsageMetadata {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface GenerationResponse {
  success: boolean;
  text?: string;
  usage?: UsageMetadata;
  error?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Initialize the client with API key
class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY environment variable is required');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    // Using the stable Gemini 2.5 Flash model
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash'
    });
  }

  async generateText(prompt: string, options: GenerationOptions = {}): Promise<GenerationResponse> {
    try {
      console.log('generateText called with prompt:', prompt);
      console.log('generateText options:', options);
      
      const {
        temperature = 0.3,
        maxOutputTokens = 1000,
        topP = 0.8,
        topK = 40
      } = options;

      const generationConfig = {
        temperature,
        topP,
        topK,
        maxOutputTokens,
      };

      console.log('Generation config:', generationConfig);

      const result: GenerateContentResult = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
      });

      const response = await result.response;
      console.log('Raw response received');
      console.log('Response text:', response.text());
      console.log('Response candidates:', result.response.candidates);
      console.log('Usage metadata:', response.usageMetadata);
      
      // Handle thinking models that might not produce visible text
      let responseText = response.text();
      if (!responseText && result.response.candidates && result.response.candidates.length > 0) {
        const candidate = result.response.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          responseText = candidate.content.parts[0].text || '';
        }
      }
      
      return {
        success: true,
        text: responseText,
        usage: {
          promptTokens: response.usageMetadata?.promptTokenCount || 0,
          completionTokens: response.usageMetadata?.candidatesTokenCount || (response.usageMetadata as any)?.thoughtsTokenCount || 0,
          totalTokens: response.usageMetadata?.totalTokenCount || 0
        }
      };
    } catch (error: any) {
      console.error('Error generating text:', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      };
    }
  }

  async generateChat(messages: ChatMessage[], options: GenerationOptions = {}): Promise<GenerationResponse> {
    try {
      console.log('Chat request received with messages:', messages.length);
      console.log('First message:', messages[0]);
      
      // For single message, use generateContent instead of chat
      if (messages.length === 1) {
        console.log('Using generateText for single message');
        return await this.generateText(messages[0].content, options);
      }

      console.log('Using chat API for multiple messages');
      const chat = this.model.startChat({
        history: messages.slice(0, -1).map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        })),
        generationConfig: {
          temperature: options.temperature || 0.3,
          topP: options.topP || 0.8,
          topK: options.topK || 40,
          maxOutputTokens: options.maxOutputTokens || 1000,
        }
      });

      const lastMessage = messages[messages.length - 1];
      const result = await chat.sendMessage(lastMessage.content);
      const response = await result.response;

      return {
        success: true,
        text: response.text(),
        usage: {
          promptTokens: response.usageMetadata?.promptTokenCount || 0,
          completionTokens: response.usageMetadata?.candidatesTokenCount || (response.usageMetadata as any)?.thoughtsTokenCount || 0,
          totalTokens: response.usageMetadata?.totalTokenCount || 0
        }
      };
    } catch (error: any) {
      console.error('Error in chat:', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      };
    }
  }

  async generateWithImage(prompt: string, imageBuffer: Buffer, mimeType: string = 'image/jpeg'): Promise<GenerationResponse> {
    try {
      const imagePart = {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType
        }
      };

      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;

      return {
        success: true,
        text: response.text(),
        usage: {
          promptTokens: response.usageMetadata?.promptTokenCount || 0,
          completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: response.usageMetadata?.totalTokenCount || 0
        }
      };
    } catch (error: any) {
      console.error('Error generating with image:', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      };
    }
  }
}

export default GeminiClient;