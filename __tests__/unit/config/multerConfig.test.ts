import { resolve } from 'path';
import multerConfig, { photoDestination, photoFilename } from '../../../src/config/multerConfig';

describe('multerConfig', () => {
  describe('fileFilter', () => {
    it('accepts PNG and JPEG files', () => {
      const cb = jest.fn();

      multerConfig.fileFilter?.({} as never, { mimetype: 'image/png' } as never, cb);
      expect(cb).toHaveBeenCalledWith(null, true);

      cb.mockClear();
      multerConfig.fileFilter?.({} as never, { mimetype: 'image/jpeg' } as never, cb);
      expect(cb).toHaveBeenCalledWith(null, true);
    });

    it('rejects any other mime type with a validation error', () => {
      const cb = jest.fn();

      multerConfig.fileFilter?.({} as never, { mimetype: 'text/plain' } as never, cb);

      expect(cb).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('photoDestination', () => {
    it('uses the test uploads directory when NODE_ENV is test', () => {
      expect(photoDestination()).toBe(resolve(process.cwd(), '__tests__', 'uploads', 'images'));
    });

    it('uses the production uploads directory otherwise', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      try {
        expect(photoDestination()).toBe(resolve(process.cwd(), 'uploads', 'images'));
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });
  });

  describe('photoFilename', () => {
    it('generates a unique name preserving the original extension', () => {
      expect(photoFilename('photo.PNG')).toMatch(/^\d+_[0-9a-f]{16}\.PNG$/);
    });

    it('generates a different name on each call', () => {
      expect(photoFilename('a.jpg')).not.toBe(photoFilename('a.jpg'));
    });
  });
});
