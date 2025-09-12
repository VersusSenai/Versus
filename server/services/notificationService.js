import { userMap,socketToUser } from "../middlewares/webSocketsMiddleware.js";
import { io } from "../server.js";
class NotificationService {

    sendNotification = ( notification) => {
        console.log(userMap.get(notification.userId));
        io.to(userMap.get(notification.userId)).emit("notification", {...notification});
    }


}

export default new NotificationService();