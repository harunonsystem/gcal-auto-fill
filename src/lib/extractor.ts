/**
 * Extract title from text content
 * Priority: First non-empty line, then subject patterns
 */
export function extractTitle(text: string): string | null {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);

  if (lines.length === 0) {
    return null;
  }

  // Check for common subject patterns
  const subjectPatterns = [
    /^(?:件名|subject|title|タイトル)[：:]\s*(.+)/i,
    /^(?:re|fw|fwd)[：:]\s*(.+)/i,
  ];

  for (const line of lines) {
    for (const pattern of subjectPatterns) {
      const match = line.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
  }

  // Use first line as title (max 50 chars)
  const firstLine = lines[0];
  if (firstLine.length > 50) {
    return firstLine.substring(0, 47) + '...';
  }

  return firstLine;
}
