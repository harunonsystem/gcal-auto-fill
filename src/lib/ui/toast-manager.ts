import { ToastOptions } from '../types';
import { CONFIG } from '../constants';
import { ErrorHandler } from '../error-handler';

type ToastType = 'success' | 'error' | 'warning' | 'info';

export class ToastManager {
  private queue: Array<{ options: ToastOptions; resolve: () => void }> = [];
  private activeToast: HTMLElement | null = null;
  private container: HTMLElement | null = null;

  private ensureContainer(): void {
    if (this.container) return;

    this.container = document.createElement('div');
    this.container.id = 'gcal-auto-fill-toast-container';
    this.container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 2147483647;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(this.container);
  }

  show(options: ToastOptions): Promise<void> {
    return new Promise((resolve) => {
      if (this.queue.length >= CONFIG.ui.maxToastsInQueue) {
        resolve();
        return;
      }

      this.queue.push({ options, resolve });
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.activeToast || this.queue.length === 0) return;

    const { options, resolve } = this.queue.shift()!;
    this.activeToast = this.createToast(options);

    try {
      await this.displayToast(this.activeToast, options);
    } catch (error) {
      ErrorHandler.handleUnknown(error);
    }

    this.activeToast = null;
    resolve();

    setTimeout(() => this.processQueue(), 300);
  }

  private createToast(options: ToastOptions): HTMLElement {
    const toast = document.createElement('div');
    toast.style.cssText = `
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 16px;
      min-width: 300px;
      max-width: 400px;
      pointer-events: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      border-left: 4px solid ${this.getBorderColor(options.type)};
      opacity: 0;
      transform: translateX(100%);
      transition: opacity 0.3s ease, transform 0.3s ease;
    `;

    const message = document.createElement('div');
    message.style.cssText = 'margin-bottom: 12px; white-space: pre-wrap;';
    message.textContent = options.message;
    toast.appendChild(message);

    if (options.onConfirm || options.onCancel) {
      const actions = document.createElement('div');
      actions.style.cssText = 'display: flex; gap: 8px; justify-content: flex-end;';

      if (options.onCancel) {
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.cssText = `
          padding: 6px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 13px;
        `;
        cancelBtn.onclick = () => {
          options.onCancel?.();
          this.removeToast(toast);
        };
        actions.appendChild(cancelBtn);
      }

      if (options.onConfirm) {
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = 'Confirm';
        confirmBtn.style.cssText = `
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          background: #1a73e8;
          color: white;
          cursor: pointer;
          font-size: 13px;
        `;
        confirmBtn.onclick = () => {
          options.onConfirm?.();
          this.removeToast(toast);
        };
        actions.appendChild(confirmBtn);
      }

      toast.appendChild(actions);
    }

    return toast;
  }

  private async displayToast(toast: HTMLElement, options: ToastOptions): Promise<void> {
    this.ensureContainer();
    this.container!.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(0)';
    });

    if (!options.onConfirm && !options.onCancel) {
      await new Promise((resolve) => setTimeout(resolve, options.duration || CONFIG.ui.toastDuration));
      this.removeToast(toast);
    }
  }

  private removeToast(toast: HTMLElement): void {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  private getBorderColor(type: ToastType): string {
    const colors = {
      success: '#34a853',
      error: '#ea4335',
      warning: '#fbbc04',
      info: '#4285f4',
    };
    return colors[type] || colors.info;
  }

  destroy(): void {
    if (this.container) {
      document.body.removeChild(this.container);
      this.container = null;
    }
    this.queue = [];
    this.activeToast = null;
  }
}

export const toastManager = new ToastManager();
