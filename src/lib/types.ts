export interface ParsedDateTime {
  start: Date;
  end: Date;
}

export interface ExtractedTitle {
  text: string;
  source: 'subject-pattern' | 'first-line' | 'truncated';
  confidence: number;
}

export interface ExtractedData {
  title?: ExtractedTitle;
  dateTime?: ParsedDateTime;
  meetingUrl?: string;
  description: string;
}

export interface GCalEventParams {
  text?: string;
  dates?: string;
  location?: string;
  details?: string;
  action: string;
}

export interface ToastOptions {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onConfirm?: () => void;
  onCancel?: () => void;
}
