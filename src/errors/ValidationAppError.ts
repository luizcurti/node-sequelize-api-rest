import { AppError } from './AppError';

export class ValidationAppError extends AppError {
  constructor(details: string[]) {
    super(details[0] ?? 'Validation error', 400, details);
  }
}
