import { CSS_CLASSES } from './constants';

export type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
}

const TOAST_CONTAINER_ID = 'gcal-magic-toast-container';

function getOrCreateContainer(): HTMLElement {
  let container = document.getElementById(TOAST_CONTAINER_ID);
  if (!container) {
    container = document.createElement('div');
    container.id = TOAST_CONTAINER_ID;
    container.className = CSS_CLASSES.TOAST_CONTAINER;
    document.body.appendChild(container);
  }
  return container;
}

export function showToast(options: ToastOptions): void {
  const { message, type = 'info', duration = 5000, actions } = options;
  const container = getOrCreateContainer();

  const toast = document.createElement('div');
  toast.className = `${CSS_CLASSES.TOAST} ${CSS_CLASSES.TOAST}-${type}`;

  const messageEl = document.createElement('div');
  messageEl.className = CSS_CLASSES.TOAST_MESSAGE;
  messageEl.textContent = message;
  toast.appendChild(messageEl);

  if (actions && actions.length > 0) {
    const actionsEl = document.createElement('div');
    actionsEl.className = CSS_CLASSES.TOAST_ACTIONS;

    for (const action of actions) {
      const btn = document.createElement('button');
      btn.className = CSS_CLASSES.TOAST_BUTTON;
      btn.textContent = action.label;
      btn.onclick = () => {
        action.onClick();
        toast.remove();
      };
      actionsEl.appendChild(btn);
    }

    toast.appendChild(actionsEl);
  }

  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.add(CSS_CLASSES.TOAST_VISIBLE);
  });

  // Auto dismiss
  if (duration > 0 && (!actions || actions.length === 0)) {
    setTimeout(() => {
      dismissToast(toast);
    }, duration);
  }
}

function dismissToast(toast: HTMLElement): void {
  toast.classList.remove(CSS_CLASSES.TOAST_VISIBLE);
  toast.addEventListener('transitionend', () => {
    toast.remove();
  });
}

export function showConfirmToast(
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
): void {
  showToast({
    message,
    type: 'info',
    duration: 0,
    actions: [
      {
        label: '✓',
        onClick: onConfirm,
      },
      {
        label: '✕',
        onClick: onCancel || (() => {}),
      },
    ],
  });
}
