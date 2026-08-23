import {
  Association,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import Photo from './Photo';

export default class Student extends Model<InferAttributes<Student, { omit: 'Photos' }>, InferCreationAttributes<Student, { omit: 'Photos' }>> {
  declare id: CreationOptional<number>;

  declare name: string;

  declare lastname: string;

  declare email: string;

  declare age: number;

  declare weight: number;

  declare height: number;

  declare Photos?: Photo[];

  declare static associations: {
    Photos: Association<Student, Photo>;
  };

  static initModel(sequelize: Sequelize): typeof Student {
    Student.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'Name must be between 3 and 255 characters.',
          },
        },
      },
      lastname: {
        type: DataTypes.STRING,
        defaultValue: '',
        validate: {
          len: {
            args: [3, 255],
            msg: 'Last name must be between 3 and 255 characters long.',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        defaultValue: '',
        unique: {
          name: 'email',
          msg: 'Email already exists',
        },
        validate: {
          isEmail: {
            msg: 'Invalid email',
          },
        },
      },
      age: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: {
            msg: 'Age must be an integer',
          },
        },
      },
      weight: {
        type: DataTypes.FLOAT,
        validate: {
          isFloat: {
            msg: 'Weight must be an integer or floating point number',
          },
        },
      },
      height: {
        type: DataTypes.FLOAT,
        validate: {
          isFloat: {
            msg: 'Height must be an integer or floating point number',
          },
        },
      },
    }, {
      sequelize,
    });

    return Student;
  }

  static associate(models: { Photo: typeof Photo }): void {
    Student.hasMany(models.Photo, { foreignKey: 'student_id', as: 'Photos' });
  }
}
