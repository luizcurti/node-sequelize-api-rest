import { Request, Response } from 'express';
import { authService } from '../container';

class TokenController {
  async store(req: Request, res: Response): Promise<void> {
    const { email = '', password = '' } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  }
}

export default new TokenController();
