import { Request, Response } from 'express';
import { studentService } from '../container';

class StudentController {
  async index(_req: Request, res: Response): Promise<void> {
    const students = await studentService.listStudents();
    res.json(students);
  }

  async store(req: Request, res: Response): Promise<void> {
    const student = await studentService.createStudent(req.body);
    res.json(student);
  }

  async show(req: Request, res: Response): Promise<void> {
    const student = await studentService.getStudent(Number(req.params.id));
    res.json(student);
  }

  async update(req: Request, res: Response): Promise<void> {
    const student = await studentService.updateStudent(Number(req.params.id), req.body);
    res.json(student);
  }

  async delete(req: Request, res: Response): Promise<void> {
    await studentService.deleteStudent(Number(req.params.id));
    res.json({ deleted: true });
  }
}

export default new StudentController();
