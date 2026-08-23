import { NextFunction, Request, Response } from 'express';
import { authService } from '../container';

export default async function loginRequired(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const { userId, userEmail } = await authService.authenticate(req.headers.authorization);

  req.userId = userId;
  req.userEmail = userEmail;
  next();
}
