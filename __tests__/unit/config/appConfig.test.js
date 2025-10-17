import appConfig from '../../../src/config/appConfig';

describe('App Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('URL Configuration', () => {
    it('should export url from environment variable', () => {
      process.env.APP_URL = 'http://localhost:3000';
      
      // Re-import to get fresh config with new env
      jest.isolateModules(() => {
        const config = require('../../../src/config/appConfig').default;
        expect(config.url).toBe('http://localhost:3000');
      });
    });

    it('should handle undefined APP_URL', () => {
      delete process.env.APP_URL;
      
      jest.isolateModules(() => {
        const config = require('../../../src/config/appConfig').default;
        expect(config.url).toBeUndefined();
      });
    });

    it('should have correct structure', () => {
      expect(appConfig).toHaveProperty('url');
      expect(typeof appConfig).toBe('object');
    });
  });

  describe('Configuration Export', () => {
    it('should export default configuration object', () => {
      expect(appConfig).toBeDefined();
      expect(typeof appConfig).toBe('object');
    });

    it('should be a simple configuration object', () => {
      const keys = Object.keys(appConfig);
      expect(keys).toContain('url');
      expect(keys.length).toBe(1);
    });
  });
});