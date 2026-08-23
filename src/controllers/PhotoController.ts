import { Request, Response } from 'express';
import multer from 'multer';
import multerConfig from '../config/multerConfig';
import { ValidationAppError } from '../errors/ValidationAppError';
import { photoService } from '../container';

const upload = multer(multerConfig).single('photo');

function runUpload(req: Request, res: Response): Promise<void> {
  return new Promise((resolve, reject) => {
    upload(req, res, (err: unknown) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

class PhotoController {
  async store(req: Request, res: Response): Promise<void> {
    await runUpload(req, res);

    if (!req.file) {
      throw new ValidationAppError(['Photo file is required.']);
    }

    const photo = await photoService.createPhoto(Number(req.body.student_id), req.file);
    res.json(photo);
  }
}

export default new PhotoController();
