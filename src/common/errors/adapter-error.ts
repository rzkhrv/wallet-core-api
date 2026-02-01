/**
 * Represents a normalized adapter error with optional details.
 */
export class AdapterError extends Error {
  readonly code: string;
  readonly details?: unknown;

  /**
   * Creates a new adapter error.
   * @param code Error code identifier.
   * @param message Human-readable message.
   * @param details Optional error details.
   */
  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.code = code;
    this.details = details;
  }
}
