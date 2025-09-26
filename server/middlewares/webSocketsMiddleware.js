import { parse } from "cookie";
import jwt from "jsonwebtoken";
import 'dotenv/config';
import util from "../services/util.js";
export const socketToUser = new Map();
export const userMap = new Map();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const notificationSocket = (io) => {

    

    io.use(async (socket, next) => {
      const session = socket.request.headers.cookie;
      if(!session){
        return next(new Error("not authorized"))
      }

      const cookies = parse(session);
      if(!cookies.token){
        return next(new Error("not authorized"))
      }

      let cookiesRequest = {cookies: cookies};
        const {token} = cookies;
        await jwt.verify(
            token,
            process.env.JWT_SECRET, 
            async (err, authData) => {
                if (err) {
                    next(new Error("not authorized"))
                }
                if(authData){
                    const user = await util.getUserByToken(cookiesRequest)

                    socketToUser.set(socket.id, user);
                    userMap.set(user.id, socket.id);
                }
            })
          
   
        next();
    
    
    });
    
    
    io.on("connect", async(socket) => {

        if(!socketToUser.has(socket.id)){
            return;
        }


        await prisma.notification.findMany({
            select:{
                id: true, link: true, message: true, title: true, read: true, createdAt: true
            },
            where: {
                userId: socketToUser.get(socket.id).id,
                read: true
            },
            orderBy:{
                createdAt: 'desc'  
            },
            take: 10,
        }).then(notifications=>{
            console.log("Emitting notifications to user: " + socketToUser.get(socket.id).username)
            io.to(socket.id).emit("notifications", notifications)
        })

    })

    io.on("disconnect", () => {
        if(socketToUser.has(socket.id)){
            userMap.delete(socketToUser.get(socket.id).id);
            socketToUser.delete(socket.id);
        }
    })


}



export default notificationSocket;