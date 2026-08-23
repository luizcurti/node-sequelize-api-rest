export class AppError extends Error {
  readonly statusCode: number;

  readonly details: string[];

  constructor(message: string, statusCode: number, details: string[] = [message]) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}
