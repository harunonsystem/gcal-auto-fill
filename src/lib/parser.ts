import * as chrono from 'chrono-node';
import { getLocale } from './i18n';

export interface ParsedDateTime {
  start: Date;
  end: Date;
}

// Get chrono parser based on locale
function getChronoParser() {
  const locale = getLocale();
  return locale === 'ja' ? chrono.ja : chrono;
}

export function parseDateTime(text: string): ParsedDateTime | null {
  const parser = getChronoParser();
  const parsed = parser.parse(text, new Date(), { forwardDate: true });
  
  if (parsed.length === 0) {
    return null;
  }
  
  const result = parsed[0];
  const start = result.start.date();
  // Default to 1 hour duration if no end time
  const end = result.end?.date() || new Date(start.getTime() + 60 * 60 * 1000);
  
  return { start, end };
}

const MEETING_URL_REGEX = /https:\/\/(?:[a-zA-Z0-9-]+\.)?(?:zoom\.us|webex\.com|teams\.microsoft\.com|meet\.google\.com)\/[^\s<>]+/gi;

export function extractMeetingUrl(text: string): string | null {
  const matches = text.match(MEETING_URL_REGEX);
  
  if (!matches || matches.length === 0) {
    return null;
  }
  
  // Remove HTML tags if present
  return matches[0].replace(/<[^>]*>/g, '');
}
