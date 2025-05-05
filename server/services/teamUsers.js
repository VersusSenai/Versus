import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const teamUsersService = {
  getAll: async () => {
    return await prisma.teamUsers.findMany();
  },

  getByUserId: async (userId) => {
    return await prisma.teamUsers.findMany({
      where: { userId: Number(userId) },
    });
  },

  getByTeamId: async (teamId) => {
    return await prisma.teamUsers.findMany({
      where: { teamId: Number(teamId) },
    });
  },

  create: async (teamUserData) => {
    const newRecord = await prisma.teamUsers.create({
      data: teamUserData,
    });

    return newRecord.id;
  },

  update: async (id, teamUserData) => {
    try {
      const updated = await prisma.teamUsers.update({
        where: { id: Number(id) },
        data: teamUserData,
      });

      return updated;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new Error("Usuário do time não encontrado");
      }
      throw err;
    }
  },

  delete: async (id) => {
    try {
      const deleted = await prisma.teamUsers.delete({
        where: { id: Number(id) },
      });

      return deleted;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new Error("Usuário do time não encontrado");
      }
      throw err;
    }
  },
};

export default teamUsersService;
