export const isProduction = (): boolean => (process.env.NODE_ENV || '').toLowerCase() === 'production';

export function safeSnippet(text: string | undefined | null, max = 300): string {
  if (!text) return '';
  const textStr = String(text);
  if (!isProduction()) return textStr.slice(0, max);
  return `<redacted length=${textStr.length}>`;
}

export const logger = {
  debug: (...args: any[]) => {
    if (!isProduction()) console.debug('[debug]', ...args);
  },
  info: (...args: any[]) => {
    console.info('[info]', ...args);
  },
  warn: (...args: any[]) => {
    console.warn('[warn]', ...args);
  },
  error: (...args: any[]) => {
    console.error('[error]', ...args);
  },
};

export default logger;
