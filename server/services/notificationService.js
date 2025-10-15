import { userMap } from "../middlewares/webSocketsMiddleware.js";
import { io } from "../server.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// enviar notificação
const sendNotification = async (notification) => {
    try {
        // criar no banco
        const newNotification = await prisma.notification.create({
            data: {
                userId: notification.userId,
                title: notification.title,
                message: notification.message,
                link: notification.link,
                read: false
            }
        });

        // enviar via websocket se usuário online
        if (userMap.has(notification.userId)) {
            const socketId = userMap.get(notification.userId);
            
            io.to(socketId).emit("new_notification", newNotification);
            
            // enviar lista atualizada
            const allNotifications = await prisma.notification.findMany({
                where: { userId: notification.userId },
                orderBy: { createdAt: 'desc' },
                take: 30
            });
            
            const total = await prisma.notification.count({
                where: { userId: notification.userId }
            });
            
            io.to(socketId).emit("notifications", allNotifications);
            io.to(socketId).emit("total_count", total);
        }

        return newNotification;
    } catch (error) {
        console.error("Erro ao enviar notificação:", error);
        throw error;
    }
};

export default { sendNotification };