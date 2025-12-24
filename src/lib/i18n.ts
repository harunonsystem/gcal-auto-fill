// i18n messages
const messages = {
  en: {
    buttonLabel: '✨ Auto Fill',
    noTextError: 'Please enter text in the description field',
    confirmTitle: 'Create event with the following details:',
    confirmReload: '* Page will reload',
    confirmProceed: 'Proceed?',
    notFoundError:
      'No date/time or meeting URL found.\n\nExample: "December 23, 6:00 PM - 7:00 PM"',
    dateSeparator: ' - ',
  },
  ja: {
    buttonLabel: '✨ 自動入力',
    noTextError: '説明欄にテキストを入力してください',
    confirmTitle: '以下の内容でイベントを作成します：',
    confirmReload: '※ページがリロードされます',
    confirmProceed: '続行しますか？',
    notFoundError:
      '日時または会議URLが見つかりませんでした。\n\n例: "12月23日 18:00〜19:00" のような形式で入力してください。',
    dateSeparator: ' 〜 ',
  },
} as const;

export type Locale = keyof typeof messages;
export type MessageKey = keyof typeof messages.en;

export function getLocale(): Locale {
  const lang = navigator.language.split('-')[0];
  return lang === 'ja' ? 'ja' : 'en';
}

export function t(key: MessageKey): string {
  const locale = getLocale();
  return messages[locale][key];
}

export function getDateLocaleString(): string {
  const locale = getLocale();
  return locale === 'ja' ? 'ja-JP' : 'en-US';
}
