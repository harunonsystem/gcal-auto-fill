import { describe, it, expect } from 'vitest';
import { extractTitle } from './extractor';

describe('extractTitle', () => {
  describe('first line extraction', () => {
    it('should extract first line as title', () => {
      const text = 'Weekly Team Meeting\nPlease join us for the weekly sync.';
      expect(extractTitle(text)).toBe('Weekly Team Meeting');
    });

    it('should truncate long titles to 50 chars', () => {
      const text = 'This is a very long title that exceeds the maximum allowed character limit for titles';
      const result = extractTitle(text);
      expect(result!.length).toBe(50);
      expect(result).toMatch(/\.\.\.$/);
    });

    it('should return null for empty text', () => {
      expect(extractTitle('')).toBeNull();
      expect(extractTitle('   ')).toBeNull();
      expect(extractTitle('\n\n')).toBeNull();
    });
  });

  describe('subject pattern extraction', () => {
    it('should extract from "件名:" pattern', () => {
      const text = '件名: プロジェクト進捗会議\n詳細は以下の通りです';
      expect(extractTitle(text)).toBe('プロジェクト進捗会議');
    });

    it('should extract from "Subject:" pattern', () => {
      const text = 'Subject: Q4 Planning Session\nAgenda items below';
      expect(extractTitle(text)).toBe('Q4 Planning Session');
    });

    it('should extract from "Title:" pattern', () => {
      const text = 'Title: Product Review\nNotes...';
      expect(extractTitle(text)).toBe('Product Review');
    });

    it('should extract from "Re:" pattern', () => {
      const text = 'Re: Follow up meeting\nSome content';
      expect(extractTitle(text)).toBe('Follow up meeting');
    });

    it('should extract from "Fw:" pattern', () => {
      const text = 'Fw: Important announcement\nForwarded message';
      expect(extractTitle(text)).toBe('Important announcement');
    });
  });

  describe('edge cases', () => {
    it('should handle multiline with empty first lines', () => {
      const text = '\n\nActual Title\nContent here';
      expect(extractTitle(text)).toBe('Actual Title');
    });

    it('should handle text with only whitespace first line', () => {
      const text = '   \nReal Title\nMore content';
      expect(extractTitle(text)).toBe('Real Title');
    });
  });
});
