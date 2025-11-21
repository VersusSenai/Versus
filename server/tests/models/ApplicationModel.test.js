import { describe, it, expect, beforeEach } from '@jest/globals';
import ApplicationModel from '../../models/ApplicationModel.js';
import DataBaseException from '../../exceptions/DataBaseException.js';
import NotAllowedException from '../../exceptions/NotAllowedException.js';

// Mock do Prisma
const mockPrisma = {
  application: {
    paginate: jest.fn(),
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
  $extends: jest.fn(() => mockPrisma),
};

// Helper para criar requests mocados
function createMockRequest(overrides = {}) {
  return {
    user: { id: 1, role: 'U', status: 'A' },
    params: {},
    query: {},
    body: {},
    ...overrides
  };
}

describe('ApplicationModel Tests', () => {
  let applicationModel;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // applicationModel is already an instance since it's exported as such
    applicationModel = ApplicationModel;
    applicationModel.prisma = mockPrisma;
  });

  describe('Basic functionality', () => {
    it('should have ApplicationModel instance available', () => {
      expect(applicationModel).toBeDefined();
      expect(applicationModel.prisma).toBeDefined();
    });
  });

  describe('getAll method', () => {
    it('should return paginated applications with default parameters', async () => {
      const mockApplications = {
        data: [
          { id: 1, fromUserId: 1, status: 'O', applicationType: 'O' },
          { id: 2, fromUserId: 2, status: 'O', applicationType: 'O' }
        ],
        meta: { total: 2, page: 1, limit: 10 }
      };

      const mockWithPages = jest.fn(() => Promise.resolve(mockApplications));
      mockPrisma.application.paginate.mockReturnValue({
        withPages: mockWithPages
      });

      const req = createMockRequest({
        query: {}
      });

      const result = await applicationModel.getAll(req);

      expect(mockPrisma.application.paginate).toHaveBeenCalledWith({
        where: {
          status: { in: ['O'] }
        }
      });
      expect(mockWithPages).toHaveBeenCalledWith({
        page: 1,
        limit: 10
      });
      expect(result).toEqual(mockApplications);
    });

    it('should handle custom status filter', async () => {
      const mockWithPages = jest.fn(() => Promise.resolve({ data: [], meta: {} }));
      mockPrisma.application.paginate.mockReturnValue({
        withPages: mockWithPages
      });

      const req = createMockRequest({
        query: {
          status: ['P', 'A', 'R']
        }
      });

      await applicationModel.getAll(req);

      expect(mockPrisma.application.paginate).toHaveBeenCalledWith({
        where: {
          status: { in: ['P', 'A', 'R'] }
        }
      });
    });

    it('should handle pagination parameters', async () => {
      const mockWithPages = jest.fn(() => Promise.resolve({ data: [], meta: {} }));
      mockPrisma.application.paginate.mockReturnValue({
        withPages: mockWithPages
      });

      const req = createMockRequest({
        query: {
          page: '2',
          limit: '5'
        }
      });

      await applicationModel.getAll(req);

      expect(mockWithPages).toHaveBeenCalledWith({
        page: 2,
        limit: 5
      });
    });

    it('should throw DataBaseException on database error', async () => {
      const dbError = new Error('Database connection failed');
      mockPrisma.application.paginate.mockReturnValue({
        withPages: jest.fn(() => Promise.reject(dbError))
      });

      const req = createMockRequest({
        query: {}
      });

      await expect(applicationModel.getAll(req)).rejects.toThrow(DataBaseException);
      await expect(applicationModel.getAll(req)).rejects.toThrow('Internal Server Error');
    });
  });

  describe('create method', () => {
    it('should create application successfully', async () => {
      const mockCreatedApplication = {
        id: 1,
        fromUserId: 1,
        applicationType: 'O',
        Description: 'I want to be an organizer',
        status: 'P'
      };

      mockPrisma.application.create.mockResolvedValue(mockCreatedApplication);

      const req = createMockRequest({
        user: { id: 1 },
        body: {
          description: 'I want to be an organizer'
        }
      });

      const result = await applicationModel.create(req);

      expect(mockPrisma.application.create).toHaveBeenCalledWith({
        data: {
          fromUserId: 1,
          applicationType: 'O',
          Description: 'I want to be an organizer'
        }
      });
      expect(result).toEqual(mockCreatedApplication);
    });

    it('should throw DataBaseException on database error', async () => {
      const dbError = new Error('Database constraint violation');
      mockPrisma.application.create.mockRejectedValue(dbError);

      const req = createMockRequest({
        user: { id: 1 },
        body: {
          description: 'Test description'
        }
      });

      await expect(applicationModel.create(req)).rejects.toThrow(DataBaseException);
      await expect(applicationModel.create(req)).rejects.toThrow('Internal Server Error');
    });

    it('should handle missing description', async () => {
      mockPrisma.application.create.mockResolvedValue({ id: 1, Description: undefined });

      const req = createMockRequest({
        user: { id: 1 },
        body: {} // No description
      });

      const result = await applicationModel.create(req);

      expect(mockPrisma.application.create).toHaveBeenCalledWith({
        data: {
          fromUserId: 1,
          applicationType: 'O',
          Description: undefined
        }
      });
      expect(result).toBeDefined();
    });
  });

  describe('Edge cases and validation', () => {
    it('should handle invalid page numbers gracefully', async () => {
      const mockWithPages = jest.fn(() => Promise.resolve({ data: [], meta: {} }));
      mockPrisma.application.paginate.mockReturnValue({
        withPages: mockWithPages
      });

      const req = createMockRequest({
        query: {
          page: 'invalid',
          limit: 'also_invalid'
        }
      });

      await applicationModel.getAll(req);

      // Should default to page 1, limit 10 when parsing fails
      expect(mockWithPages).toHaveBeenCalledWith({
        page: 1,
        limit: 10
      });
    });

    it('should handle zero and negative page numbers', async () => {
      const mockWithPages = jest.fn(() => Promise.resolve({ data: [], meta: {} }));
      mockPrisma.application.paginate.mockReturnValue({
        withPages: mockWithPages
      });

      const req = createMockRequest({
        query: {
          page: '0',
          limit: '-5'
        }
      });

      await applicationModel.getAll(req);

      // parseInt('0') returns 0 (falsy), parseInt('-5') returns -5
      // ApplicationModel doesn't validate negative numbers, just falsy values
      expect(mockWithPages).toHaveBeenCalledWith({
        page: 1, // 0 is falsy, so defaults to 1
        limit: -5 // -5 is truthy, so it's used as-is
      });
    });

    it('should handle null status query parameter', async () => {
      const mockWithPages = jest.fn(() => Promise.resolve({ data: [], meta: {} }));
      mockPrisma.application.paginate.mockReturnValue({
        withPages: mockWithPages
      });

      const req = createMockRequest({
        query: {
          status: null
        }
      });

      await applicationModel.getAll(req);

      expect(mockPrisma.application.paginate).toHaveBeenCalledWith({
        where: {
          status: { in: ['O'] }
        }
      });
    });

    it('should handle empty status array', async () => {
      const mockWithPages = jest.fn(() => Promise.resolve({ data: [], meta: {} }));
      mockPrisma.application.paginate.mockReturnValue({
        withPages: mockWithPages
      });

      const req = createMockRequest({
        query: {
          status: []
        }
      });

      await applicationModel.getAll(req);

      expect(mockPrisma.application.paginate).toHaveBeenCalledWith({
        where: {
          status: { in: [] }
        }
      });
    });

    it('should handle different application types', () => {
      // This test verifies the hardcoded 'O' type
      // In a real scenario, this might be configurable
      const req = createMockRequest({
        user: { id: 1 },
        body: { description: 'Test' }
      });

      applicationModel.create(req);

      expect(mockPrisma.application.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          applicationType: 'O'
        })
      });
    });
  });

  describe('Database interaction patterns', () => {
    it('should use pagination extension correctly', () => {
      expect(applicationModel.prisma).toBeDefined();
      // Verify that $extends was called during construction
      expect(mockPrisma.$extends).toHaveBeenCalled();
    });

    it('should handle concurrent applications', async () => {
      // Test concurrent creation scenarios
      const promises = [];
      
      for (let i = 0; i < 3; i++) {
        mockPrisma.application.create.mockResolvedValueOnce({ id: i + 1 });
        
        const req = createMockRequest({
          user: { id: i + 1 },
          body: { description: `Application ${i + 1}` }
        });
        
        promises.push(applicationModel.create(req));
      }

      const results = await Promise.all(promises);
      
      expect(results).toHaveLength(3);
      expect(mockPrisma.application.create).toHaveBeenCalledTimes(3);
    });
  });
});