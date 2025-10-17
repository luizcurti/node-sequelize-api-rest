describe('Database Connection', () => {
  it('should import database configuration', () => {
    const db = require('../../src/database');
    expect(db).toBeDefined();
  });

  it('should initialize models', () => {
    // This test covers the database/index.js initialization
    expect(() => {
      require('../../src/database');
    }).not.toThrow();
  });
});