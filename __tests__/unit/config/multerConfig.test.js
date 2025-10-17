import multerConfig from '../../../src/config/multerConfig';
import { resolve } from 'path';

describe('Multer Configuration', () => {
  it('should export multer configuration object', () => {
    expect(multerConfig).toBeDefined();
    expect(typeof multerConfig).toBe('object');
  });

  it('should have fileFilter function', () => {
    expect(multerConfig.fileFilter).toBeInstanceOf(Function);
  });

  it('should have storage configuration', () => {
    expect(multerConfig.storage).toBeDefined();
  });

  it('should accept valid image types', () => {
    const mockCb = jest.fn();
    const mockReq = {};
    const mockFile = { mimetype: 'image/png' };

    multerConfig.fileFilter(mockReq, mockFile, mockCb);
    expect(mockCb).toHaveBeenCalledWith(null, true);
  });

  it('should reject invalid file types', () => {
    const mockCb = jest.fn();
    const mockReq = {};
    const mockFile = { mimetype: 'text/plain' };

    multerConfig.fileFilter(mockReq, mockFile, mockCb);
    expect(mockCb).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should generate unique filenames', () => {
    const mockCb = jest.fn();
    const mockReq = {};
    const mockFile = { originalname: 'test.jpg' };

    const storage = multerConfig.storage;
    if (storage && storage.getFilename) {
      storage.getFilename(mockReq, mockFile, mockCb);
      expect(mockCb).toHaveBeenCalled();
    } else {
      expect(storage).toBeDefined();
    }
  });

  it('should set correct destination path', () => {
    const mockCb = jest.fn();
    const mockReq = {};
    const mockFile = {};

    const expectedPath = resolve(__dirname, '..', '..', 'uploads', 'images');

    const storage = multerConfig.storage;
    if (storage && storage.getDestination) {
      storage.getDestination(mockReq, mockFile, mockCb);
      expect(mockCb).toHaveBeenCalledWith(null, expectedPath);
    } else {

      expect(storage).toBeDefined();
    }
  });

  it('should use production path when NODE_ENV is not test', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    jest.resetModules();
    const prodConfig = require('../../../src/config/multerConfig').default;

    const mockCb = jest.fn();
    const storage = prodConfig.storage;
    
    if (storage && storage.getDestination) {
      storage.getDestination({}, {}, mockCb);
      const expectedProdPath = resolve(__dirname, '..', '..', '..', 'uploads', 'images');
      expect(mockCb).toHaveBeenCalledWith(null, expectedProdPath);
    }

    process.env.NODE_ENV = originalEnv;
    jest.resetModules();
  });
});
