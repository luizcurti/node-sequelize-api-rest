import { Sequelize } from 'sequelize';
import appConfig from '../../../src/config/appConfig';
import Photo from '../../../src/models/Photo';
import Student from '../../../src/models/Student';

describe('Photo model', () => {
  const sequelize = new Sequelize({ dialect: 'mysql', logging: false });

  beforeAll(() => {
    Photo.initModel(sequelize);
    Student.initModel(sequelize);
    Student.associate({ Photo });
    Photo.associate({ Student });
  });

  it('defines the expected attributes, including the virtual url getter', () => {
    expect(Object.keys(Photo.getAttributes())).toEqual(
      expect.arrayContaining(['id', 'originalname', 'filename', 'student_id', 'url']),
    );
  });

  it('belongs to a student', () => {
    expect(Photo.associations.Student).toBeDefined();
    expect(Photo.associations.Student.target).toBe(Student);
  });

  it('computes the url from appConfig.url and the filename', () => {
    const photo = Photo.build({ originalname: 'original.png', filename: 'photo.png' });

    expect(photo.url).toBe(`${appConfig.url}/images/photo.png`);
  });
});
