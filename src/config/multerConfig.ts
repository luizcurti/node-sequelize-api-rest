import multer, { Options } from 'multer';
import { extname, resolve } from 'path';
import { randomBytes } from 'crypto';
import { ValidationAppError } from '../errors/ValidationAppError';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg'];

export function photoDestination(): string {
  const isTest = process.env.NODE_ENV === 'test';
  return isTest
    ? resolve(__dirname, '..', '..', '__tests__', 'uploads', 'images')
    : resolve(__dirname, '..', '..', 'uploads', 'images');
}

export function photoFilename(originalname: string): string {
  return `${Date.now()}_${randomBytes(8).toString('hex')}${extname(originalname)}`;
}

const multerConfig: Options = {
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(new ValidationAppError(['File must be PNG or JPG.']));
      return;
    }

    cb(null, true);
  },
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, photoDestination()),
    filename: (_req, file, cb) => cb(null, photoFilename(file.originalname)),
  }),
};

export default multerConfig;
