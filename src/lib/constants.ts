import { getConfig } from './config';

export const SELECTORS = {
  DESCRIPTION_AREA: '#xDescIn .editable',
  DESCRIPTION_CONTAINER: 'xDescIn',
} as const;

export const ELEMENT_IDS = {
  AUTO_FILL_BUTTON: 'gcal-auto-fill-btn',
} as const;

export const CSS_CLASSES = {
  AUTO_FILL_CONTAINER: 'gcal-auto-fill-container',
  TOAST_CONTAINER: 'gcal-auto-fill-toast-container',
  TOAST: 'gcal-auto-fill-toast',
  TOAST_VISIBLE: 'gcal-auto-fill-toast--visible',
  TOAST_MESSAGE: 'gcal-auto-fill-toast__message',
  TOAST_ACTIONS: 'gcal-auto-fill-toast__actions',
  TOAST_BUTTON: 'gcal-auto-fill-toast__button',
} as const;

export const CONFIG = getConfig();
