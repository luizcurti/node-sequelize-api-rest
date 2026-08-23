import { SequelizeUserRepository } from './repositories/SequelizeUserRepository';
import { SequelizeStudentRepository } from './repositories/SequelizeStudentRepository';
import { SequelizePhotoRepository } from './repositories/SequelizePhotoRepository';
import { UserService } from './services/UserService';
import { StudentService } from './services/StudentService';
import { PhotoService } from './services/PhotoService';
import { AuthService } from './services/AuthService';

const userRepository = new SequelizeUserRepository();
const studentRepository = new SequelizeStudentRepository();
const photoRepository = new SequelizePhotoRepository();

export const userService = new UserService(userRepository);
export const studentService = new StudentService(studentRepository);
export const photoService = new PhotoService(photoRepository, studentRepository);
export const authService = new AuthService(userRepository);
