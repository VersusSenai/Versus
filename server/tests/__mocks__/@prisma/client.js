// Mock do PrismaClient
export const mockPrisma = {
  team: {
    paginate: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  teamUsers: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  invite: {
    update: jest.fn(),
    findFirst: jest.fn(),
  },
  $transaction: jest.fn(),
  $extends: jest.fn().mockReturnThis(),
};

export class PrismaClient {
  constructor() {
    return mockPrisma;
  }
}

export default { PrismaClient };