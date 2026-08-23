import { ErrorRequestHandler } from 'express';
import multer from 'multer';
import { ValidationError as SequelizeValidationError } from 'sequelize';
import { AppError } from '../errors/AppError';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ errors: err.details });
    return;
  }

  if (err instanceof SequelizeValidationError) {
    res.status(400).json({ errors: err.errors.map((validationErrorItem) => validationErrorItem.message) });
    return;
  }

  if (err instanceof multer.MulterError) {
    res.status(400).json({ errors: [err.message] });
    return;
  }

  console.error(err);
  res.status(500).json({ errors: ['Internal server error'] });
};

export default errorHandler;
