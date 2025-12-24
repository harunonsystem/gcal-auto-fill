import { t, getDateLocaleString } from './i18n';
import { parseDateTime, extractMeetingUrl } from './parser';
import { extractTitle } from './extractor';
import { showConfirmToast, showToast } from './toast';
import { getConfig } from './config';
import { ErrorHandler } from './error-handler';

export interface GCalParams {
  text?: string;
  dates?: string;
  location?: string;
  details: string;
}

export function formatDateForGcal(date: Date): string {
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

export function buildGCalParams(text: string): GCalParams | null {
  const params: GCalParams = { details: text };
  let hasChanges = false;

  const title = extractTitle(text);
  if (title) {
    params.text = title.text;
    hasChanges = true;
  }

  const dateTime = parseDateTime(text);
  if (dateTime) {
    const startStr = formatDateForGcal(dateTime.start);
    const endStr = formatDateForGcal(dateTime.end);
    params.dates = `${startStr}/${endStr}`;
    hasChanges = true;
  }

  const meetingUrl = extractMeetingUrl(text);
  if (meetingUrl) {
    params.location = meetingUrl;
    hasChanges = true;
  }

  return hasChanges ? params : null;
}

export function fillCalendarFields(text: string): void {
  try {
    const currentUrl = new URL(window.location.href);
    const urlParams = new URLSearchParams(currentUrl.search);

    const gcalParams = buildGCalParams(text);
    if (!gcalParams) {
      showToast({
        message: t('notFoundError'),
        type: 'error',
        duration: getConfig().ui.toastDuration,
      });
      return;
    }

    const results: string[] = [];

    if (gcalParams.text) {
      urlParams.set('text', gcalParams.text);
      results.push(`📝 ${gcalParams.text}`);
    }

    if (gcalParams.dates) {
      urlParams.set('dates', gcalParams.dates);
      const dateTime = parseDateTime(text);
      if (dateTime) {
        const startDisplay = formatDisplayDate(dateTime.start);
        const endDisplay = formatDisplayDate(dateTime.end);
        results.push(`📅 ${startDisplay}${t('dateSeparator')}${endDisplay}`);
      }
    }

    if (gcalParams.location) {
      urlParams.set('location', gcalParams.location);
      results.push(`🔗 ${gcalParams.location}`);
    }

    urlParams.set('details', gcalParams.details);

    const confirmMessage = [
      t('confirmTitle'),
      ...results,
    ].join('\n');

    showConfirmToast(confirmMessage, () => {
      const newUrl = `${currentUrl.origin}${currentUrl.pathname}?${urlParams.toString()}`;
      console.log('[GCal Auto Fill] Redirecting to:', newUrl);
      window.location.href = newUrl;
    });
  } catch (error) {
    ErrorHandler.handleUnknown(error);
    showToast({
      message: t('notFoundError'),
      type: 'error',
      duration: getConfig().ui.toastDuration,
    });
  }
}
