import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import bcryptjs from 'bcryptjs';

export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;

  declare name: string;

  declare email: string;

  declare password_hash: CreationOptional<string>;

  declare password: CreationOptional<string>;

  static initModel(sequelize: Sequelize): typeof User {
    User.init({
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
            msg: 'Name field must be between 3 and 255 characters',
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
      password_hash: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      password: {
        type: DataTypes.VIRTUAL,
        defaultValue: '',
        validate: {
          len: {
            args: [6, 50],
            msg: 'Password must be between 6 and 50 characters',
          },
        },
      },
    }, {
      sequelize,
    });

    User.addHook('beforeSave', async (user: User) => {
      // `password` is virtual, so its value survives on the instance past the save it was
      // set for; without the changed() guard an unrelated update would re-hash stale plaintext.
      if (user.password && user.changed('password')) {
        user.password_hash = await bcryptjs.hash(user.password, 8);
      }
    });

    return User;
  }

  passwordIsValid(password: string): Promise<boolean> {
    return bcryptjs.compare(password, this.password_hash);
  }
}
