const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// initialize the client with api key
class GeminiClient {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        // configuro para gemini 2.5 flash
        this.model = this.genAI.getGenerativeModel({
            model: 'gemini-1.5-flash' // Cambiar a 2.5 cuando esté disponible
        });
    }
    async generateText(prompt, options = {}) {
        try {
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
        const result = await this.model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig,
        });

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
        } catch (error){
            console.error('Error generating text:', error);
        return {
            success: false,
            error: error.message
        };
        }
    }

    async generateChat(messages, options = {}) {
        try {
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
                        completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
                        totalTokens: response.usageMetadata?.totalTokenCount || 0
                    }
                };
            } catch (error) {
                console.error('Error in chat:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        }

        async generateWithImage(prompt, imageBuffer, mimeType = 'image/jpeg') {
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
            } catch (error) {
                console.error('Error generating with image:', error);
                return {
                    success: false,
                    error: error.message
                };
            }

        }

}
module.exports = GeminiClient;

