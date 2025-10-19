import { describe, it, expect } from 'vitest';
import { parseOptionsFromText } from '../src/infrastructure/adapters/ai/parseUtils.ts';

describe('parseOptionsFromText', () => {
  it('parses JSON array responses', () => {
    const raw = '["a","b","c"]';
    const res = parseOptionsFromText(raw);
    expect(res).toEqual(['a','b','c']);
  });

  it('parses fenced code JSON arrays', () => {
    const raw = "```json\n[\"x\", \"y\"]\n```";
    const res = parseOptionsFromText(raw);
    expect(res).toEqual(['x','y']);
  });

  it('falls back to lines', () => {
    const raw = '- option1\n- option2';
    const res = parseOptionsFromText(raw);
    expect(res).toEqual(['option1','option2']);
  });
});
