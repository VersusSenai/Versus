import prisma from "../ config/prismaClient.js";

const notificationModel = {
  markAsRead: async (req) => {
    const { id } = req.params;
    const user = req.user;

    if (!id) {
      throw new Error("ID da notificação é obrigatório");
    }

    try {
      await prisma.notification.update({
        where: {
          id: parseInt(id),
          userId: user.id,
          read: false,
        },
        data: { read: true },
      });
      return { msg: "Notificação marcada como lida" };
    } catch (error) {
      throw new Error("Erro ao marcar notificação como lida");
    }
  },

  create: async (notification) => {
    try {
      return await prisma.notification.create({
        data: {
          userId: notification.userId,
          title: notification.title,
          message: notification.message,
          link: notification.link,
          read: false,
        },
      });
    } catch (error) {
      throw new Error("Erro ao criar notificação");
    }
  },

  getAllFromUser: async (req) => {
    const userId = req.user.id;
    let { page = 1, limit = 10, read } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (limit > 50) limit = 50;

    const where = { userId };
    if (read === "true") where.read = true;
    if (read === "false") where.read = false;

    try {
      const notifications = await prisma.notification.findMany({
        where,
        orderBy: [{ read: "asc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      });

      const total = await prisma.notification.count({ where });

      return {
        data: notifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error("Erro ao buscar notificações");
    }
  },
};

export default notificationModel;
