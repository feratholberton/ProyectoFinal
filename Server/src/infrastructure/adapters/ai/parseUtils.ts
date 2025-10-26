export function extractFirstJSONArray(text: string): string | null {
  const start = text.indexOf('[');
  if (start === -1) return null;
  let depth = 0;
  for (let iterator = start; iterator < text.length; iterator++) {
    const ch = text[iterator];
    if (ch === '[') depth++;
    else if (ch === ']') {
      depth--;
      if (depth === 0) return text.slice(start, iterator + 1);
    }
  }
  return null;
}

export function parseOptionsFromText(raw: string): string[] {
  const cleaned = raw.replace(/```[\s\S]*?```/g, '').trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {}
  const extracted = extractFirstJSONArray(raw) || extractFirstJSONArray(cleaned);
  if (extracted) {
    try {
      const parsed = JSON.parse(extracted);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {}
  }
  return cleaned
    .split(/\r?\n/)
    // remove bullets, leading numbering and trim whitespace
    .map((line) => line.replace(/^\s*[-\d\.\)\s]*/, '').trim())
    .filter(Boolean)
    // strip surrounding quotes
    .map((line) => line.replace(/^['"]|['"]$/g, ''))
    .filter((line) => line.length > 0);
}
