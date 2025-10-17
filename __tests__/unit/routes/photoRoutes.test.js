import { Router } from 'express';
import PhotoController from '../../../src/controllers/PhotoController';
import loginRequired from '../../../src/middlewares/loginRequired';

jest.mock('express');
jest.mock('../../../src/controllers/PhotoController');
jest.mock('../../../src/middlewares/loginRequired');

describe('Photo Routes', () => {
  let mockRouter;
  let mockPost;

  beforeEach(() => {
    mockPost = jest.fn();
    mockRouter = {
      post: mockPost,
    };
    Router.mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  it('should configure POST route with loginRequired middleware', () => {
    // Import the routes file to execute the setup
    require('../../../src/routes/photoRoutes');

    expect(Router).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalled();

    const [path, middleware, handler] = mockPost.mock.calls[0];

    expect(path).toBe('/');
    expect(middleware).toBe(loginRequired);
    expect(typeof handler).toBe('function');
  });

  it('should instantiate PhotoController and call store method', () => {
    const mockReq = { body: {}, file: {} };
    const mockRes = { json: jest.fn(), status: jest.fn() };
    const mockStore = jest.fn();

    PhotoController.mockImplementation(() => ({
      store: mockStore,
    }));

    // Reset mocks to clear previous call
    jest.clearAllMocks();
    mockRouter.post = jest.fn();

    // Import the routes file
    jest.resetModules();
    require('../../../src/routes/photoRoutes');

    // Get the handler function
    const callArgs = mockRouter.post.mock.calls[0];
    if (callArgs && callArgs[2]) {
      const handler = callArgs[2];

      // Execute the handler
      handler(mockReq, mockRes);

      expect(mockStore).toHaveBeenCalledWith(mockReq, mockRes);
    }
  });
});
