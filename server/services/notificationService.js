import { userMap,socketToUser } from "../middlewares/webSocketsMiddleware.js";
import { io } from "../server.js";
import { PrismaClient } from "@prisma/client";
import notificationModel from "../models/notificationModel.js";

class NotificationService {
    prisma;

    constructor() {
        this.prisma = new PrismaClient();

    }
    sendNotification = async( notification) => {
        
        await notificationModel.create(notification).then(r=>{
            
            if(userMap.has(notification.userId)){
                io.to(userMap.get(notification.userId)).emit("notifications", {...notification});
            }
        })
    }


}

export default new NotificationService();