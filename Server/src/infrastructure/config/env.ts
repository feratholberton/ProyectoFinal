import 'dotenv/config';

export const env = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? '',
  PORT: process.env.PORT ? Number(process.env.PORT) : 10000,
};
