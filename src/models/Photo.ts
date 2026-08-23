import {
  Association,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import appConfig from '../config/appConfig';
import Student from './Student';

export default class Photo extends Model<InferAttributes<Photo>, InferCreationAttributes<Photo>> {
  declare id: CreationOptional<number>;

  declare originalname: string;

  declare filename: string;

  declare student_id: CreationOptional<number | null>;

  declare readonly url: CreationOptional<string>;

  declare static associations: {
    Student: Association<Photo, Student>;
  };

  static initModel(sequelize: Sequelize): typeof Photo {
    Photo.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      originalname: {
        type: DataTypes.STRING,
        defaultValue: '',
        validate: {
          notEmpty: {
            msg: 'Field cannot be empty.',
          },
        },
      },
      filename: {
        type: DataTypes.STRING,
        defaultValue: '',
        validate: {
          notEmpty: {
            msg: 'Field cannot be empty.',
          },
        },
      },
      student_id: {
        type: DataTypes.INTEGER,
      },
      url: {
        type: DataTypes.VIRTUAL,
        get(this: Photo) {
          return `${appConfig.url}/images/${this.getDataValue('filename')}`;
        },
      },
    }, {
      sequelize,
      tableName: 'photos',
    });

    return Photo;
  }

  static associate(models: { Student: typeof Student }): void {
    Photo.belongsTo(models.Student, { foreignKey: 'student_id', as: 'Student' });
  }
}
