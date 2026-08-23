import Photo from '../models/Photo';
import { CreatePhotoData, PhotoRepository } from './interfaces/PhotoRepository';

export class SequelizePhotoRepository implements PhotoRepository {
  create(data: CreatePhotoData): Promise<Photo> {
    return Photo.create(data);
  }
}
