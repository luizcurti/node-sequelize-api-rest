import multer from 'multer';
import { extname, resolve } from 'path';
import { randomBytes } from 'crypto';

export default {
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
      return cb(new multer.MulterError('File must be PNG or JPG.'));
    }

    return cb(null, true);
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const isTest = process.env.NODE_ENV === 'test';
      const basePath = isTest
        ? resolve(__dirname, '..', '..', '__tests__', 'uploads', 'images')
        : resolve(__dirname, '..', '..', 'uploads', 'images');
      cb(null, basePath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${randomBytes(8).toString('hex')}${extname(file.originalname)}`);
    },
  }),
};
