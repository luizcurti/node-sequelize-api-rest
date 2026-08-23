jest.mock('multer', () => {
  const single = jest.fn(() => (_req: unknown, _res: unknown, callback: (error?: unknown) => void) => callback());
  return { __esModule: true, default: jest.fn(() => ({ single })) };
});

jest.mock('../../../src/config/multerConfig', () => ({ __esModule: true, default: {} }));

jest.mock('../../../src/container', () => ({
  photoService: { createPhoto: jest.fn() },
}));

import { Request, Response } from 'express';
import Photo from '../../../src/models/Photo';
import photoController from '../../../src/controllers/PhotoController';
import { photoService } from '../../../src/container';
import { PhotoService } from '../../../src/services/PhotoService';

const mockedPhotoService = photoService as jest.Mocked<PhotoService>;

function mockResponse(): Response {
  return { json: jest.fn() } as unknown as Response;
}

describe('PhotoController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a photo for the given student when a file is present', async () => {
    const res = mockResponse();
    const file = { originalname: 'photo.png', filename: 'stored.png' };
    const photo = { id: 1, ...file } as unknown as Photo;
    mockedPhotoService.createPhoto.mockResolvedValue(photo);

    const req = { body: { student_id: '5' }, file } as unknown as Request;

    await photoController.store(req, res);

    expect(mockedPhotoService.createPhoto).toHaveBeenCalledWith(5, file);
    expect(res.json).toHaveBeenCalledWith(photo);
  });

  it('throws a validation error when no file was uploaded, without calling the service', async () => {
    const res = mockResponse();
    const req = { body: { student_id: '5' }, file: undefined } as unknown as Request;

    await expect(photoController.store(req, res)).rejects.toThrow('Photo file is required.');
    expect(mockedPhotoService.createPhoto).not.toHaveBeenCalled();
  });
});
