import { Sequelize } from 'sequelize';
import databaseConfig from '../config/database';
import Student from '../models/Student';
import User from '../models/User';
import Photo from '../models/Photo';

const models = [Student, User, Photo];

const connection = new Sequelize(databaseConfig);

models.forEach((model) => model.initModel(connection));
Student.associate({ Photo });
Photo.associate({ Student });

export default connection;
