export enum ErrorType {
  DOM_NOT_FOUND = 'DOM_NOT_FOUND',
  PARSING_FAILED = 'PARSING_FAILED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SELECTOR_INVALID = 'SELECTOR_INVALID',
}

export class ExtensionError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public recoverable: boolean = true,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'ExtensionError';
  }
}

export class ErrorHandler {
  private static enabled: boolean = true;

  static setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  static handle(error: ExtensionError): void {
    if (!this.enabled) return;

    console.error(`[${error.type}]`, error.message, error.context || '');
  }

  static handleUnknown(error: unknown): ExtensionError | null {
    if (!this.enabled) return null;

    if (error instanceof ExtensionError) {
      this.handle(error);
      return error;
    }

    if (error instanceof Error) {
      const extensionError = new ExtensionError(
        ErrorType.PARSING_FAILED,
        error.message,
        true,
        { originalError: error.name }
      );
      this.handle(extensionError);
      return extensionError;
    }

    console.error('[UNKNOWN_ERROR]', error);
    return null;
  }

  static create(type: ErrorType, message: string, context?: Record<string, any>): ExtensionError {
    return new ExtensionError(type, message, true, context);
  }
}
