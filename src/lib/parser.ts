import * as chrono from 'chrono-node';
import { ParsedDateTime } from './types';
import { getConfig } from './config';
import { ErrorHandler } from './error-handler';

const JAPANESE_CHARS_REGEX = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
const ENGLISH_DATE_KEYWORDS_REGEX = /\b(january|february|march|april|may|june|july|august|september|october|november|december|monday|tuesday|wednesday|thursday|friday|saturday|sunday|today|tomorrow|yesterday)\b/i;
const TIME_24H_REGEX = /\b([01]?\d|2[0-3]):([0-5]\d)\b/g;
const MEETING_URL_REGEX = new RegExp(
  `https://(?:[a-zA-Z0-9-]+\\.)?(?:${getConfig().parsing.supportedMeetingPlatforms.join('|')})/[^\\s<>]+`,
  'gi'
);
const HTML_TAG_REGEX = /<[^>]*>/g;

function containsJapanese(text: string): boolean {
  return JAPANESE_CHARS_REGEX.test(text);
}

function containsEnglishDate(text: string): boolean {
  return ENGLISH_DATE_KEYWORDS_REGEX.test(text);
}

function convertTo12HourFormat(text: string): string {
  return text.replace(TIME_24H_REGEX, (match, hours, minutes) => {
    const h = parseInt(hours, 10);
    if (h >= 13 && h <= 23) {
      return `${h - 12}:${minutes} PM`;
    }
    if (h === 12) {
      return `12:${minutes} PM`;
    }
    if (h === 0) {
      return `12:${minutes} AM`;
    }
    if (h >= 1 && h <= 11) {
      return `${h}:${minutes} AM`;
    }
    return match;
  });
}

function selectBestResult(results: chrono.ParsedResult[]): chrono.ParsedResult {
  let best = results[0];

  for (const result of results) {
    const hasTime = result.start.isCertain('hour');
    const hasEnd = result.end !== null;
    const bestHasTime = best.start.isCertain('hour');
    const bestHasEnd = best.end !== null;

    if (hasTime && !bestHasTime) {
      best = result;
    } else if (hasTime && bestHasTime && hasEnd && !bestHasEnd) {
      best = result;
    }
  }

  return best;
}

export function parseDateTime(text: string): ParsedDateTime | null {
  try {
    const hasJapanese = containsJapanese(text);
    const hasEnglishDate = containsEnglishDate(text);

    let results: chrono.ParsedResult[] = [];

    if (hasEnglishDate && !hasJapanese) {
      const converted = convertTo12HourFormat(text);
      results = chrono.parse(converted, new Date(), { forwardDate: true });
    } else if (hasJapanese && !hasEnglishDate) {
      results = chrono.ja.parse(text, new Date(), { forwardDate: true });
    } else {
      results = chrono.ja.parse(text, new Date(), { forwardDate: true });
      if (results.length === 0) {
        const converted = convertTo12HourFormat(text);
        results = chrono.parse(converted, new Date(), { forwardDate: true });
      }
    }

    if (results.length === 0) {
      return null;
    }

    const best = selectBestResult(results);
    const start = best.start.date();
    const defaultDuration = getConfig().parsing.defaultDurationMinutes * 60 * 1000;
    const end = best.end?.date() || new Date(start.getTime() + defaultDuration);

    return { start, end };
  } catch (error) {
    ErrorHandler.handleUnknown(error);
    return null;
  }
}

export function extractMeetingUrl(text: string): string | null {
  try {
    const matches = text.match(MEETING_URL_REGEX);
    if (!matches || matches.length === 0) {
      return null;
    }
    return matches[0].replace(HTML_TAG_REGEX, '');
  } catch (error) {
    ErrorHandler.handleUnknown(error);
    return null;
  }
}
