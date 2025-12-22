import { describe, it, expect } from 'vitest';
import { parseDateTime, extractMeetingUrl } from './parser';

describe('parseDateTime', () => {
  describe('English dates with 24-hour time', () => {
    it('should parse "December 23rd 18:00 - 19:00"', () => {
      const text = 'December 23rd (Tuesday) 18:00 - 19:00';
      const result = parseDateTime(text);
      
      expect(result).not.toBeNull();
      expect(result!.start.getMonth()).toBe(11); // December = 11
      expect(result!.start.getDate()).toBe(23);
      expect(result!.start.getHours()).toBe(18);
      expect(result!.start.getMinutes()).toBe(0);
      expect(result!.end.getHours()).toBe(19);
      expect(result!.end.getMinutes()).toBe(0);
    });

    it('should parse "December 23 at 18:00"', () => {
      const text = 'December 23 at 18:00';
      const result = parseDateTime(text);
      
      expect(result).not.toBeNull();
      expect(result!.start.getHours()).toBe(18);
    });

    it('should parse "January 15 at 9:30 AM"', () => {
      const text = 'Meeting on January 15 at 9:30 AM';
      const result = parseDateTime(text);
      
      expect(result).not.toBeNull();
      expect(result!.start.getMonth()).toBe(0); // January = 0
      expect(result!.start.getDate()).toBe(15);
      expect(result!.start.getHours()).toBe(9);
      expect(result!.start.getMinutes()).toBe(30);
    });

    it('should parse "tomorrow at 3pm"', () => {
      const text = "Let's meet tomorrow at 3pm";
      const result = parseDateTime(text);
      
      expect(result).not.toBeNull();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(result!.start.getDate()).toBe(tomorrow.getDate());
      expect(result!.start.getHours()).toBe(15);
    });
  });

  describe('Japanese dates', () => {
    it('should parse "12月23日 18:00〜19:00"', () => {
      const text = '12月23日 18:00〜19:00';
      const result = parseDateTime(text);
      
      expect(result).not.toBeNull();
      expect(result!.start.getMonth()).toBe(11);
      expect(result!.start.getDate()).toBe(23);
      expect(result!.start.getHours()).toBe(18);
    });

    it('should parse "明日 14時"', () => {
      const text = '明日 14時に会議';
      const result = parseDateTime(text);
      
      expect(result).not.toBeNull();
      expect(result!.start.getHours()).toBe(14);
    });
  });

  describe('Mixed content', () => {
    it('should parse English date with 24-hour time in email', () => {
      const text = `
Hi team,

Let's sync up on the project status.

Date: December 23rd (Tuesday) 18:00 - 19:00
Location: https://meet.google.com/abc-defg-hij

Please update the agenda beforehand.
      `;
      const result = parseDateTime(text);
      
      expect(result).not.toBeNull();
      expect(result!.start.getMonth()).toBe(11);
      expect(result!.start.getDate()).toBe(23);
      expect(result!.start.getHours()).toBe(18);
      expect(result!.end.getHours()).toBe(19);
    });
  });
});

describe('extractMeetingUrl', () => {
  it('should extract Google Meet URL', () => {
    const text = 'Join at https://meet.google.com/abc-defg-hij';
    const result = extractMeetingUrl(text);
    expect(result).toBe('https://meet.google.com/abc-defg-hij');
  });

  it('should extract Zoom URL', () => {
    const text = 'Zoom link: https://zoom.us/j/123456789';
    const result = extractMeetingUrl(text);
    expect(result).toBe('https://zoom.us/j/123456789');
  });

  it('should extract Teams URL', () => {
    const text = 'Teams: https://teams.microsoft.com/l/meetup-join/xxx';
    const result = extractMeetingUrl(text);
    expect(result).toBe('https://teams.microsoft.com/l/meetup-join/xxx');
  });

  it('should extract Webex subdomain URL', () => {
    const text = 'Webex: https://company.webex.com/meet/user123';
    const result = extractMeetingUrl(text);
    expect(result).toBe('https://company.webex.com/meet/user123');
  });

  it('should extract Slack Huddles URL', () => {
    const text = 'Slack: https://app.slack.com/huddle/T12345/C67890';
    const result = extractMeetingUrl(text);
    expect(result).toBe('https://app.slack.com/huddle/T12345/C67890');
  });

  it('should return null if no meeting URL found', () => {
    const text = 'No meeting URL here';
    const result = extractMeetingUrl(text);
    expect(result).toBeNull();
  });
});
