import { getConfig } from './config';

export interface DOMSelectors {
  descriptionArea: string;
  descriptionContainer: string;
  titleInput?: string;
  locationInput?: string;
}

const DEFAULT_SELECTORS: DOMSelectors = {
  descriptionArea: '#xDescIn .editable',
  descriptionContainer: '#xDescIn',
  titleInput: '[aria-label*="title"], [placeholder*="title"]',
  locationInput: '[aria-label*="location"]',
};

export class DOMSelectorManager {
  private selectors: DOMSelectors;
  private validationTimeout: number | null = null;

  constructor() {
    this.selectors = { ...DEFAULT_SELECTORS };
  }

  getSelectors(): DOMSelectors {
    return { ...this.selectors };
  }

  updateSelectors(updates: Partial<DOMSelectors>): void {
    this.selectors = { ...this.selectors, ...updates };
  }

  findElement(selector: string, parent: ParentNode = document): Element | null {
    try {
      return parent.querySelector(selector);
    } catch {
      return null;
    }
  }

  findElements(selector: string, parent: ParentNode = document): NodeListOf<Element> {
    try {
      return parent.querySelectorAll(selector);
    } catch {
      return document.querySelectorAll('[data-nonexistent]');
    }
  }

  waitForElement(selector: string, parent: ParentNode = document): Promise<Element | null> {
    return new Promise((resolve) => {
      const element = this.findElement(selector, parent);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const found = this.findElement(selector, parent);
        if (found) {
          observer.disconnect();
          resolve(found);
        }
      });

      observer.observe(parent, {
        childList: true,
        subtree: true,
      });

      const timeout = getConfig().selectors.observerTimeout;
      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeout);
    });
  }

  startValidation(): void {
    const interval = getConfig().selectors.validationInterval;

    this.validationTimeout = window.setInterval(() => {
      this.validateSelectors();
    }, interval);
  }

  stopValidation(): void {
    if (this.validationTimeout) {
      clearInterval(this.validationTimeout);
      this.validationTimeout = null;
    }
  }

  private validateSelectors(): void {
    const selectors = this.getSelectors();

    for (const [key, selector] of Object.entries(selectors)) {
      if (!selector) continue;

      const element = this.findElement(selector);
      if (!element) {
        console.warn(`[DOMSelector] Selector validation failed for ${key}: ${selector}`);
      }
    }
  }

  destroy(): void {
    this.stopValidation();
  }
}

export const domSelectorManager = new DOMSelectorManager();
