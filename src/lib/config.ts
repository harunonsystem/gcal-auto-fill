export interface ExtensionConfig {
  parsing: {
    defaultDurationMinutes: number;
    supportedMeetingPlatforms: string[];
    maxTitleLength: number;
    maxTitleSuffixLength: number;
  };
  ui: {
    toastDuration: number;
    enableAnimations: boolean;
    maxToastsInQueue: number;
  };
  selectors: {
    retryAttempts: number;
    validationInterval: number;
    observerTimeout: number;
  };
  gcal: {
    baseUrl: string;
    templateAction: string;
  };
}

export const DEFAULT_CONFIG: ExtensionConfig = {
  parsing: {
    defaultDurationMinutes: 60,
    supportedMeetingPlatforms: [
      'zoom.us',
      'teams.microsoft.com',
      'meet.google.com',
      'webex.com',
      'slack.com/huddle'
    ],
    maxTitleLength: 50,
    maxTitleSuffixLength: 3,
  },
  ui: {
    toastDuration: 5000,
    enableAnimations: true,
    maxToastsInQueue: 3,
  },
  selectors: {
    retryAttempts: 3,
    validationInterval: 1000,
    observerTimeout: 5000,
  },
  gcal: {
    baseUrl: 'https://calendar.google.com/calendar/render',
    templateAction: 'TEMPLATE',
  },
} as const;

export function getConfig(): ExtensionConfig {
  return DEFAULT_CONFIG;
}
