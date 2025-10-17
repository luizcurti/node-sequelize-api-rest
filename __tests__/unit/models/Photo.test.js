import Photo from '../../../src/models/Photo';
import { Model } from 'sequelize';

describe('Photo Model', () => {
  let mockSequelize, mockModels;

  beforeEach(() => {
    mockSequelize = {
      define: jest.fn(() => Photo),
      models: {},
    };
    mockModels = {
      Student: {
        belongsTo: jest.fn(),
      },
    };

    jest.clearAllMocks();
  });

  describe('Model Definition', () => {
    it('should define model with correct attributes', () => {
      const mockInit = jest.spyOn(Model, 'init').mockImplementation(() => Photo);

      Photo.init(mockSequelize);

      expect(mockInit).toHaveBeenCalled();
      const [attributes, options] = mockInit.mock.calls[0];

      expect(attributes).toHaveProperty('originalname');
      expect(attributes).toHaveProperty('filename');
      expect(attributes).toHaveProperty('url');
      expect(options).toEqual({ sequelize: mockSequelize, tableName: 'photos' });

      mockInit.mockRestore();
    });
  });

  describe('Associations', () => {
    it('should define belongsTo association with Student model', () => {
      const mockBelongsTo = jest.spyOn(Photo, 'belongsTo').mockImplementation(() => {});

      Photo.associate(mockModels);

      expect(mockBelongsTo).toHaveBeenCalledWith(mockModels.Student, {
        foreignKey: 'student_id',
      });

      mockBelongsTo.mockRestore();
    });

    it('should handle missing models gracefully', () => {
      const mockBelongsTo = jest.spyOn(Photo, 'belongsTo').mockImplementation(() => {});

      expect(() => Photo.associate({})).not.toThrow();

      mockBelongsTo.mockRestore();
    });
  });

  describe('Virtual URL Field', () => {
    it('should have url field defined in model attributes', () => {
      const mockInit = jest.spyOn(Model, 'init').mockImplementation(() => Photo);

      Photo.init(mockSequelize);

      expect(mockInit).toHaveBeenCalled();
      const [attributes] = mockInit.mock.calls[0];

      expect(attributes).toHaveProperty('url');
      expect(attributes.url).toHaveProperty('type');
      expect(attributes.url).toHaveProperty('get');
      expect(typeof attributes.url.get).toBe('function');

      const mockThis = {
        getDataValue: jest.fn((key) => {
          if (key === 'filename') return 'test-photo.jpg';
          return null;
        }),
      };

      const urlGetter = attributes.url.get;
      const url = urlGetter.call(mockThis);

      expect(url).toContain('/images/test-photo.jpg');
      expect(url).toMatch(/https?:\/\/.+\/images\/test-photo\.jpg/);
      expect(mockThis.getDataValue).toHaveBeenCalledWith('filename');

      mockInit.mockRestore();
    });
  });
});




