import { describe, it, expect } from 'vitest';
import { buildGCalParams, formatDateForGcal } from './gcal';

const SAMPLE_EMAIL_TEXT = `Hi team, let's schedule our weekly sync!

January 15th (Wednesday) 14:00 - 15:00
https://meet.google.com/abc-defg-hij

Looking forward to seeing everyone.

Best regards`;

describe('formatDateForGcal', () => {
  it('should format date correctly for GCal', () => {
    const date = new Date(2025, 0, 15, 14, 0, 0); // Jan 15, 2025 14:00
    expect(formatDateForGcal(date)).toBe('20250115T140000');
  });
});

describe('buildGCalParams', () => {
  it('should extract title, dates, and meeting URL from sample email', () => {
    const params = buildGCalParams(SAMPLE_EMAIL_TEXT);

    expect(params).not.toBeNull();
    expect(params!.text).toBe("Hi team, let's schedule our weekly sync!");
    expect(params!.dates).toMatch(/^\d{8}T140000\/\d{8}T150000$/);
    expect(params!.location).toBe('https://meet.google.com/abc-defg-hij');
    expect(params!.details).toBe(SAMPLE_EMAIL_TEXT);
  });

  it('should extract dates with correct format', () => {
    const text = `Meeting
December 23rd 18:00 - 19:00`;

    const params = buildGCalParams(text);

    expect(params).not.toBeNull();
    // December 23, 2025 (next occurrence of Dec 23rd)
    expect(params!.dates).toContain('T180000/');
    expect(params!.dates).toContain('T190000');
  });

  it('should extract Google Meet URL', () => {
    const text = `Hello
https://meet.google.com/abc-defg-hij`;

    const params = buildGCalParams(text);

    expect(params).not.toBeNull();
    expect(params!.location).toBe('https://meet.google.com/abc-defg-hij');
  });

  it('should extract Zoom URL', () => {
    const text = `Conference call
https://zoom.us/j/123456789`;

    const params = buildGCalParams(text);

    expect(params).not.toBeNull();
    expect(params!.location).toBe('https://zoom.us/j/123456789');
  });

  it('should only have title and details for text with no dates or URLs', () => {
    const text = 'Just some random text with no dates or URLs';
    const params = buildGCalParams(text);
    expect(params).not.toBeNull();
    expect(params!.text).toBe(text);
    expect(params!.dates).toBeUndefined();
    expect(params!.location).toBeUndefined();
  });

  it('should extract subject pattern title', () => {
    const text = `Subject: Weekly Team Meeting
December 25th 10:00 - 11:00`;

    const params = buildGCalParams(text);

    expect(params).not.toBeNull();
    expect(params!.text).toBe('Weekly Team Meeting');
  });

  it('should handle Japanese text', () => {
    const text = `件名: プロジェクト進捗会議
12月23日 18:00〜19:00`;

    const params = buildGCalParams(text);

    expect(params).not.toBeNull();
    expect(params!.text).toBe('プロジェクト進捗会議');
    expect(params!.dates).toBeDefined();
  });
});
