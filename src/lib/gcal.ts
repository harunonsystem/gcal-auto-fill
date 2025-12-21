import { t, getDateLocaleString } from './i18n';
import { parseDateTime, extractMeetingUrl } from './parser';

// Format date for Google Calendar URL (YYYYMMDDTHHMMSS)
function formatDateForGcal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = '00';
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

function formatDisplayDate(date: Date): string {
  return date.toLocaleString(getDateLocaleString(), {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function fillCalendarFields(text: string): void {
  const currentUrl = new URL(window.location.href);
  const params = new URLSearchParams(currentUrl.search);
  
  let hasChanges = false;
  const results: string[] = [];
  
  // 1. Parse date/time
  const dateTime = parseDateTime(text);
  if (dateTime) {
    const startStr = formatDateForGcal(dateTime.start);
    const endStr = formatDateForGcal(dateTime.end);
    
    params.set('dates', `${startStr}/${endStr}`);
    hasChanges = true;
    
    const startDisplay = formatDisplayDate(dateTime.start);
    const endDisplay = formatDisplayDate(dateTime.end);
    results.push(`📅 ${startDisplay}${t('dateSeparator')}${endDisplay}`);
  }
  
  // 2. Extract meeting URL
  const meetingUrl = extractMeetingUrl(text);
  if (meetingUrl) {
    params.set('location', meetingUrl);
    hasChanges = true;
    results.push(`🔗 ${meetingUrl}`);
  }
  
  // 3. Keep description as-is
  params.set('details', text);
  
  if (hasChanges) {
    const confirmMessage = [
      t('confirmTitle'),
      '',
      ...results,
      '',
      t('confirmReload'),
      t('confirmProceed'),
    ].join('\n');
    
    if (confirm(confirmMessage)) {
      const newUrl = `${currentUrl.origin}${currentUrl.pathname}?${params.toString()}`;
      console.log('[GCal Magic Filler] Redirecting to:', newUrl);
      window.location.href = newUrl;
    }
  } else {
    alert(t('notFoundError'));
  }
}
