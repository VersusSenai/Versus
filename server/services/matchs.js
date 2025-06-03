import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const matchService = {

  getAll: async () => {
    return await prisma.match.findMany();
  },

  getById: async (id) => {
    const match = await prisma.match.findUnique({
      where: { id: Number(id) },
    });

    if (!match) {
      throw new Error("Partida não encontrada");
    }

    return match;
  },

  create: async (matchData) => {
    const { eventId, firstTeamId, secondTeamId, time, winnerId, loserId, firstUserId, secondUserId } = matchData;

    const newMatch = await prisma.match.create({
      data: {
          eventId,
          firstTeamId,
          secondTeamId,
          time,
          winnerId,
          loserId,
          firstUserId, 
          secondUserId
      },
    });

    return newMatch.id;
  },

  update: async (id, matchData) => {
    const { eventId, firstTeamId, secondTeamId, time, winnerId, loserId, firstUserId, secondUserId } = matchData;

    try {
      const updated = await prisma.match.update({
        where: { id: Number(id) },
        data: {
          eventId,
          firstTeamId,
          secondTeamId,
          time,
          winnerId,
          loserId,
          firstUserId, 
          secondUserId
        },
      });
      return updated;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new Error("Partida não encontrada");
      }
      throw err;
    }
  },

  delete: async (id) => {
    try {
      const deleted = await prisma.match.delete({
        where: { id: Number(id) },
      });

      return deleted;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new Error("Partida não encontrada");
      }
      throw err;
    }
  },


};

export default matchService;
