import { describe, it, expect, beforeEach } from '@jest/globals';
import inviteModel from '../../models/inviteModel.js';
import DataBaseException from '../../exceptions/DataBaseException.js';
import jwt from 'jsonwebtoken';

// Mock Prisma
const mockPrisma = {
  invite: {
    create: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  },
};

// Mock MailSender
const mockMailSender = {
  sendMail: jest.fn(),
};

// Mock util service  
const mockUtil = {
  getFullUrl: jest.fn(() => 'http://localhost:8080'),
};

// Mock notification service
const mockNotificationService = {
  sendNotification: jest.fn(),
};



// Helper para criar requests mocados
function createMockRequest(overrides = {}) {
  return {
    user: { id: 1, role: 'O', status: 'A' },
    params: {},
    query: {},
    body: {},
    headers: { host: 'localhost:8080' },
    protocol: 'http',
    get: jest.fn((header) => {
      if (header === 'host') return 'localhost:8080';
      return undefined;
    }),
    ...overrides
  };
}

describe('InviteModel Tests', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock the prisma instance
    inviteModel.prisma = mockPrisma;

    // Setup environment
    process.env.INVITE_SECRET = 'test-invite-secret';
    process.env.FRONTEND_URL = 'http://localhost:5173';

    // Note: External services (MailSender, util, notificationService) 
    // are not mocked in this test - they may cause side effects
    // but we focus on database operations
  });

  describe('Basic functionality', () => {
    it('should have InviteModel instance available', () => {
      expect(inviteModel).toBeDefined();
      expect(inviteModel.prisma).toBeDefined();
    });
  });

  describe('inviteToTournment method', () => {
    it('should create tournament invite successfully', async () => {
      const toUser = { id: 1, email: 'user1@test.com' };
      const fromUser = { id: 2, username: 'user2' };
      const event = { id: 1, name: 'Test Tournament' };
      const req = createMockRequest();

      const mockInvite = { id: 1, toUserId: 1, fromUserId: 2, eventId: 1 };
      mockPrisma.invite.create.mockResolvedValue(mockInvite);

      const result = await inviteModel.inviteToTournment(toUser, fromUser, event, req);

      expect(mockPrisma.invite.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          toUserId: 1,
          fromUserId: 2,
          eventId: 1,
          status: 'P',
          description: 'Convidando Usuário para o Torneio: Test Tournament',
          token: expect.any(String), // Real JWT token generated
          expirationDate: expect.any(String),
          callback: expect.any(String)
        })
      });
      expect(result).toEqual({ msg: 'Invite Sent' });
    });

    it('should handle database error gracefully', async () => {
      const toUser = { id: 1, email: 'user1@test.com' };
      const fromUser = { id: 2, username: 'user2' };
      const event = { id: 1, name: 'Test Tournament' };
      const req = createMockRequest();

      mockPrisma.invite.create.mockRejectedValue(new Error('Database error'));

      await expect(inviteModel.inviteToTournment(toUser, fromUser, event, req))
        .rejects.toThrow('Database error');
    });
  });

  describe('inviteToTeam method', () => {
    it('should create team invite successfully', async () => {
      const toUser = { id: 1, email: 'user1@test.com' };
      const fromUser = { id: 2, username: 'user2' };
      const team = { id: 1, name: 'Test Team' };
      const req = createMockRequest();

      const mockInvite = { id: 1, toUserId: 1, fromUserId: 2, teamId: 1 };
      mockPrisma.invite.create.mockResolvedValue(mockInvite);

      const result = await inviteModel.inviteToTeam(toUser, fromUser, team, req);

      expect(mockPrisma.invite.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          toUserId: 1,
          fromUserId: 2,
          teamId: 1,
          status: 'P',
          description: 'Convidando Usuário para o Time: Test Team',
          token: expect.any(String), // Real JWT token generated
          expirationDate: expect.any(String),
          callback: expect.any(String)
        })
      });
      expect(result).toEqual({ msg: 'Invite Sent' });
    });
  });

  describe('inviteValidation method', () => {
    it('should validate pending invite successfully', async () => {
      // Create a real JWT token for testing
      const validToken = jwt.sign(
        { id: 1, email: 'user@test.com', event: 1 },
        'test-invite-secret',
        { expiresIn: '5 days' }
      );

      const mockInvite = {
        id: 1,
        toUserId: 1,
        fromUserId: 2,
        status: 'P',
        token: validToken,
        toUser: { id: 1, email: 'user@test.com' },
        fromUser: { id: 2, email: 'sender@test.com' }
      };

      mockPrisma.invite.findFirst.mockResolvedValue(mockInvite);

      const result = await inviteModel.inviteValidation(validToken);

      expect(mockPrisma.invite.findFirst).toHaveBeenCalledWith({
        where: { token: validToken },
        include: {
          toUser: true,
          fromUser: true,
          event: true,
          team: true
        }
      });
      expect(result).toEqual(mockInvite);
    });

    it('should return false for non-pending invite', async () => {
      const token = 'accepted-token';
      const mockInvite = { id: 1, status: 'A', token: 'accepted-token' };

      mockPrisma.invite.findFirst.mockResolvedValue(mockInvite);

      const result = await inviteModel.inviteValidation(token);

      expect(result).toBe(false);
    });

    it('should handle expired token', async () => {
      // Create an expired JWT token for testing
      const expiredToken = jwt.sign(
        { id: 1, email: 'user@test.com', event: 1 },
        'test-invite-secret',
        { expiresIn: '-1d' } // Already expired
      );

      const mockInvite = { id: 1, status: 'P', token: expiredToken };

      mockPrisma.invite.findFirst.mockResolvedValue(mockInvite);
      mockPrisma.invite.update.mockResolvedValue({ ...mockInvite, status: 'E' });

      const result = await inviteModel.inviteValidation(expiredToken);

      expect(mockPrisma.invite.update).toHaveBeenCalledWith({
        where: { token: expiredToken },
        data: { status: 'E' }
      });
      expect(result).toBe(false);
    });

    it('should throw DataBaseException for JWT verification error', async () => {
      const token = 'completely-invalid-token-format';
      const mockInvite = { id: 1, status: 'P', token: 'completely-invalid-token-format' };

      mockPrisma.invite.findFirst.mockResolvedValue(mockInvite);

      await expect(inviteModel.inviteValidation(token))
        .rejects.toThrow(DataBaseException);
    });
  });
});