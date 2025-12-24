import { toastManager } from './ui/toast-manager';
import { ToastOptions as InternalToastOptions } from './types';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
}

export function showToast(options: ToastOptions): void {
  const internalOptions: InternalToastOptions = {
    message: options.message,
    type: options.type ?? 'info',
    duration: options.duration ?? 5000,
  };

  if (options.actions && options.actions.length > 0) {
    const confirmAction = options.actions.find((a) => a.label === '✓');
    const cancelAction = options.actions.find((a) => a.label === '✕');

    if (confirmAction) {
      internalOptions.onConfirm = confirmAction.onClick;
    }
    if (cancelAction) {
      internalOptions.onCancel = cancelAction.onClick;
    }
  }

  toastManager.show(internalOptions);
}

export function showConfirmToast(
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
): void {
  toastManager.show({
    message,
    type: 'info',
    duration: 0,
    onConfirm,
    onCancel,
  });
}
