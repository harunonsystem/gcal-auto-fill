import * as chrono from 'chrono-node';

export interface ParsedDateTime {
  start: Date;
  end: Date;
}

// Custom English parser with 24-hour time support
const customEnParser = chrono.en.casual.clone();
customEnParser.refiners.push({
  refine: (context, results) => {
    // This refiner runs after initial parsing
    return results;
  },
});

// Detect if text contains Japanese characters
function containsJapanese(text: string): boolean {
  return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
}

// Detect if text contains English date keywords
function containsEnglishDate(text: string): boolean {
  const englishPatterns = /\b(january|february|march|april|may|june|july|august|september|october|november|december|monday|tuesday|wednesday|thursday|friday|saturday|sunday|today|tomorrow|yesterday)\b/i;
  return englishPatterns.test(text);
}

// Pre-process text to convert 24-hour time to 12-hour for English parser
function convertTo12HourFormat(text: string): string {
  // Match 24-hour time patterns like "18:00" or "18:30"
  // Also handle ranges like "18:00 - 19:00"
  return text.replace(/\b([01]?\d|2[0-3]):([0-5]\d)\b/g, (match, hours, minutes) => {
    const h = parseInt(hours, 10);
    if (h >= 13 && h <= 23) {
      return `${h - 12}:${minutes} PM`;
    } else if (h === 12) {
      return `12:${minutes} PM`;
    } else if (h === 0) {
      return `12:${minutes} AM`;
    } else if (h >= 1 && h <= 11) {
      // Morning hours - add AM only if not already followed by AM/PM
      return `${h}:${minutes} AM`;
    }
    return match;
  });
}

export function parseDateTime(text: string): ParsedDateTime | null {
  const hasJapanese = containsJapanese(text);
  const hasEnglishDate = containsEnglishDate(text);
  
  let results: chrono.ParsedResult[] = [];
  
  if (hasEnglishDate && !hasJapanese) {
    // English text - convert 24-hour to 12-hour format first
    const convertedText = convertTo12HourFormat(text);
    results = chrono.parse(convertedText, new Date(), { forwardDate: true });
  } else if (hasJapanese && !hasEnglishDate) {
    // Japanese text
    results = chrono.ja.parse(text, new Date(), { forwardDate: true });
  } else {
    // Mixed - try Japanese first, then English with conversion
    results = chrono.ja.parse(text, new Date(), { forwardDate: true });
    if (results.length === 0) {
      const convertedText = convertTo12HourFormat(text);
      results = chrono.parse(convertedText, new Date(), { forwardDate: true });
    }
  }
  
  if (results.length === 0) {
    return null;
  }
  
  // Select the best result - prefer ones with explicit time information
  // If multiple results, find the one with the most complete time info
  let bestResult = results[0];
  for (const result of results) {
    const hasExplicitTime = result.start.isCertain('hour');
    const hasEndTime = result.end !== null;
    const bestHasExplicitTime = bestResult.start.isCertain('hour');
    const bestHasEndTime = bestResult.end !== null;
    
    // Prefer results with explicit time
    if (hasExplicitTime && !bestHasExplicitTime) {
      bestResult = result;
    }
    // If both have time, prefer the one with end time
    else if (hasExplicitTime && bestHasExplicitTime && hasEndTime && !bestHasEndTime) {
      bestResult = result;
    }
  }
  
  const start = bestResult.start.date();
  const end = bestResult.end?.date() || new Date(start.getTime() + 60 * 60 * 1000);
  return { start, end };
}

const MEETING_URL_REGEX = /https:\/\/(?:[a-zA-Z0-9-]+\.)?(?:zoom\.us|webex\.com|teams\.microsoft\.com|meet\.google\.com)\/[^\s<>]+/gi;

export function extractMeetingUrl(text: string): string | null {
  const matches = text.match(MEETING_URL_REGEX);
  
  if (!matches || matches.length === 0) {
    return null;
  }
  
  return matches[0].replace(/<[^>]*>/g, '');
}

