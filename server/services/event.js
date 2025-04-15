import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const eventService = {
  getAll: async () => {
    return await prisma.event.findMany();
  },

  getById: async (id) => {
    return await prisma.event.findUnique({
      where: { id: Number(id) },
    });
  },

  create: async (eventData) => {
    const newEvent = await prisma.event.create({
      data: eventData,
    });
    return newEvent;
  },

  update: async (id, eventData) => {
    try {
      const updatedEvent = await prisma.event.update({
        where: { id: Number(id) },
        data: eventData,
      });
      return updatedEvent;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new Error("Evento não encontrado");
      }
      throw err;
    }
  },

  delete: async (id) => {
    try {
      const deletedEvent = await prisma.event.delete({
        where: { id: Number(id) },
      });
      return deletedEvent;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new Error("Evento não encontrado");
      }
      throw err;
    }
  },
};

export default eventService;
