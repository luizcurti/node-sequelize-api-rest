import Photo from '../../models/Photo';

export interface CreatePhotoData {
  originalname: string;
  filename: string;
  student_id: number;
}

export interface PhotoRepository {
  create(data: CreatePhotoData): Promise<Photo>;
}
