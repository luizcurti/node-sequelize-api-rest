import { Request, Response } from 'express';
import User from '../models/User';
import { userService } from '../container';

function toUserResponse(user: User) {
  return { id: user.id, name: user.name, email: user.email };
}

class UserController {
  async store(req: Request, res: Response): Promise<void> {
    const user = await userService.createUser(req.body);
    res.json(toUserResponse(user));
  }

  async index(_req: Request, res: Response): Promise<void> {
    const users = await userService.listUsers();
    res.json(users);
  }

  async show(req: Request, res: Response): Promise<void> {
    const user = await userService.getUser(Number(req.params.id));
    res.json(toUserResponse(user));
  }

  async update(req: Request, res: Response): Promise<void> {
    const user = await userService.updateUser(req.userId as number, req.body);
    res.json(toUserResponse(user));
  }

  async delete(req: Request, res: Response): Promise<void> {
    await userService.deleteUser(req.userId as number);
    res.json({ deleted: true });
  }
}

export default new UserController();
