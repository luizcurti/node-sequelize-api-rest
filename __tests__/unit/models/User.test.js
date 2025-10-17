import User from '../../../src/models/User';

describe('User Model', () => {
  it('should be defined', () => {
    expect(User).toBeDefined();
    expect(typeof User.init).toBe('function');
    expect(typeof User.associate).toBe('undefined'); // User has no associations
  });

  it('should have passwordIsValid method', () => {
    expect(typeof User.prototype.passwordIsValid).toBe('function');
  });
});





