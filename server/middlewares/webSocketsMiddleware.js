import { parse } from "cookie";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import util from "../services/util.js";
import { PrismaClient } from "@prisma/client";

// mapas para conexões
export const socketToUser = new Map();
export const userMap = new Map();
const prisma = new PrismaClient();

const notificationSocket = (io) => {
    
    // autenticação do websocket
    io.use(async (socket, next) => {
        try {
            const session = socket.request.headers.cookie;
            if (!session) return next(new Error("not authorized"));

            const cookies = parse(session);
            if (!cookies.token) return next(new Error("not authorized"));

            const { token } = cookies;
            
            jwt.verify(token, process.env.JWT_SECRET, async (err, authData) => {
                if (err) return next(new Error("not authorized"));
                
                try {
                    const cookiesRequest = { cookies: cookies };
                    const user = await util.getUserByToken(cookiesRequest);
                    
                    socketToUser.set(socket.id, user);
                    userMap.set(user.id, socket.id);
                    next();
                } catch (error) {
                    next(new Error("not authorized"));
                }
            });
        } catch (error) {
            next(new Error("not authorized"));
        }
    });
    
    // eventos do websocket
    io.on("connect", async (socket) => {
        const user = socketToUser.get(socket.id);
        if (!user) return;

        // enviar notificações iniciais
        try {
            const notifications = await prisma.notification.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' },
                take: 30
            });
            
            const total = await prisma.notification.count({
                where: { userId: user.id }
            });
            
            socket.emit("notifications", notifications);
            socket.emit("total_count", total);
        } catch (error) {
            console.error("Erro ao buscar notificações:", error);
        }

        // recarregar notificações
        socket.on("reload_notifications", async () => {
            const user = socketToUser.get(socket.id);
            if (!user) return;

            try {
                const notifications = await prisma.notification.findMany({
                    where: { userId: user.id },
                    orderBy: { createdAt: 'desc' },
                    take: 30
                });
                
                const total = await prisma.notification.count({
                    where: { userId: user.id }
                });
                
                socket.emit("notifications", notifications);
                socket.emit("total_count", total);
            } catch (error) {
                console.error("Erro ao recarregar notificações:", error);
            }
        });

        // marcar como lida
        socket.on("mark_as_read", async (notificationId) => {
            const user = socketToUser.get(socket.id);
            if (!user) return;

            try {
                await prisma.notification.update({
                    where: {
                        id: parseInt(notificationId),
                        userId: user.id,
                        read: false
                    },
                    data: { read: true }
                });

                const notifications = await prisma.notification.findMany({
                    where: { userId: user.id },
                    orderBy: { createdAt: 'desc' },
                    take: 30
                });
                socket.emit("notifications", notifications);
            } catch (error) {
                console.error("Erro ao marcar como lida:", error);
            }
        });

        // desconectar
        socket.on("disconnect", () => {
            const user = socketToUser.get(socket.id);
            if (user) {
                userMap.delete(user.id);
                socketToUser.delete(socket.id);
            }
        });
    });
};

export default notificationSocket;