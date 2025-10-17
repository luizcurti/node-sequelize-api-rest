import HomeController from '../../../src/controllers/HomeController';

describe('HomeController', () => {
  let req, res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
  });

  describe('index', () => {
    it('should return Index message', async () => {
      await HomeController.index(req, res);

      expect(res.json).toHaveBeenCalledWith('Index');
    });

    it('should be an async function', () => {
      const result = HomeController.index(req, res);
      expect(result).toBeInstanceOf(Promise);
    });
  });
});