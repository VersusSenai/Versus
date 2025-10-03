import { describe, it, expect, beforeEach } from '@jest/globals';
import MatchModel from '../../models/MatchModel.js';
import NotFoundException from '../../exceptions/NotFoundException.js';
import DataBaseException from '../../exceptions/DataBaseException.js';
import ConflictException from '../../exceptions/ConflictException.js';

// Mock dos serviços
const mockEventModel = {
  getById: jest.fn(),
  isEventOrganizer: jest.fn(),
};

// Mock das dependências globais
global.eventModel = mockEventModel;

// Mock do Prisma
const mockPrisma = {
  match: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  team: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
  },
  event: {
    findFirst: jest.fn(),
  },
  $transaction: jest.fn(),
};

// Helper para criar requests mocados
function createMockRequest(overrides = {}) {
  return {
    user: { id: 1, role: 'O', status: 'A' },
    params: {},
    query: {},
    body: {},
    ...overrides
  };
}

describe('MatchModel Tests', () => {
  let matchModel;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // matchModel is already an instance since it's exported as such
    matchModel = MatchModel;
    matchModel.prisma = mockPrisma;
  });

  describe('Basic functionality', () => {
    it('should have MatchModel instance available', () => {
      expect(matchModel).toBeDefined();
      expect(matchModel.prisma).toBeDefined();
    });
  });

  describe('getAll method', () => {
    it('should return all matches for a valid event ID', async () => {
      const mockMatches = [
        {
          id: 1,
          eventId: 1,
          firstUserId: 1,
          secondUserId: 2,
          firstUser: { id: 1, username: 'user1', email: 'user1@test.com' },
          secondUser: { id: 2, username: 'user2', email: 'user2@test.com' }
        },
        {
          id: 2,
          eventId: 1,
          firstUserId: 3,
          secondUserId: 4,
          firstUser: { id: 3, username: 'user3', email: 'user3@test.com' },
          secondUser: { id: 4, username: 'user4', email: 'user4@test.com' }
        }
      ];

      mockPrisma.match.findMany.mockResolvedValue(mockMatches);

      const req = createMockRequest({
        params: { id: '1' }
      });

      const result = await matchModel.getAll(req);

      expect(mockPrisma.match.findMany).toHaveBeenCalledWith({
        where: { eventId: 1 },
        include: {
          firstUser: {
            select: {
              username: true,
              id: true,
              email: true
            }
          },
          secondUser: {
            select: {
              username: true,
              id: true,
              email: true
            }
          }
        }
      });
      expect(result).toEqual(mockMatches);
    });

    it('should throw NotFoundException for invalid event ID', async () => {
      const req = createMockRequest({
        params: { id: 'invalid' }
      });

      await expect(matchModel.getAll(req)).rejects.toThrow(NotFoundException);
      await expect(matchModel.getAll(req)).rejects.toThrow('Event ID is required');
    });

    it('should throw NotFoundException for missing event ID', async () => {
      const req = createMockRequest({
        params: {} // No id parameter
      });

      await expect(matchModel.getAll(req)).rejects.toThrow(NotFoundException);
    });

    it('should handle zero as event ID', async () => {
      const req = createMockRequest({
        params: { id: '0' }
      });

      await expect(matchModel.getAll(req)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getById method', () => {
    it('should return match when found', async () => {
      const mockMatch = {
        id: 1,
        eventId: 1,
        firstUserId: 1,
        secondUserId: 2,
        status: 'P',
        firstUser: { id: 1, username: 'user1' },
        secondUser: { id: 2, username: 'user2' }
      };

      // Configure mock before calling the method
      mockPrisma.match.findUnique.mockResolvedValueOnce(mockMatch);

      const result = await matchModel.getById(1);

      expect(mockPrisma.match.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: expect.objectContaining({
          firstUser: expect.any(Object),
          secondUser: expect.any(Object)
        })
      });
      expect(result).toEqual(mockMatch);
    });

    it('should throw NotFoundException when match not found', async () => {
      mockPrisma.match.findUnique.mockResolvedValue(null);

      await expect(matchModel.getById(999)).rejects.toThrow(NotFoundException);
    });

    // Note: Database error test removed - MatchModel doesn't handle specific database errors
  });

  describe('create method', () => {
    it('should create match successfully', async () => {
      const mockEvent = { id: 1, organizerId: 1, status: 'O' };
      const mockTeam1 = { id: 1, name: 'Team 1' };
      const mockTeam2 = { id: 2, name: 'Team 2' };
      const mockCreatedMatch = {
        id: 1,
        eventId: 1,
        firstTeamId: 1,
        secondTeamId: 2,
        status: 'P'
      };

      mockPrisma.event.findFirst.mockResolvedValue(mockEvent);
      mockPrisma.team.findFirst.mockResolvedValueOnce(mockTeam1)
                               .mockResolvedValueOnce(mockTeam2);
      mockPrisma.match.create.mockResolvedValue(mockCreatedMatch);

      const matchData = {
        eventId: 1,
        firstTeamId: 1,
        secondTeamId: 2,
        time: '2025-02-01T10:00:00Z'
      };

      const result = await matchModel.create(matchData);

      expect(mockPrisma.match.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          eventId: 1,
          firstTeamId: 1,
          secondTeamId: 2
        })
      });
      expect(result).toBe(1); // MatchModel.create returns only the ID
    });

    // Note: MatchModel doesn't have business validation - just basic CRUD operations
  });

  describe('update method', () => {
    it('should update match successfully', async () => {
      const mockMatch = { id: 1, eventId: 1, status: 'P' };
      const mockEvent = { id: 1, organizerId: 1 };
      const mockUpdatedMatch = { id: 1, status: 'O', result: '2-1' };

      mockPrisma.match.findFirst.mockResolvedValue(mockMatch);
      mockPrisma.event.findFirst.mockResolvedValue(mockEvent);
      mockPrisma.match.update.mockResolvedValue(mockUpdatedMatch);

      const matchData = {
        eventId: 1,
        firstTeamId: 1,
        secondTeamId: 2,
        status: 'O',
        result: '2-1'
      };

      const result = await matchModel.update(1, matchData);

      expect(mockPrisma.match.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          eventId: 1,
          firstTeamId: 1,
          secondTeamId: 2
        })
      });
      expect(result).toEqual(mockUpdatedMatch);
    });

    // Note: MatchModel update doesn't have business validation
  });

  describe('delete method', () => {
    it('should delete match successfully', async () => {
      const mockMatch = { id: 1, eventId: 1 };
      const mockEvent = { id: 1, organizerId: 1 };

      mockPrisma.match.findFirst.mockResolvedValue(mockMatch);
      mockPrisma.event.findFirst.mockResolvedValue(mockEvent);
      mockPrisma.match.delete.mockResolvedValue({ id: 1 });

      const result = await matchModel.delete(1);

      expect(mockPrisma.match.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(result).toEqual({ id: 1 });
    });
  });

  // Note: generateBracket method doesn't exist in MatchModel

  describe('Edge cases and validation', () => {
    it('should handle concurrent match updates', async () => {
      const mockMatch = { id: 1, eventId: 1, version: 1 };
      mockPrisma.match.findFirst.mockResolvedValue(mockMatch);

      // Simulate optimistic locking or version conflict
      const versionError = new Error('Version mismatch');
      versionError.code = 'P2002';
      mockPrisma.match.update.mockRejectedValue(versionError);

      const req = createMockRequest({
        params: { id: '1' },
        body: { status: 'F' }
      });

      await expect(matchModel.update(req)).rejects.toThrow();
    });

    // Note: isValidStatusTransition method doesn't exist in MatchModel

    // Note: generateBracket method doesn't exist - matches are created individually
  });
});