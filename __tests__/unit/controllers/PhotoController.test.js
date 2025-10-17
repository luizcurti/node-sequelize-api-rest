import PhotoController from '../../../src/controllers/PhotoController';
import Photo from '../../../src/models/Photo';
import multer from 'multer';

// Mock models
jest.mock('../../../src/models/Photo');

// Mock multer
jest.mock('multer');

// Mock multerConfig
jest.mock('../../../src/config/multerConfig', () => ({
  storage: {},
  limits: { fileSize: 2 * 1024 * 1024 },
}));

describe('PhotoController', () => {
  let req, res, controller;

  beforeEach(() => {
    controller = new PhotoController();
    req = {
      body: {},
      file: null,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('store', () => {
    it('should upload photo successfully', async () => {
      const mockFile = {
        originalname: 'test-photo.jpg',
        filename: 'unique-filename.jpg',
      };
      
      req.file = mockFile;
      req.body = { student_id: '1' };

      const mockPhoto = {
        id: 1,
        originalname: mockFile.originalname,
        filename: mockFile.filename,
        student_id: '1',
      };

      Photo.create.mockResolvedValue(mockPhoto);

      // Mock multer middleware
      const mockSingle = jest.fn((fieldName) => {
        return jest.fn((req, res, callback) => {
          // Simulate successful upload
          callback(null);
        });
      });

      multer.mockReturnValue({
        single: mockSingle,
      });

      await controller.store(req, res);

      expect(Photo.create).toHaveBeenCalledWith({
        originalname: mockFile.originalname,
        filename: mockFile.filename,
        student_id: '1',
      });
      expect(res.json).toHaveBeenCalledWith(mockPhoto);
    });

    it('should handle multer upload errors', async () => {
      const uploadError = new Error('File too large');
      uploadError.code = 'LIMIT_FILE_SIZE';

      // Mock multer middleware to simulate error
      const mockSingle = jest.fn((fieldName) => {
        return jest.fn((req, res, callback) => {
          callback(uploadError);
        });
      });

      multer.mockReturnValue({
        single: mockSingle,
      });

      await controller.store(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [uploadError.code],
      });
    });

    it('should handle database errors (student does not exist)', async () => {
      const mockFile = {
        originalname: 'test-photo.jpg',
        filename: 'unique-filename.jpg',
      };
      
      req.file = mockFile;
      req.body = { student_id: '999' }; // Non-existent student

      Photo.create.mockRejectedValue(new Error('Database constraint violation'));

      // Mock multer middleware for successful upload
      const mockSingle = jest.fn((fieldName) => {
        return jest.fn((req, res, callback) => {
          callback(null);
        });
      });

      multer.mockReturnValue({
        single: mockSingle,
      });

      await controller.store(req, res);

      expect(Photo.create).toHaveBeenCalledWith({
        originalname: mockFile.originalname,
        filename: mockFile.filename,
        student_id: '999',
      });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Student does not exist'],
      });
    });

    it('should handle missing file case', async () => {
      req.file = null; // No file uploaded
      req.body = { student_id: '1' };

      // Mock multer middleware for successful processing but no file
      const mockSingle = jest.fn((fieldName) => {
        return jest.fn((req, res, callback) => {
          callback(null);
        });
      });

      multer.mockReturnValue({
        single: mockSingle,
      });

      // This will cause an error when trying to destructure req.file
      await controller.store(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: ['Student does not exist'],
      });
    });
  });
});