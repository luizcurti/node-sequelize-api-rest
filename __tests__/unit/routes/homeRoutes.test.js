import homeRoutes from '../../../src/routes/homeRoutes';

describe('Home Routes', () => {
  describe('Route Configuration', () => {
    it('should be properly configured as Express router', () => {
      expect(homeRoutes).toBeDefined();
      expect(typeof homeRoutes).toBe('function');
      expect(homeRoutes.stack).toBeDefined();
    });

    it('should have correct route path', () => {
      const routes = homeRoutes.stack.map(layer => ({
        path: layer.route?.path,
        methods: layer.route?.methods,
      }));

      expect(routes).toContainEqual({
        path: '/',
        methods: { get: true },
      });
    });
  });
});

