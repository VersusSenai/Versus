// Mock do util service
export const hashPassword = jest.fn().mockResolvedValue('hashed-password');
export const comparePassword = jest.fn().mockResolvedValue(true);
export const generateToken = jest.fn().mockReturnValue('mock-jwt-token');
export const verifyToken = jest.fn().mockReturnValue({ id: 1, email: 'test@test.com' });

export default {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
};