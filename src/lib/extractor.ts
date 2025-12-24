import { ExtractedTitle } from './types';
import { getConfig } from './config';
import { ErrorHandler } from './error-handler';

const SUBJECT_PATTERNS = [
  /^(?:件名|subject|title|タイトル)[：:]\s*(.+)/i,
  /^(?:re|fw|fwd)[：:]\s*(.+)/i,
];

const TITLE_PREFIXES = [
  '【', '『', '「', '『', '(', '[', '<',
  'Subject:', 'Title:', '件名:', 'タイトル:',
];

function calculateConfidence(text: string, source: ExtractedTitle['source']): number {
  let score = 0.5;

  if (source === 'subject-pattern') {
    score = 0.95;
  } else if (source === 'first-line') {
    score = 0.7;
  } else if (source === 'truncated') {
    score = 0.6;
  }

  const hasTitlePrefix = TITLE_PREFIXES.some(prefix => text.startsWith(prefix));
  if (hasTitlePrefix) {
    score += 0.1;
  }

  const length = text.trim().length;
  if (length > 5 && length < 50) {
    score += 0.1;
  } else if (length === 0 || length > 100) {
    score -= 0.2;
  }

  const hasEmailSignature = text.includes('From:') || text.includes('Sent:');
  if (hasEmailSignature) {
    score -= 0.3;
  }

  return Math.min(1, Math.max(0, score));
}

function extractFromSubjectPatterns(text: string): ExtractedTitle | null {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);

  for (const line of lines) {
    for (const pattern of SUBJECT_PATTERNS) {
      const match = line.match(pattern);
      if (match) {
        const titleText = match[1].trim();
        return {
          text: titleText,
          source: 'subject-pattern',
          confidence: calculateConfidence(titleText, 'subject-pattern'),
        };
      }
    }
  }

  return null;
}

function extractFromFirstLine(text: string): ExtractedTitle | null {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);

  if (lines.length === 0) {
    return null;
  }

  const firstLine = lines[0];
  const maxLength = getConfig().parsing.maxTitleLength;

  let titleText = firstLine;
  let source: ExtractedTitle['source'] = 'first-line';

  if (firstLine.length > maxLength) {
    const suffixLength = getConfig().parsing.maxTitleSuffixLength;
    titleText = firstLine.substring(0, maxLength - suffixLength) + '...'.padEnd(suffixLength, '.');
    source = 'truncated';
  }

  return {
    text: titleText,
    source,
    confidence: calculateConfidence(titleText, source),
  };
}

export function extractTitle(text: string): ExtractedTitle | null {
  try {
    const subjectTitle = extractFromSubjectPatterns(text);
    if (subjectTitle) {
      return subjectTitle;
    }

    return extractFromFirstLine(text);
  } catch (error) {
    ErrorHandler.handleUnknown(error);
    return null;
  }
}
