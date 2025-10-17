import Student from '../../../src/models/Student';
import { Model } from 'sequelize';

describe('Student Model', () => {
  let mockSequelize, mockModels;

  beforeEach(() => {
    mockSequelize = {
      define: jest.fn(() => Student),
      models: {},
    };
    mockModels = {
      Photo: {},
    };

    jest.clearAllMocks();
  });

  describe('Model Definition', () => {
    it('should define model with correct attributes', () => {
      const mockInit = jest.spyOn(Model, 'init').mockImplementation(() => Student);

      Student.init(mockSequelize);

      expect(mockInit).toHaveBeenCalled();
      const [attributes, options] = mockInit.mock.calls[0];

      expect(attributes).toHaveProperty('name');
      expect(attributes).toHaveProperty('lastname');
      expect(attributes).toHaveProperty('email');
      expect(attributes).toHaveProperty('age');
      expect(attributes).toHaveProperty('weight');
      expect(attributes).toHaveProperty('height');
      expect(options).toEqual({ sequelize: mockSequelize });

      mockInit.mockRestore();
    });

  });

  describe('Associations', () => {
    it('should define hasMany association with Photo model', () => {
      const mockHasMany = jest.spyOn(Student, 'hasMany').mockImplementation(() => {});

      Student.associate(mockModels);

      expect(mockHasMany).toHaveBeenCalledWith(mockModels.Photo, {
        foreignKey: 'student_id',
      });

      mockHasMany.mockRestore();
    });

    it('should handle missing models gracefully', () => {
      const mockHasMany = jest.spyOn(Student, 'hasMany').mockImplementation(() => {});

      expect(() => Student.associate({})).not.toThrow();

      mockHasMany.mockRestore();
    });
  });

});

