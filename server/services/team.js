
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const teamService = {
  getAll: async () => {
    return await prisma.team.findMany();
  },

  getById: async (id) => {
    const team = await prisma.team.findUnique({
      where: { id: Number(id) },
    });

    if (!team) {
      throw new Error("Team não encontrado");
    }

    return team;
  },

  create: async (teamData) => {
    const newTeam = await prisma.team.create({
      data: teamData,
    });

    return {
      message: "Time criado com sucesso",
      id: newTeam.id,
    };
  },

  update: async (id, teamData) => {
    try {
      const updatedTeam = await prisma.team.update({
        where: { id: Number(id) },
        data: teamData,
      });

      return updatedTeam;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new Error("Team não encontrado");
      }
      throw err;
    }
  },

  delete: async (id) => {
    try {
      await prisma.team.delete({
        where: { id: Number(id) },
      });

      return { message: "Team deletado com sucesso" };
    } catch (err) {
      if (err.code === 'P2025') {
        throw new Error("Team não encontrado");
      }
      throw err;
    }
  },
};

export default teamService;
