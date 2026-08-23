import { Request, Response } from 'express';
import homeController from '../../../src/controllers/HomeController';

function mockResponse(): Response {
  return { json: jest.fn() } as unknown as Response;
}

describe('HomeController', () => {
  it('responds with the index message', async () => {
    const res = mockResponse();

    await homeController.index({} as Request, res);

    expect(res.json).toHaveBeenCalledWith('Index');
  });
});
