import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const teamEventsService = {
  getAll: async () => {
    return await prisma.teamEvents.findMany();
  },

  getByTeamId: async (teamId) => {
    return await prisma.teamEvents.findMany({
      where: { teamId: Number(teamId) },
    });
  },

  getByEventId: async (eventId) => {
    return await prisma.teamEvents.findMany({
      where: { eventId: Number(eventId) },
    });
  },

  create: async (teamEventData) => {
    const newTeamEvent = await prisma.teamEvents.create({
      data: teamEventData,
    });

    return newTeamEvent.id;
  },

  update: async (id, teamEventData) => {
    try {
      const updated = await prisma.teamEvents.update({
        where: { id: Number(id) },
        data: teamEventData,
      });

      return updated;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new Error("Evento do time não encontrado");
      }
      throw err;
    }
  },

  delete: async (id) => {
    try {
      const deleted = await prisma.teamEvents.delete({
        where: { id: Number(id) },
      });

      return deleted;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new Error("Evento do time não encontrado");
      }
      throw err;
    }
  },
};

export default teamEventsService;
