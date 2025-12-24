import { describe, it, expect } from 'vitest';
import { extractTitle } from './extractor';

describe('extractTitle', () => {
  describe('first line extraction', () => {
    it('should extract first line as title', () => {
      const text = 'Weekly Team Meeting\nPlease join us for the weekly sync.';
      expect(extractTitle(text)?.text).toBe('Weekly Team Meeting');
    });

    it('should truncate long titles to 50 chars', () => {
      const text = 'This is a very long title that exceeds the maximum allowed character limit for titles';
      const result = extractTitle(text);
      expect(result!.text.length).toBe(50);
      expect(result?.text).toMatch(/\.\.$/);
      expect(result?.source).toBe('truncated');
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
      const result = extractTitle(text);
      expect(result?.text).toBe('プロジェクト進捗会議');
      expect(result?.source).toBe('subject-pattern');
    });

    it('should extract from "Subject:" pattern', () => {
      const text = 'Subject: Q4 Planning Session\nAgenda items below';
      const result = extractTitle(text);
      expect(result?.text).toBe('Q4 Planning Session');
      expect(result?.source).toBe('subject-pattern');
    });

    it('should extract from "Title:" pattern', () => {
      const text = 'Title: Product Review\nNotes...';
      const result = extractTitle(text);
      expect(result?.text).toBe('Product Review');
      expect(result?.source).toBe('subject-pattern');
    });

    it('should extract from "Re:" pattern', () => {
      const text = 'Re: Follow up meeting\nSome content';
      const result = extractTitle(text);
      expect(result?.text).toBe('Follow up meeting');
      expect(result?.source).toBe('subject-pattern');
    });

    it('should extract from "Fw:" pattern', () => {
      const text = 'Fw: Important announcement\nForwarded message';
      const result = extractTitle(text);
      expect(result?.text).toBe('Important announcement');
      expect(result?.source).toBe('subject-pattern');
    });
  });

  describe('edge cases', () => {
    it('should handle multiline with empty first lines', () => {
      const text = '\n\nActual Title\nContent here';
      expect(extractTitle(text)?.text).toBe('Actual Title');
    });

    it('should handle text with only whitespace first line', () => {
      const text = '   \nReal Title\nMore content';
      expect(extractTitle(text)?.text).toBe('Real Title');
    });
  });

  describe('confidence scoring', () => {
    it('should have high confidence for subject patterns', () => {
      const text = 'Subject: Important Meeting\nDetails...';
      const result = extractTitle(text);
      expect(result?.confidence).toBeGreaterThan(0.9);
    });

    it('should have moderate confidence for first line', () => {
      const text = 'Regular Meeting\nDetails...';
      const result = extractTitle(text);
      expect(result?.confidence).toBeGreaterThan(0.5);
    });
  });
});
