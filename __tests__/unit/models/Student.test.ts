import { Sequelize } from 'sequelize';
import Photo from '../../../src/models/Photo';
import Student from '../../../src/models/Student';

describe('Student model', () => {
  const sequelize = new Sequelize({ dialect: 'mysql', logging: false });

  beforeAll(() => {
    Photo.initModel(sequelize);
    Student.initModel(sequelize);
    Student.associate({ Photo });
    Photo.associate({ Student });
  });

  it('defines the expected attributes', () => {
    expect(Object.keys(Student.getAttributes())).toEqual(
      expect.arrayContaining(['id', 'name', 'lastname', 'email', 'age', 'weight', 'height']),
    );
  });

  it('has many photos, exposed as "Photos"', () => {
    expect(Student.associations.Photos).toBeDefined();
    expect(Student.associations.Photos.target).toBe(Photo);
  });
});
