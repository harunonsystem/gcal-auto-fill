import { ELEMENT_IDS, CSS_CLASSES } from '../constants';
import { ErrorHandler } from '../error-handler';

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

export class AutoFillButton {
  private element: HTMLButtonElement;

  constructor(onClick: () => void) {
    this.element = this.createButton();
    this.bindEvents(onClick);
  }

  private createButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.id = ELEMENT_IDS.AUTO_FILL_BUTTON;
    button.className = CSS_CLASSES.AUTO_FILL_CONTAINER;
    button.innerHTML = `
      <span class="icon">✨</span>
      <span class="text">Auto Fill</span>
    `;
    button.style.cssText = `
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 20px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
    `;

    this.setupStyles();
    return button;
  }

  private setupStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .${CSS_CLASSES.AUTO_FILL_CONTAINER}:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }
      .${CSS_CLASSES.AUTO_FILL_CONTAINER}:active {
        transform: translateY(0);
      }
      .${CSS_CLASSES.AUTO_FILL_CONTAINER}.loading {
        pointer-events: none;
        opacity: 0.7;
      }
      .${CSS_CLASSES.AUTO_FILL_CONTAINER}.loading .text {
        display: none;
      }
      .${CSS_CLASSES.AUTO_FILL_CONTAINER}.loading .icon {
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .${CSS_CLASSES.AUTO_FILL_CONTAINER}.success {
        background: linear-gradient(135deg, #34a853 0%, #0d9488 100%);
      }
      .${CSS_CLASSES.AUTO_FILL_CONTAINER}.error {
        background: linear-gradient(135deg, #ea4335 0%, #dc2626 100%);
      }
    `;
    document.head.appendChild(style);
  }

  private bindEvents(onClick: () => void): void {
    this.element.addEventListener('click', () => {
      try {
        onClick();
      } catch (error) {
        ErrorHandler.handleUnknown(error);
        this.setState('error');
        setTimeout(() => this.setState('idle'), 2000);
      }
    });
  }

  setState(state: ButtonState): void {
    this.element.className = CSS_CLASSES.AUTO_FILL_CONTAINER;
    this.element.classList.add(state);

    const icon = this.element.querySelector('.icon') as HTMLElement;
    const text = this.element.querySelector('.text') as HTMLElement;

    switch (state) {
      case 'idle':
        icon.textContent = '✨';
        text.textContent = 'Auto Fill';
        break;
      case 'loading':
        icon.textContent = '⏳';
        break;
      case 'success':
        icon.textContent = '✓';
        text.textContent = 'Done!';
        break;
      case 'error':
        icon.textContent = '✕';
        text.textContent = 'Error';
        break;
    }
  }

  getElement(): HTMLButtonElement {
    return this.element;
  }

  mount(container: HTMLElement): void {
    container.appendChild(this.element);
  }

  unmount(): void {
    this.element.remove();
  }
}
