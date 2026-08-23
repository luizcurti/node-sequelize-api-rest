import { Request, Response } from 'express';

class HomeController {
  async index(_req: Request, res: Response): Promise<void> {
    res.json('Index');
  }
}

export default new HomeController();
